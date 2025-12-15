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
    const [isWithdrawing, setIsWithdrawing] = useState(false)

    const [appliedGroups, setAppliedGroups] = useState<Set<string>>(new Set())
    const [groupLeader, setGroupLeader] = useState<Set<string>>(new Set())
    const [groupMember, setGroupMember] = useState<Set<string>>(new Set())

    const [openGroupId, setOpenGroupId] = useState<string | null>(null)
    const [withdrawGroupId, setWithdrawGroupId] = useState<string | null>(null)

    const { groups, isGettingGroups, message, setGroups } = useGroupStore()
    const { user, setActiveUser } = useUserStore()

    /* ---------------- Effects ---------------- */

    useEffect(() => {
        setGroups()
        setActiveUser()
    }, [setGroups, setActiveUser])

    useEffect(() => {
        if (!user?._id || groups.length === 0) return

        const userId = user._id.toString()
        console.log(userId)

        const { applied, leader, member } = groups.reduce(
            (acc, group) => {
                if (!group._id) return acc

                console.log(group)
                const hasRequested = group.requestedUser?.some(

                    req => req.userId.toString() === userId
                )

                console.log(hasRequested)

                const isLeader = group.accessTo?.some(
                    req => req.userId.toString() === userId && req.userRole === 'leader'
                )

                const hasMember = group.accessTo?.some(
                    req => req.userId.toString() === userId
                )

                if (hasRequested) acc.applied.add(group._id.toString())
                if (isLeader) acc.leader.add(group._id.toString())
                else if (hasMember) acc.member.add(group._id.toString())

                return acc
            },
            {
                applied: new Set<string>(),
                leader: new Set<string>(),
                member: new Set<string>(),
            }
        )

        setAppliedGroups(applied)
        setGroupLeader(leader)
        setGroupMember(member)
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

    /* ---------------- APIs ---------------- */

    const sendRequest = async (groupId: string, data: JoinGroupSchema) => {
        try {
            setIsSubmitting(true)

            const res = await axios.post(
                `/api/member/group/joinGroup?groupId=${groupId}`,
                data
            )

            if (res.data.success) {
                toast.success(res.data.message)
                setAppliedGroups(prev => new Set(prev).add(groupId))
                setOpenGroupId(null)
                form.reset()
            } else {
                toast.error(res.data.message)
            }
        } catch {
            toast.error('Error while sending request')
        } finally {
            setIsSubmitting(false)
        }
    }

    const withdrawRequest = async (groupId: string) => {
        try {
            setIsWithdrawing(true)

            const res = await axios.post(
                `/api/member/group/widrawRequest?groupId=${groupId}`
            )

            if (res.data.success) {
                toast.success(res.data.message)

                setAppliedGroups(prev => {
                    const updated = new Set(prev)
                    updated.delete(groupId)
                    return updated
                })

                setWithdrawGroupId(null)
            } else {
                toast.error(res.data.message)
            }
        } catch {
            toast.error('Error while withdrawing request')
        } finally {
            setIsWithdrawing(false)
        }
    }



    /* ---------------- Render ---------------- */

    return (
        <div className="mx-auto my-8 max-w-7xl px-6 space-y-8">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold">Explore Groups</h1>
                <p className="text-sm text-muted-foreground">
                    Discover teams and communities you can join
                </p>
            </div>

            {/* Loading */}
            {isGettingGroups && <GroupListSkeleton />}

            {/* Empty */}
            {!isGettingGroups && groups.length === 0 && (
                <div className="border border-dashed rounded-xl p-10 text-center">
                    No groups available
                </div>
            )}

            {/* Groups */}
            {!isGettingGroups && groups.length > 0 && (
                <div className="max-w-5xl mx-auto rounded-2xl border divide-y">
                    {groups.map(group => {
                        if (!group._id) return null
                        const groupId = group._id.toString()

                        const isApplied = appliedGroups.has(groupId)
                        const isLeader = groupLeader.has(groupId)
                        const isMember = groupMember.has(groupId)

                        return (
                            <div
                                key={groupId}
                                className="flex justify-between gap-6 px-6 py-5"
                            >
                                {/* Left */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-sm">
                                            {group.name.toUpperCase()}
                                        </h3>
                                        <span className="text-xs text-muted-foreground">
                                            • {group.accessTo?.length ?? 0} members
                                        </span>
                                    </div>

                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {group.desc}
                                    </p>

                                    <div className="flex gap-2 flex-wrap">
                                        {group.techStack.map(tech => (
                                            <Badge key={tech} variant="secondary">
                                                {tech}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {/* Right */}
                                <div className="flex items-center space-x-2">
                                    {isLeader && <Badge>Leader</Badge>}

                                    {isMember && !isLeader && <Badge>Member</Badge>}

                                    {isApplied && !isLeader && (
                                        <Dialog
                                            open={withdrawGroupId === groupId}
                                            onOpenChange={open => !open && setWithdrawGroupId(null)}
                                        >
                                            <DialogTrigger asChild>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => setWithdrawGroupId(groupId)}
                                                >
                                                    Withdraw Request
                                                </Button>
                                            </DialogTrigger>

                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Withdraw Request</DialogTitle>
                                                    <DialogDescription>
                                                        Are you sure you want to withdraw your request from this group?
                                                    </DialogDescription>
                                                </DialogHeader>

                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button variant="outline">Cancel</Button>
                                                    </DialogClose>

                                                    <Button
                                                        variant="destructive"
                                                        onClick={() => withdrawRequest(groupId)}
                                                        disabled={isWithdrawing}
                                                    >
                                                        {isWithdrawing ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            'Confirm Withdraw'
                                                        )}
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>

                                    )}

                                    {!isApplied && !isLeader && !isMember && (
                                        <Dialog
                                            open={openGroupId === groupId}
                                            onOpenChange={open => setOpenGroupId(open ? groupId : null)}
                                        >
                                            <DialogTrigger asChild>
                                                <Button size="sm">Send Join Request</Button>
                                            </DialogTrigger>

                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Join Group</DialogTitle>
                                                    <DialogDescription>Tell why you want to join</DialogDescription>
                                                </DialogHeader>

                                                <Form {...form}>
                                                    <form
                                                        onSubmit={form.handleSubmit(data => sendRequest(groupId, data))}
                                                        className="space-y-4"
                                                    >
                                                        <FormField
                                                            control={form.control}
                                                            name="message"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Message</FormLabel>
                                                                    <FormControl>
                                                                        <Input {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />

                                                        <DialogFooter>
                                                            <DialogClose asChild>
                                                                <Button variant="outline">Cancel</Button>
                                                            </DialogClose>

                                                            <Button disabled={isSubmitting}>
                                                                {isSubmitting ? (
                                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                                ) : (
                                                                    'Submit'
                                                                )}
                                                            </Button>
                                                        </DialogFooter>
                                                    </form>
                                                </Form>
                                            </DialogContent>
                                        </Dialog>
                                    )}
                                </div>

                            </div>
                        )
                    })}
                </div>
            )}

        </div>
    )
}

export default JoinGroup
