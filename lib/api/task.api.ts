import { TaskPriority, TaskStatus } from '@/lib/constraints/task'
import axios from 'axios'

export const fetchAllGroupTasks = async (groupId: string) => {
  const res = await axios.get(`/api/member/task/getTasksByGroupId?groupId=${groupId}`)

  return res.data
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
