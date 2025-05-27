// this is a server action!
"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import postgres from "postgres"
import { z } from "zod"
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

export async function updateInvoice(id: string, formData: FormData) {
    const { customerId, amount, status } = CreateOrUpdateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });
    const amountInCents = amount * 100;
    await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents} , status = ${status}
    WHERE id = ${id}`

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



// todo : read this article :
//https://nextjs.org/blog/security-nextjs-server-components-actions