"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { signInSchema } from '@/lib/signInSchema';
import { toast } from "sonner"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2Icon } from "lucide-react"
import Link from 'next/link';
import axios from 'axios';


const RegisterPage: React.FC = () => {

    const [isSubmiting, setIsSubmiting] = React.useState(false);
    const [message, setMessage] = React.useState('');


    const router = useRouter();


    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setIsSubmiting(true)

        try {
            const res = await axios.post('/api/member/user/sign-in', { username: data.identifier, password: data.password })
            setMessage(res.data.message)
            console.log("SignIn responce auth", res.data)

            if (res?.data.success) {
                router.replace("/member/dashboard")
            }
            
        } catch (error) {
            console.log("Error Loging in")
            toast.info(message)
        } finally {
            setIsSubmiting(false)
        }

    }


    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: '',
            password: '',
        }
    })

    return (

        <main className="min-h-screen flex flex-col justify-center px-6 py-12 lg:px-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Sign in to your account
                </h1>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Not a member?{" "}
                    <Link
                        href="/member/auth/sign-up"
                        className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                    >
                        Sign up
                    </Link>
                </p>
            </div>



            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md  p-8 shadow rounded-2xl border border-gray-100">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        <FormField
                            name="identifier"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email address</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="Enter your email or username"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Enter password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isSubmiting}
                        >
                            {isSubmiting ? (
                                <>
                                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign in"
                            )}
                        </Button>
                    </form>
                </Form>
            </div>
        </main >
    );
};

export default RegisterPage;