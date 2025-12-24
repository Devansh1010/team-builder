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
import { useActiveUser } from '@/hooks/useActiveUser'

const JoinGroup = () => {
  const [openGroupId, setOpenGroupId] = useState<string | null>(null)
  const [withdrawGroupId, setWithdrawGroupId] = useState<string | null>(null)

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

  // Update your mutation definition for better clarity
  const sendRequestMutation = useMutation({
    mutationFn: sendJoinRequest,
    onSuccess: () => {
      toast.success('Request sent successfully');
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      setOpenGroupId(null); // Closes the dialog
      form.reset({ message: '' }); // Clears the form input
    },
    onError: (error: any) => {
     
      const message = error.response?.data?.message || 'Error while sending request';
      toast.error(message);
    },
  });

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
    <div className="mx-auto my-8 max-w-340 px-6 space-y-8 transition-colors">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Explore Groups
        </h1>
        <p className="text-sm text-slate-500 dark:text-gray-400">
          Discover teams and communities you can join
        </p>
      </div>

      {/* Empty State */}
      {!isGettingGroups && groups.length === 0 && (
        <div className="border border-dashed border-gray-300 dark:border-white/10 rounded-2xl p-20 text-center text-slate-500 dark:text-gray-400 bg-gray-50/50 dark:bg-white/2">
          No groups available at the moment.
        </div>
      )}

      {/* Groups List Container */}
      {!isGettingGroups && groups.length > 0 && (
        <div className="max-w-5xl mx-auto rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-[#161616] overflow-hidden divide-y divide-gray-100 dark:divide-white/5 shadow-sm dark:shadow-none">
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
              <div key={groupId} className="flex flex-col sm:flex-row justify-between sm:items-center gap-6 px-8 py-6 hover:bg-gray-50/50 dark:hover:bg-white/1 transition-colors">
                {/* Left Content */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-[15px] tracking-wide text-slate-900 dark:text-gray-100">
                      {group.name.toUpperCase()}
                    </h3>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-gray-400">
                      {group.accessTo?.length ?? 0} members
                    </span>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-gray-400 line-clamp-2 max-w-xl leading-relaxed">
                    {group.desc}
                  </p>

                  <div className="flex gap-2 flex-wrap pt-1">
                    {group.techStack.map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400 border-none font-medium text-[11px] uppercase tracking-wider"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Right Action Area */}
                <div className="flex items-center space-x-3">
                  {isLeader && (
                    <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                      Leader
                    </Badge>
                  )}

                  {isMember && !isLeader && (
                    <Badge variant="outline" className="border-slate-300 dark:border-white/10 text-slate-600 dark:text-gray-300">
                      Member
                    </Badge>
                  )}

                  {/* Withdraw Logic */}
                  {isApplied && !isLeader && (
                    <Dialog
                      open={withdrawGroupId === groupId}
                      onOpenChange={(open) => !open && setWithdrawGroupId(null)}
                    >
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="rounded-full px-4 h-9 font-medium"
                          onClick={() => setWithdrawGroupId(groupId)}
                        >
                          Withdraw Request
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="dark:bg-[#161616] dark:border-white/10">
                        <DialogHeader>
                          <DialogTitle className="dark:text-white">Withdraw Request</DialogTitle>
                          <DialogDescription className="dark:text-gray-400">
                            Are you sure you want to withdraw your request from <span className="font-semibold text-slate-900 dark:text-white">{group.name}</span>?
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="gap-2 sm:gap-0">
                          <DialogClose asChild>
                            <Button variant="ghost" className="dark:text-gray-400">Cancel</Button>
                          </DialogClose>
                          <Button
                            variant="destructive"
                            disabled={withdrawMutation.isPending}
                            onClick={() => withdrawMutation.mutate(groupId)}
                          >
                            {withdrawMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirm Withdraw'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}

                  {/* Join Logic */}
                  {!isApplied && !isLeader && !isMember && (
                    <Dialog
                      open={openGroupId === groupId}
                      onOpenChange={(open) => setOpenGroupId(open ? groupId : null)}
                    >
                      <DialogTrigger asChild>
                        <Button size="sm" className="bg-sky-600 hover:bg-sky-700 dark:bg-white dark:text-black dark:hover:bg-gray-200 rounded-full px-6 h-9 font-semibold">
                          Join
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="dark:bg-[#161616] dark:border-white/10">
                        <DialogHeader>
                          <DialogTitle className="dark:text-white font-bold">Join Group</DialogTitle>
                          <DialogDescription className="dark:text-gray-400">
                            Why do you want to join {group.name}?
                          </DialogDescription>
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
                                  <FormLabel className="dark:text-gray-300">Personal Message</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      className="dark:bg-black/20 dark:border-white/10 focus-visible:ring-sky-500"
                                      placeholder="I'd love to contribute because..."
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <DialogFooter>
                              <Button
                                type="submit"
                                disabled={sendRequestMutation.isPending}
                                className="w-full sm:w-auto bg-sky-600 dark:bg-white dark:text-black"
                              >
                                {sendRequestMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send Request'}
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
