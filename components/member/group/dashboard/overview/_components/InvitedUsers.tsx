import { fetchActiveGroups } from '@/lib/api/group.api'
import { IInvitedUser } from '@/models/user_models/group.model'
import { useQuery } from '@tanstack/react-query'
import { Badge } from 'lucide-react'
import React from 'react'

const InvitedUsers = () => {

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

  const invitedUsers = groupOverview?.invitedUsers || []

    return (
        <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
            <h3 className="text-lg font-semibold mb-2">Invited Users</h3>
            <div className="mt-4 space-y-3">
                {/* Empty State */}
                {(!invitedUsers || invitedUsers.length === 0) && (
                    <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center dark:border-gray-700 dark:bg-gray-900">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            No pending invitations
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Invite users to collaborate in this group
                        </p>
                    </div>
                )}

                {/* Invited Users List */}
                {invitedUsers?.map((user: IInvitedUser) => (
                    <div
                        key={user.userId?.toString()}
                        className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition hover:bg-gray-50
                 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800"
                    >
                        {/* Left: User info */}
                        <div className="flex items-center gap-3">
                            {/* Avatar */}
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                                {user.username.charAt(0).toUpperCase()}
                            </div>

                            {/* Name */}
                            <div>
                                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                    {user.username}
                                </p>
                                <p className="text-xs text-muted-foreground">Invitation sent</p>
                            </div>
                        </div>

                        {/* Right: Status badge */}
                        <Badge className="text-xs">
                            Pending
                        </Badge>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default InvitedUsers