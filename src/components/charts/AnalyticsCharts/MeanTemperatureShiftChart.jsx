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

const UCL = 210;
const LCL = 190;

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-300 rounded shadow">
        <p className="font-bold">{`Time: ${label}`}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const checkMeanTemperatureShift = (data) => {
  let consecutiveIncrease = 0;
  let consecutiveDecrease = 0;
  for (let i = 1; i < data.length; i++) {
    if (data[i].Temperature > data[i - 1].Temperature) {
      consecutiveIncrease++;
      consecutiveDecrease = 0;
      if (consecutiveIncrease >= 8) return true;
    } else if (data[i].Temperature < data[i - 1].Temperature) {
      consecutiveDecrease++;
      consecutiveIncrease = 0;
      if (consecutiveDecrease >= 6) return true;
    } else {
      consecutiveIncrease = 0;
      consecutiveDecrease = 0;
    }
  }
  return false;
};

const parseTimestamp = (timestamp) => {
  if (typeof timestamp === "number") {
    return new Date(timestamp);
  }
  if (typeof timestamp === "string") {
    const parsedDate = new Date(timestamp);
    return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
  }
  return new Date();
};

const MeanTemperatureShiftChart = ({ realData, predictionData }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [combinedData, setCombinedData] = useState([]);

  useEffect(() => {
    if (!realData || realData.length === 0) {
      console.warn("No real data available");
      return;
    }

    const truncatedRealData = realData.slice(0, -3); // Remove last 3 points from realData
    const alertStatus = checkMeanTemperatureShift(truncatedRealData);
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

    // Shift prediction data 5 points ahead
    const shiftedPredictionData = predictionData.map((item, index) => ({
      ...item,
      Timestamp:
        truncatedRealData[Math.min(index + 5, truncatedRealData.length - 1)]
          ?.Timestamp || item.Timestamp,
      PredictedTemperature: item.Temperature,
    }));

    // Combine truncated real and shifted prediction data
    const combined = truncatedRealData.map((realItem, index) => ({
      ...realItem,
      PredictedTemperature:
        shiftedPredictionData[Math.max(0, index - 5)]?.PredictedTemperature ||
        null,
    }));

    // Add the last 3 prediction points
    if (truncatedRealData.length > 0) {
      const lastRealTimestamp = parseTimestamp(
        truncatedRealData[truncatedRealData.length - 1].Timestamp
      );
      for (let i = 1; i <= 3; i++) {
        const newTimestamp = new Date(lastRealTimestamp.getTime() + i * 1000); // Assuming 1-second intervals
        combined.push({
          Timestamp: newTimestamp.toISOString(),
          Temperature: null,
          PredictedTemperature:
            shiftedPredictionData[truncatedRealData.length - 5 + i]
              ?.PredictedTemperature || null,
        });
      }
    }

    setCombinedData(combined);
  }, [realData, predictionData]);

  if (combinedData.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={combinedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Timestamp" />
          <YAxis domain={[LCL - 10, UCL + 10]} />
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
            dataKey="Temperature"
            stroke="#00712D"
            name="Real Temperature"
            dot={{ fill: "#00712D" }}
            isAnimationActive={false}
            connectNulls={true}
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="PredictedTemperature"
            stroke="#FFC100"
            name="Predicted Temperature"
            dot={{ fill: "#FFC100" }}
            strokeDasharray="5 5"
            isAnimationActive={false}
            connectNulls={true}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
      {showAlert && (
        <Alert variant="destructive" className="mt-2">
          <AlertDescription>
            Significant mean temperature shift detected!
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default MeanTemperatureShiftChart;
