'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { signUpSchema } from '@/lib/schemas/signUpSchema'
import axios, { AxiosError } from 'axios'
import { toast } from 'sonner'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AlertCircle, ArrowRight, CheckCircle2, Loader2, Loader2Icon, Lock, Mail, User } from 'lucide-react'
import Link from 'next/link'
import { useDebounceCallback } from 'usehooks-ts'

const RegisterPage: React.FC = () => {
  const [username, setUsername] = React.useState('')
  const [isUsernameChecking, setIsUsernameChecking] = React.useState(false)
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isSubmiting, setIsSubmiting] = React.useState(false)
  const debounced = useDebounceCallback(setUsername, 500)

  const router = useRouter()

  // Username Unique check
  useEffect(() => {
    const checkIsUsernameAvailable = async () => {
      if (username) {
        setIsUsernameChecking(true)
        setUsernameMessage('')

        try {
          const responce = await axios.get(`/api/auth/check-username-unique?username=${username}`)

          setUsernameMessage(responce.data?.message)
        } catch (error) {
          setUsernameMessage('Username not available')
        } finally {
          setIsUsernameChecking(false)
          // setUsernameMessage('')
        }
      }
    }

    checkIsUsernameAvailable()
  }, [username])

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmiting(true)
    try {
      const res = await axios.post('/api/auth/sign-up', data)
      //TODO: check if res has success message or not then show toast
      console.log(res)
      if (res.data.success) {
        toast.success('Success', {
          description: res.data.message,
        })
      }
      router.replace('/auth/verify-code')
    } catch (error: any) {
      let axiosError = error as AxiosError
      console.error('catch sign-up.tsx: Registration error:', error)
      toast.error('Failed', {
        description: 'Error signing-up',
      })
    } finally {
      setIsSubmiting(false)
    }
  }

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      lname: '',
      fname: '',
      email: '',
      password: '',
    },
  })
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12 bg-slate-50 dark:bg-[#09090b] transition-colors duration-300">
      {/* Background branding glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-b from-indigo-50/50 dark:from-indigo-500/5 to-transparent pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg">
        <div className="text-center space-y-3 mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-100">
            Create your account
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium">
            Join the community today. Already a member?{' '}
            <Link
              href="/sign-in"
              className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 font-bold underline-offset-4 hover:underline transition-all"
            >
              Sign in
            </Link>
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900/50 p-8 sm:p-10 shadow-2xl shadow-slate-200/50 dark:shadow-none rounded-[2.5rem] border border-slate-200 dark:border-zinc-800 backdrop-blur-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

              {/* Username Field with Availability Check */}
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500 ml-1">Username</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <Input
                          placeholder="johndoe"
                          className="pl-10 h-12 rounded-xl bg-slate-50/50 dark:bg-zinc-800/30 border-slate-200 dark:border-zinc-700 focus:ring-2 focus:ring-indigo-500 transition-all"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e)
                            debounced(e.target.value)
                          }}
                        />
                      </div>
                    </FormControl>

                    {/* Status Message */}
                    <div className="min-h-[20px] px-1">
                      {isUsernameChecking ? (
                        <span className="flex items-center gap-2 text-xs text-slate-400 animate-pulse">
                          <Loader2 size={12} className="animate-spin" /> Checking availability...
                        </span>
                      ) : usernameMessage && (
                        <span className={`flex items-center gap-1.5 text-xs font-medium ${usernameMessage === 'Username Available' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'
                          }`}>
                          {usernameMessage === 'Username Available' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                          {usernameMessage}
                        </span>
                      )}
                    </div>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Name Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  name="fname"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500 ml-1">First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" className="h-12 rounded-xl bg-slate-50/50 dark:bg-zinc-800/30 border-slate-200 dark:border-zinc-700" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  name="lname"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500 ml-1">Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" className="h-12 rounded-xl bg-slate-50/50 dark:bg-zinc-800/30 border-slate-200 dark:border-zinc-700" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Email Field */}
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500 ml-1">Email address</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <Input type="email" placeholder="john@example.com" className="pl-10 h-12 rounded-xl bg-slate-50/50 dark:bg-zinc-800/30 border-slate-200 dark:border-zinc-700" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500 ml-1">Password</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <Input type="password" placeholder="••••••••" className="pl-10 h-12 rounded-xl bg-slate-50/50 dark:bg-zinc-800/30 border-slate-200 dark:border-zinc-700" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95 group mt-2"
                disabled={isSubmiting}
              >
                {isSubmiting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Create Account <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </main>
  )
}

export default RegisterPage
