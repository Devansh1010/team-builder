'use client'
import * as React from "react"
import {
  ColumnDef,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { Input } from "@/components/ui/input"

import { Button } from "@/components/ui/button"
import { DataTablePagination } from './data-table-page-size'
import { DataTableViewOptions } from './data-table-column-toggle'
import CreateTask from "../CreateTask"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  meta: any
}

export function DataTable<TData, TValue>({ columns, data, meta }: DataTableProps<TData, TValue>) {

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )

  const table = useReactTable({
    data,
    columns,
    meta,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500">
      {/* Toolbar: High-Contrast Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-[300px]">
          <Input
            placeholder="SEARCH TASKS..."
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("title")?.setFilterValue(event.target.value)
            }
            className="h-10 pl-4 font-bold text-xs uppercase tracking-widest border-slate-200 bg-white dark:bg-transparent dark:border-slate-800 focus-visible:ring-slate-900 rounded-lg transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <CreateTask group={(table.options.meta as any)?.group} />
          <DataTableViewOptions table={table} />
        </div>
      </div>

      {/* Table Container: Sharp & Minimal */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-black/20 overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50/50 dark:bg-white/2 border-b border-slate-200 dark:border-slate-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="h-12 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-b border-slate-100 dark:border-slate-900 last:border-0 hover:bg-slate-50/50 dark:hover:bg-white/2 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4 px-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-40 text-center"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <span className="text-2xl">🔍</span>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-tighter">No tasks found</p>
                    <p className="text-xs text-slate-500">Try adjusting your filters or search query.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Section */}
      <div className="flex items-center justify-between px-2">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {table.getFilteredRowModel().rows.length} Total Tasks
        </p>
        <DataTablePagination table={table} />
      </div>
    </div>
  )
}
