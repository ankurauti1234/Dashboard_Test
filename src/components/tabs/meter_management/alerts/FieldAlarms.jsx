"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  RefreshCw,
  Filter,
  Download,
} from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function FieldAlarms() {
  const [loading, setLoading] = useState(false);
  const [alarmData, setAlarmData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [limit, setLimit] = useState(5);

  const [searchDeviceId, setSearchDeviceId] = useState("");
  const [filterDeviceId, setFilterDeviceId] = useState("");
  const [filterAlertType, setFilterAlertType] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState(null);
  const [filterDateTo, setFilterDateTo] = useState(null);

  const [searchParams, setSearchParams] = useState({});

  const [selectedRows, setSelectedRows] = useState({});

  useEffect(() => {
    fetchAlarmData();

    const intervalId = setInterval(fetchAlarmData,60000);

    return () => clearInterval(intervalId);
  }, [currentPage, limit, searchParams]);

  const fetchAlarmData = async () => {
    setLoading(true);
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/events/alerts?page=${currentPage}&limit=${limit}`;

      Object.entries(searchParams).forEach(([key, value]) => {
        if (value) {
          if (key === "dateFrom" || key === "dateTo") {
            url += `&${key}=${value.toISOString()}`;
          } else {
            url += `&${key}=${value}`;
          }
        }
      });

      const response = await fetch(url);
      const data = await response.json();
      setAlarmData(data.events);
      setTotalRecords(data.total);
    } catch (error) {
      console.error("Error fetching alarm data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    setSearchParams({
      DEVICE_ID: searchDeviceId || filterDeviceId,
      AlertType: filterAlertType,
      dateFrom: filterDateFrom,
      dateTo: filterDateTo,
    });
  };

  const handleReset = () => {
    setSearchDeviceId("");
    setFilterDeviceId("");
    setFilterAlertType("");
    setFilterDateFrom(null);
    setFilterDateTo(null);
    setCurrentPage(1);
    setSearchParams({});
  };

  const handleRefresh = () => {
    fetchAlarmData();
  };

  const handleRowSelect = (id) => {
    setSelectedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSelectAll = (checked) => {
    const newSelectedRows = {};
    alarmData.forEach((alarm) => {
      newSelectedRows[alarm._id] = checked;
    });
    setSelectedRows(newSelectedRows);
  };

  const handleExport = () => {
    const selectedData = alarmData.filter((alarm) => selectedRows[alarm._id]);
    if (selectedData.length === 0) {
      alert("Please select at least one row to export.");
      return;
    }

    const csvContent = convertToCSV(selectedData);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "alarm_data.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const convertToCSV = (data) => {
    const headers = ["Device ID", "Timestamp", "Event Name", "Alert Type"];
    const rows = data.map((alarm) => {
      const timestamp = new Date(alarm.TS).toLocaleString();
      return [alarm.DEVICE_ID, timestamp, alarm.eventName, alarm.AlertType];
    });
    return [headers, ...rows].map((row) => row.join(",")).join("\n");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div
          className={cn(
            "w-16 h-16 border-4 border-dashed rounded-full animate-spin",
            "border-gray-400 border-t-transparent"
          )}
        ></div>
      </div>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-4 md:gap-8 bg-white">
      <div className="border p-2 rounded-lg">
        <div className="flex items-center rounded-t-lg justify-between mb-2">
          <div className="flex w-full justify-between gap-3 items-center">
            <div className="flex items-center gap-4">
              <div className="flex-1 flex items-center max-w-96 rounded-full bg-background">
                <Input
                  placeholder="Search Devices..."
                  value={searchDeviceId}
                  onChange={(e) => setSearchDeviceId(e.target.value)}
                  className="rounded-full border-none"
                />
                <Button onClick={handleSearch} className="rounded-full">
                  <Search className="h-4 w-4" /> Search
                </Button>
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="bg-background rounded-full"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Search By Filter
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-96">
                  <div className="space-y-4">
                    <h4 className="font-medium leading-none">Search Filters</h4>
                    <div className="grid gap-4">
                      <div className="flex items-center gap-4">
                        <Label htmlFor="deviceId" className="w-24">
                          Device ID
                        </Label>
                        <Input
                          id="deviceId"
                          value={filterDeviceId}
                          onChange={(e) => setFilterDeviceId(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <Label htmlFor="alertType" className="w-24">
                          Alert Type
                        </Label>
                        <Input
                          id="alertType"
                          value={filterAlertType}
                          onChange={(e) => setFilterAlertType(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <Label className="w-24">Date From</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="flex-1 justify-start text-left font-normal"
                            >
                              {filterDateFrom ? (
                                format(filterDateFrom, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={filterDateFrom}
                              onSelect={setFilterDateFrom}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="flex items-center gap-4">
                        <Label className="w-24">Date To</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="flex-1 justify-start text-left font-normal"
                            >
                              {filterDateTo ? (
                                format(filterDateTo, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={filterDateTo}
                              onSelect={setFilterDateTo}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <Button onClick={handleSearch}>Search</Button>
                      <Button onClick={handleReset} variant="outline">
                        Reset
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Button
                onClick={handleRefresh}
                variant="outline"
                className="rounded-full p-2 size-10"
              >
                <RefreshCw className="h-8 w-8" />
              </Button>
            </div>

            <div className="flex gap-1 items-center">
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                variant="secondary"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span>
                Page {currentPage} of {Math.ceil(totalRecords / limit)}
              </span>
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage * limit >= totalRecords}
                variant="secondary"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="mx-3">
            <Select
              id="limit"
              value={limit.toString()}
              onValueChange={(value) => {
                setLimit(value === "all" ? totalRecords : Number(value));
              }}
            >
              <SelectTrigger className="w-[120px]">
                <span>{limit}</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
                <SelectItem value="all">All {totalRecords}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {Object.values(selectedRows).filter(Boolean).length > 0 && (
            <Button
              className="ml-3"
              onClick={handleExport}
              disabled={
                Object.values(selectedRows).filter(Boolean).length === 0
              }
            >
              <Download className="h-4 w-4 mr-2" />
              Export Selected
            </Button>
          )}
        </div>
        <ScrollArea className="h-[48vh] rounded-lg border w-full">
          <Table className="h-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={
                      alarmData.length > 0 &&
                      alarmData.every((alarm) => selectedRows[alarm._id])
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Device ID</TableHead>
                <TableHead className="w-[180px]">Timestamp</TableHead>
                <TableHead>Event Name</TableHead>
                <TableHead>Alert Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alarmData.map((alarm) => (
                <TableRow key={alarm._id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedRows[alarm._id] || false}
                      onCheckedChange={() => handleRowSelect(alarm._id)}
                    />
                  </TableCell>
                  <TableCell>{alarm.DEVICE_ID}</TableCell>
                  <TableCell>
                    {alarm.TS
                      ? format(new Date(alarm.TS), "MM/dd/yy, hh:mm:ss a")
                      : "N/A"}
                  </TableCell>
                  <TableCell>{alarm.eventName}</TableCell>
                  <TableCell>{alarm.AlertType}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </main>
  );
}
