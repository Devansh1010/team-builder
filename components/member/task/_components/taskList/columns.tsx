'use client'

import { TaskPriority, TaskStatus } from '@/lib/constraints/task'
import { ColumnDef } from '@tanstack/react-table'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  title: string
  status: TaskStatus
  priority: TaskPriority
  assignedTo?: string[]
  createdBy: string
  dueDate?: Date
  createdAt?: Date
}

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'priority',
    header: 'Priority',
  },
  {
    accessorKey: 'assignedTo',
    header: 'AssignedTo',
  },
  {
    accessorKey: 'dueDate',
    header: 'DueDate',
  },
  {
    accessorKey: 'createdAt',
    header: 'CreatedAt',
  },
]
