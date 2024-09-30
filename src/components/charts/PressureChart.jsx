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

const PressureChart = ({ device }) => {
  const [data, setData] = useState([
    { Timestamp: new Date().getTime(), Pressure: 0 },
  ]);
  const [index, setIndex] = useState(0);

  const pressureUCL = 100; // Upper Control Limit for pressure
  const pressureLCL = 0; // Lower Control Limit for pressure
  const averagePressure = (pressureUCL + pressureLCL) / 2;

  // Function to round to two decimal places
  const roundToTwoDecimals = (num) => {
    return Math.round((num + Number.EPSILON) * 100) / 100;
  };

  // Generate initial data
  useEffect(() => {
    const initialData = Array(20)
      .fill(0)
      .map((_, i) => ({
        Timestamp: new Date().getTime() - i * 5000,
        Pressure: roundToTwoDecimals(
          Math.random() * (pressureUCL - pressureLCL) + pressureLCL
        ),
      }));
    setData(initialData);
  }, []);

  // Set up interval to generate new data every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const lastPressure = data[data.length - 1].Pressure;
      let newPressure;

      // Randomly increase or decrease pressure by a small amount
      if (Math.random() < 0.5) {
        // Increase pressure by 0.25 to 0.56
        newPressure = roundToTwoDecimals(
          lastPressure + Math.random() * (0.56 - 0.25) + 0.25
        );
      } else {
        // Decrease pressure by 0.15 to 0.25
        newPressure = roundToTwoDecimals(
          lastPressure - Math.random() * (5 - 50) - 0.15
        );
      }

      // Ensure new pressure is within bounds
        newPressure = Math.max(pressureLCL, Math.min(newPressure, pressureUCL));
        

      const newDataPoint = {
        Timestamp: new Date().getTime(),
        Pressure: newPressure,
      };

      // Update state with new data point
      setData((prevData) => {
        const newData = [...prevData.slice(1), newDataPoint]; // Keep last 20 data points
        return newData;
      });

      // Check for out-of-control points
      if (
        newDataPoint.Pressure > pressureUCL ||
        newDataPoint.Pressure < pressureLCL
      ) {
        toast.warning(`Pressure out of control: ${newDataPoint.Pressure} Pa`, {
          description: `Time: ${new Date(
            newDataPoint.Timestamp
          ).toLocaleTimeString()}`,
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [pressureUCL, pressureLCL]);

  return (
    <Card className="w-full bg-white">
      <CardHeader>
        <CardTitle>Pressure </CardTitle>
      </CardHeader>
      <CardContent className="w-full p-2">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%" className="">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="Timestamp"
                tickFormatter={(unixTime) =>
                  new Date(unixTime).toLocaleTimeString()
                }
                label={{ value: "Time", position: "bottom" }}
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis
                label={{
                  value: "Pressure (Pa)",
                  angle: -90,
                  position: "insideLeft",
                }}
                domain={[
                  Math.min(
                    pressureLCL - 20,
                    Math.floor(Math.min(...data.map((d) => d.Pressure)))
                  ),
                  Math.max(
                    pressureUCL + 20,
                    Math.ceil(Math.max(...data.map((d) => d.Pressure)))
                  ),
                ]}
              />
              <Tooltip
                content={({ payload, label }) => {
                  if (payload && payload.length > 0) {
                    return (
                      <div className="bg-popover border p-3 rounded-lg">
                        <p>{`Time: ${new Date(label).toLocaleTimeString()}`}</p>
                        <p>{`Pressure: ${payload[0].value} Pa`}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="Pressure"
                stroke="#8884d8"
                strokeWidth={2}
                dot={(props) => {
                  const { cx, cy, payload } = props;
                  if (
                    payload.Pressure > pressureUCL ||
                    payload.Pressure < pressureLCL
                  ) {
                    return (
                      <g>
                        <circle cx={cx} cy={cy} r={6} fill="red" />
                        <text
                          x={cx}
                          y={cy - 15}
                          textAnchor="middle"
                          fill="white"
                          fontSize={12}
                          fontWeight="bold"
                        >
                          {payload.Pressure}
                        </text>
                      </g>
                    );
                  }
                  return (
                    <g>
                      <circle cx={cx} cy={cy} r={4} fill="#8884d8" />
                      <text
                        x={cx}
                        y={cy - 15}
                        textAnchor="middle"
                        fill="#8884d8"
                        fontSize={12}
                        fontWeight="bold"
                      >
                        {payload.Pressure}
                      </text>
                    </g>
                  );
                }}
              />
              <ReferenceLine
                y={averagePressure}
                stroke="green"
                strokeDasharray="3 3"
                label={{ value: "Mean", position: "insideTopLeft" }}
              />
              <ReferenceLine
                y={pressureUCL}
                stroke="red"
                strokeDasharray="3 3"
                label={{ value: "UCL", position: "insideTopLeft" }}
              />
              <ReferenceLine
                y={pressureLCL}
                stroke="red"
                strokeDasharray="3 3"
                label={{ value: "LCL", position: "insideBottomLeft" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PressureChart;
