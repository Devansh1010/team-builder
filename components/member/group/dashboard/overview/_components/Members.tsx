import { Button } from '@/components/ui/button'
import { fetchActiveGroups } from '@/lib/api/group.api'
import { CustomBadge } from '@/lib/CustomBadge'
import { IMembers } from '@/models/user_models/group.model'
import { useQuery } from '@tanstack/react-query'
import { Badge, MoreVertical, ShieldCheck, Users } from 'lucide-react'
import React from 'react'

const Members = () => {
    const { data: groupOverview, isLoading } = useQuery({
        queryKey: ['activeGroups'],
        queryFn: fetchActiveGroups,

        select: (groups) => ({
            id: groups[0]?._id,
            members: groups[0]?.members || [],
        }),

        gcTime: 1000 * 60 * 30,
        refetchOnWindowFocus: false,
    })

    const members = groupOverview?.members || []

    return (
        <div className="w-full space-y-6 animate-in fade-in duration-700">
            {/* Header Section: Minimal & Sharp */}
            <div className="flex flex-col gap-1 px-1">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Organization Personnel
                </h3>
                <p className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">
                    All Group Members
                </p>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-black/20 overflow-hidden shadow-sm">
                <div className="p-6">
                    {(!members || members.length === 0) ? (
                        /* Empty State: Themed */
                        <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-slate-100 dark:border-slate-900 rounded-xl">
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-900 text-slate-400">
                                <Users className="h-7 w-7" />
                            </div>
                            <p className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-slate-100">No members found</p>
                            <p className="mt-2 text-xs text-slate-500 max-w-[200px] leading-relaxed">
                                The directory is currently empty. New members will appear here upon authorization.
                            </p>
                        </div>
                    ) : (
                        /* Members List: Clean & High-Contrast */
                        <div className="divide-y divide-slate-100 dark:divide-slate-900">
                            {members.map((member: IMembers) => (
                                <div
                                    key={member.userId.toString()}
                                    className="group flex items-center justify-between py-4 first:pt-0 last:pb-0 transition-all"
                                >
                                    {/* Left: User Info */}
                                    <div className="flex items-center gap-4">
                                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border-2 font-black text-sm transition-transform group-hover:rotate-3
                  ${member.userRole === 'leader'
                                                ? 'border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-black'
                                                : 'border-slate-200 bg-transparent text-slate-600 dark:border-slate-800 dark:text-slate-400'}`}>
                                            {(member.username?.charAt(0) || 'U').toUpperCase()}
                                        </div>

                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                                                    {member.username || 'Anonymous User'}
                                                </p>
                                                {member.userRole === 'leader' && (
                                                    <ShieldCheck className="h-3.5 w-3.5 text-slate-900 dark:text-slate-100" />
                                                )}
                                            </div>
                                            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-tight mt-0.5">
                                                Authorized {new Date(member.joinedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right: Role + Actions */}
                                    <div className="flex items-center gap-4">
                                        <span className={`text-[9px] font-black uppercase tracking-[0.15em] px-2.5 py-1 rounded-md border
                  ${member.userRole === 'leader'
                                                ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-black dark:border-white'
                                                : 'bg-transparent text-slate-500 border-slate-200 dark:border-slate-800'}`}>
                                            {String(member.userRole)}
                                        </span>

                                        {member.userRole !== 'leader' && (
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-9 w-9 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                                            >
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Members