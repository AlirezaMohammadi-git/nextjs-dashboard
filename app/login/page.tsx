import React, { Suspense } from "react"
import LoginForm from "../ui/login-form"
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'login',
};

export default async function SignInPage() {
    return (
        <div className="flex w-full h-screen justify-center items-center flex-col gap-2">
            <Suspense fallback={<>Loading...</>}>
                <LoginForm />
            </Suspense>
        </div>
    )
}