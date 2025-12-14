'use client'

import { useEffect, useState } from 'react'
import { useGroupStore } from '@/store/group.store'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { Calendar } from "@/components/ui/calendar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

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
    <div className="mx-auto my-6 max-w-7xl flex gap-6">

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
      <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 shadow-sm">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-lg"
        />
      </div>

    </div>

  )
}

export default GroupPage
