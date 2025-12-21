import { z } from 'zod'
import { TaskPriority, TaskStatus } from '@/lib/constraints/task'

export const createTaskSchema = z.object({
  title: z.string().trim().min(2, 'Title must be at least 2 characters'),

  description: z.string().trim().optional(),

  status: z.nativeEnum(TaskStatus).optional(),

  priority: z.nativeEnum(TaskPriority).optional(),

  assignedTo: z
    .array(
      z.object({
        userId: z.string(),
        username: z.string().min(1, 'Username required'),
      })
    )
    .optional(),

  dueDate: z.string().datetime().optional(),
})

export const createTaskFormSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),

  status: z.nativeEnum(TaskStatus),
  priority: z.nativeEnum(TaskPriority),

  assignedTo: z.array(z.string()).optional(), // usernames only

  dueDate: z.date().optional(),
  groupId: z.string(),
})
