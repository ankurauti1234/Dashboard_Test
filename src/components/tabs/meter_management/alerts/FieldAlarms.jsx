"use client";

import React, { useState, useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const initialData = [
  {
    id: 1,
    meterId: "100001",
    hhId: "HH001",
    remoteId: "R001",
    eventId: "E001",
    alarmName: "TAMPER ALARM",
    alarmPriority: "High",
    status: "Active",
    validFrom: "2023-05-01",
    validTo: "2023-06-01",
    assignedTo: "John Doe",
  },
  {
    id: 2,
    meterId: "100002",
    hhId: "HH002",
    remoteId: "R002",
    eventId: "E002",
    alarmName: "SOS ALARM",
    alarmPriority: "Critical",
    status: "Active",
    validFrom: "2023-05-02",
    validTo: "2023-06-02",
    assignedTo: "Jane Smith",
  },
  {
    id: 3,
    meterId: "100003",
    hhId: "HH003",
    remoteId: "R003",
    eventId: "E003",
    alarmName: "BATTERY ALARM",
    alarmPriority: "Medium",
    status: "Resolved",
    validFrom: "2023-05-03",
    validTo: "2023-06-03",
    assignedTo: "Alice Johnson",
  },
  {
    id: 4,
    meterId: "100004",
    hhId: "HH004",
    remoteId: "R004",
    eventId: "E004",
    alarmName: "SIM ALERT",
    alarmPriority: "Low",
    status: "Active",
    validFrom: "2023-05-04",
    validTo: "2023-06-04",
    assignedTo: "Bob Wilson",
  },
  {
    id: 5,
    meterId: "100005",
    hhId: "HH005",
    remoteId: "R005",
    eventId: "E005",
    alarmName: "SYSTEM ALARM",
    alarmPriority: "High",
    status: "Active",
    validFrom: "2023-05-05",
    validTo: "2023-06-05",
    assignedTo: "Charlie Brown",
  },
  {
    id: 6,
    meterId: "100006",
    hhId: "HH006",
    remoteId: "R006",
    eventId: "E006",
    alarmName: "TAMPER ALARM",
    alarmPriority: "High",
    status: "Resolved",
    validFrom: "2023-05-06",
    validTo: "2023-06-06",
    assignedTo: "David Lee",
  },
  {
    id: 7,
    meterId: "100007",
    hhId: "HH007",
    remoteId: "R007",
    eventId: "E007",
    alarmName: "SOS ALARM",
    alarmPriority: "Critical",
    status: "Active",
    validFrom: "2023-05-07",
    validTo: "2023-06-07",
    assignedTo: "Eva Green",
  },
  {
    id: 8,
    meterId: "100008",
    hhId: "HH008",
    remoteId: "R008",
    eventId: "E008",
    alarmName: "BATTERY ALARM",
    alarmPriority: "Medium",
    status: "Active",
    validFrom: "2023-05-08",
    validTo: "2023-06-08",
    assignedTo: "Frank White",
  },
  {
    id: 9,
    meterId: "100009",
    hhId: "HH009",
    remoteId: "R009",
    eventId: "E009",
    alarmName: "SIM ALERT",
    alarmPriority: "Low",
    status: "Resolved",
    validFrom: "2023-05-09",
    validTo: "2023-06-09",
    assignedTo: "Grace Taylor",
  },
  {
    id: 10,
    meterId: "100010",
    hhId: "HH010",
    remoteId: "R010",
    eventId: "E010",
    alarmName: "SYSTEM ALARM",
    alarmPriority: "High",
    status: "Active",
    validFrom: "2023-05-10",
    validTo: "2023-06-10",
    assignedTo: "Henry Ford",
  },
];

const FieldAlarms = () => {
  const [data, setData] = useState(initialData);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo(
    () => [
      { accessorKey: "meterId", header: "Device ID" },
      { accessorKey: "hhId", header: "HH ID" },
      { accessorKey: "remoteId", header: "Remote ID" },
      { accessorKey: "eventId", header: "Event ID" },
      { accessorKey: "alarmName", header: "Alarm Name" },
      { accessorKey: "alarmPriority", header: "Alarm Priority" },
      { accessorKey: "status", header: "Status" },
      { accessorKey: "validFrom", header: "Valid From" },
      { accessorKey: "validTo", header: "Valid To" },
      { accessorKey: "assignedTo", header: "Assigned To" },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="w-full p-2 bg-white rounded-lg border">
      <div className="flex items-center mb-4">
        <Input
          placeholder="Search..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm mr-2"
        />
        <Button onClick={() => setGlobalFilter("")}>Clear</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
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
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default FieldAlarms;
