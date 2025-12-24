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
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="p-4 border-b">
                <h3 className="text-lg font-semibold tracking-tight">All Group Members</h3>
                <p className="text-xs text-muted-foreground">Manage and view all current members</p>
            </div>

            <div className="p-4">
                {/* Empty State */}
                {(!members || members.length === 0) ? (
                    <div className="flex flex-col items-center justify-center py-10 px-4 border-2 border-dashed rounded-xl bg-accent/5">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Users className="h-6 w-6" />
                        </div>
                        <p className="text-sm font-medium">No members yet</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Members will appear here once they join the group.
                        </p>
                    </div>
                ) : (
                    /* Members List */
                    <div className="space-y-3">
                        {members.map((member: IMembers) => (
                            <div
                                key={member.userId.toString()}
                                className="flex items-center justify-between rounded-lg border bg-background p-3 transition-all hover:bg-accent/5"
                            >
                                {/* Left: User Info */}
                                <div className="flex items-center gap-3">
                                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold text-xs
                                ${member.userRole === 'leader'
                                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
                                            : 'bg-primary text-primary-foreground'}`}>
                                        {(member.username?.charAt(0) || 'U').toUpperCase()}
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold truncate flex items-center gap-2">
                                            {member.username || 'Sample User'}
                                            {member.userRole === 'leader' && (
                                                <ShieldCheck className="h-3 w-3 text-amber-500" />
                                            )}
                                        </p>
                                        <p className="text-[11px] text-muted-foreground">
                                            Joined {new Date(member.joinedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                {/* Right: Role + Actions */}
                                <div className="flex items-center gap-2">
                                    <CustomBadge
                                        variant={member.userRole === 'leader' ? 'leader' : 'secondary'}
                                        className="text-[10px] uppercase tracking-wider"
                                    >
                                        {String(member.userRole)}
                                    </CustomBadge>

                                    {member.userRole !== 'leader' && (
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground">
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
    )
}

export default Members