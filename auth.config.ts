
import type { Provider } from "next-auth/providers"
import GitHub from "next-auth/providers/github"

export const providers: Provider[] = [GitHub({
    clientId: process.env.AUTH_GITHUB_ID,
    clientSecret: process.env.AUTH_GITHUB_SECRET,
})]

export const conf = {
    pages: {
        signIn: "/login",
        signOut: "/"
    },
    providers: providers,
}