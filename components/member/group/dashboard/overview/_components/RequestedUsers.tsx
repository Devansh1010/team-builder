import { fetchActiveGroups, handleGroupRequest } from '@/lib/api/group.api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { IRequestedUser } from '@/models/user_models/group.model'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

const RequestedUsers = () => {

    const { data: groupOverview, isLoading } = useQuery({
        queryKey: ['activeGroups'],
        queryFn: fetchActiveGroups,

        select: (groups) => ({
            id: groups[0]?._id,
            requestedUsers: groups[0]?.requestedUser || [],
        }),

        gcTime: 1000 * 60 * 30,
        refetchOnWindowFocus: false,
    })

    const queryClient = useQueryClient()

    const requestMutation = useMutation({
        mutationFn: handleGroupRequest,
        onSuccess: () => {
            toast.success('Request updated')
            queryClient.invalidateQueries({ queryKey: ['activeGroups'] })
        },
        onError: () => {
            toast.error('Failed to update request')
        },
    })

    const requestedUsers = groupOverview?.requestedUsers || []
    const groupId = groupOverview?.id

    if (!groupId) return

    return (
        <div className="animate-in fade-in duration-500">
            {/* Header: Clean & Uncluttered */}
            <div className="mb-6">
                <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white uppercase italic">
                    Join Requests
                </h3>
                <p className="text-xs font-medium text-slate-500">
                    Review and manage pending membership applications
                </p>
            </div>

            {requestedUsers.length === 0 ? (
                /* Minimalist Empty State */
                <div className="flex flex-col items-center justify-center py-16 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-black/20">
                    
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Queue is empty</p>
                    <p className="text-xs text-slate-500 mt-1">New requests will appear here in real-time.</p>
                </div>
            ) : (
                /* Refined List State */
                <div className="grid gap-3">
                    {requestedUsers.map((user: IRequestedUser) => {
                        if (!user?.userId) return null;
                        return (
                            <div
                                key={user.userId.toString()}
                                className="group flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-transparent hover:border-slate-900 dark:hover:border-slate-100 transition-all duration-300"
                            >
                                <div className="flex items-center gap-4">
                                    {/* User Avatar - Professional Slate Style */}
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 dark:bg-slate-100 text-slate-100 dark:text-slate-900 font-black text-xs shadow-sm">
                                        {(user.username?.charAt(0) || '?').toUpperCase()}
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                            {user.username}
                                        </p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                                            </span>
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                                                Awaiting Action
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-9 px-4 font-bold text-xs uppercase tracking-widest border-slate-200 dark:border-slate-800 hover:bg-slate-900 hover:text-white dark:hover:bg-slate-100 dark:hover:text-slate-900 transition-colors"
                                        >
                                            Review
                                        </Button>
                                    </DialogTrigger>

                                    <DialogContent className="sm:max-w-[420px] border-slate-200 dark:border-slate-800 p-0 overflow-hidden">
                                        <div className="p-6 pb-0">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="h-12 w-12 rounded-full bg-slate-900 dark:bg-slate-100 flex items-center justify-center text-slate-100 dark:text-slate-900 font-black text-lg">
                                                    {user.username?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <DialogTitle className="text-xl font-black tracking-tight">{user.username}</DialogTitle>
                                                    <p className="text-xs text-slate-500 font-medium">Request to join group</p>
                                                </div>
                                            </div>

                                            <div className="relative p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                                <span className="absolute -top-2 left-4 px-2 bg-white dark:bg-slate-950 text-[10px] font-black uppercase tracking-tighter text-slate-400">Message</span>
                                                <p className="text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
                                                    "{user.msg || 'No introductory message provided.'}"
                                                </p>
                                            </div>
                                        </div>

                                        <DialogFooter className="flex flex-row gap-0 p-6 pt-6">
                                            <Button
                                                variant="ghost"
                                                className="flex-1 h-12 font-bold text-destructive hover:bg-destructive/10 rounded-none rounded-l-xl"
                                                disabled={requestMutation.isPending}
                                                onClick={() => requestMutation.mutate({
                                                    groupId: groupId.toString(),
                                                    requestedUserId: user.userId.toString(),
                                                    isAccept: false,
                                                })}
                                            >
                                                Decline
                                            </Button>
                                            <Button
                                                className="flex-1 h-12 font-bold bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-none rounded-r-xl"
                                                disabled={requestMutation.isPending}
                                                onClick={() => requestMutation.mutate({
                                                    groupId: groupId.toString(),
                                                    requestedUserId: user.userId.toString(),
                                                    isAccept: true,
                                                })}
                                            >
                                                {requestMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Accept Member'}
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    )
}

export default RequestedUsers