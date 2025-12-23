import { TaskPriority, TaskStatus } from '@/lib/constraints/task'
import axios from 'axios'

export const fetchAllGroupTasks = async (groupId: string) => {
  const res = await axios.get(`/api/member/task/getTasksByGroupId?groupId=${groupId}`)

  console.log('res: - ', res.data.data)
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

export const updateTask = async (_id: string, field: string, value: string) => {

  try {
    const response = await axios.patch(`/api/member/task/updateTask?taskId=${_id}`, {
      operation: `${field.toUpperCase()}`,
      payload: { [field]: value }
    });

    return response.data

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios Error:", error.response?.data || error.message);
    } else {
      console.error("Unexpected Error:", error);
    }
  }
}