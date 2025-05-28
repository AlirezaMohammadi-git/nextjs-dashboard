

import NextAuth from 'next-auth';
import { authConfig } from './auth.config';


//export { auth as middleware } from "@/auth"


export default NextAuth(authConfig).auth;

// this is for specifiyng which route should use middleware:
// middleware protect your routes!
export const config = {
    // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};