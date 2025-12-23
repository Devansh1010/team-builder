import { Button } from '@/components/ui/button'
import { fetchActiveGroups } from '@/lib/api/group.api'
import { IMembers } from '@/models/user_models/group.model'
import { useQuery } from '@tanstack/react-query'
import { Badge } from 'lucide-react'
import React from 'react'

const Members = () => {
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

    const members = groupOverview?.members || []

    return (
        <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
            <h3 className="text-lg font-semibold mb-2">Join Requests</h3>
            <div className="mt-4 space-y-3">
                {/* Empty State (edge case) */}
                {(!members || members.length === 0) && (
                    <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center dark:border-gray-700 dark:bg-gray-900">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            No members yet
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Members will appear here once they join the group
                        </p>
                    </div>
                )}

                {/* Members List */}
                {members?.map((member: IMembers) => (
                    <div
                        key={member.userId.toString()}
                        className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-3 shadow-sm
                 transition hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800"
                    >
                        {/* Left: User Info */}
                        <div className="flex items-center gap-3">
                            {/* Avatar */}
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                                {member.username?.charAt(0).toUpperCase()}
                            </div>

                            {/* Name + Meta */}
                            <div>
                                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                    {member.username ? member.username : 'sample name'}
                                </p>

                                <p className="text-xs text-muted-foreground">
                                    Joined {new Date(member.joinedAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        {/* Right: Role + Actions */}
                        <div className="flex items-center gap-3">
                            {/* Role Badge */}
                            <Badge
                                className="text-xs"
                            >
                                {member.userRole}
                            </Badge>

                            {/* Optional: Admin Controls */}
                            {member.userRole !== 'leader' && (
                                <Button size="sm" variant="ghost" className="text-xs">
                                    Manage
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Members