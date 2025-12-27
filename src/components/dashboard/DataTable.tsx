"use client";

import { useTranslations } from "next-intl";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { useState, useMemo } from "react";
import { ArrowUpDown } from "lucide-react";

type PageData = {
  page: string;
  views: number;
  uniqueVisitors: number;
  avgTime: string;
};

const data: PageData[] = [
  { page: "/docs/getting-started", views: 12453, uniqueVisitors: 8234, avgTime: "3m 45s" },
  { page: "/docs/installation", views: 9876, uniqueVisitors: 6543, avgTime: "2m 30s" },
  { page: "/docs/configuration", views: 8234, uniqueVisitors: 5432, avgTime: "4m 12s" },
  { page: "/docs/components", views: 7654, uniqueVisitors: 4321, avgTime: "5m 08s" },
  { page: "/docs/api-reference", views: 6543, uniqueVisitors: 3210, avgTime: "6m 22s" },
  { page: "/dashboard", views: 5432, uniqueVisitors: 2109, avgTime: "2m 15s" },
  { page: "/", views: 4321, uniqueVisitors: 1098, avgTime: "1m 45s" },
];

export function DataTable() {
  const t = useTranslations("dashboard.table");
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<PageData>[]>(
    () => [
      {
        accessorKey: "page",
        header: () => t("page"),
        cell: ({ row }) => (
          <span className="font-mono text-[var(--neon-cyan)]">
            {row.getValue("page")}
          </span>
        ),
      },
      {
        accessorKey: "views",
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 hover:text-[var(--foreground)] transition-colors"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("views")}
            <ArrowUpDown className="w-4 h-4" />
          </button>
        ),
        cell: ({ row }) => (
          <span className="font-medium">
            {(row.getValue("views") as number).toLocaleString()}
          </span>
        ),
      },
      {
        accessorKey: "uniqueVisitors",
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 hover:text-[var(--foreground)] transition-colors"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("uniqueVisitors")}
            <ArrowUpDown className="w-4 h-4" />
          </button>
        ),
        cell: ({ row }) => (
          <span>
            {(row.getValue("uniqueVisitors") as number).toLocaleString()}
          </span>
        ),
      },
      {
        accessorKey: "avgTime",
        header: () => t("avgTime"),
        cell: ({ row }) => (
          <span className="text-[var(--muted-foreground)]">
            {row.getValue("avgTime")}
          </span>
        ),
      },
    ],
    [t]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
  });

  return (
    <div className="data-table overflow-x-auto">
      <table className="w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3 text-left border-b border-[var(--glass-border)]"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-[var(--glass-border)] transition-colors"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
