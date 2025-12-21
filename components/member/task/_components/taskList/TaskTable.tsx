import { columns } from './columns'
import { DataTable } from './data-table'
import { useQuery } from '@tanstack/react-query'
import { fetchAllGroupTasks } from '@/lib/api/task.api'
import { IGroup } from '@/models/user_models/group.model'
import { Loader2 } from 'lucide-react'

export default function TaskList({ group }: { group: IGroup }) {
  if (!group._id) return null

  const {
    data: groupTasks = [],
    isLoading,
  } = useQuery({
    queryKey: ['groupTasks', group._id],
    queryFn: () => fetchAllGroupTasks(group._id!.toString()),
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  })

 
  if (isLoading) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">
          Loading tasks...
        </span>
      </div>
    )
  }

  if (groupTasks.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-muted-foreground">
        No tasks today
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={groupTasks} />
    </div>
  )
}
