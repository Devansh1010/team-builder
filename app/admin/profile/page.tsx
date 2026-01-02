'use client'

import { useEffect, useState } from 'react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { KeyRound, Mail, User, ShieldCheck, Loader2 } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner' // Highly recommended for production notifications

export default function AdminProfilePage() {
  const [admin, setAdmin] = useState({
    username: '',
    fname: '',
    lname: '',
    email: '',
    isVerified: false,
    imageUrl: '',
  })

  const [isLoading, setIsLoading] = useState(true)
  const [isResetting, setIsResetting] = useState(false)

  const getProfile = async () => {
    try {
      const response = await axios.get('/api/v1/users/getProfile')
      if (response.data.success) {
        setAdmin(response.data.data)
      }
    } catch (error) {
      toast.error('Failed to load profile data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async () => {
    setIsResetting(true)
    try {
      await axios.post('/api/auth/forgot-password', { email: admin.email })
      toast.success('Reset link sent to your email!')
    } catch (error) {
      toast.error('Could not initiate password reset')
    } finally {
      setIsResetting(false)
    }
  }

  useEffect(() => {
    getProfile()
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#09090b] transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">

        {/* HEADER SECTION - Glassmorphism style */}
        <div className="relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 bg-white dark:bg-zinc-900/50 p-10 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-xl shadow-slate-200/50 dark:shadow-none backdrop-blur-md">
          {/* Subtle background glow for dark mode */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="relative group">
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-indigo-50 to-slate-100 dark:from-zinc-800 dark:to-zinc-900 border-2 border-white dark:border-zinc-700 overflow-hidden shadow-2xl transition-transform group-hover:scale-105 duration-300">
                {admin.imageUrl ? (
                  <img src={admin.imageUrl} alt="Admin" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-indigo-400 dark:text-zinc-500">
                    <User size={56} strokeWidth={1.5} />
                  </div>
                )}
              </div>
              {admin.isVerified && (
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-2xl border-4 border-white dark:border-zinc-900 shadow-lg">
                  <ShieldCheck size={20} />
                </div>
              )}
            </div>

            <div className="text-center md:text-left space-y-2">
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight">
                {admin.fname} {admin.lname}
              </h1>
              <p className="text-indigo-600 dark:text-indigo-400 font-semibold text-lg">@{admin.username}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-1">
                <Badge className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20 hover:bg-emerald-100 transition-colors">
                  {admin.isVerified ? 'Verified Admin' : 'Unverified'}
                </Badge>
                <Badge variant="outline" className="dark:text-zinc-400 dark:border-zinc-700">
                  TeamUp Core
                </Badge>
              </div>
            </div>
          </div>

          <Button variant="outline" className="relative z-10 rounded-2xl px-8 h-12 font-bold border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all shadow-sm">
            Edit Profile
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* PERSONAL INFO - Occupies 7/12 of the grid */}
          <Card className="lg:col-span-7 bg-white dark:bg-zinc-900/50 border-slate-200 dark:border-zinc-800 rounded-3xl shadow-sm overflow-hidden">
            <CardHeader className="p-8 border-b border-slate-50 dark:border-zinc-800/50">
              <CardTitle className="text-xl font-bold dark:text-zinc-100">Personal Details</CardTitle>
              <CardDescription className="dark:text-zinc-400">Manage your account information and visibility.</CardDescription>
            </CardHeader>
            <CardContent className="p-10 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <Label className="text-xs uppercase tracking-widest font-bold text-slate-400 dark:text-zinc-500 ml-1">First Name</Label>
                  <div className="p-4 bg-slate-50/50 dark:bg-zinc-800/30 rounded-2xl border border-slate-100 dark:border-zinc-800 focus-within:border-indigo-500 transition-all">
                    <p className="font-bold text-slate-700 dark:text-zinc-200">{admin.fname || '—'}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-xs uppercase tracking-widest font-bold text-slate-400 dark:text-zinc-500 ml-1">Last Name</Label>
                  <div className="p-4 bg-slate-50/50 dark:bg-zinc-800/30 rounded-2xl border border-slate-100 dark:border-zinc-800">
                    <p className="font-bold text-slate-700 dark:text-zinc-200">{admin.lname || '—'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-xs uppercase tracking-widest font-bold text-slate-400 dark:text-zinc-500 ml-1">Official Email</Label>
                <div className="flex items-center gap-4 p-4 bg-slate-50/50 dark:bg-zinc-800/30 rounded-2xl border border-slate-100 dark:border-zinc-800">
                  <Mail size={20} className="text-indigo-500" />
                  <p className="font-bold text-slate-700 dark:text-zinc-200">{admin.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SECURITY - Occupies 5/12 of the grid */}
          <Card className="lg:col-span-5 bg-white dark:bg-zinc-900/50 border-slate-200 dark:border-zinc-800 rounded-3xl shadow-sm">
            <CardHeader className="p-8">
              <CardTitle className="text-xl font-bold dark:text-zinc-100">Security & Access</CardTitle>
              <CardDescription className="dark:text-zinc-400">Keep your admin credentials secure.</CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8 space-y-8">
              <div className="p-6 rounded-3xl border border-indigo-100/50 dark:border-indigo-500/20 bg-indigo-50/30 dark:bg-indigo-500/5 space-y-6">
                <div className="flex items-center gap-4 text-indigo-600 dark:text-indigo-400">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-xl">
                    <KeyRound size={24} />
                  </div>
                  <span className="font-extrabold text-sm uppercase tracking-tighter">Secure Password Reset</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                  Triggers an encrypted reset link to your registered email. Link remains active for 10 minutes.
                </p>
                <Button
                  onClick={handleResetPassword}
                  disabled={isResetting}
                  className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95"
                >
                  {isResetting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Request Reset Link'}
                </Button>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Account Created</span>
                <Badge variant="secondary" className="font-mono dark:bg-zinc-800 dark:text-zinc-300 border-none">JAN-2026</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

  )
}