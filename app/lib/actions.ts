// this is a server action!
"use server"

import { signIn } from "@/auth"
import { AuthError } from "next-auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import postgres from "postgres"
import { z } from "zod"
import bcrypt from 'bcrypt';
import { User } from "./definitions"
// https://zod.dev/

export type State = {
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
    };
    message?: string | null;
};

// The amount field is specifically set to coerce (change) from a string to a number while also validating its type.
const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(
        { invalid_type_error: "Please select a customer!" }
    ),
    amount: z.coerce.number().gt(0, { message: "Please enter an amount greater than $0." }),
    status: z.enum(['pending', "paid"], { invalid_type_error: "Please select an invoice status!" }),
    date: z.string()
})

const CreateOrUpdateInvoice = FormSchema.omit({ id: true, date: true })

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" })

export async function createInvoice(prevState: State, formData: FormData) {
    const validatedFields = CreateOrUpdateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });


    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
        };
    }

    // Prepare data for insertion into the database
    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    try {
        await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId},${amountInCents},${status},${date})`;
    } catch (err) {
        return {
            message: "Database Error : Failed to create Invoice."
        }
    }

    // triggering a new request to server and clearing cache.
    // because data displayed in invoices route has been updated.
    revalidatePath("/dashboard/invoices");
    // Once the database has been updated, the /dashboard/invoices path will be revalidated, and fresh data will be fetched from the server.

    // bring user back to invoices page:
    redirect('/dashboard/invoices')
}

export async function updateInvoice(id: string, prevState: State, formData: FormData) {
    const validatedFields = CreateOrUpdateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Invoice.',
        };
    }

    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;

    try {
        await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents} , status = ${status}
    WHERE id = ${id}`
    } catch (err) {
        return {
            error: "Database Error : Failed to update invoice!"
        }
    }

    // triggering a new request to server and clearing cache.
    // because data displayed in invoices route has been updated.
    revalidatePath("/dashboard/invoices");
    // Once the database has been updated, the /dashboard/invoices path will be revalidated, and fresh data will be fetched from the server.

    // bring user back to invoices page:
    redirect('/dashboard/invoices')
}

export async function deleteInvoice(id: string) {


    await sql`
    DELETE FROM invoices WHERE id = ${id}`

    // triggering a new request to server and clearing cache.
    // because data displayed in invoices route has been updated.
    revalidatePath("/dashboard/invoices");
    // Once the database has been updated, the /dashboard/invoices path will be revalidated, and fresh data will be fetched from the server.

    // user is already in invoices page!
}

export async function getUserFromDb(email: string, password: string) {

    try {
        const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
        if (!user || user.length === 0) return null;

        const match = await bcrypt.compare(password, user[0].password);
        return match ? user[0] : null;
    } catch (err) {
        console.log("Failed to load user from db.")
        throw new Error("Failed to load user from db.")
    }

}

const SIGNIN_ERROR_URL = "/error"
export async function authenticate(prevState: string | undefined, formData: FormData) {

    // these information filled with inputs
    const method = formData.get("method") as string;
    if (method === "credentials") {
        try {
            await signIn('credentials', formData)
        } catch (error) {
            if (error instanceof AuthError) {
                switch (error.type) {
                    case "CredentialsSignin":
                        return "Invalid credentials.";
                    default:
                        return 'Something went wrong'
                }
            }
            throw error;
        }
    } else if (method === "OAuth") {
        try {

            const providerId = formData.get("providerId") as string;
            await signIn(providerId)
        } catch (error) {
            // Signin can fail for a number of reasons, such as the user
            // not existing, or the user not having the correct role.
            // In some cases, you may want to redirect to a custom error
            if (error instanceof AuthError) {
                return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`)
            }

            // Otherwise if a redirects happens Next.js can handle it
            // so you can just re-thrown the error and let Next.js handle it.
            // Docs:
            // https://nextjs.org/docs/app/api-reference/functions/redirect#server-component
            throw error
        }

    }
}