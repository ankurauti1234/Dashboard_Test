"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Dot,
  ReferenceLine,
} from "recharts";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  RefreshCw,
  Calendar as CalendarIcon,
  Fan,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Toaster, toast } from "sonner";

const DISTANCE_LCL = 2;
const DISTANCE_UCL = 100;
const TEMPERATURE_LCL = 10;
const TEMPERATURE_UCL = 25;
const HUMIDITY_LCL = 30;
const HUMIDITY_UCL = 70;
const ALERTS_PER_PAGE = 5;

export default function SensorData() {
  const [sensorData, setSensorData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [distanceAlerts, setDistanceAlerts] = useState([]);
  const [temperatureAlerts, setTemperatureAlerts] = useState([]);
  const [humidityAlerts, setHumidityAlerts] = useState([]);
  const [alertsPage, setAlertsPage] = useState(1);
  const [fanState, setFanState] = useState(false);
  const [isAutoMode, setIsAutoMode] = useState(false);

  const fetchData = async () => {
    let url = `https://apmapis.webdevava.live/api/sensor/live?page=${currentPage}&limit=10`;
    if (startDate && endDate) {
      url += `&startTime=${startDate.toISOString()}&endTime=${endDate.toISOString()}`;
    }
    try {
      const response = await fetch(url);
      const result = await response.json();
      const processedData = result.data.map((item) => ({
        ...item,
        isDistanceAlert:
          item.distance < DISTANCE_LCL || item.distance > DISTANCE_UCL,
        isTemperatureAlert:
          item.temperature < TEMPERATURE_LCL ||
          item.temperature > TEMPERATURE_UCL,
        isHumidityAlert:
          item.humidity < HUMIDITY_LCL || item.humidity > HUMIDITY_UCL,
      }));
      setSensorData(processedData);
      setTotalPages(result.totalPages);
      updateAlerts(processedData);
    } catch (error) {
      console.error("Error fetching sensor data:", error);
    }
  };

  // Update the existing toast.error() calls in the updateAlerts function
  const updateAlerts = (data) => {
    const newDistanceAlerts = data.filter((item) => item.isDistanceAlert);
    const newTemperatureAlerts = data.filter((item) => item.isTemperatureAlert);
    const newHumidityAlerts = data.filter((item) => item.isHumidityAlert);

    setDistanceAlerts((prev) => [...prev, ...newDistanceAlerts]);
    setTemperatureAlerts((prev) => [...prev, ...newTemperatureAlerts]);
    setHumidityAlerts((prev) => [...prev, ...newHumidityAlerts]);

    newDistanceAlerts.forEach((alert) => {
      toast.error(
        `Distance Alert: ${alert.distance.toFixed(
          2
        )} CM is out of control limits`,
        {
          description: format(
            new Date(alert.timestamp),
            "MMM d, yyyy h:mm:ss a"
          ),
          style: {
            background: "rgb(220, 38, 38)",
            color: "white",
            border: "none",
          },
        }
      );
    });

    newTemperatureAlerts.forEach((alert) => {
      toast.error(
        `Temperature Alert: ${alert.temperature.toFixed(
          2
        )}°C is out of control limits`,
        {
          description: format(
            new Date(alert.timestamp),
            "MMM d, yyyy h:mm:ss a"
          ),
          style: {
            background: "rgb(220, 38, 38)",
            color: "white",
            border: "none",
          },
        }
      );
    });

    newHumidityAlerts.forEach((alert) => {
      toast.error(
        `Humidity Alert: ${alert.humidity.toFixed(
          2
        )}% is out of control limits`,
        {
          description: format(
            new Date(alert.timestamp),
            "MMM d, yyyy h:mm:ss a"
          ),
          style: {
            background: "rgb(220, 38, 38)",
            color: "white",
            border: "none",
          },
        }
      );
    });
  };

  const fetchFanState = async () => {
    try {
      const response = await fetch(
        "https://apmapis.webdevava.live/api/fan/state"
      );
      const result = await response.json();
      setFanState(result.state);
    } catch (error) {
      console.error("Error fetching fan state:", error);
    }
  };

  const toggleFan = async (newState) => {
    try {
      const response = await fetch(
        "https://apmapis.webdevava.live/api/fan/toggle",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ state: newState }),
        }
      );
      const result = await response.json();
      setFanState(result.state);
      toast.success(`Fan turned ${result.state ? "on" : "off"}`);
    } catch (error) {
      console.error("Error toggling fan state:", error);
      toast.error("Failed to toggle fan state");
    }
  };

  useEffect(() => {
    fetchData();
    fetchFanState();
    const intervalId = setInterval(() => {
      fetchData();
      fetchFanState();
    }, 5000); // Fetch every 5 seconds
    return () => clearInterval(intervalId);
  }, [currentPage, startDate, endDate]);

  useEffect(() => {
    if (isAutoMode && sensorData.length > 0) {
      const latestTemperature = sensorData[0].temperature;
      if (latestTemperature > 25 && !fanState) {
        toggleFan(true);
      } else if (latestTemperature <= 25 && fanState) {
        toggleFan(false);
      }
    }
  }, [sensorData, isAutoMode, fanState]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleAlertPageChange = (newPage) => {
    setAlertsPage(newPage);
  };

  const handleFilterApply = () => {
    setCurrentPage(1);
    fetchData();
    setIsFilterOpen(false);
  };

  const handleFilterReset = () => {
    setStartDate(null);
    setEndDate(null);
    setCurrentPage(1);
    fetchData();
    setIsFilterOpen(false);
  };

  const renderChart = (dataKey, title, lcl, ucl) => (
    <Card className="w-full bg-white">
      <CardHeader className="px-4 py-2 border-b">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="w-full">
        <div className="h-[333px] w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[...sensorData].reverse()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(timestamp) =>
                  new Date(timestamp).toLocaleTimeString()
                }
              />
              <YAxis />
              <Tooltip
                content={({ payload, label }) => {
                  if (payload && payload.length) {
                    const formattedTime = format(
                      new Date(label),
                      "MMM d, yyyy h:mm:ss a"
                    );
                    return (
                      <div className="bg-popover border p-3 rounded-lg">
                        <p>{`Time: ${formattedTime}`}</p>
                        <p>{`${title}: ${payload[0].value.toFixed(2)}`}</p>
                        <p>{`Status: ${
                          payload[0].payload[`is${title}Alert`]
                            ? "Alert"
                            : "Normal"
                        }`}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine
                y={lcl}
                label="LCL"
                stroke="red"
                strokeDasharray="3 3"
              />
              <ReferenceLine
                y={ucl}
                label="UCL"
                stroke="red"
                strokeDasharray="3 3"
              />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke="#8884d8"
                strokeWidth={2}
                dot={<CustomizedDot dataKey={dataKey} />}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );

  const renderAlertTable = (alerts, title) => (
    <Card className="w-full bg-white">
      <CardHeader className="flex justify-between items-center flex-row px-4 py-2 border-b">
        <CardTitle className="text-lg">{title} Alerts</CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => handleAlertPageChange(alertsPage - 1)}
            disabled={alertsPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>
          <span>
            Page {alertsPage} of {Math.ceil(alerts.length / ALERTS_PER_PAGE)}
          </span>
          <Button
            variant="outline"
            onClick={() => handleAlertPageChange(alertsPage + 1)}
            disabled={alertsPage === Math.ceil(alerts.length / ALERTS_PER_PAGE)}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>{title}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alerts
              .slice(
                (alertsPage - 1) * ALERTS_PER_PAGE,
                alertsPage * ALERTS_PER_PAGE
              )
              .map((alert, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {format(new Date(alert.timestamp), "MMM d, yyyy h:mm:ss a")}
                  </TableCell>
                  <TableCell>
                    {alert[title.toLowerCase()].toFixed(2)}{" "}
                    {title === "Distance"
                      ? "CM"
                      : title === "Temperature"
                      ? "°C"
                      : "%"}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <Card className="bg-transparent mt-4 border-0">
      <CardHeader className="px-4 py-0">
        <CardTitle className="text-lg">Live Sensor Data</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col w-full items-center justify-evenly gap-4 p-4">
        <div className="flex gap-6 w-full">
          {renderChart(
            "temperature",
            "Temperature",
            TEMPERATURE_LCL,
            TEMPERATURE_UCL
          )}
          {renderChart("humidity", "Humidity", HUMIDITY_LCL, HUMIDITY_UCL)}
        </div>
        {renderChart("distance", "Distance", DISTANCE_LCL, DISTANCE_UCL)}

        <Card className="w-full bg-white">
          <CardHeader className="flex justify-between items-center flex-row px-4 py-2 border-b">
            <CardTitle className="text-lg">Fan Control</CardTitle>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-mode"
                  checked={isAutoMode}
                  onCheckedChange={setIsAutoMode}
                />
                <Label htmlFor="auto-mode">Auto Mode</Label>
              </div>
              <Button
                variant={fanState ? "default" : "outline"}
                onClick={() => toggleFan(!fanState)}
                disabled={isAutoMode}
              >
                <Fan className="mr-2 h-4 w-4" />
                {fanState ? "Turn Off" : "Turn On"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p>Current fan state: {fanState ? "On" : "Off"}</p>
            <p>Mode: {isAutoMode ? "Automatic" : "Manual"}</p>
          </CardContent>
        </Card>

        <CardContent className="flex flex-col lg:flex-row w-full items-center p-0 gap-4">
          <Card className="w-full bg-white">
            <CardHeader className="flex justify-between items-center flex-row px-4 py-2 border-b">
              <CardTitle className="text-lg w-fit">Sensor Data</CardTitle>
              <div className="flex w-fit justify-between items-center gap-2">
                <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline">
                      <Filter className="mr-2 h-4 w-4" /> Filter
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium leading-none">Date Range</h4>
                        <p className="text-sm text-muted-foreground">
                          Select the start and end dates for filtering.
                        </p>
                      </div>
                      <div className="grid gap-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !startDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {startDate ? (
                                format(startDate, "dd/MM/yy")
                              ) : (
                                <span>Pick a start date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={startDate}
                              onSelect={setStartDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !endDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {endDate ? (
                                format(endDate, "dd/MM/yy")
                              ) : (
                                <span>Pick an end date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={endDate}
                              onSelect={setEndDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <Button onClick={handleFilterApply}>Apply Filter</Button>
                      <Button variant="outline" onClick={handleFilterReset}>
                        Reset Filter
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
                <Button variant="outline" onClick={fetchData}>
                  <RefreshCw className="mr-2 h-4 w-4" /> Refresh
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous page</span>
                </Button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next page</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Distance</TableHead>
                    <TableHead>Temperature</TableHead>
                    <TableHead>Humidity</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sensorData.map((data, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {format(
                          new Date(data.timestamp),
                          "MMM d, yyyy h:mm:ss a"
                        )}
                      </TableCell>
                      <TableCell>
                        {data.distance?.toFixed(2) ?? "N/A"} CM
                      </TableCell>
                      <TableCell>
                        {data.temperature?.toFixed(2) ?? "N/A"} °C
                      </TableCell>
                      <TableCell>
                        {data.humidity?.toFixed(2) ?? "N/A"} %
                      </TableCell>
                      <TableCell>
                        {data.isDistanceAlert ||
                        data.isTemperatureAlert ||
                        data.isHumidityAlert
                          ? "Alert"
                          : "Normal"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </CardContent>
        <CardContent className="flex flex-col lg:flex-row w-full items-start p-0 gap-4">
          {renderAlertTable(distanceAlerts, "Distance")}
          {renderAlertTable(temperatureAlerts, "Temperature")}
          {renderAlertTable(humidityAlerts, "Humidity")}
        </CardContent>
      </CardContent>
    </Card>
  );
}

const CustomizedDot = (props) => {
  const { cx, cy, payload, dataKey } = props;
  const value = payload[dataKey];
  const formattedValue = value;
  const isAlert =
    payload[`is${dataKey.charAt(0).toUpperCase() + dataKey.slice(1)}Alert`];

  return (
    <g>
      <Dot
        cx={cx}
        cy={cy}
        stroke={isAlert ? "red" : "#8884d8"}
        strokeWidth={2}
        fill={isAlert ? "red" : "#fff"}
        r={4}
      />
      <text
        x={cx}
        y={cy - 10}
        fill={isAlert ? "red" : "#8884d8"}
        textAnchor="middle"
        fontSize={12}
        fontWeight="bold"
      >
        {formattedValue}
      </text>
    </g>
  );
};
