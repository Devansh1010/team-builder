import { TaskPriority, TaskStatus } from '@/lib/constraints/task'
import axios from 'axios'

export const fetchAllGroupTasks = async (groupId: string) => {
  const res = await axios.get(`/api/member/task/getTasksByGroupId?groupId=${groupId}`)
  return res.data.data
}

export const createTask = async ({
  title,
  description,
  status,
  priority,
  assignedTo,
  dueDate,
  groupId,
}: {
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  assignedTo?: string[]
  dueDate?: Date
  groupId: string
}) => {
  const res = await axios.post(`/api/member/task/createTask?groupId=${groupId}`, {
    title,
    description,
    status,
    priority,
    assignedTo,
    dueDate,
  })

  return res.data
}

export const updateTask = async (_id: string, operation: string, value: any) => {
  try {
    const response = await axios.patch(`/api/member/task/updateTask?taskId=${_id}`, {
      operation: operation, // The operation string (e.g., 'ADD_ASSIGNEE')
      payload: value        // The object (e.g., { ADD_ASSIGNEE: { assignee: id } })
    });

    return response.data;
  } catch (error) {
    // Re-throw the error so useMutation can see it
    if (axios.isAxiosError(error) && error.response) {
      // Throw the actual data from the backend (which contains your success: false, message: "...")
      throw error.response.data;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const fetchGroupTask = async (taskId: string, groupId: string) => {
  const res = await axios.get(`/api/member/task/getTaskByTaskId?taskId=${taskId}&groupId=${groupId}`)
  return res.data.data
}