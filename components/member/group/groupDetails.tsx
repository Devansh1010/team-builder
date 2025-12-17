'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

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

import { Divide, Loader2 } from 'lucide-react'

import { IMembers, IRequestedUser } from '@/models/user_models/group.model'

//tanstack Quert

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchActiveGroups, handleGroupRequest } from '@/lib/api/group.api'
import CreateGroup from './createGroup'
import { IUser } from '@/models/user_models/user.model'
import { Badge } from '@/components/ui/badge'

const GroupPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date())

  const { data: activeGroup = [], isLoading } = useQuery({
    queryKey: ['activeGroups'],
    queryFn: fetchActiveGroups,
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

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!activeGroup.length) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="max-w-md text-center space-y-6">
          {/* Heading */}
          <h2 className="text-2xl font-semibold">You’re not part of any group yet</h2>

          {/* Sub text */}
          <p className="text-muted-foreground">
            Create a new group or join an existing one to start collaborating with others.
          </p>

          {/* Actions */}
          <div className="flex items-center justify-center gap-4">
            <CreateGroup />
            <Button variant="outline">Join Group</Button>
          </div>
        </div>
      </div>
    )
  }

  const group = activeGroup[0]
  // const role = group.accessTo?.[0]?.userRole

  return (
    <div className="mx-auto my-6 max-w-340">
      {/* Main Card */}
      <div className="flex-1 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-8 py-6 shadow-sm min-h-155">
        {/* Header */}
        <div className="flex items-center justify-between">
          {/* Group Title */}
          <h1 className="text-2xl font-semibold tracking-wide text-gray-900 dark:text-gray-100">
            {group.name.toUpperCase()}
          </h1>

          {/* Members */}
          <div className="flex -space-x-2">
            {group.accessTo?.map((user: IRequestedUser) => (
              <Avatar
                key={user.userId.toString()}
                className="h-8 w-8 border border-white dark:border-gray-900"
              >
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            ))}
          </div>
        </div>

        {/* Soft Divider */}
        <div className="my-4 h-px bg-linear-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />

        {/* Content */}
        <div className="flex flex-col gap-6">
          <Tabs defaultValue="tasks" className="w-full">
            {/* Tab Headers */}
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="Discussion">Discussion</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Tab 1 */}
            <TabsContent value="overview" className="mt-6">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                {/* Header */}
                <div className="mb-4 flex items-start justify-between gap-4">
                  {/* Left: Title */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      Overview
                    </h3>
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
                      <DialogHeader>
                        <DialogTitle>Leave this group?</DialogTitle>
                        <DialogDescription>
                          You will lose access to group content and activities.
                        </DialogDescription>
                      </DialogHeader>

                      <DialogFooter className="flex gap-2">
                        <DialogClose asChild>
                          <Button variant="outline" className="flex-1">
                            Cancel
                          </Button>
                        </DialogClose>

                        <Button variant="destructive" className="flex-1">
                          Leave Group
                        </Button>
                      </DialogFooter>
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
                          {group.requestedUser.length === 0 && (
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

                          {group.requestedUser.length > 0 && (
                            <div className="space-y-3">
                              {group.requestedUser.map((user: IRequestedUser) => {
                                if (!user?.userId || !group._id) return null

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
                                        <p className="text-xs text-muted-foreground">
                                          Requested to join
                                        </p>
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
                                                groupId: group._id.toString(),
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
                                                groupId: group._id.toString(),
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
                          {(!group.invitedUsers || group.invitedUsers.length === 0) && (
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
                          {group.invitedUsers?.map((user: IUser) => (
                            <div
                              key={user._id?.toString()}
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
                          {(!group.members || group.members.length === 0) && (
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
                          {group.members?.map((member: IMembers) => (
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
            </TabsContent>

            {/* Tab 2 */}
            <TabsContent value="tasks" className="mt-6">
              <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
                <h3 className="text-lg font-semibold mb-2">Tasks</h3>
                <p className="text-sm text-muted-foreground">
                  Tasks / boards / workflow will go here.
                </p>
              </div>
            </TabsContent>

            {/* Tab 3 */}
            <TabsContent value="settings" className="mt-6">
              <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
                <h3 className="text-lg font-semibold mb-2">Members</h3>
                <p className="text-sm text-muted-foreground">
                  Members management content will go here.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="Discussion" className="mt-6">
              <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
                <h3 className="text-lg font-semibold mb-2">Members</h3>
                <p className="text-sm text-muted-foreground">Discussion</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default GroupPage
