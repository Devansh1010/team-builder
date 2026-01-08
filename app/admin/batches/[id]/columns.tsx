'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge' // Assuming you have a Badge component
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, UserCheck, Clock } from 'lucide-react'

export type User = {
  id: string
  email: string
  status: 'pending' | 'approved'
  username?: string
}

export const columns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px] border-slate-300 dark:border-zinc-700"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px] border-slate-300 dark:border-zinc-700"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const username = row.getValue('username') as string
      const isApproved = !!username && username.trim() !== ""

      return (
        <div className="flex items-center">
          {isApproved ? (
            <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-1.5 font-bold tracking-tight">
              <UserCheck size={12} />
              Approved
            </Badge>
          ) : (
            <Badge className="bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-100 dark:border-amber-500/20 px-3 py-1 rounded-full flex items-center gap-1.5 font-bold tracking-tight">
              <Clock size={12} />
              Pending
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'username',
    header: 'Username',
    cell: ({ row }) => {
      const username = row.getValue('username') as string
      return (
        <div className="font-medium text-slate-900 dark:text-zinc-100">
          {username || <span className="text-slate-400 dark:text-zinc-600 italic text-xs">Not set yet</span>}
        </div>
      )
    }
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 -ml-4 font-bold"
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase font-medium text-slate-600 dark:text-zinc-400">{row.getValue('email')}</div>,
  },
]