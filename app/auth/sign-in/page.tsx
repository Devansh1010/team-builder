'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { signInSchema } from '@/lib/signInSchema'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react'

const RegisterPage: React.FC = () => {
  const [isSubmiting, setIsSubmiting] = React.useState(false)

  const router = useRouter()

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmiting(true)

    const res = await signIn('credentials', {
      redirect: false,
      email: data.identifier,
      password: data.password,
    })

    console.log('SignIn responce auth', res)

    if (res?.url) {
      router.replace('/admin')
    }
    setIsSubmiting(false)
  }

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  })

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12 bg-slate-50 dark:bg-[#09090b] transition-colors duration-300">
      {/* Subtle background glow for branding */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-b from-indigo-50/50 dark:from-indigo-500/5 to-transparent pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-200 dark:shadow-none mb-4">
            <Lock className="text-white" size={28} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-100">
            Welcome Back
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium">
            Not a member?{' '}
            <Link
              href="/auth/sign-up"
              className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 font-bold underline-offset-4 hover:underline transition-all"
            >
              Create an account
            </Link>
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900/50 p-8 sm:p-10 shadow-2xl shadow-slate-200/50 dark:shadow-none rounded-[2rem] border border-slate-200 dark:border-zinc-800 backdrop-blur-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

              <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500 ml-1">
                      Email address
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <Input
                          type="email"
                          placeholder="name@company.com"
                          className="pl-10 h-12 rounded-xl bg-slate-50/50 dark:bg-zinc-800/30 border-slate-200 dark:border-zinc-700 focus:ring-2 focus:ring-indigo-500 transition-all"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500 ml-1">
                        Password
                      </FormLabel>
                      <Link
                        href="/auth/forgot-password"
                        className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        Forgot?
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="pl-10 h-12 rounded-xl bg-slate-50/50 dark:bg-zinc-800/30 border-slate-200 dark:border-zinc-700 focus:ring-2 focus:ring-indigo-500 transition-all"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95 group"
                disabled={isSubmiting}
              >
                {isSubmiting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Sign in <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </form>
          </Form>
        </div>

        <p className="mt-8 text-center text-xs text-slate-400 dark:text-zinc-500 uppercase tracking-tighter">
          Protected by TeamUp Security Protocols
        </p>
      </div>
    </main>
  )
}

export default RegisterPage
