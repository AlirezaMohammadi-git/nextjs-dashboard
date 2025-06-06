
"use client"

import { lusitana } from '@/app/ui/fonts';
import {
  AtSymbolIcon,
  KeyIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from './button';
import { useSearchParams } from 'next/navigation';
import clsx from 'clsx';
import { FaGithub } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";
import { authenticate } from '../lib/actions';
import { providerMap } from '@/auth.config';
import { useActionState } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';
import { Spinner } from './loading';






export default function LoginForm() {


  const iconClass = "w-5 h-5"
  //https://react.dev/reference/react/useActionState
  const [state, formAction, isPending] = useActionState(authenticate, undefined)
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';


  return (
    <div className='flex flex-col  items-center rounded-lg bg-gray-100 px-6 pb-6 pt-8'>
      <form action={formAction}>

        <input type="hidden" name="method" value="credentials" />
        <input type="hidden" name="redirectTo" value={callbackUrl} />

        <div className="">
          <h1 className={`${lusitana.className} mb-2 text-2xl`}>
            Please log in to continue.
          </h1>
          <div className="w-full">
            <div>
              <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="email"
              >
                Email
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  aria-disabled={isPending}
                  required
                />
                <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
            <div className="mt-4">
              <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  aria-disabled={isPending}
                  required
                  minLength={6}
                />
                <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>
          <Button aria-disabled={isPending} className="mt-6 w-full">
            Log in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
          </Button>
        </div>
      </form>

      <p className='text-gray-600 my-2'>or</p>

      {Object.values(providerMap).map((provider) => (
        <form className='w-full' key={provider.id}
          action={formAction}
        >

          <input type="hidden" name="method" value="OAuth" />
          <input type="hidden" name="providerId" value={provider.id} />

          <Button aria-disabled={isPending} className={clsx(
            {
              ["bg-gray-900 hover:bg-gray-800 active:bg-black"]: (provider.name as string === "GitHub" || "Google"),
              ["mt-4"]: (provider.name as string === "Google"),
              ["w-full"]: true
            }
          )} >
            <div className="w-full flex flex-row justify-between items-center">
              <div className='flex flex-row justify-center items-center gap-2'>
                <span>Sign in with</span>
                {
                  (provider.name as string === "GitHub") ? <FaGithub className={iconClass} /> : <FaGoogle className={iconClass} />
                }
              </div>
              <ArrowRightIcon className="w-5 h-5" />
            </div>
          </Button>
        </form>
      ))
      }

      {<Spinner show={isPending} size={"large"} className='text-blue-500 mt-3'>
        <span className="mt-2 text-sm text-muted-foreground">Please wait...</span>
      </Spinner>}

      {state && !isPending && (
        <>
          <div className='mt-4 flex flex-col justify-center items-center'>
            <ExclamationCircleIcon className='h-5 w-5 text-red-500' />
            <p className='text-sm text-red-500'>{state}</p>
          </div>
        </>
      )}

    </div >
  );
}
