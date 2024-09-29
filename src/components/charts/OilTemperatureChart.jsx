import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

// Mock data generator for demonstration purposes
const generateData = (time) => ({
  time,
  realTemp: Math.random() * 20 + 60, // Random temperature between 60 and 80
});

export default function OilTemperatureChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Initial data
    const initialData = Array.from({ length: 15 }, (_, i) => generateData(i));
    setData(initialData);

    // Update data every second
    const interval = setInterval(() => {
      setData((prevData) => {
        const newRealData = generateData(prevData.length);
        const newData = [...prevData.slice(1), newRealData];

        // Update predicted temperatures (5 points ahead)
        newData.forEach((point, index) => {
          if (index < newData.length - 5) {
            point.predictedTemp = newData[index + 5].realTemp;
          }
        });

        return newData;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Oil Temperature Monitoring</h2>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            label={{
              value: "Time (seconds)",
              position: "insideBottomRight",
              offset: -10,
            }}
          />
          <YAxis
            label={{
              value: "Temperature (°C)",
              angle: -90,
              position: "insideLeft",
            }}
            domain={[50, 100]}
          />
          <Tooltip />
          <Legend />
          <ReferenceLine
            y={80}
            label="Upper Control Limit (80°C)"
            stroke="orange"
            strokeDasharray="3 3"
          />
          <ReferenceLine
            y={90}
            label="Upper Limit (90°C)"
            stroke="red"
            strokeDasharray="3 3"
          />
          <Area
            type="monotone"
            dataKey="realTemp"
            stroke="#0000FF"
            fill="#0000FF"
            fillOpacity={0.3}
            name="Real Temperature"
            dot={{ stroke: "#0000FF", strokeWidth: 2 }}
          />
          <Area
            type="monotone"
            dataKey="predictedTemp"
            stroke="#FF0000"
            fill="#FF0000"
            fillOpacity={0.3}
            name="Predicted Temperature"
            dot={{ stroke: "#FF0000", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
