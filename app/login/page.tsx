import React from "react"
import LoginForm from "../ui/login-form"


export default async function SignInPage() {
    return (
        <div className="flex w-full h-screen justify-center items-center flex-col gap-2">
            <LoginForm />
        </div>
    )
}