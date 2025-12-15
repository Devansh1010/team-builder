'use client'

import { useEffect, useState } from 'react'
import { useGroupStore } from '@/store/group.store'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { Calendar } from "@/components/ui/calendar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import axios from 'axios'
import { Loader2 } from 'lucide-react'

const GroupPage = () => {
  const {
    activeGroup,
    isGettingActiveGroup,
    message,
    setActiveGroup,
  } = useGroupStore()

  useEffect(() => {
    setActiveGroup()
  }, [setActiveGroup])

  useEffect(() => {
    if (message) toast.info(message)
  }, [message])

  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isRequestSending, setIsRequestSending] = useState<boolean>(false)
  const [activeAction, setActiveAction] = useState<"accept" | "reject" | null>(null)

  const onAccept = (groupId: string , requestedUserId: string) => {
    if (!groupId || !requestedUserId || isRequestSending) return
    setActiveAction("accept")
    setIsRequestSending(true)
    handleRequest(groupId.toString(), requestedUserId.toString(), true)
  }

  const onReject = (groupId: string, requestedUserId: string) => {
    if (!groupId || !requestedUserId || isRequestSending) return
    setActiveAction("reject")
    setIsRequestSending(true)
    handleRequest(groupId.toString(), requestedUserId.toString(), false)
  }


  const handleRequest = async (groupId: string, requestedUserId: string, isAccept: boolean) => {
    try {
      setIsRequestSending(true)

      const res = await axios.post(
        `/api/member/group/accept-reject-request?groupId=${groupId}&requestedUser=${requestedUserId}&isAccept=${isAccept}`
      )
    } catch {
      toast.error('Error while withdrawing request')
    } finally {
      setIsRequestSending(false)
      setActiveAction(null)
    }
  }

  if (!activeGroup.length) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        You are not part of any group yet.
      </div>
    )
  }

  const group = activeGroup[0]
  const role = group.accessTo?.[0]?.userRole

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
            {group.accessTo?.map((user) => (
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
            {group.techStack?.map((tech) => (
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
      <div className='flex- flex-col'>
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

            {group.requestedUser.map((user) => {
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
                      {(user.username?.charAt(0) || "?").toUpperCase()}
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
                        <DialogTitle className="text-lg">
                          {user.username}
                        </DialogTitle>
                        <DialogDescription className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                          {user.msg || "No message provided."}
                        </DialogDescription>
                      </DialogHeader>

                      <DialogFooter className="mt-4 flex gap-2">
                        <DialogClose asChild>
                          <Button variant="outline" className="flex-1">
                            Cancel
                          </Button>
                        </DialogClose>


                        <Button
                          className="flex-1"
                          disabled={isRequestSending}
                          onClick={() => onAccept(group._id!.toString(), user.userId.toString())}
                        >
                          {isRequestSending && activeAction === "accept" ? (
                            <span className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Accepting...
                            </span>
                          ) : (
                            "Accept"
                          )}
                        </Button>

                        <Button
                          variant="destructive"
                          className="flex-1"
                          disabled={isRequestSending}
                          onClick={() => onReject(group._id!.toString(), user.userId.toString())}
                        >
                          {isRequestSending && activeAction === "reject" ? (
                            <span className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Rejecting...
                            </span>
                          ) : (
                            "Reject"
                          )}
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
