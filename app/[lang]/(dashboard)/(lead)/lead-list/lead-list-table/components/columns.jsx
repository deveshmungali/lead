"use client";

import React, { useState } from "react";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import Link from "next/link";
import * as XLSX from "xlsx";

// Define the columns for your table
export const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <input
        type="checkbox"
        // Handle select all
        checked={table.getIsAllRowsSelected()}
        onChange={() => table.toggleAllRowsSelected(!table.getIsAllRowsSelected())}
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={() => row.toggleSelected()}
      />
    ),
  },
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

// Function to export data to Excel
const exportToExcel = (selectedRows) => {
  const worksheet = XLSX.utils.json_to_sheet(selectedRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Selected Data");
  XLSX.writeFile(workbook, "exported_data.xlsx");
};

// Main component
const DataTableWithExport = ({ data }) => {
  const [selectedRows, setSelectedRows] = useState([]);

  // Handle row selection
  const handleSelectRow = (row) => {
    if (selectedRows.includes(row)) {
      setSelectedRows(selectedRows.filter((r) => r !== row));
    } else {
      setSelectedRows([...selectedRows, row]);
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedRows.length === data.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(data);
    }
  };

  const handleExport = () => {
    if (selectedRows.length > 0) {
      exportToExcel(selectedRows);
    } else {
      alert("Please select rows to export.");
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <Button onClick={handleExport}>Export to Excel</Button>
        <input
          type="checkbox"
          onChange={handleSelectAll}
          checked={selectedRows.length === data.length}
        />
        <span>Select All</span>
      </div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            {/* Render column headers */}
            {columns.map((column) => (
              <th key={column.accessorKey || column.id}>{column.header({ column })}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Render rows */}
          {data.map((row, idx) => (
            <tr key={idx}>
              {columns.map((column) => (
                <td key={column.accessorKey || column.id}>
                  {column.accessorKey
                    ? row[column.accessorKey]
                    : column.cell({ row })}
                </td>
              ))}
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(row)}
                  onChange={() => handleSelectRow(row)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTableWithExport;
