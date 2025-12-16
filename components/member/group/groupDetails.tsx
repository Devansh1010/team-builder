'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Calendar } from '@/components/ui/calendar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

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

import { Loader2 } from 'lucide-react'

import { IRequestedUser } from '@/models/user_models/group.model'

//tanstack Quert

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchActiveGroups, handleGroupRequest } from '@/lib/api/group.api'
import CreateGroup from './createGroup'

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
    <div className="mx-auto my-6 max-w-340 flex gap-6">
      {/* Main Card */}
      <div className="flex-1 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-8 py-6 shadow-sm">
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
          {/* Description */}
          <Accordion type="single" collapsible>
            <AccordionItem value="desc" className="border-none">
              <AccordionTrigger className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:no-underline">
                Description
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                {group.desc}
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2">
            {group.techStack?.map((tech: string) => (
              <Badge
                key={tech}
                variant="secondary"
                className="rounded-full px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700
                       dark:bg-gray-800 dark:text-gray-300"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar Card */}
      <div className="flex- flex-col">
        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 shadow-sm">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-lg min-w-70"
          />
        </div>

        {group.requestedUser.length > 0 && (
          <div className="my-4 space-y-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Join Requests
            </h3>

            {group.requestedUser.map((user: IRequestedUser) => {
              if (!user?.userId || !group._id) return null
              return (
                <div
                  key={user.userId.toString()}
                  className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-3 transition hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-900"
                >
                  {/* Left: User Info */}
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                      {(user.username?.charAt(0) || '?').toUpperCase()}
                    </div>

                    {/* Name */}
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-200">
                        {user.username}
                      </p>
                    </div>
                  </div>

                  {/* Right: Action */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        View Request
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-[420px] rounded-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-lg">{user.username}</DialogTitle>
                        <DialogDescription className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                          {user.msg || 'No message provided.'}
                        </DialogDescription>
                      </DialogHeader>

                      <DialogFooter className="mt-4 flex gap-2">
                        <DialogClose asChild>
                          <Button variant="outline" className="flex-1">
                            Cancel
                          </Button>
                        </DialogClose>

                        {/* Accept */}
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

                        {/* Reject */}
                        <Button
                          variant={'destructive'}
                          disabled={requestMutation.isPending}
                          onClick={() =>
                            requestMutation.mutate({
                              groupId: group._id.toString(),
                              requestedUserId: user.userId.toString(),
                              isAccept: false,
                            })
                          }
                        >
                          {requestMutation.isPending ? 'Rejecting' : 'Reject'}
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
  )
}

export default GroupPage
