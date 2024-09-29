"use client";
import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const SPC = ({ device }) => {
  const [data, setData] = useState([]);
  const [index, setIndex] = useState(0);

  const temperatureUCL = 30;
  const temperatureLCL = 10;
  const averageTemperature = (temperatureUCL + temperatureLCL) / 2;

  const humidityUCL = 80;
  const humidityLCL = 20;
  const averageHumidity = (humidityUCL + humidityLCL) / 2;

  // Fetch initial data from API
  useEffect(() => {
    const fetchInitialData = async () => {
      const response = await fetch(
        "https://apmapis.webdevava.live/api/sensor/live"
      );
      const jsonData = await response.json();
      const formattedData = jsonData.data.map((item) => ({
        Timestamp: item.timestamp,
        Temperature: item.temperature,
        Humidity: item.humidity,
      }));
      setData(formattedData);
    };
    fetchInitialData();
  }, []);

  // Set up interval to fetch new data every 5 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      const response = await fetch(
        "https://apmapis.webdevava.live/api/sensor/live"
      );
      const jsonData = await response.json();
      const newDataPoint = jsonData.data; // Assuming the latest data is the first item
      const newFormattedData = {
        Timestamp: newDataPoint.timestamp,
        Temperature: newDataPoint.temperature,
        Humidity: newDataPoint.humidity,
      };

      // Update state with new data point
      setData((prevData) => {
        const newData = [...prevData.slice(1), newFormattedData]; // Keep last 60 data points (5 minutes)
        return newData;
      });

      // Check for out-of-control points
      if (
        newFormattedData.Temperature > temperatureUCL ||
        newFormattedData.Temperature < temperatureLCL
      ) {
        toast.warning(
          `Temperature out of control: ${newFormattedData.Temperature.toFixed(
            2
          )}°C`,
          {
            description: `Time: ${newFormattedData.Timestamp}`,
          }
        );
      }
      if (
        newFormattedData.Humidity > humidityUCL ||
        newFormattedData.Humidity < humidityLCL
      ) {
        toast.warning(
          `Humidity out of control: ${newFormattedData.Humidity.toFixed(2)}%`,
          {
            description: `Time: ${newFormattedData.Timestamp}`,
          }
        );
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [temperatureUCL, temperatureLCL, humidityUCL, humidityLCL]);

  return (
    <Card className="bg-transparent mt-4 border-0">
      {device && (
        <CardHeader className="px-4 py-0">
          <CardTitle className="text-lg">{device}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="flex flex-col md:flex-row gap-4 p-4">
        <Card className="w-full bg-white">
          <CardHeader className="px-4 py-2 border-b">
            <CardTitle className="text-lg">Temperature Over Time</CardTitle>
          </CardHeader>
          <CardContent className="w-full p-2">
            <ResponsiveContainer
              width="100%"
              height={400}
              className="border rounded-lg pt-4"
            >
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="Timestamp"
                  label={{ value: "Time", position: "bottom" }}
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  label={{
                    value: "Temperature (°C)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                  domain={[
                    Math.min(
                      temperatureLCL - 20,
                      Math.floor(Math.min(...data.map((d) => d.Temperature)))
                    ),
                    Math.max(
                      temperatureUCL + 20,
                      Math.ceil(Math.max(...data.map((d) => d.Temperature)))
                    ),
                  ]}
                />
                <Tooltip
                  content={({ payload, label }) => {
                    if (payload && payload.length > 0) {
                      return (
                        <div className="bg-popover border p-3 rounded-lg">
                          <p>{`Time: ${label}`}</p>
                          <p>{`Temperature: ${payload[0].value.toFixed(
                            2
                          )} °C`}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="Temperature"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={(props) => {
                    const { cx, cy, payload } = props;
                    if (
                      payload.Temperature > temperatureUCL ||
                      payload.Temperature < temperatureLCL
                    ) {
                      return (
                        <g>
                          <circle cx={cx} cy={cy} r={6} fill="red" />{" "}
                          <text
                            x={cx}
                            y={cy - 15} // Adjust vertical position as needed
                            textAnchor="middle"
                            fill="white"
                            fontSize={12}
                            fontWeight="bold"
                          >
                            {payload.Temperature.toFixed(2)}
                          </text>
                        </g>
                      );
                    }
                    return (
                      <g>
                        <circle cx={cx} cy={cy} r={4} fill="#8884d8" />
                        <text
                          x={cx}
                          y={cy - 15} // Adjust vertical position as needed
                          textAnchor="middle"
                          fill="#8884d8"
                          fontSize={12}
                          fontWeight="bold"
                        >
                          {payload.Temperature.toFixed(2)}
                        </text>
                      </g>
                    );
                  }}
                />
                <ReferenceLine
                  y={averageTemperature}
                  stroke="green"
                  strokeDasharray="3 3"
                  label={{ value: "Mean", position: "insideTopLeft" }}
                />
                <ReferenceLine
                  y={temperatureUCL}
                  stroke="red"
                  strokeDasharray="3 3"
                  label={{ value: "UCL", position: "insideTopLeft" }}
                />
                <ReferenceLine
                  y={temperatureLCL}
                  stroke="red"
                  strokeDasharray="3 3"
                  label={{ value: "LCL", position: "insideBottomLeft" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="w-full bg-white">
          <CardHeader className="px-4 py-2 border-b">
            <CardTitle className="text-lg">Humidity Over Time</CardTitle>
          </CardHeader>
          <CardContent className="w-full p-2">
            <ResponsiveContainer
              width="100%"
              height={400}
              className="border rounded-lg pt-4"
            >
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="Timestamp"
                  label={{ value: "Time", position: "bottom" }}
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  label={{
                    value: "Humidity (%)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                  domain={[0, 100]}
                />
                <Tooltip
                  content={({ payload, label }) => {
                    if (payload && payload.length > 0) {
                      return (
                        <div className="bg-popover border p-3 rounded-lg">
                          <p>{`Time: ${label}`}</p>
                          <p>{`Humidity: ${payload[0].value.toFixed(2)} %`}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="Humidity"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  dot={(props) => {
                    const { cx, cy, payload } = props;
                    if (
                      payload.Humidity > humidityUCL ||
                      payload.Humidity < humidityLCL
                    ) {
                      return (
                        <g>
                          <circle cx={cx} cy={cy} r={6} fill="red" />
                          <text
                            x={cx}
                            y={cy - 15} // Adjust vertical position as needed
                            textAnchor="middle"
                            fill="white"
                            fontSize={12}
                            fontWeight="bold"
                          >
                            {payload.Humidity.toFixed(2)}
                          </text>
                        </g>
                      );
                    }
                    return (
                      <g>
                        <circle cx={cx} cy={cy} r={4} fill="#82ca9d" />
                        <text
                          x={cx}
                          y={cy - 15} // Adjust vertical position as needed
                          textAnchor="middle"
                          fill="#82ca9d"
                          fontSize={12}
                          fontWeight="bold"
                        >
                          {payload.Humidity.toFixed(2)}
                        </text>
                      </g>
                    );
                  }}
                />
                <ReferenceLine
                  y={averageHumidity}
                  stroke="green"
                  strokeDasharray="3 3"
                  label={{ value: "Mean", position: "insideTopLeft" }}
                />
                <ReferenceLine
                  y={humidityUCL}
                  stroke="red"
                  strokeDasharray="3 3"
                  label={{ value: "UCL", position: "insideTopLeft" }}
                />
                <ReferenceLine
                  y={humidityLCL}
                  stroke="red"
                  strokeDasharray="3 3"
                  label={{ value: "LCL", position: "insideBottomLeft" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default SPC;
