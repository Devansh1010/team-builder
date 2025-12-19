import { IGroup, IInvitedUser, IMembers, IRequestedUser } from '@/models/user_models/group.model'

import { joinGroupSchema, JoinGroupSchema } from '@/lib/schemas/group/SendRequest'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchActiveGroups, handleGroupRequest, handleLeaveGroup } from '@/lib/api/group.api'
import { Loader2 } from 'lucide-react'

const TabOverview = ({ group }: { group: IGroup }) => {
  const { data: groupOverview, isLoading } = useQuery({
    queryKey: ['activeGroups'],
    queryFn: fetchActiveGroups,
    // Transform: Return an object containing both the ID and the users array
    select: (groups) => ({
      id: groups[0]?._id,
      requestedUsers: groups[0]?.requestedUser || [],
      invitedUsers: groups[0]?.invitedUsers || [],
      members: groups[0]?.members || [],
    }),
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  })

  // Now you access them like this:
  const requestedUsers = groupOverview?.requestedUsers || []
  const invitedUsers = groupOverview?.invitedUsers || []
  const members = groupOverview?.members || []
  const groupId = groupOverview?.id

  if (!groupId) return

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

  const leaveGroup = useMutation({
    mutationFn: handleLeaveGroup,
    onSuccess: () => {
      toast.success('Group Leaved Successfully')
      queryClient.invalidateQueries({ queryKey: ['activeGroups'] })
    },
    onError: () => {
      toast.error('Failed to Leave Group')
    },
  })

  const form = useForm<JoinGroupSchema>({
    resolver: zodResolver(joinGroupSchema),
    defaultValues: {
      message: '',
    },
  })

  return (
    <div>
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-4">
        {/* Left: Title */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Overview</h3>
          <p className="text-sm text-muted-foreground">
            Manage group details and incoming join requests
          </p>
        </div>

        {/* Right: Leave Group */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="hover:text-red-500">
              Leave Group
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[420px] rounded-2xl">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((data) =>
                  leaveGroup.mutate({ groupId: groupId.toString(), data })
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
                  <Button disabled={leaveGroup.isPending}>
                    {leaveGroup.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Submit'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-6">
        <Tabs defaultValue="requests" className="w-full">
          {/* Tab Headers */}
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="requests">Requests</TabsTrigger>
            <TabsTrigger value="invited">Invited Members</TabsTrigger>
            <TabsTrigger value="members">Group Members</TabsTrigger>
          </TabsList>

          {/* Tab 1 */}
          <TabsContent value="requests" className="mt-6">
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
          </TabsContent>

          {/* Tab 2 */}
          <TabsContent value="invited" className="mt-6">
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
                    <Badge variant="outline" className="text-xs">
                      Pending
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Tab 3 */}
          <TabsContent value="members" className="mt-6">
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
                        variant={member.userRole === 'leader' ? 'default' : 'secondary'}
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default TabOverview
