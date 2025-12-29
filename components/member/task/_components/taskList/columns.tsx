'use client'

import { TaskPriority, TaskStatus } from '@/lib/constraints/task'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from './data-table-column-header'
import { Button } from '@/components/ui/button'
import { ArrowUpDown, Check, UserPlus } from 'lucide-react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from '@/components/ui/checkbox';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useQuery } from '@tanstack/react-query'
import { fetchCurrentActiveUser } from '@/lib/api/user.api'

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

  //checkbox
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-2px border-slate-300 dark:border-slate-700"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-2px border-slate-300 dark:border-slate-700"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  //my-tasks
  {
    id: "my-task",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="For Me" />
    ),
    cell: ({ row, table }) => {
      // 1. Get the ID from the table meta
      const activeUserId = (table.options.meta as any)?.activeUserId;
      console.log(activeUserId)

      const isAssignedToMe = (row.original as any).assignedTo?.some(
        (a: any) => a.userId?.toString() === activeUserId?.toString()
      );

      if (!isAssignedToMe) return null;

      return (
        <div className="flex items-center justify-center">
          <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[9px] font-black uppercase tracking-tighter">
            <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
            My Task
          </span>
        </div>
      );
    },
  },

  // title
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

  // status
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row, table }) => {
      const status = row.getValue("status") as string;
      const meta = table.options.meta as any;

      const statusStyles: Record<string, string> = {
        todo: "bg-slate-500/10 text-slate-500 border-slate-500/20",
        in_progress: "bg-amber-500/10 text-amber-500 border-amber-500/20",
        done: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      };

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
          <SelectTrigger
            className={`h-7 w-[130px] px-3 text-[11px] font-bold uppercase tracking-wider rounded-full border ${statusStyles[status] || statusStyles.todo} transition-all hover:opacity-80`}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#161616] border-white/10 text-white">
            <SelectItem value="todo" className="focus:bg-slate-500/20 focus:text-slate-400">Todo</SelectItem>
            <SelectItem value="in_progress" className="focus:bg-amber-500/20 focus:text-amber-400">In Progress</SelectItem>
            <SelectItem value="done" className="focus:bg-emerald-500/20 focus:text-emerald-400">Done</SelectItem>
          </SelectContent>
        </Select>
      );
    },
  },

  // priority
  {
    accessorKey: 'priority',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row, table }) => {
      const priority = row.getValue("priority") as string
      const meta = table.options.meta as any;

      // Color mapping for Priority Levels
      const priorityStyles: Record<string, string> = {
        low: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
        high: "bg-rose-500/10 text-rose-500 border-rose-500/20",
      };

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
          <SelectTrigger
            className={`h-7 w-[100px] px-3 text-[10px] font-bold uppercase tracking-widest rounded-full border ${priorityStyles[priority] || priorityStyles.low} transition-all hover:brightness-110`}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#161616] border-white/10 text-white">
            <SelectItem value="low" className="focus:bg-blue-500/20 focus:text-blue-400">Low</SelectItem>
            <SelectItem value="medium" className="focus:bg-yellow-500/20 focus:text-yellow-400">Medium</SelectItem>
            <SelectItem value="high" className="focus:bg-rose-500/20 focus:text-rose-400">High</SelectItem>
          </SelectContent>
        </Select>
      )
    },
  },

  // AssignedTO
  {
    accessorKey: 'assignedTo',
    header: 'Assigned To',
    cell: ({ row, table }) => {
      const assignments = row.original.assignedTo || [];
      const meta = table.options.meta as any;

      // 1. Check if the current user is a leader
      const isLeader = meta?.isLeader;

      // 2. If NOT a leader, show a simple read-only badge instead of the Popover
      if (!isLeader) {
        return (
          <div className="flex items-center gap-1">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 bg-slate-100 dark:bg-slate-800/50 px-2 py-1 rounded">
              {assignments.length > 0 ? `${assignments.length} Assigned` : "No Assignees"}
            </span>
          </div>
        );
      }

      // 3. If IS a leader, show the full Popover/Command logic (Your existing code)
      const groupMembers = meta?.group?.accessTo || [];
      const toggleMember = (userId: string) => {
        const isAssigned = assignments.some((a: any) => a.userId?.toString() === userId?.toString());
        const operation = isAssigned ? 'REMOVE_ASSIGNEE' : 'ADD_ASSIGNEE';
        meta?.updateTask({
          id: row.original._id,
          operation,
          value: { assignee: userId }
        });
      };

      return (
        <div className="flex items-center gap-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 border-dashed border-slate-700 bg-transparent hover:bg-slate-800">
                <UserPlus className="mr-2 h-3 w-3" />
                <span className="text-[11px] uppercase tracking-wider font-bold">
                  {assignments.length > 0 ? `${assignments.length} Assigned` : "Assign"}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[220px] p-0 bg-[#161616] border-white/10" align="start">
              <Command className="bg-transparent">
                <CommandInput placeholder="Search members..." className="text-white" />
                <CommandList className="text-slate-300">
                  <CommandEmpty>No member found.</CommandEmpty>
                  <CommandGroup>
                    {groupMembers.map((member: any) => {

                      const isSelected = assignments.some((a: any) => {

                        // console.log(`Comparing ${a._id} to ${member.userId}`);
                        return a.userId?.toString() === member.userId?.toString();
                      });

                      return (
                        <CommandItem
                          key={member.userId}
                          onSelect={() => toggleMember(member.userId)}
                          className="flex items-center gap-2 px-2 py-1.5 cursor-pointer focus:bg-white/5"
                        >
                          <div className={`flex h-4 w-4 items-center justify-center rounded border border-slate-500 ${isSelected ? "bg-emerald-500 border-emerald-500" : "opacity-50"}`}>
                            {isSelected && <Check className="h-3 w-3 text-white" />}
                          </div>
                          <span className="text-xs">{member.username.toUpperCase() || "Member"}</span>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      );
    },
  },

  // due date
  {
    accessorKey: 'dueDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Due Date" />
    ),
    cell: ({ row }) => {
      const dateValue = row.getValue("dueDate") as string;
      if (!dateValue) return <span className="text-muted-foreground">-</span>;

      const dueDate = new Date(dateValue);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Calculate difference in days
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Styling Logic
      let style = "text-gray-500 dark:text-gray-400"; // Default
      let label = "";

      if (diffDays < 0) {
        style = "text-rose-500 font-bold animate-pulse"; // Overdue
        label = "Overdue";
      } else if (diffDays === 0) {
        style = "text-rose-500 font-bold"; // Today
        label = "Today";
      } else if (diffDays <= 3) {
        style = "text-amber-500 font-semibold"; // Due soon (3 days)
        label = "Soon";
      }

      const formattedDate = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
      }).format(dueDate);

      return (
        <div className="flex flex-col items-start gap-0.5">
          <span className={`text-sm ${style}`}>
            {formattedDate}
          </span>
          {label && (
            <span className={`text-[9px] uppercase tracking-tighter ${style}`}>
              {label}
            </span>
          )}
        </div>
      );
    },
  },

  // created at
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;

      if (!date) return <span className="text-muted-foreground">-</span>;

      // Formatting to "Dec 23, 2025"
      const formattedDate = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(date));

      return (
        <div className="flex flex-col">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
            {formattedDate}
          </span>
        </div>
      );
    },
  },
]
