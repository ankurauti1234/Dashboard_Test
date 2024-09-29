"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Scatter,
  Legend,
} from "recharts";
import { AlertTriangle } from "lucide-react";
import { spcData } from "../../data/AnalyticalData";

export default function Analytics2() {
  const [timeRange, setTimeRange] = useState("1h");
  const [dataPoints, setDataPoints] = useState("all");
  const [chartData, setChartData] = useState(spcData);

  useEffect(() => {
    const now = Date.now();
    let filteredData = spcData.filter((d) => {
      const timeDiff = now - d.Timestamp;
      switch (timeRange) {
        case "1h":
          return timeDiff <= 3600000;
        case "6h":
          return timeDiff <= 21600000;
        case "24h":
          return timeDiff <= 86400000;
        default:
          return true;
      }
    });

    if (dataPoints !== "all") {
      if (dataPoints.startsWith("last")) {
        const numPoints = parseInt(dataPoints.split(" ")[1]);
        filteredData = filteredData.slice(-numPoints);
      } else if (dataPoints.startsWith("first")) {
        const numPoints = parseInt(dataPoints.split(" ")[1]);
        filteredData = filteredData.slice(0, numPoints);
      }
    }

    setChartData(filteredData);
  }, [timeRange, dataPoints]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded shadow">
          <p>{`Time: ${new Date(label).toLocaleString()}`}</p>
          {payload[0] && (
            <p>{`${payload[0].name}: ${payload[0].value.toFixed(2)}${
              payload[0].name === "Temperature" ? "°C" : " units/min"
            }`}</p>
          )}
          {payload[1] && (
            <p>{`${payload[1].name}: ${payload[1].value.toFixed(2)}${
              payload[1].name === "Temperature" ? "°C" : " units/min"
            }`}</p>
          )}
          <p>{`Defective: ${payload[0].payload.Defective ? "Yes" : "No"}`}</p>
          <p>{`Error Type: ${payload[0].payload.Error_Type}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Statistical Process Control Chart
        </CardTitle>
        <div className="flex justify-between items-center">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last 1 hour</SelectItem>
              <SelectItem value="6h">Last 6 hours</SelectItem>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="all">All data</SelectItem>
            </SelectContent>
          </Select>
          <Select value={dataPoints} onValueChange={setDataPoints}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select data points" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="last 10">Last 10</SelectItem>
              <SelectItem value="last 20">Last 20</SelectItem>
              <SelectItem value="last 50">Last 50</SelectItem>
              <SelectItem value="last 100">Last 100</SelectItem>
              <SelectItem value="first 10">First 10</SelectItem>
              <SelectItem value="first 20">First 20</SelectItem>
              <SelectItem value="first 50">First 50</SelectItem>
              <SelectItem value="first 100">First 100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-6">
          <div className="w-full h-[400px]">
            <h3 className="text-xl font-semibold mb-2">Mean Temperature</h3>
            <LineChart
              width={800}
              height={400}
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="Timestamp"
                tickFormatter={(timestamp) =>
                  new Date(timestamp).toLocaleTimeString()
                }
              />
              <YAxis domain={[100, 200]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="Mean_Temperature"
                stroke="#8884d8"
                dot={false}
                name="Temperature"
              />
              <ReferenceLine
                y={180}
                label="UCL"
                stroke="red"
                strokeDasharray="3 3"
              />
              <ReferenceLine
                y={120}
                label="LCL"
                stroke="red"
                strokeDasharray="3 3"
              />
              <Scatter
                data={chartData.filter((d) => d.Defective === 1)}
                fill="red"
                shape={<AlertTriangle size={20} />}
              />
            </LineChart>
          </div>
          <div className="w-full h-[400px]">
            <h3 className="text-xl font-semibold mb-2">Conveyor Speed</h3>
            <LineChart
              width={800}
              height={400}
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="Timestamp"
                tickFormatter={(timestamp) =>
                  new Date(timestamp).toLocaleTimeString()
                }
              />
              <YAxis domain={[0, 200]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="Conveyor_Speed"
                stroke="#82ca9d"
                dot={false}
                name="Conveyor Speed"
              />
            </LineChart>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
