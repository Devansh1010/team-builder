'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { KeyRound, ShieldCheck, Loader2, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'

export default function NewPasswordPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            return toast.error("Passwords do not match")
        }

        if (password.length < 8) {
            return toast.error("Password must be at least 8 characters")
        }

        setIsSubmitting(true)

        try {
            const response = await axios.post(`/api/auth/reset-password?token=${token}`, {
                newPassword: password
            })

            if (response.data.success) {
                setIsSuccess(true)
                toast.success("Password updated successfully!")
                setTimeout(() => router.push('/login'), 3000)
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Something went wrong")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#09090b] px-4">
                <Card className="max-w-md w-full border-none shadow-2xl bg-white dark:bg-zinc-900/50 rounded-3xl p-6 text-center space-y-6">
                    <div className="flex justify-center">
                        <div className="bg-emerald-100 dark:bg-emerald-500/10 p-4 rounded-full">
                            <CheckCircle2 size={48} className="text-emerald-500" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold dark:text-zinc-100">Security Updated</h2>
                        <p className="text-slate-500 dark:text-zinc-400">Your new password is now active. Redirecting you to login...</p>
                    </div>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#09090b] px-4 transition-colors duration-300">
            <Card className="max-w-md w-full border-slate-200 dark:border-zinc-800 shadow-xl bg-white dark:bg-zinc-900/50 rounded-3xl overflow-hidden backdrop-blur-sm">
                <div className="h-2 bg-indigo-600 w-full" />
                <CardHeader className="p-8 text-center space-y-2">
                    <div className="mx-auto w-12 h-12 bg-indigo-100 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-2">
                        <ShieldCheck size={28} />
                    </div>
                    <CardTitle className="text-2xl font-extrabold tracking-tight dark:text-zinc-100">Set New Password</CardTitle>
                    <CardDescription className="dark:text-zinc-400">Enter a strong password for your TeamUp account.</CardDescription>
                </CardHeader>

                <CardContent className="p-8 pt-0">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500">New Password</Label>
                            <div className="relative group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                    <KeyRound size={18} />
                                </div>
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="pl-10 h-12 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border-slate-200 dark:border-zinc-700"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500">Confirm Password</Label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                className="h-12 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border-slate-200 dark:border-zinc-700"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting || !token}
                            className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95"
                        >
                            {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Update Password'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}