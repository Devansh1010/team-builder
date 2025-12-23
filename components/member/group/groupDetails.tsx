'use client'

import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

//tanstack Quert
import { useQuery } from '@tanstack/react-query'
import { fetchActiveGroups } from '@/lib/api/group.api'
import CreateGroup from '@/components/member/group/dashboard/_components/CreateGroup'

import Link from 'next/link'
import GroupHeader from './dashboard/_components/GroupHeader'
import GroupTabs from './dashboard/GroupTabs'

const GroupPage = () => {
  
  const { data: activeGroup = [], isLoading } = useQuery({
    queryKey: ['activeGroups'],
    queryFn: fetchActiveGroups,

    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
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
            <Link href={'/member/dashboard/join'}>
              <Button variant="outline">Join Group</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const group = activeGroup[0]

  return (
    <div className="mx-auto my-6 max-w-340">
      {/* Main Card */}
      <div className="flex-1 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-8 py-6 shadow-sm min-h-155">
        {/* Header */}
        <GroupHeader group={group} />

        {/* Soft Divider */}
        <div className="my-4 h-px bg-linear-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />

        {/* Content */}
        <div className="flex flex-col gap-6">
          <GroupTabs group={group} />
        </div>
      </div>
    </div>
  )
}

export default GroupPage
