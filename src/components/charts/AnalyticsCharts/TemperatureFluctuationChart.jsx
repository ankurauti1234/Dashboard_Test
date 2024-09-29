"use client";
import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

const UCL = 3;
const LCL = 1;

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-300 rounded shadow">
        <p className="font-bold">{`Time: ${label}`}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value.toFixed(2)}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const calculateRanges = (data) => {
  const ranges = [];
  for (let i = 0; i < data.length; i += 5) {
    const subgroup = data.slice(i, i + 5);
    if (subgroup.length === 5) {
      const temperatures = subgroup.map((d) => d.Temperature);
      const range = Math.max(...temperatures) - Math.min(...temperatures);
      ranges.push({
        Timestamp: subgroup[0].Timestamp,
        Range: range,
      });
    }
  }
  return ranges;
};

const checkTemperatureFluctuation = (ranges) => {
  for (let i = 0; i < ranges.length - 1; i++) {
    if (ranges[i].Range >= 2 && ranges[i + 1].Range >= 1) {
      return true;
    }
  }
  return false;
};

const TemperatureFluctuationChart = ({ realData }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [ranges, setRanges] = useState([]);

  useEffect(() => {
    const calculatedRanges = calculateRanges(realData);
    setRanges(calculatedRanges);
    const alertStatus = checkTemperatureFluctuation(calculatedRanges);
    setShowAlert(alertStatus);
    if (alertStatus) {
      toast.error(
        "Alert: Combined effect of increasing temperature and decreasing conveyor speed detected!",
        {
          style: {
            background: "rgb(220, 38, 38)", // Tailwind's red-600
            color: "white",
            border: "none",
          },
        }
      );
    }
  }, [realData]);

  return (
    <>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={ranges}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Timestamp" />
          <YAxis domain={[0, UCL + 0.5]} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <ReferenceLine
            y={UCL}
            label="UCL"
            stroke="red"
            strokeDasharray="3 3"
          />
          <ReferenceLine
            y={LCL}
            label="LCL"
            stroke="red"
            strokeDasharray="3 3"
          />
          <Line
            type="monotone"
            dataKey="Range"
            stroke="#00712D"
            name="Temperature Range"
            dot={{ fill: "#00712D" }}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
      {showAlert && (
        <Alert variant="destructive" className="mt-2">
          <AlertDescription>
            Continuous temperature range increase detected!
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default TemperatureFluctuationChart;
