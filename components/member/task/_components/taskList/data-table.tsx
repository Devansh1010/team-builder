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
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    getRowId: (row: any) => row._id, 
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
    meta,
  })

  const handleBulkDelete = () => {
    console.log(rowSelection)
    const selectedIds = Object.keys(rowSelection);
    console.log("Initiating Bulk Delete for IDs:", selectedIds);
    // mutation.mutate(selectedIds);
  }

  const selectedCount = Object.keys(rowSelection).length;

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500">

      {/* TOOLBAR AREA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-4 w-full">
          <Input
            placeholder="FILTER BY TITLE..."
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("title")?.setFilterValue(event.target.value)
            }
            className="h-10 max-w-sm font-bold text-[10px] uppercase tracking-widest border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus-visible:ring-slate-900 rounded-lg"
          />

          {/* BULK ACTIONS - Only shows when selection exists */}
          {selectedCount > 0 && (
            <div className="flex items-center gap-2 animate-in slide-in-from-left-2 duration-300">
              <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-2" />
              <Button
                onClick={handleBulkDelete}
                variant="destructive"
                className="h-9 px-4 text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-red-500/10"
              >
                Delete {selectedCount} Task{selectedCount > 1 ? 's' : ''}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setRowSelection({})}
                className="text-[10px] font-bold uppercase text-slate-500 hover:text-slate-900"
              >
                Clear
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <CreateTask group={(table.options.meta as any)?.group} />
          <DataTableViewOptions table={table} />
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50/50 dark:bg-white/2">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent border-b border-slate-200 dark:border-slate-800">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="h-12 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
                  // ADDING HIGHLIGHT ON SELECTED ROW
                  className={`
                    border-b border-slate-100 dark:border-slate-900 last:border-0 transition-colors
                    ${row.getIsSelected() ? 'bg-slate-50 dark:bg-white/3' : 'hover:bg-slate-50/30 dark:hover:bg-white/1'}
                  `}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4 px-4">
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-60 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="h-12 w-12 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-xl">🔍</div>
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-widest">No matching results</p>
                    <p className="text-[10px] text-slate-500 max-w-[200px]">Refine your search parameters or create a new task entry.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* FOOTER / PAGINATION */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {table.getFilteredRowModel().rows.length} Records Found
          </p>
          {selectedCount > 0 && (
            <p className="text-[10px] font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
              {selectedCount} Selected
            </p>
          )}
        </div>
        <DataTablePagination table={table} />
      </div>
    </div>
  )
}
