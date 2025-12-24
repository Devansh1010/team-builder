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
    <div>
      {/* Header */}
      <GroupHeader group={group} />
      {/* Soft Divider */}
      <div className="my-4 h-px bg-linear-to-r from-transparent via-gray-300 dark:via-gray-300 to-transparent" />

      <div className="mb-4 flex items-start justify-between gap-4 py-2">
        {/* Left: Title */}
        <div>

          <p className="text-sm text-muted-foreground">
            Manage group details and incoming join requests
          </p>
        </div>
        {/* Right: Leave Group */}
        <LeaveGroup />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-6">
        <Tabs defaultValue="requests" className="w-full">
          {/* Tab Headers */}
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="requests">Requests</TabsTrigger>
            <TabsTrigger value="invited">Invited Members</TabsTrigger>
            <TabsTrigger value="members">Group Members</TabsTrigger>
            <TabsTrigger value="logs">Group Logs</TabsTrigger>
          </TabsList>


          {/* Tab 1 */}
          <TabsContent value="requests" className="mt-6">
            <RequestedUsers />
          </TabsContent>

          {/* Tab 2 */}
          <TabsContent value="invited" className="mt-6">
            <InvitedUsers />
          </TabsContent>

          {/* Tab 3 */}
          <TabsContent value="members" className="mt-6">
            <Members />
          </TabsContent>

          <TabsContent value="logs" className="mt-6">
            <GroupLog group={group} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default TabOverview
