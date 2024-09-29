"use client";

import React, { useState, useEffect } from "react";
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Scatter,
} from "recharts";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

const TEMP_UCL = 210;
const TEMP_LCL = 190;
const SPEED_UCL = 1.2;
const SPEED_LCL = 0.8;

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
        {payload[0].payload.outOfUCL && (
          <p className="text-red-500 font-bold">Out of UCL!</p>
        )}
      </div>
    );
  }
  return null;
};

const checkCombinedEffect = (data) => {
  for (let i = 1; i < data.length; i++) {
    if (
      data[i].Temperature > data[i - 1].Temperature &&
      data[i].Conveyor_Speed < data[i - 1].Conveyor_Speed
    ) {
      return true;
    }
  }
  return false;
};

const CustomizedDot = (props) => {
  const { cx, cy, payload } = props;
  if (payload.outOfUCL) {
    return <circle cx={cx} cy={cy} r={4} fill="red" stroke="none" />;
  }
  return null;
};

export default function CombinedEffectChart({ realData, predictionData }) {
  const [showAlert, setShowAlert] = useState(false);
  const [truncatedRealData, setTruncatedRealData] = useState([]);

  useEffect(() => {
    if (realData && realData.length > 3) {
      const truncated = realData.slice(0, -3).map((point) => ({
        ...point,
        outOfUCL:
          point.Temperature > TEMP_UCL || point.Conveyor_Speed > SPEED_UCL,
      }));
      setTruncatedRealData(truncated);
      const alertStatus = checkCombinedEffect(truncated);
      setShowAlert(alertStatus);
      if (alertStatus) {
        toast.error(
          "Alert: Combined effect of increasing temperature and decreasing conveyor speed detected!",
          {
            style: {
              background: "rgb(220, 38, 38)",
              color: "white",
              border: "none",
            },
          }
        );
      }
    }
  }, [realData]);

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Timestamp" />
          <YAxis
            yAxisId="left"
            orientation="left"
            stroke="#8884d8"
            domain={[TEMP_LCL - 10, TEMP_UCL + 10]}
            label={{
              value: "Temperature (°C)",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#82ca9d"
            domain={[SPEED_LCL - 0.1, SPEED_UCL + 0.1]}
            label={{
              value: "Conveyor Speed",
              angle: 90,
              position: "insideRight",
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <ReferenceLine
            yAxisId="left"
            y={TEMP_UCL}
            label={{ value: "TEMP_UCL", position: "insideTopLeft" }}
            stroke="red"
            strokeDasharray="3 3"
          />
          <ReferenceLine
            yAxisId="left"
            y={TEMP_LCL}
            label={{ value: "TEMP_LCL", position: "insideBottomLeft" }}
            stroke="red"
            strokeDasharray="3 3"
          />
          <ReferenceLine
            yAxisId="right"
            y={SPEED_UCL}
            label={{ value: "SPEED_UCL", position: "insideTopRight" }}
            stroke="red"
            strokeDasharray="3 3"
          />
          <ReferenceLine
            yAxisId="right"
            y={SPEED_LCL}
            label={{ value: "SPEED_LCL", position: "insideBottomRight" }}
            stroke="red"
            strokeDasharray="3 3"
          />
          <Line
            yAxisId="left"
            type="monotone"
            data={truncatedRealData}
            dataKey="Temperature"
            stroke="#00712D"
            name="Real Temperature"
            strokeWidth={2}
            dot={<CustomizedDot />}
          />
          <Line
            yAxisId="left"
            type="monotone"
            data={predictionData}
            dataKey="Temperature"
            stroke="#FFC100"
            name="Predicted Temperature"
            strokeWidth={2}
            strokeDasharray="5 5"
          />
          <Line
            yAxisId="right"
            type="monotone"
            data={truncatedRealData}
            dataKey="Conveyor_Speed"
            stroke="#3ed321"
            name="Real Conveyor Speed"
            strokeWidth={2}
            dot={<CustomizedDot />}
          />
          <Line
            yAxisId="right"
            type="monotone"
            data={predictionData}
            dataKey="Conveyor_Speed"
            stroke="#FF885B"
            name="Predicted Conveyor Speed"
            strokeDasharray="5 5"
            strokeWidth={2}
          />
          <Scatter
            yAxisId="left"
            data={truncatedRealData.filter((d) => d.outOfUCL)}
            fill="red"
          />
        </ComposedChart>
      </ResponsiveContainer>
      {showAlert && (
        <Alert variant="destructive" className="mt-2">
          <AlertDescription>
            Combined effect of increasing temperature and decreasing conveyor
            speed detected!
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
