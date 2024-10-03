"use client";

import { DataTableColumnHeader } from "./data-table-column-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import Link from "next/link";

export const columns = [
  {
    accessorKey: "first_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="First Name" />
    ),
    cell: ({ row }) => <div>{row.getValue("first_name")}</div>,
  },
  {
    accessorKey: "last_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Name" />
    ),
    cell: ({ row }) => <div>{row.getValue("last_name")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <div className="flex gap-2 items-center">
        <Avatar className="rounded-full">
          <AvatarImage src={row?.original?.avatar?.src} />
          <AvatarFallback>{row?.original?.email?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-default-600">
            {row.getValue("email")}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "designation",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Designation" />
    ),
    cell: ({ row }) => <div>{row.getValue("designation")}</div>,
  },
  {
    accessorKey: "company",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Company" />
    ),
    cell: ({ row }) => <div>{row.getValue("company")}</div>,
  },
  {
    accessorKey: "link",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Link" />
    ),
    cell: ({ row }) => (
      <Link href={row.getValue("link")} className="text-blue-600 hover:underline">
        {row.getValue("link")}
      </Link>
    ),
  },
  {
    accessorKey: "linkedin_url",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="LinkedIn URL" />
    ),
    cell: ({ row }) => (
      <Link href={row.getValue("linkedin_url")} className="text-blue-600 hover:underline">
        {row.getValue("linkedin_url")}
      </Link>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex gap-3 items-center">
        <Button variant="outline" size="sm">
          <Link href={`/edit/${row.getValue("id")}`}>
            <Icon icon="heroicons:pencil-square" className="w-4 h-4" />
            Edit
          </Link>
        </Button>
      </div>
    ),
  },
];
