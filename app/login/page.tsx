import { redirect } from "next/navigation"
import { signIn, auth, providerMap } from "@/auth"
import { AuthError } from "next-auth"
import { Button } from "../ui/button"
import { ArrowUpRightIcon } from "@heroicons/react/16/solid"
import React from "react"

const SIGNIN_ERROR_URL = "/error"

export default async function SignInPage(props: {
    searchParams: { callbackUrl: string | undefined }
}) {
    return (
        <div className="flex w-full h-screen justify-center items-center flex-col gap-2">
            {Object.values(providerMap).map((provider) => (
                <form key={provider.id}
                    action={
                        async () => {
                            "use server"
                            try {
                                await signIn(provider.id)
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
                        }}
                >
                    <Button className='bg-black hover:bg-gray-900 active:bg-gray-950' type="submit">
                        <div className="flex flex-row justify-center">
                            <span>Sign in with {provider.name}</span>
                            <ArrowUpRightIcon className="w-4 h-4" />
                        </div>
                    </Button>
                </form>
            ))}
        </div>
    )
}