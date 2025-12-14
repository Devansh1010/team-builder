'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useGroupStore } from '@/store/group.store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

/* ---------------- Skeleton ---------------- */

const GroupListSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
            <Card key={i}>
                <CardHeader>
                    <Skeleton className="h-5 w-2/3" />
                </CardHeader>
                <CardContent className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <div className="flex gap-2">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-16" />
                    </div>
                </CardContent>
            </Card>
        ))}
    </div>
)

/* ---------------- Page ---------------- */

const JoinGroup = () => {
    const {
        groups,
        isGettingGroups,
        message,
        setGroups,
    } = useGroupStore()

    useEffect(() => {
        setGroups()
    }, [setGroups])

    useEffect(() => {
        if (message) toast.info(message)
    }, [message])

    return (
        <div className="mx-auto my-8 max-w-7xl px-6 space-y-8">

            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                    Explore Groups
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Discover teams and communities you can join
                </p>
            </div>

            {/* Loading */}
            {isGettingGroups && <GroupListSkeleton />}

            {/* Empty State */}
            {!isGettingGroups && groups.length === 0 && (
                <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-10 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        No groups available right now.
                    </p>
                </div>
            )}

            {/* Groups List */}
            {!isGettingGroups && groups.length > 0 && (
                <div className="mx-auto max-w-5xl rounded-2xl border border-gray-200 dark:border-gray-800 divide-y divide-gray-200 dark:divide-gray-800 overflow-hidden">

                    {groups.map((group) => (
                        <Link
                            key={group._id?.toString()}
                            href={`/member/dashboard/join/${group._id}`}
                            className="group block transition-colors hover:bg-gray-50 dark:hover:bg-gray-900"
                        >
                            <div className="flex items-start justify-between gap-6 px-6 py-5">

                                {/* Left Content */}
                                <div className="min-w-0 space-y-2">

                                    {/* Title + Meta */}
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h3 className="font-semibold text-sm tracking-wide text-gray-900 dark:text-gray-100 truncate">
                                            {group.name.toUpperCase()}
                                        </h3>

                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            • {group.accessTo?.length ?? 0} members
                                        </span>
                                    </div>

                                    {/* Description */}
                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 max-w-3xl">
                                        {group.desc}
                                    </p>

                                    {/* Tech Stack */}
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {group.techStack.map((tech: string) => (
                                            <Badge
                                                key={tech}
                                                variant="secondary"
                                                className="rounded-full text-xs px-3 py-0.5 bg-gray-100 text-gray-700
                               dark:bg-gray-800 dark:text-gray-300"
                                            >
                                                {tech}
                                            </Badge>
                                        ))}
                                    </div>

                                </div>

                                {/* Arrow */}
                                <div className="mt-1 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition">
                                    →
                                </div>

                            </div>
                        </Link>
                    ))}

                </div>
            )}

        </div>

    )
}

export default JoinGroup
