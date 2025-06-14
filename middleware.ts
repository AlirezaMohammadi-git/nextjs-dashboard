
import { absoluteUrl } from "./app/lib/utils"
import { AuthConfig } from "./auth.config"
import NextAuth from "next-auth"

// Use only one of the two middleware options below
// 1. Use middleware directly
// export const { auth: middleware } = NextAuth(authConfig)

// 2. Wrapped middleware option
const { auth } = NextAuth(AuthConfig)
export default auth(async function middleware(req) {
    // Your custom middleware logic goes here
    console.log("middleware called")
    const isLoggedIn = !!req.auth;
    console.log(req.auth)
    const { nextUrl } = req;
    const isPrivateRoute = privateRoutes.includes(nextUrl.pathname)
    const isAuthRoute = nextUrl.pathname.includes("/login")
    const loginUrl = absoluteUrl("/login")
    const dashboardUrl = absoluteUrl("/dashboard")
    // making sure don't block auth handlers:
    const isApiRoute = nextUrl.pathname.includes("/api")

    // skip middleware for api routes.
    if (isApiRoute) return;

    // redirecting user from login page to main page after they logged in :
    if (isLoggedIn && isAuthRoute) {
        return Response.redirect(dashboardUrl)
    }

    // user wants to login:
    if (isAuthRoute && !isLoggedIn) {
        return;
    }

    // redirect unathorized user to signUp page.
    if (!isLoggedIn && isPrivateRoute) {
        return Response.redirect(loginUrl)
    }

    return;
})


export const privateRoutes = [
    "/dashboard",
    "/seed",
    "/query"
];
export const config = {
    matchers: privateRoutes
}