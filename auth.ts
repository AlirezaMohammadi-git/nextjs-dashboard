import NextAuth from "next-auth";
import { AuthConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth(AuthConfig)





//todo : customize auth user to have a type property and only allow admin type to access some routings.