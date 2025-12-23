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

  console.log(table.options.meta)

  return (
    <div className="w-full space-y-4">
      {/* Toolbar: Search and View Options */}
      <div className="flex items-center justify-between gap-4 py-4">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Search Tasks..."
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("title")?.setFilterValue(event.target.value)
            }
            className="h-9 w-[150px] lg:w-[250px] transition-colors bg-white border-gray-200 dark:bg-[#161616] dark:border-white/10 focus-visible:ring-sky-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <CreateTask group={(table.options.meta as any)?.group} />
          <DataTableViewOptions table={table} />
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden dark:border-white/5 dark:bg-[#111111] shadow-sm dark:shadow-none transition-colors">
        <Table>
          <TableHeader className="bg-gray-50/50 dark:bg-white/2">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent border-gray-200 dark:border-white/5">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="font-bold text-slate-900 dark:text-gray-100 uppercase text-[11px] tracking-wider">
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
                  data-state={row.getIsSelected() && "selected"}
                  className="border-gray-100 dark:border-white/5 hover:bg-gray-50/50 dark:hover:bg-white/2 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4 text-sm text-slate-600 dark:text-gray-300">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-slate-500 dark:text-gray-400"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Section */}
      <div className="flex items-center justify-end py-2">
        <DataTablePagination table={table} />
      </div>
    </div>
  )
}
