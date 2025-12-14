'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'

import { useGroupStore } from '@/store/group.store'
import { joinGroupSchema, JoinGroupSchema } from '@/lib/schemas/group/SendRequest'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog'

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from '@/components/ui/form'
import { useUserStore } from '@/store/user.store'

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
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [appliedGroups, setAppliedGroups] = useState<Set<string>>(new Set())
    const [openGroupId, setOpenGroupId] = useState<string | null>(null)

    const { groups, isGettingGroups, message, setGroups } = useGroupStore()
    const { user, setActiveUser } = useUserStore()

    /* ---------------- Effects ---------------- */
    useEffect(() => {
        setGroups()
        setActiveUser()
    }, [setGroups, setActiveUser])

    useEffect(() => {
        if (!user?._id) return

        const userId = user._id.toString()
        const applied = new Set<string>()

        groups.forEach(group => {
            if (!group._id) return

            const hasRequested = group.requestedUser?.some(
                req => req.userId.toString() === userId
            )

            const hasGroupMember = group.accessTo?.some(
                req => req.userId.toString() === userId
            )

            if (hasRequested || hasGroupMember) {
                applied.add(group._id.toString())
            }
        })

        setAppliedGroups(applied)

    }, [user, groups])

    useEffect(() => {
        if (message) toast.info(message)
    }, [message])

    /* ---------------- Form ---------------- */

    const form = useForm<JoinGroupSchema>({
        resolver: zodResolver(joinGroupSchema),
        defaultValues: {
            message: '',
        },
    })

    /* ---------------- API ---------------- */

    const sendRequest = async (groupId: string, data: JoinGroupSchema) => {
        try {
            setIsSubmitting(true)

            const res = await axios.post(
                `/api/member/group/joinGroup?groupId=${groupId}`,
                data
            )

            if (res.data.success) {
                toast.success(res.data.message)
                setOpenGroupId(null)
                setAppliedGroups(prev => new Set(prev).add(groupId))
                form.reset()
            } else {
                toast.error(res.data.message)
            }
        } catch {
            toast.error('Error occurred while sending request')
        } finally {
            setIsSubmitting(false)
        }
    }

    /* ---------------- Render ---------------- */

    return (
        <div className="mx-auto my-8 max-w-7xl px-6 space-y-8">

            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Explore Groups
                </h1>
                <p className="text-sm text-muted-foreground">
                    Discover teams and communities you can join
                </p>
            </div>

            {/* Loading */}
            {isGettingGroups && <GroupListSkeleton />}

            {/* Empty State */}
            {!isGettingGroups && groups.length === 0 && (
                <div className="rounded-xl border border-dashed p-10 text-center">
                    <p className="text-sm text-muted-foreground">
                        No groups available right now.
                    </p>
                </div>
            )}

            {/* Groups */}
            {!isGettingGroups && groups.length > 0 && (
                <div className="mx-auto max-w-5xl rounded-2xl border divide-y overflow-hidden">

                    {groups.map(group => {
                        if (!group._id) return null
                        const groupId = group._id.toString()
                        const isApplied = appliedGroups.has(groupId)

                        return (
                            <div
                                key={groupId}
                                className="flex items-start justify-between gap-6 px-6 py-5"
                            >

                                {/* Left */}
                                <div className="space-y-2 min-w-0">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h3 className="font-semibold text-sm truncate">
                                            {group.name.toUpperCase()}
                                        </h3>
                                        <span className="text-xs text-muted-foreground">
                                            • {group.accessTo?.length ?? 0} members
                                        </span>
                                    </div>

                                    <p className="text-sm text-muted-foreground line-clamp-2 max-w-3xl">
                                        {group.desc}
                                    </p>

                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {group.techStack.map(tech => (
                                            <Badge
                                                key={tech}
                                                variant="secondary"
                                                className="rounded-full text-xs px-3"
                                            >
                                                {tech}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {/* Right */}
                                <Dialog
                                    open={openGroupId === groupId}
                                    onOpenChange={open =>
                                        setOpenGroupId(open ? groupId : null)
                                    }
                                >
                                    {isApplied ? (
                                        <Button size="sm" variant="secondary" disabled>
                                            Applied
                                        </Button>
                                    ) : (
                                        <DialogTrigger asChild>
                                            <Button size="sm">Send Join Request</Button>
                                        </DialogTrigger>
                                    )}

                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Join Group</DialogTitle>
                                            <DialogDescription>
                                                Send a short message explaining why you want to join.
                                            </DialogDescription>
                                        </DialogHeader>

                                        <Form {...form}>
                                            <form
                                                onSubmit={form.handleSubmit(data =>
                                                    sendRequest(groupId, data)
                                                )}
                                                className="space-y-6"
                                            >
                                                <FormField
                                                    control={form.control}
                                                    name="message"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Message</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="I would love to contribute to backend or schema design"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            disabled={isSubmitting}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </DialogClose>

                                                    <Button type="submit" disabled={isSubmitting}>
                                                        {isSubmitting ? (
                                                            <span className="flex items-center gap-2">
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                                Sending...
                                                            </span>
                                                        ) : (
                                                            'Submit'
                                                        )}
                                                    </Button>
                                                </DialogFooter>
                                            </form>
                                        </Form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default JoinGroup
