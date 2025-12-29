'use client'
import { fetchCurrentActiveUser } from '@/lib/api/user.api'
import { useQuery } from '@tanstack/react-query'
import { User, Mail, Shield, CalendarDays } from 'lucide-react'

const UserProfileDetails = () => {

    const { data: activeUser, isLoading } = useQuery({
        queryKey: ['activeUser'],
        queryFn: fetchCurrentActiveUser,
    })

     if (isLoading) return <div className="p-10 text-center font-black uppercase tracking-widest animate-pulse">Syncing Profile...</div>

    return (
        <div className="w-full space-y-6 animate-in fade-in duration-500">
            {/* Header Info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-black/20 shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="h-20 w-20 rounded-2xl bg-slate-900 dark:bg-slate-100 flex items-center justify-center text-white dark:text-black text-3xl font-black italic">
                        {activeUser.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">
                            {activeUser.username}
                        </h1>
                        <p className="text-sm font-medium text-slate-500 flex items-center gap-2 mt-1">
                            <Mail className="h-3.5 w-3.5" /> {activeUser.email}
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <div className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Groups</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">{activeUser.groups?.length || 0}</p>
                    </div>
                    <div className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Invites</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">{activeUser.invitation?.length || 0}</p>
                    </div>
                </div>
            </div>

            {/* Account Settings / Meta */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Security Status</h3>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <Shield className={`h-4 w-4 ${activeUser.isVerified ? 'text-emerald-500' : 'text-amber-500'}`} />
                            {activeUser.isVerified ? 'Identity Verified' : 'Verification Pending'}
                        </div>
                        {!activeUser.isVerified && (
                            <button className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white underline underline-offset-4">Verify Now</button>
                        )}
                    </div>
                </div>

                <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Member Since</h3>
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                        <CalendarDays className="h-4 w-4 text-slate-400" />
                        {new Date(activeUser.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserProfileDetails