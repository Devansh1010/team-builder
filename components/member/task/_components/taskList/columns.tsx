'use client'

import axios from 'axios';

import { TaskPriority, TaskStatus } from '@/lib/constraints/task'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from './data-table-column-header'
import { Button } from '@/components/ui/button'
import { ArrowUpDown } from 'lucide-react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTask } from '@/lib/api/task.api';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Task = {
  _id: string
  title: string
  status: TaskStatus
  priority: TaskPriority
  assignedTo?: string[]
  createdBy: string
  dueDate?: Date
  createdAt?: Date
}

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'status',
    header: "Status",
    cell: ({ row, table }) => {
      const status = row.getValue("status") as string;
      const meta = table.options.meta as any;

      return (
        <Select
          defaultValue={status}
          onValueChange={(value) => {
            meta?.updateTask({
              id: row.original._id,
              operation: 'UPDATE_STATUS',
              value: { status: value }
            });
          }}
        >
          <SelectTrigger className="w-[110px] h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todo">Todo</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>
      );
    },
  },
  {
    accessorKey: 'priority',
    header: "Priority",
    cell: ({ row, table }) => {
      const priority = row.getValue("priority") as string
      const meta = table.options.meta as any;
      return (
        <Select
          defaultValue={priority}
          onValueChange={(value) => {
            meta?.updateTask({
              id: row.original._id,
              operation: 'UPDATE_PRIORITY',
              value: { priority: value }
            });
          }}
        >
          <SelectTrigger className="w-[110px] h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      )
    },
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
