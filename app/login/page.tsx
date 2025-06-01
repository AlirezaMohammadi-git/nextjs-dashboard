import { redirect } from "next/navigation"
import { signIn, auth, providerMap } from "@/auth"
import { AuthError } from "next-auth"
import { Button } from "../ui/button"
import { ArrowUpRightIcon } from "@heroicons/react/16/solid"
import React from "react"
import Input from "../ui/auth/input"
import LoginForm from "../ui/login-form"


export default async function SignInPage(props: {
    searchParams: { callbackUrl: string | undefined }
}) {
    return (
        <div className="flex w-full h-screen justify-center items-center flex-col gap-2">
            <LoginForm />
        </div>
    )
}