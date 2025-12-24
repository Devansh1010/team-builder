import { Button } from '@/components/ui/button'
import { fetchActiveGroups } from '@/lib/api/group.api'
import { IInvitedUser } from '@/models/user_models/group.model'
import { useQuery } from '@tanstack/react-query'
import { Badge, Loader2, X } from 'lucide-react'

const InvitedUsers = () => {

    const { data: groupOverview, isLoading } = useQuery({
        queryKey: ['activeGroups'],
        queryFn: fetchActiveGroups,

        select: (groups) => ({
            id: groups[0]?._id,
            invitedUsers: groups[0]?.invitedUsers || [],
        }),

        gcTime: 1000 * 60 * 30,
        refetchOnWindowFocus: false,
    })

    const invitedUsers = groupOverview?.invitedUsers || []

    return (
        <div className="w-full animate-in fade-in duration-500">
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/30">
                    <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                    <p className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                        Refreshing Invites
                    </p>
                </div>
            ) : (
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-black/20 overflow-hidden shadow-sm">
                    {/* Header with Consistent Brand Style */}
                    <div className="p-5 border-b border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-white/2">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                            Pending Authorization
                        </h3>
                        <p className="text-lg font-black tracking-tighter text-slate-900 dark:text-white uppercase italic mt-1">
                            Invited Users
                        </p>
                    </div>

                    <div className="p-5">
                        <div className="space-y-4">
                            {/* Empty State: Themed Dash */}
                            {(!invitedUsers || invitedUsers.length === 0) ? (
                                <div className="rounded-xl border-2 border-dashed border-slate-100 dark:border-slate-900 p-8 text-center bg-slate-50/30 dark:bg-transparent">
                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                        No active invitations
                                    </p>
                                    <p className="mt-1 text-[11px] text-slate-500">
                                        Outbound access requests will appear here.
                                    </p>
                                </div>
                            ) : (
                                /* Invited Users List */
                                invitedUsers.map((user: IInvitedUser) => (
                                    <div
                                        key={user.userId?.toString()}
                                        className="group flex items-center justify-between p-4 rounded-lg border border-slate-100 dark:border-slate-900 bg-white dark:bg-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-all"
                                    >
                                        {/* Left: User info */}
                                        <div className="flex items-center gap-4">
                                            {/* Avatar: Slate-based Square */}
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 font-bold text-xs border border-slate-200 dark:border-slate-700">
                                                {user.username.charAt(0).toUpperCase()}
                                            </div>

                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                                    {user.username}
                                                </p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="relative flex h-1.5 w-1.5">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-slate-400"></span>
                                                    </span>
                                                    <p className="text-[10px] font-medium text-slate-500 uppercase tracking-tight">
                                                        Awaiting Response
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right: Status badge - Minimalist */}
                                        <div className="flex items-center gap-3">
                                            <span className="px-3 py-1 text-[9px] font-black uppercase tracking-widest bg-slate-50 dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800 rounded-md">
                                                Pending
                                            </span>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600">
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default InvitedUsers