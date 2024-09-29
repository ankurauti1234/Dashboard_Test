"use client";

import {
  Bar,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  ComposedChart,
  Area,
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BarChart({ logoData, audioData }) {
  const [filter, setFilter] = useState("all");

  // Combine and process the data
  const chartData = logoData.map((logo, index) => {
    const audioConfidence = audioData[index]?.confidence || 0;
    const averageConfidence = (logo.confidence + audioConfidence) / 2;
    return {
      timestamp: new Date(logo.ts).toLocaleTimeString(),
      logoConfidence: logo.confidence,
      audioConfidence: audioConfidence,
      averageConfidence: averageConfidence,
    };
  });

  // Filter chart data based on selected option
  const filteredData = chartData.map((data) => {
    return {
      ...data,
      logoConfidence:
        filter === "audio" || filter === "average" ? 0 : data.logoConfidence,
      audioConfidence:
        filter === "logo" || filter === "average" ? 0 : data.audioConfidence,
      averageConfidence:
        filter === "logo" || filter === "audio" ? 0 : data.averageConfidence,
    };
  });

  return (
    <div className="flex flex-col bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-10 shadow-inner shadow-accent/50 border p-2 rounded-lg">
      <Select value={filter} onValueChange={setFilter}>
        <SelectTrigger className="w-[180px] mb-2">
          <SelectValue placeholder="Select filter" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="logo">Logo</SelectItem>
          <SelectItem value="audio">Audio</SelectItem>
          <SelectItem value="average">Average Confidence</SelectItem>
        </SelectContent>
      </Select>
      <ChartContainer
        config={{
          logoConfidence: {
            label: "Logo Confidence",
            color: "hsl(var(--chart-1))",
          },
          audioConfidence: {
            label: "Audio Confidence",
            color: "hsl(var(--chart-2))",
          },
          averageConfidence: {
            label: "Average Confidence",
            color: "hsl(var(--chart-3))",
          },
        }}
        className="max-h-[40vh] w-full bg-card border rounded-lg pt-4 "
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={filteredData}>
            <XAxis
              dataKey="timestamp"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value * 100}%`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        {filter !== "audio" && filter !== "average" && (
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Logo
                            </span>
                            <span className="font-bold text-muted-foreground">
                              {(payload[0]?.value * 100).toFixed(2)}%
                            </span>
                          </div>
                        )}
                        {filter !== "logo" && filter !== "average" && (
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Audio
                            </span>
                            <span className="font-bold text-muted-foreground">
                              {(
                                payload[filter === "audio" ? 0 : 1]?.value * 100
                              ).toFixed(2)}
                              %
                            </span>
                          </div>
                        )}
                        {(filter === "all" || filter === "average") && (
                          <div className="flex flex-col col-span-2">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Average
                            </span>
                            <span className="font-bold text-muted-foreground">
                              {(
                                payload[filter === "average" ? 0 : 2]?.value *
                                100
                              ).toFixed(2)}
                              %
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            {filter !== "audio" && filter !== "average" && (
              <Bar
                dataKey="logoConfidence"
                fill="var(--color-logoConfidence)"
                radius={[4, 4, 0, 0]}
              />
            )}
            {filter !== "logo" && filter !== "average" && (
              <Bar
                dataKey="audioConfidence"
                fill="var(--color-audioConfidence)"
                radius={[4, 4, 0, 0]}
              />
            )}
            {filter === "all" && (
              <Line
                type="monotone"
                dataKey="averageConfidence"
                stroke="var(--color-averageConfidence)"
                strokeWidth={4}
                dot={true}
              />
            )}
            {filter === "average" && (
              <Area
                type="monotone"
                dataKey="averageConfidence"
                fill="var(--color-averageConfidence)"
                stroke="var(--color-averageConfidence)"
                fillOpacity={0.3}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
