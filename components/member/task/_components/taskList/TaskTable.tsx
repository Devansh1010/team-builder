import { columns } from './columns'
import { DataTable } from './data-table'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchAllGroupTasks, updateTask } from '@/lib/api/task.api'
import { IGroup } from '@/models/user_models/group.model'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import CreateTask from '../CreateTask'

export default function TaskList({ group }: { group: IGroup }) {
  if (!group._id!.toString()) return null

  const {
    data: groupTasks = [],
    isLoading,
    isFetching, // This is true during the background re-fetch
  } = useQuery({
    queryKey: ['groupTasks', group._id],
    queryFn: () => fetchAllGroupTasks(group._id!.toString()),
    // Use to keep the UI stable during invalidations
    placeholderData: (previousData) => previousData,
    gcTime: 1000 * 60 * 30,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })


  const queryClient = useQueryClient();

  const { mutate: updateTaskMutation } = useMutation({
    mutationFn: ({ id, operation, value }: { id: string; operation: string; value: any }) =>
    updateTask(id, operation, value),

    onSuccess: () => {
      toast.success(`Task updated successfully`);
      queryClient.invalidateQueries({ queryKey: ['groupTasks', group._id!.toString()] });
    },

    onError: (error: any) => {

      const errorMessage = error.response?.data?.message || error.message || "Failed to Update task";

      toast.error(errorMessage);

    },
  });

  if (isLoading && groupTasks.length === 0) {
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
      <div className="flex h-[400px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted bg-muted/10 p-8 text-center animate-in fade-in zoom-in duration-300">

        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/20 mb-4">
          <span className="text-2xl">📋</span>
        </div>

        <h3 className="text-lg font-semibold tracking-tight text-foreground">
          No tasks for today
        </h3>

        <p className="mb-6 mt-1 max-w-[250px] text-sm text-muted-foreground leading-relaxed">
          Your task list is empty. Start your day by creating a new objective for the group.
        </p>

        <CreateTask group={group} />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable
        columns={columns}
        data={groupTasks}
        meta={{
          groupId: group._id,
          updateTask: updateTaskMutation,
          group: group
        }}
      />
    </div>
  )
}
