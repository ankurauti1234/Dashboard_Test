"use client";

import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const generateData = (startHour, endHour) => {
  const data = [];
  for (let hour = startHour; hour <= endHour + 2; hour++) {
    const time = (hour + 24) % 24;
    const baseValue = Math.sin((time / 24) * Math.PI * 2) * 50 + 50;
    const realValue =
      hour >= startHour && hour <= endHour
        ? Math.max(0, Math.floor(baseValue + Math.random() * 20 - 10))
        : null;
    const predictedValue = Math.max(
      0,
      Math.floor(baseValue + Math.random() * 30)
    );
    data.push({
      time: `${time.toString().padStart(2, "0")}:00`,
      realValue,
      predictedValue,
    });
  }
  return data;
};

export default function TransformerPredictionChart() {
  const [data, setData] = useState([]);
  const [selectedTime, setSelectedTime] = useState("Morning");

  useEffect(() => {
    const updateData = () => {
      let newData;
      switch (selectedTime) {
        case "Morning":
          newData = generateData(6, 11);
          break;
        case "Afternoon":
          newData = generateData(12, 17);
          break;
        case "Night":
          newData = generateData(18, 23);
          break;
        default:
          newData = generateData(6, 11);
      }
      setData(newData);
    };

    updateData();
    const interval = setInterval(updateData, 5000);

    return () => clearInterval(interval);
  }, [selectedTime]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          Transformer Prediction Chart
        </CardTitle>
        <div className="flex space-x-2">
          <Button
            variant={selectedTime === "Morning" ? "default" : "outline"}
            onClick={() => setSelectedTime("Morning")}
          >
            Morning
          </Button>
          <Button
            variant={selectedTime === "Afternoon" ? "default" : "outline"}
            onClick={() => setSelectedTime("Afternoon")}
          >
            Afternoon
          </Button>
          <Button
            variant={selectedTime === "Night" ? "default" : "outline"}
            onClick={() => setSelectedTime("Night")}
          >
            Night
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid />
              <XAxis
                dataKey="time"
                stroke="hsl(var(--foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Real
                            </span>
                            <span className="font-bold text-foreground">
                              {payload[1] && payload[1].value !== null
                                ? payload[1].value
                                : "N/A"}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Prediction
                            </span>
                            <span className="font-bold text-foreground">
                              {payload[0] && payload[0].value !== null
                                ? payload[0].value
                                : "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="predictedValue"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={2}
                dot={false}
                strokeDasharray="5 5"
              />
              <Line
                type="monotone"
                dataKey="realValue"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
