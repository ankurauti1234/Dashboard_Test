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
  Legend,
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
import { motion, AnimatePresence } from "framer-motion";
import PressureChart from "./PressureChart";

const DISTANCE_LCL = 2;
const DISTANCE_UCL = 100;
const TEMPERATURE_LCL = 10;
const TEMPERATURE_UCL = 25;
const HUMIDITY_LCL = 30;
const HUMIDITY_UCL = 70;
const ALERTS_PER_PAGE = 10;


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
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [lastProcessedTimestamp, setLastProcessedTimestamp] = useState(null);
  const [showFanAnimation, setShowFanAnimation] = useState(false);

  const fetchData = async () => {
    let url = `https://apmapis.webdevava.live/api/sensor/live?page=${currentPage}&limit=20`;
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
      toast.error("Failed to fetch sensor data");
    }
  };

  const updateAlerts = (data) => {
    const newData = data.filter(
      (item) =>
        !lastProcessedTimestamp ||
        new Date(item.timestamp) > lastProcessedTimestamp
    );

    if (newData.length === 0) return;

    const newDistanceAlerts = newData.filter((item) => item.isDistanceAlert);
    const newTemperatureAlerts = newData.filter(
      (item) => item.isTemperatureAlert
    );
    const newHumidityAlerts = newData.filter((item) => item.isHumidityAlert);

    setDistanceAlerts((prev) => [...newDistanceAlerts, ...prev]);
    setTemperatureAlerts((prev) => [...newTemperatureAlerts, ...prev]);
    setHumidityAlerts((prev) => [...newHumidityAlerts, ...prev]);

    const latestData = newData[0];
    if (latestData.isDistanceAlert) {
      showAlert("Oil Level", latestData.distance, "CM");
    }
    if (latestData.isTemperatureAlert) {
      showAlert("Temperature", latestData.temperature, "°C");
    }
    if (latestData.isHumidityAlert) {
      showAlert("Humidity", latestData.humidity, "%");
    }

    setLastProcessedTimestamp(
      new Date(Math.max(...newData.map((d) => new Date(d.timestamp))))
    );
  };

  const showAlert = (type, value, unit) => {
    toast.error(
      `${type} Alert: ${value.toFixed(2)}${unit} is out of control limits`,
      {
        style: {
          background: "rgb(220, 38, 38)",
          color: "white",
          border: "none",
        },
      }
    );
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
      toast.error("Failed to fetch fan state");
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
      setShowFanAnimation(result.state);
      setTimeout(() => setShowFanAnimation(false), 500);
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

  const getStatus = (value, lcl, ucl) => {
    if (value < lcl || value > ucl) {
      return "Alert";
    }
    return "Normal";
  };

  const renderChart = (dataKey, title, lcl, ucl) => (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
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
                    const timestamp = new Date(label);
                    if (!isNaN(timestamp.getTime())) {
                      // Check if the timestamp is valid
                      const formattedTime = format(
                        timestamp,
                        "MMM d, yyyy h:mm:ss a"
                      );
                      const value = payload[0].value;
                      const status = getStatus(value, lcl, ucl);
                      return (
                        <div className="bg-background border p-2 rounded-md shadow-md">
                          <p className="font-bold">{`Time: ${formattedTime}`}</p>
                          <p>{`${title}: ${value.toFixed(2)}`}</p>
                          <p
                            className={
                              status === "Alert"
                                ? "text-red-500 font-bold"
                                : "text-green-500"
                            }
                          >{`Status: ${status}`}</p>
                        </div>
                      );
                    } else {
                      return null; // or some other default value
                    }
                  }
                  return null;
                }}
              />
              <ReferenceLine
                y={lcl}
                label={{ value: "LCL", position: "insideLeft" }}
                stroke="red"
                strokeDasharray="3 3"
              />
              <ReferenceLine
                y={ucl}
                label={{ value: "UCL", position: "insideLeft" }}
                stroke="red"
                strokeDasharray="3 3"
              />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke="#8884d8"
                strokeWidth={2}
                dot={<CustomizedDot dataKey={dataKey} lcl={lcl} ucl={ucl} />}
                activeDot={{ r: 8 }}
              />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );

  const renderAlertTable = (alerts, title) => (
    <Card className="w-full">
      <CardHeader className="flex justify-between items-center">
        <CardTitle>{title} Alerts</CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAlertPageChange(alertsPage - 1)}
            disabled={alertsPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span>
            Page {alertsPage} of{" "}
            {Math.max(1, Math.ceil(alerts.length / ALERTS_PER_PAGE))}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAlertPageChange(alertsPage + 1)}
            disabled={
              alertsPage ===
              Math.max(1, Math.ceil(alerts.length / ALERTS_PER_PAGE))
            }
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="max-h-[300px] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>{title}</TableHead>
                <TableHead>Status</TableHead>
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
                      {format(
                        new Date(alert.timestamp),
                        "MMM d, yyyy h:mm:ss a"
                      )}
                    </TableCell>
                    <TableCell>
                      {alert[title.toLowerCase().replace(" ", "")]}
                      {title === "Oil Level"
                        ? " CM"
                        : title === "Temperature"
                        ? " °C"
                        : " %"}
                    </TableCell>
                    <TableCell className="font-bold text-red-500">
                      Alert
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className=" mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold">Sensor Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderChart(
          "temperature",
          "Temperature",
          TEMPERATURE_LCL,
          TEMPERATURE_UCL
        )}
        {renderChart("humidity", "Humidity", HUMIDITY_LCL, HUMIDITY_UCL)}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderChart("distance", "Oil Level", DISTANCE_LCL, DISTANCE_UCL)}
        <PressureChart  />
      </div>

      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Fan Control</CardTitle>
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
              <AnimatePresence>
                {showFanAnimation && (
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    exit={{ rotate: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Fan className="mr-2 h-4 w-4" />
                  </motion.div>
                )}
                {!showFanAnimation && <Fan className="mr-2 h-4 w-4" />}
              </AnimatePresence>
              {fanState ? "Turn Off" : "Turn On"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p>Current fan state: {fanState ? "On" : "Off"}</p>
          <p>Mode: {isAutoMode ? "Automatic" : "Manual"}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Sensor Data</CardTitle>
          <div className="flex items-center gap-2">
            <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" /> Filter
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Date Range</h4>
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
                            format(startDate, "PP")
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
                            format(endDate, "PP")
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
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="max-h-[400px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Oil Level</TableHead>
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
                    <TableCell
                      className={
                        data.isDistanceAlert ? "text-red-500 font-bold" : ""
                      }
                    >
                      {data.distance?.toFixed(2) ?? "N/A"} CM
                    </TableCell>
                    <TableCell
                      className={
                        data.isTemperatureAlert ? "text-red-500 font-bold" : ""
                      }
                    >
                      {data.temperature?.toFixed(2) ?? "N/A"} °C
                    </TableCell>
                    <TableCell
                      className={
                        data.isHumidityAlert ? "text-red-500 font-bold" : ""
                      }
                    >
                      {data.humidity?.toFixed(2) ?? "N/A"} %
                    </TableCell>
                    <TableCell
                      className={
                        data.isDistanceAlert ||
                        data.isTemperatureAlert ||
                        data.isHumidityAlert
                          ? "text-red-500 font-bold"
                          : "text-green-500"
                      }
                    >
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
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {renderAlertTable(distanceAlerts, "Oil Level")}
        {renderAlertTable(temperatureAlerts, "Temperature")}
        {renderAlertTable(humidityAlerts, "Humidity")}
      </div>

      <Toaster />
    </div>
  );
}


const CustomizedDot = (props) => {
  const { cx, cy, payload, dataKey, lcl, ucl } = props;
  const value = payload[dataKey];
  const formattedValue = value.toFixed(2);
  const isAlert = value < lcl || value > ucl;

  return (
    <g>
      <Dot
        cx={cx}
        cy={cy}
        r={4}
        stroke={isAlert ? "red" : "#8884d8"}
        strokeWidth={2}
        fill={isAlert ? "red" : "#fff"}
      />
      <text
        x={cx}
        y={cy - 10}
        fill={isAlert ? "red" : "#8884d8"}
        textAnchor="middle"
        fontSize={10}
      >
        {formattedValue}
      </text>
    </g>
  );
};
