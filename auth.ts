

import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { Provider } from 'next-auth/providers';
import { z } from 'zod';
import postgres from 'postgres';
import { User } from './app/lib/definitions';
import bcrypt from "bcrypt"


const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" })
async function getUser(email: string) {
    try {
        const user = await sql<User[]>`select * from users where email=${email}`;
        return user[0];
    } catch (err) {
        console.error(`Failed to fetch user : `, err)
        throw new Error("Failed to fetch user.")
    }
}


const providers: Provider[] = [
    Credentials({
        credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
            const parsedCredentials = z
                .object({ email: z.string().email(), password: z.string().min(6) })
                .safeParse(credentials)

            if (parsedCredentials.success) {
                const { email, password } = parsedCredentials.data;
                const user = await getUser(email);
                if (!user) return null
                const passwordMatches = await bcrypt.compare(password, user.password)
                if (passwordMatches) return user;
            }
            return null;
        },
    }),
]

export const { signIn, signOut, auth } = NextAuth({
    ...authConfig,
    providers: providers
});