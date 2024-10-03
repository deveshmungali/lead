"use client";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { statuses } from "../data/data";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { Icon } from "@iconify/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";

export function DataTableToolbar({ table }) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Selection state
  const selectedRows = table.getSelectedRowModel().rows;

  // Debounced search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      table.getColumn("id")?.setFilterValue(searchTerm);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, table]);

  // Export data to Excel
  const exportToExcel = (selectedRows) => {
    const dataToExport = selectedRows.map((row) => row.original); // Extract row data
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Selected Data");
    XLSX.writeFile(workbook, "exported_data.xlsx");
  };

  const handleExport = () => {
    if (selectedRows.length > 0) {
      exportToExcel(selectedRows);
    } else {
      alert("Please select rows to export.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <span className="text-base font-medium text-default-600">Show</span>
          <Select
            value={rowsPerPage}
            onValueChange={(value) => {
              setRowsPerPage(Number(value));
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="w-20" size="md" radius="sm">
              <SelectValue placeholder={rowsPerPage.toString()} />
            </SelectTrigger>
            <SelectContent className="w-20 min-w-[80px]">
              {Array.from({ length: 9 }, (_, index) => {
                const number = index + 10;
                return (
                  <SelectItem key={number} value={number.toString()}>
                    {number}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div className="relative">
          <Input
            placeholder="Search Lead..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="min-w-[200px] sm:max-w-[248px] ltr:pl-7 rtl:pr-7 rounded"
          />
          <Icon
            icon="heroicons:magnifying-glass"
            className="w-3.5 h-3.5 absolute top-1/2 -translate-y-1/2 ltr:left-3 rtl:right-3 text-default-500"
          />
        </div>
      </div>

      <div className="flex-none flex flex-col sm:flex-row sm:items-center gap-4">
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Select Status"
            options={statuses}
          />
        )}

        {isFiltered && (
          <Button
            variant="outline"
            onClick={() => table.resetColumnFilters()}
            className="px-2 lg:px-3"
          >
            Reset
            <X className="ltr:ml-2 rtl:mr-2 h-4 w-4" />
          </Button>
        )}

        {/* Export to Excel Button */}
        <Button onClick={handleExport} variant="default">
          <Icon icon="icon-park-outline:export" className="w-5 h-5 ltr:mr-2" />
          Export to Excel
        </Button>

        {/* Create Lead Button */}
        <Button asChild>
          <Link href="/create-lead">
            <Plus className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
            Create Lead
          </Link>
        </Button>
      </div>
    </div>
  );
}
