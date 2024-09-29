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

const checkFluctuatingPatterns = (data) => {
  for (let i = 0; i < data.length - 5; i++) {
    if (
      data[i + 1].Temperature - data[i].Temperature === 0.3 &&
      data[i + 2].Temperature - data[i + 1].Temperature === 0.3 &&
      data[i + 3].Temperature - data[i + 2].Temperature === -0.1 &&
      data[i + 4].Temperature - data[i + 3].Temperature === 0.3 &&
      data[i + 5].Temperature - data[i + 4].Temperature === 0.3
    ) {
      return true;
    }
  }
  return false;
};

const FluctuatingPatternsChart = ({ realData, predictionData }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [truncatedRealData, setTruncatedRealData] = useState([]);

  useEffect(() => {
    if (realData && realData.length > 3) {
      const truncated = realData.slice(0, -3);
      setTruncatedRealData(truncated);
      const alertStatus = checkFluctuatingPatterns(truncated);
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
    }
  }, [realData]);

  return (
    <>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart>
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
            data={truncatedRealData}
            dataKey="Temperature"
            stroke="#00712D"
            name="Real Temperature"
            dot={{ fill: "#00712D" }}
            strokeWidth={2}
          />
          <Line
            type="monotone"
            data={predictionData}
            dataKey="Temperature"
            stroke="#FFC100"
            name="Predicted Temperature"
            dot={{ fill: "#FFC100" }}
            strokeDasharray="5 5"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
      {showAlert && (
        <Alert variant="destructive" className="mt-2">
          <AlertDescription>
            Fluctuating temperature pattern detected!
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default FluctuatingPatternsChart;
