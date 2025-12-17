import { z } from 'zod'
import { TaskPriority, TaskStatus } from '@/models/user_models/task.model'

export const createTaskSchema = z.object({
  title: z.string().trim().min(2, 'Title must be at least 2 characters'),

  description: z.string().trim().optional(),

  status: z.nativeEnum(TaskStatus).optional(),

  priority: z.nativeEnum(TaskPriority).optional(),

  assignedTo: z
    .array(
      z.object({
        userId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid userId'),
        username: z.string().min(1, 'Username required'),
      })
    )
    .optional(),

  dueDate: z.string().datetime().optional(),
})
