'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'

import { joinGroupSchema, JoinGroupSchema } from '@/lib/schemas/group/SendRequest'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
//tanstack Quert

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchAllGroups, sendJoinRequest, widrawRequest } from '@/lib/api/group.api'
import { IAccessTo, IGroup, IRequestedUser } from '@/models/user_models/group.model'
import { fetchCurrentActiveUser } from '@/lib/api/user.api'
import { useActiveUser } from '@/hooks/useActiveUser'

/* ---------------- Page ---------------- */

const JoinGroup = () => {
  const [openGroupId, setOpenGroupId] = useState<string | null>(null)
  const [withdrawGroupId, setWithdrawGroupId] = useState<string | null>(null)

  /* ---------------- Effects ---------------- */

  const {
    data: groups = [],
    isLoading: isGettingGroups,
    isError,
  } = useQuery({
    queryKey: ['groups'],
    queryFn: fetchAllGroups,
  })

  const { data: user } = useActiveUser()

  const queryClient = useQueryClient()

  const sendRequestMutation = useMutation({
    mutationFn: sendJoinRequest,
    onSuccess: () => {
      toast.success('Request sent successfully')
      queryClient.invalidateQueries({ queryKey: ['groups'] })
      setOpenGroupId(null)
      form.reset()
    },
    onError: () => {
      toast.error('Error while sending request')
    },
  })

  const withdrawMutation = useMutation({
    mutationFn: widrawRequest,
    onSuccess: () => {
      toast.success('Request withdrawn')
      queryClient.invalidateQueries({ queryKey: ['groups'] })
      setWithdrawGroupId(null)
    },

    onError: () => {
      toast.error('Error while sending request')
    },
  })

  const form = useForm<JoinGroupSchema>({
    resolver: zodResolver(joinGroupSchema),
    defaultValues: {
      message: '',
    },
  })

  if (isGettingGroups) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (!groups.length) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        No groups available
      </div>
    )
  }

  return (
    <div className="mx-auto my-8 max-w-340 px-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Explore Groups</h1>
        <p className="text-sm text-muted-foreground">Discover teams and communities you can join</p>
      </div>

      {/* Empty */}
      {!isGettingGroups && groups.length === 0 && (
        <div className="border border-dashed rounded-xl p-10 text-center">No groups available</div>
      )}

      {/* Groups */}
      {!isGettingGroups && groups.length > 0 && (
        <div className="max-w-5xl mx-auto rounded-2xl border divide-y">
          {groups.map((group: IGroup) => {
            if (!group._id) return null
            const groupId = group._id.toString()

            const userId = user?._id?.toString()

            const isApplied = group.requestedUser?.some(
              (r: IRequestedUser) => r.userId.toString() === userId?.toString()
            )

            const isLeader = group.accessTo?.some(
              (a: IAccessTo) => a.userId.toString() === userId && a.userRole === 'leader'
            )

            const isMember = group.accessTo?.some(
              (a: IAccessTo) => a.userId.toString() === userId && a.userRole === 'member'
            )

            return (
              <div key={groupId} className="flex justify-between gap-6 px-6 py-5">
                {/* Left */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm">{group.name.toUpperCase()}</h3>
                    <span className="text-xs text-muted-foreground">
                      • {group.accessTo?.length ?? 0} members
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">{group.desc}</p>

                  <div className="flex gap-2 flex-wrap">
                    {group.techStack.map((tech) => (
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
                      onOpenChange={(open) => !open && setWithdrawGroupId(null)}
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

                          {/* Widraw Request Button */}
                          <Button
                            variant="destructive"
                            disabled={withdrawMutation.isPending}
                            onClick={() => withdrawMutation.mutate(groupId)}
                          >
                            {withdrawMutation.isPending ? (
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
                      onOpenChange={(open) => setOpenGroupId(open ? groupId : null)}
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
                            onSubmit={form.handleSubmit((data) =>
                              sendRequestMutation.mutate({ groupId, data })
                            )}
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

                              {/* Join Request Button */}
                              <Button disabled={sendRequestMutation.isPending}>
                                {sendRequestMutation.isPending ? (
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
