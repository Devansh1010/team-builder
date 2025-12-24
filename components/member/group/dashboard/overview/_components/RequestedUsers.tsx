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
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="p-4 border-b">
                <h3 className="text-lg font-semibold tracking-tight">Join Requests</h3>
                <p className="text-xs text-muted-foreground">Manage pending member requests</p>
            </div>

            <div className="p-4">
                {requestedUsers.length === 0 ? (
                    /* Empty State - Matched to your previous list style */
                    <div className="flex flex-col items-center justify-center py-10 px-4 border-2 border-dashed rounded-xl bg-accent/5">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <span className="text-xl">👋</span>
                        </div>
                        <p className="text-sm font-medium">No join requests yet</p>
                        <p className="mt-1 text-xs text-muted-foreground max-w-[200px] text-center">
                            When someone asks to join, they will appear here.
                        </p>
                    </div>
                ) : (
                    /* List State */
                    <div className="space-y-3">
                        {requestedUsers.map((user: IRequestedUser) => {
                            if (!user?.userId) return null;
                            return (
                                <div
                                    key={user.userId.toString()}
                                    className="flex items-center justify-between rounded-lg border bg-background p-3 transition-all hover:border-primary/30"
                                >
                                    <div className="flex items-center gap-3">
                                        {/* Avatar with Theme Colors */}
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xs">
                                            {(user.username?.charAt(0) || '?').toUpperCase()}
                                        </div>

                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold truncate">
                                                {user.username}
                                            </p>
                                            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                                                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                                                Pending review
                                            </p>
                                        </div>
                                    </div>

                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button size="sm" variant="secondary" className="h-8 text-xs">
                                                Review
                                            </Button>
                                        </DialogTrigger>

                                        <DialogContent className="sm:max-w-[400px]">
                                            <DialogHeader>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                                                        {user.username?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <DialogTitle>{user.username}</DialogTitle>
                                                </div>
                                                <DialogDescription className="bg-accent/30 p-4 rounded-lg text-foreground italic border">
                                                    "{user.msg || 'No message provided.'}"
                                                </DialogDescription>
                                            </DialogHeader>

                                            <DialogFooter className="flex flex-row gap-2 mt-4">
                                                <Button
                                                    variant="destructive"
                                                    className="flex-1"
                                                    disabled={requestMutation.isPending}
                                                    onClick={() => requestMutation.mutate({
                                                        groupId: groupId.toString(),
                                                        requestedUserId: user.userId.toString(),
                                                        isAccept: false,
                                                    })}
                                                >
                                                    Reject
                                                </Button>
                                                <Button
                                                    variant="default"
                                                    className="flex-1"
                                                    disabled={requestMutation.isPending}
                                                    onClick={() => requestMutation.mutate({
                                                        groupId: groupId.toString(),
                                                        requestedUserId: user.userId.toString(),
                                                        isAccept: true,
                                                    })}
                                                >
                                                    {requestMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Accept User'}
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
        </div>
    )
}

export default RequestedUsers