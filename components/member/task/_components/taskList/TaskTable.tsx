import { columns, Payment } from './columns'
import { DataTable } from './data-table'
import { useQuery } from '@tanstack/react-query'
import { fetchAllGroupTasks } from '@/lib/api/task.api'
import { IGroup } from '@/models/user_models/group.model'

export default function TaskList({ group }: { group: IGroup }) {
  if (!group._id) return
  const { data: groupTasks = [], isLoading } = useQuery({
    queryKey: ['groupTasks'],
    queryFn: () => {
      if (!group._id) return
      fetchAllGroupTasks(group._id.toString())
    },

    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  })

  console.log(groupTasks)

  return (
    <div className="container mx-auto py-10">
      {groupTasks.length > 0 ? (
        <DataTable columns={columns} data={groupTasks} />
      ) : (
        <div>No Task Today</div>
      )}
    </div>
  )
}
