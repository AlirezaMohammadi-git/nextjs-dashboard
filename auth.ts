import NextAuth from "next-auth";
import { config } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth(config)





//todo : customize auth user to have a type property and only allow admin type to access some routings.