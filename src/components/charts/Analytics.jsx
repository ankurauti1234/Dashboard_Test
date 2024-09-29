"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import ChartContainer from "./AnalyticsCharts/ChartContainer";
import MeanTemperatureShiftChart from "./AnalyticsCharts/MeanTemperatureShiftChart";
import TemperatureFluctuationChart from "./AnalyticsCharts/TemperatureFluctuationChart";
import GradualIncreaseChart from "./AnalyticsCharts/GradualIncreaseChart";
import FluctuatingPatternsChart from "./AnalyticsCharts/FluctuatingPatternsChart";
import CombinedEffectChart from "./AnalyticsCharts/CombinedEffectChart";
import { Card } from "../ui/card";

export default function ManufacturingDashboard() {
  const [realData, setRealData] = useState([]);
  const [predictionData, setPredictionData] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://apmapis.webdevava.live/api/data?limit=20"
      );
      const result = await response.json();
      setRealData(
        result.realData
          .map((item) => ({
            ...item,
            Timestamp: new Date(item.Timestamp).toLocaleTimeString(),
          }))
          .reverse()
      );
      setPredictionData(
        result.predictionData
          .map((item) => ({
            ...item,
            Timestamp: new Date(item.Timestamp).toLocaleTimeString(),
          }))
          .reverse()
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleGenerate = async () => {
    try {
      await fetch("https://apmapis.webdevava.live/api/data/generate", {
        method: "POST",
      });
      setIsGenerating(true);
      toast.success(
        "Data generation started for both prediction and real-time data"
      );
    } catch (error) {
      console.error("Error starting data generation:", error);
      toast.error("Failed to start data generation");
    }
  };

  return (
    <div className="bg-transparent bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-10 shadow-inner shadow-accent/50 border  rounded-lg  p-4">
      <h1 className="text-2xl font-bold mb-4">Temperature Data Dashboard</h1>
      <div className="flex space-x-4 mb-4">
        <Button onClick={handleGenerate} disabled={isGenerating}>
          {isGenerating ? "Generating Data..." : "Generate Data"}
        </Button>
      </div>
      <Card className="flex bg-transparent flex-col p-2 gap-8">
        <ChartContainer title="Mean Temperature Shift (X-bar Chart)">
          <MeanTemperatureShiftChart
            realData={realData}
            predictionData={predictionData}
          />
        </ChartContainer>
        <ChartContainer title="Temperature Fluctuation (R Chart)">
          <TemperatureFluctuationChart
            realData={realData}
            predictionData={predictionData}
          />
        </ChartContainer>
        <ChartContainer title="Gradual Increase (CUSUM Chart)">
          <GradualIncreaseChart
            realData={realData}
            predictionData={predictionData}
          />
        </ChartContainer>
        <ChartContainer title="Fluctuating Patterns (EWMA Chart)">
          <FluctuatingPatternsChart
            realData={realData}
            predictionData={predictionData}
          />
        </ChartContainer>
        <ChartContainer title="Combined Effect Chart">
          <CombinedEffectChart
            realData={realData}
            predictionData={predictionData}
          />
        </ChartContainer>
      </Card>
    </div>
  );
}
