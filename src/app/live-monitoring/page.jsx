"use client";

import * as React from "react";
import dynamic from "next/dynamic";

import {
  ChevronDown,
  ChevronRight,
  Ellipsis,
  Filter,
  Search,
} from "lucide-react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import MainLayout from "@/components/layouts/MainLayout";
const LiveLocations = dynamic(() => import("@/components/maps/LiveLocations"), {
  loading: () => <div>Loading...</div>,
  ssr: false, // Render the component on the client-side only
});
import { RadialBarChart, RadialBar, Legend, Tooltip } from "recharts";
import { useRouter } from "next/navigation";

// Function to generate a random number between min and max (inclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const dummyData = [
  {
    status: "online",
    meterId: "MT001",
    LogoAccuracy: 95,
    channelDetection: "Channel A",
    connectivityStatus: "connected",
    householdId: "HH001",
    householdStatus: "active",
    hardwareVersion: "v1.2",
    network: "4G",
    location: "New York",
    latLon: "40.7128° N, 74.0060° W",
    avatarId: getRandomInt(1, 100000).toString()
  },
  {
    status: "offline",
    meterId: "MT002",
    LogoAccuracy: 87,
    channelDetection: "Channel B",
    connectivityStatus: "disconnected",
    householdId: "HH002",
    householdStatus: "inactive",
    hardwareVersion: "v1.1",
    network: "3G",
    location: "Los Angeles",
    latLon: "34.0522° N, 118.2437° W",
    avatarId: getRandomInt(1, 100000).toString()
  },
  {
    status: "online",
    meterId: "MT003",
    LogoAccuracy: 92,
    channelDetection: "Channel C",
    connectivityStatus: "connected",
    householdId: "HH003",
    householdStatus: "active",
    hardwareVersion: "v1.3",
    network: "5G",
    location: "Chicago",
    latLon: "41.8781° N, 87.6298° W",
    avatarId: getRandomInt(1, 100000).toString()
  },
  {
    status: "online",
    meterId: "MT004",
    LogoAccuracy: 89,
    channelDetection: "Channel D",
    connectivityStatus: "connected",
    householdId: "HH004",
    householdStatus: "active",
    hardwareVersion: "v1.2",
    network: "4G",
    location: "Houston",
    latLon: "29.7604° N, 95.3698° W",
    avatarId: getRandomInt(1, 100000).toString()
  },
  {
    status: "offline",
    meterId: "MT005",
    LogoAccuracy: 85,
    channelDetection: "Channel E",
    connectivityStatus: "disconnected",
    householdId: "HH005",
    householdStatus: "inactive",
    hardwareVersion: "v1.1",
    network: "3G",
    location: "Phoenix",
    latLon: "33.4484° N, 112.0740° W",
    avatarId: getRandomInt(1, 100000).toString()
  },
  {
    status: "online",
    meterId: "MT006",
    LogoAccuracy: 93,
    channelDetection: "Channel F",
    connectivityStatus: "connected",
    householdId: "HH006",
    householdStatus: "active",
    hardwareVersion: "v1.3",
    network: "5G",
    location: "Philadelphia",
    latLon: "39.9526° N, 75.1652° W",
    avatarId: getRandomInt(1, 100000).toString()
  },
  {
    status: "offline",
    meterId: "MT007",
    LogoAccuracy: 88,
    channelDetection: "Channel G",
    connectivityStatus: "disconnected",
    householdId: "HH007",
    householdStatus: "inactive",
    hardwareVersion: "v1.2",
    network: "4G",
    location: "San Antonio",
    latLon: "29.4241° N, 98.4936° W",
    avatarId: getRandomInt(1, 100000).toString()
  },
  {
    status: "online",
    meterId: "MT008",
    LogoAccuracy: 96,
    channelDetection: "Channel H",
    connectivityStatus: "connected",
    householdId: "HH008",
    householdStatus: "active",
    hardwareVersion: "v1.4",
    network: "5G",
    location: "San Diego",
    latLon: "32.7157° N, 117.1611° W",
    avatarId: getRandomInt(1, 100000).toString()
  },
  {
    status: "offline",
    meterId: "MT009",
    LogoAccuracy: 84,
    channelDetection: "Channel I",
    connectivityStatus: "disconnected",
    householdId: "HH009",
    householdStatus: "inactive",
    hardwareVersion: "v1.1",
    network: "3G",
    location: "Dallas",
    latLon: "32.7767° N, 96.7970° W",
    avatarId: getRandomInt(1, 100000).toString()
  },
  {
    status: "online",
    meterId: "MT010",
    LogoAccuracy: 90,
    channelDetection: "Channel J",
    connectivityStatus: "connected",
    householdId: "HH010",
    householdStatus: "active",
    hardwareVersion: "v1.3",
    network: "4G",
    location: "San Jose",
    latLon: "37.3382° N, 121.8863° W",
    avatarId: getRandomInt(1, 100000).toString()
  },
];


// Update the column definitions
export const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className=""
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status").toLowerCase();
      const statusClass =
        status === "online"
          ? "bg-green-500 text-white"
          : "bg-red-500 text-white";

      return (
        <div
          className={`capitalize h-0 w-0 p-2 rounded-full  ${statusClass}`}
        ></div>
      );
    },
  },
  {
    accessorKey: "meterId",
    header: "Meter ID",
    cell: ({ row }) => {
      const router = useRouter();

      const handleClick = () => {
        router.push(`/live-monitoring/${row.getValue("meterId")}`);
      };

      return (
        <div
          className="flex gap-2 items-center bg-secondary p-1 rounded-full pl-2 cursor-pointer"
          onClick={handleClick}
        >
          {row.getValue("meterId")} <ChevronRight size={16} />
        </div>
      );
    },
  },

  {
    accessorKey: "channelDetection",
    header: "Channel Detection",
    cell: ({ row }) => (
      <Dialog>
        <DialogTrigger>
          <div className="capitalize flex items-center gap-2 bg-accent rounded-full w-48 p-1">
            <img
              src={`https://avatars.githubusercontent.com/u/${row.original.avatarId}`}
              alt="img"
              className="size-10 rounded-full aspect-square"
            />
            <span className="truncate text-ellipsis">
              {row.getValue("channelDetection")}
            </span>
          </div>
        </DialogTrigger>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>
              <div className="capitalize flex items-center justify-between gap-2 my-2">
                <div className="flex items-center gap-2">
                  <img
                    src={`https://avatars.githubusercontent.com/u/${row.original.avatarId}`}
                    alt="img"
                    className="size-16 rounded-full aspect-square"
                  />
                  <span className="truncate text-ellipsis">
                    {row.getValue("channelDetection")}
                  </span>
                </div>
                <p className="text-sm">09/11/2001</p>
              </div>
              <hr />
            </DialogTitle>
            <DialogDescription>
              <div className="flex flex-col items-center">
                <span className="truncate text-ellipsis mb-4">
                  Logo Accuracy
                </span>
                <RadialBarChart
                  width={200}
                  height={200}
                  cx={100}
                  cy={100}
                  innerRadius={60}
                  outerRadius={80}
                  barSize={10}
                  data={[
                    {
                      name: "Logo Accuracy",
                      value: row.getValue("LogoAccuracy"),
                      fill: "#8884d8",
                    },
                  ]}
                  startAngle={90}
                  endAngle={-270}
                >
                  <RadialBar
                    minAngle={15}
                    label={{ position: "center", fill: "#8884d8" }}
                    background
                    clockWise
                    dataKey="value"
                  />
                  <Tooltip />
                </RadialBarChart>
                <div className="mt-2 text-center font-bold">
                  {row.getValue("LogoAccuracy")}%
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    ),
  },
  {
    accessorKey: "connectivityStatus",
    header: "Connectivity Status",
    cell: ({ row }) => {
      const connectivityStatus = row
        .getValue("connectivityStatus")
        .toLowerCase();
      const connectivityClass =
        connectivityStatus === "connected"
          ? "bg-blue-500 text-white"
          : "bg-gray-500 text-white";

      return (
        <div
          className={`capitalize p-1 rounded-full text-center ${connectivityClass}`}
        >
          {connectivityStatus}
        </div>
      );
    },
  },
  {
    accessorKey: "householdId",
    header: "Household ID",
    cell: ({ row }) => <div>{row.getValue("householdId")}</div>,
  },
  {
    accessorKey: "householdStatus",
    header: "Household Status",
    cell: ({ row }) => {
      const householdStatus = row.getValue("householdStatus").toLowerCase();
      const householdClass =
        householdStatus === "active"
          ? "bg-yellow-500 text-white"
          : "bg-gray-500 text-white";

      return (
        <div
          className={`capitalize p-1 rounded-full text-center ${householdClass}`}
        >
          {householdStatus}
        </div>
      );
    },
  },
  {
    accessorKey: "hardwareVersion",
    header: "Hardware Version",
    cell: ({ row }) => <div>{row.getValue("hardwareVersion")}</div>,
  },
  {
    accessorKey: "network",
    header: "Network",
    cell: ({ row }) => <div>{row.getValue("network")}</div>,
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => <div>{row.getValue("location")}</div>,
  },
  {
    accessorKey: "latLon",
    header: "Lat & Lon",
    cell: ({ row }) => <div className="w-32">{row.getValue("latLon")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const meter = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <Ellipsis className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(meter.meterId)}
            >
              Copy Meter ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

function Page() {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [searchFilters, setSearchFilters] = React.useState({});
  const [data, setData] = React.useState(dummyData);
  const [filteredData, setFilteredData] = React.useState(dummyData);
  const [pageIndex, setPageIndex] = React.useState(0);
  const pageSize = 5;
  const pageCount = Math.ceil(filteredData.length / pageSize);

const table = useReactTable({
  data: filteredData.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize),
  columns,
  onSortingChange: setSorting,
  onColumnFiltersChange: setColumnFilters,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  onColumnVisibilityChange: setColumnVisibility,
  onRowSelectionChange: setRowSelection,
  state: {
    sorting,
    columnFilters,
    columnVisibility,
    rowSelection,
  },
  manualPagination: true,
  pageCount: pageCount,
});

const handleSearch = () => {
  const filtered = data.filter((item) => {
    return Object.entries(searchFilters).every(([key, value]) => {
      if (!value) return true;
      return item[key].toLowerCase().includes(value.toLowerCase());
    });
  });
  setFilteredData(filtered);
  setPageIndex(0);
};

  const handleCancelSearch = () => {
    setSearchFilters({});
    setFilteredData(data);
    setPageIndex(0);
    table.resetColumnFilters();
  };


React.useEffect(() => {
  const start = pageIndex * pageSize;
  const end = start + pageSize;
  table.setPageSize(pageSize);
  table.setPageIndex(0);
}, [pageIndex, filteredData]);

  const filteredDevices = table
    .getFilteredRowModel()
    .rows.map((row) => row.original);

  return (
    <MainLayout>
      <div className="w-full h-full flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="w-full h-full">
          <h1 className="text-2xl font-bold">Live Monitoring</h1>
          <LiveLocations devices={filteredDevices} />
        </div>
        <div className="top-50 w-full p-2 bg-white rounded-lg">
          <div className="flex items-center py-2 gap-2">
            <div className="flex bg-accent rounded-full">
              <Input
                placeholder="Search Meters by Meter Id..."
                value={searchFilters.meterId || ""}
                onChange={(event) =>
                  setSearchFilters((prev) => ({
                    ...prev,
                    meterId: event.target.value,
                  }))
                }
                className="min-w-56 rounded-full border-none"
              />
              <Button className="rounded-full" onClick={handleSearch}>
                <Search /> Search
              </Button>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="rounded-full">
                  Advanced Search <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[800px] bg-white">
                <div className="grid gap-4">
                  <h4 className="font-medium leading-none">Search Filters</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {columns.map((column) => {
                      if (column.accessorKey && column.header) {
                        return (
                          <div key={column.accessorKey}>
                            <Label htmlFor={column.accessorKey}>
                              {column.header}
                            </Label>
                            {[
                              "status",
                              "connectivityStatus",
                              "householdStatus",
                            ].includes(column.accessorKey) ? (
                              <Select
                                value={searchFilters[column.accessorKey] || ""}
                                onValueChange={(value) =>
                                  setSearchFilters((prev) => ({
                                    ...prev,
                                    [column.accessorKey]: value,
                                  }))
                                }
                              >
                                <SelectTrigger id={column.accessorKey}>
                                  <SelectValue
                                    placeholder={`Select ${column.header}`}
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {column.accessorKey === "status" && (
                                    <>
                                      <SelectItem value="online">
                                        Online
                                      </SelectItem>
                                      <SelectItem value="offline">
                                        Offline
                                      </SelectItem>
                                    </>
                                  )}
                                  {column.accessorKey ===
                                    "connectivityStatus" && (
                                    <>
                                      <SelectItem value="connected">
                                        Connected
                                      </SelectItem>
                                      <SelectItem value="disconnected">
                                        Disconnected
                                      </SelectItem>
                                    </>
                                  )}
                                  {column.accessorKey === "householdStatus" && (
                                    <>
                                      <SelectItem value="active">
                                        Active
                                      </SelectItem>
                                      <SelectItem value="inactive">
                                        Inactive
                                      </SelectItem>
                                    </>
                                  )}
                                </SelectContent>
                              </Select>
                            ) : (
                              <Input
                                id={column.accessorKey}
                                value={searchFilters[column.accessorKey] || ""}
                                onChange={(e) =>
                                  setSearchFilters((prev) => ({
                                    ...prev,
                                    [column.accessorKey]: e.target.value,
                                  }))
                                }
                                className="rounded-md"
                              />
                            )}
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={handleCancelSearch}>
                      Cancel
                    </Button>
                    <Button onClick={handleSearch}>Apply Filters</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto rounded-full">
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="rounded-md border z-0 bg-white">
            <Table>
              <TableHeader className="bg-card">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
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
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground w-full">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <Pagination className="w-fit">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPageIndex(Math.max(pageIndex - 1, 0))}
                    disabled={pageIndex === 0}
                  />
                </PaginationItem>
                {Array.from({ length: pageCount }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setPageIndex(page - 1)}
                        isActive={pageIndex === page - 1}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setPageIndex(Math.min(pageIndex + 1, pageCount - 1))
                    }
                    disabled={pageIndex === pageCount - 1}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Page;