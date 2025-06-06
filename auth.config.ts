
import type { Provider } from "next-auth/providers"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { object, string, ZodError } from "zod"
import { absoluteUrl } from "./app/lib/utils"

export const signInSchema = object({
    email: string({ required_error: "Email is required" })
        .min(1, "Email is required")
        .email("Invalid email"),
    password: string({ required_error: "Password is required" })
        .min(1, "Password is required")
        .min(5, "Password must be more than 5 characters")
        .max(32, "Password must be less than 32 characters"),
})

export const providers: Provider[] = [
    Credentials({
        credentials: {
            email: {
                type: "email",
                label: "email",
                placeholder: "testUser@example.com"
            },
            password: {
                type: "password",
                label: "password",
                placeholder: "******"
            }
        },
        authorize: async (c) => {

            try {
                const parsedCredentials = signInSchema.safeParse(c)
                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    // using lazy import to prevent runtime errors:
                    const { getUserFromDb } = await import("./app/lib/actions");
                    const user = await getUserFromDb(email, password);
                    if (!user) {
                        throw new Error("Invalid credentials.")
                    }
                    return user;
                }
                return null;

            } catch (err) {

                console.error("❌ Error during authorize:", err);

                if (err instanceof ZodError) {
                    return null
                }
                return null;

            }
        }
    }),
    GitHub({
        clientId: process.env.AUTH_GITHUB_ID,
        clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Google({
        clientId: process.env.AUTH_GOOGLE_ID,
        clientSecret: process.env.AUTH_GOOGLE_SECRET,
    })
]

export const AuthConfig = {
    pages: {
        signIn: absoluteUrl("/login"),
        signOut: absoluteUrl("/")
    },
    providers
}


export const providerMap = providers
    .map((provider) => {
        if (typeof provider === "function") {
            const providerData = provider()
            return { id: providerData.id, name: providerData.name }
        } else {
            return { id: provider.id, name: provider.name }
        }
    })
    .filter((provider) => provider.id !== "credentials")

