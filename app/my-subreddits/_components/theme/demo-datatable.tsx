"use client";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { DataTableFilterList } from "@/components/data-table/data-table-filter-list";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDataTable } from "@/hooks/use-data-table";

import type { Column, ColumnDef } from "@tanstack/react-table";
import {
  CheckCircle,
  CheckCircle2,
  DollarSign,
  MoreHorizontal,
  Text,
  XCircle,
  Calendar,
} from "lucide-react";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import * as React from "react";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";

interface Project {
  id: string;
  title: string;
  status: "active" | "inactive";
  budget: number;

  // Additional metadata
  createdAt: string; // ISO date string (e.g. "2024-06-01")
  owner: string; // Name of the person responsible
  priority?: "low" | "medium" | "high"; // Optional priority field
  description?: string; // Optional short description
  position?: number; // For drag-and-drop ordering
}

const data: Project[] = [
  {
    id: "1",
    title: "Project Alpha",
    status: "active",
    budget: 50000,
    createdAt: "2024-01-15",
    owner: "Alice",
  },
  {
    id: "2",
    title: "Project Beta",
    status: "inactive",
    budget: 75000,
    createdAt: "2024-02-10",
    owner: "Bob",
  },
  {
    id: "3",
    title: "Project Gamma",
    status: "active",
    budget: 25000,
    createdAt: "2024-03-22",
    owner: "Charlie",
  },
  {
    id: "4",
    title: "Project Delta",
    status: "active",
    budget: 100000,
    createdAt: "2024-04-05",
    owner: "Diana",
  },
];

export function DataTableDemo() {
  const [title] = useQueryState("title", parseAsString.withDefault(""));
  const [status] = useQueryState(
    "status",
    parseAsArrayOf(parseAsString).withDefault([])
  );

  // Ideally we would filter the data server-side, but for the sake of this example, we'll filter the data client-side
  const filteredData = React.useMemo(() => {
    return data.filter((project) => {
      const matchesTitle =
        title === "" ||
        project.title.toLowerCase().includes(title.toLowerCase());
      const matchesStatus =
        status.length === 0 || status.includes(project.status);

      return matchesTitle && matchesStatus;
    });
  }, [title, status]);

  const columns = React.useMemo<ColumnDef<Project>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        size: 32,
        enableSorting: true,
        enableHiding: false,
      },
      {
        id: "title",
        accessorKey: "title",
        header: ({ column }: { column: Column<Project, unknown> }) => (
          <DataTableColumnHeader column={column} title="Title" />
        ),
        cell: ({ cell }) => <div>{cell.getValue<Project["title"]>()}</div>,
        meta: {
          label: "Title",
          placeholder: "Search titles...",
          variant: "text",
          icon: Text,
        },
        enableColumnFilter: true,
      },
      {
        id: "status",
        accessorKey: "status",
        header: ({ column }: { column: Column<Project, unknown> }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ cell }) => {
          const status = cell.getValue<Project["status"]>();
          const Icon = status === "active" ? CheckCircle2 : XCircle;

          return (
            <Badge variant="outline" className="capitalize">
              <Icon />
              {status}
            </Badge>
          );
        },
        meta: {
          label: "Status",
          variant: "multiSelect",
          options: [
            { label: "Active", value: "active", icon: CheckCircle },
            { label: "Inactive", value: "inactive", icon: XCircle },
          ],
        },
        enableColumnFilter: true,
      },
      {
        id: "budget",
        accessorKey: "budget",
        header: ({ column }: { column: Column<Project, unknown> }) => (
          <DataTableColumnHeader column={column} title="Budget" />
        ),
        cell: ({ cell }) => {
          const budget = cell.getValue<Project["budget"]>();

          return (
            <div className="flex items-center gap-1">
              <DollarSign className="size-4" />
              {budget.toLocaleString()}
            </div>
          );
        },
        enableSorting: true,
      },
      {
        id: "createdAt",
        accessorKey: "createdAt",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Created At" />
        ),
        cell: ({ cell }) => {
          const value = cell.getValue<Project["createdAt"]>();
          return <div>{new Date(value).toLocaleDateString()}</div>;
        },
        meta: {
          label: "Created At",
          variant: "dateRange", // 👈 enables the date filter in your switch
          icon: Calendar, // optional: use lucide-react Calendar icon
        },
        enableColumnFilter: true,
        enableSorting: true,
      },

      {
        id: "owner",
        accessorKey: "owner",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Owner" />
        ),
        cell: ({ cell }) => <div>{cell.getValue<Project["owner"]>()}</div>,
        enableColumnFilter: true,
      },
      {
        id: "actions",
        cell: function Cell() {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem variant="destructive">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
        size: 32,
      },
    ],
    []
  );

  const { table } = useDataTable({
    data: filteredData,
    columns,
    pageCount: 1,
    initialState: {
      sorting: [{ id: "title", desc: true }],
      columnPinning: { right: ["actions"] },
    },
    getRowId: (row) => row.id,
  });

  return (
    <div className="data-table-container">
      <DataTable table={table}>
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  );
}
