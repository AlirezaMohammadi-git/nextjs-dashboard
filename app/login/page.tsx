import React, { Suspense } from "react"
import LoginForm from "../ui/login-form"


export default async function SignInPage() {
    return (
        <div className="flex w-full h-screen justify-center items-center flex-col gap-2">
            <Suspense fallback={<>Loading...</>}>
                <LoginForm />
            </Suspense>
        </div>
    )
}