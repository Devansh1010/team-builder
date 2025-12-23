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

const RequestedUsers = () => {

    const { data: groupOverview, isLoading } = useQuery({
        queryKey: ['activeGroups'],
        queryFn: fetchActiveGroups,

        select: (groups) => ({
            id: groups[0]?._id,
            requestedUsers: groups[0]?.requestedUser || [],
            invitedUsers: groups[0]?.invitedUsers || [],
            members: groups[0]?.members || [],
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
        <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
            <h3 className="text-lg font-semibold mb-2">Join Requetes</h3>
            <div>
                {requestedUsers.length === 0 && (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300">
                            👋
                        </div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            No join requests yet
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            When someone requests to join, they’ll appear here.
                        </p>
                    </div>
                )}

                {requestedUsers.length > 0 && (
                    <div className="space-y-3">
                        {requestedUsers.map((user: IRequestedUser) => {
                            if (!user?.userId) return null
                            return (
                                <div
                                    key={user.userId.toString()}
                                    className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4 transition hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-900"
                                >
                                    {/* Left */}
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                                            {(user.username?.charAt(0) || '?').toUpperCase()}
                                        </div>

                                        <div>
                                            <p className="font-medium text-gray-800 dark:text-gray-200">
                                                {user.username}
                                            </p>
                                            <p className="text-xs text-muted-foreground">Requested to join</p>
                                        </div>
                                    </div>

                                    {/* Right */}
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button size="sm" variant="outline">
                                                View
                                            </Button>
                                        </DialogTrigger>

                                        <DialogContent className="sm:max-w-[420px] rounded-2xl">
                                            <DialogHeader>
                                                <DialogTitle>{user.username}</DialogTitle>
                                                <DialogDescription className="mt-2 text-sm text-muted-foreground">
                                                    {user.msg || 'No message provided.'}
                                                </DialogDescription>
                                            </DialogHeader>

                                            <DialogFooter className="mt-4 flex gap-2">
                                                <DialogClose asChild>
                                                    <Button variant="outline" className="flex-1">
                                                        Cancel
                                                    </Button>
                                                </DialogClose>

                                                <Button
                                                    disabled={requestMutation.isPending}
                                                    onClick={() =>
                                                        requestMutation.mutate({
                                                            groupId: groupId.toString(),
                                                            requestedUserId: user.userId.toString(),
                                                            isAccept: true,
                                                        })
                                                    }
                                                >
                                                    {requestMutation.isPending ? 'Accepting...' : 'Accept'}
                                                </Button>

                                                <Button
                                                    variant="destructive"
                                                    disabled={requestMutation.isPending}
                                                    onClick={() =>
                                                        requestMutation.mutate({
                                                            groupId: groupId.toString(),
                                                            requestedUserId: user.userId.toString(),
                                                            isAccept: false,
                                                        })
                                                    }
                                                >
                                                    {requestMutation.isPending ? 'Rejecting...' : 'Reject'}
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default RequestedUsers