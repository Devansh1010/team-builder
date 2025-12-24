import { IGroup } from '@/models/user_models/group.model'
import { Button } from '@/components/ui/button'


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


import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { useQuery } from '@tanstack/react-query'
import { fetchActiveGroups } from '@/lib/api/group.api'
import RequestedUsers from './_components/RequestedUsers'
import InvitedUsers from './_components/InvitedUsers'
import Members from './_components/Members'
import GroupHeader from '../_components/GroupHeader'
import GroupLog from './_components/GroupLog'
import LeaveGroup from './_components/LeaveGroup'

const TabOverview = ({ group }: { group: IGroup }) => {
  const { data: groupOverview, isLoading } = useQuery({
    queryKey: ['activeGroups'],
    queryFn: fetchActiveGroups,

    select: (groups) => ({
      id: groups[0]?._id,
      requestedUsers: groups[0]?.requestedUser || [],
      invitedUsers: groups[0]?.invitedUsers || [],
      members: groups[0]?.members || [],
    }),

    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  })

  const groupId = groupOverview?.id
  if (!groupId) return

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 animate-in fade-in duration-500">
      {/* Header Section: Clean & Structured */}
      <div className="mb-10 border-b border-slate-200 dark:border-slate-800 pb-8">
        <GroupHeader group={group} />

        <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">
              Management
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-1 font-medium">
              Control access, invitations, and audit group activity.
            </p>
          </div>
          <LeaveGroup />
        </div>
      </div>

      {/* Content Section: Structured Tabs */}
      <Tabs defaultValue="requests" className="space-y-8">
        <TabsList className="flex h-auto w-full justify-start rounded-none border-b border-slate-200 dark:border-slate-800 bg-transparent p-1 gap-8">
          <TabsTrigger
            value="requests"
           className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-[#161616] dark:data-[state=active]:text-white transition-all"
          >
            Requests
          </TabsTrigger>
          <TabsTrigger
            value="invited"
            className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-[#161616] dark:data-[state=active]:text-white transition-all"
          >
            Invited
          </TabsTrigger>
          <TabsTrigger
            value="members"
           className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-[#161616] dark:data-[state=active]:text-white transition-all"
          >
            Members
          </TabsTrigger>
          <TabsTrigger
            value="logs"
            className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-[#161616] dark:data-[state=active]:text-white transition-all"
          >
            Activity Logs
          </TabsTrigger>
        </TabsList>

        {/* Content Area */}
        <div className="min-h-[300px]">
          <TabsContent value="requests" className="mt-0 outline-none">
            <RequestedUsers />
          </TabsContent>
          <TabsContent value="invited" className="mt-0 outline-none">
            <InvitedUsers />
          </TabsContent>
          <TabsContent value="members" className="mt-0 outline-none">
            <Members />
          </TabsContent>
          <TabsContent value="logs" className="mt-0 outline-none">
            <GroupLog group={group} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

export default TabOverview
