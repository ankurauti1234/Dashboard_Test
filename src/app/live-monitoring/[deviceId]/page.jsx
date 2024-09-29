"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation"; // Import useParams
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import MainLayout from "@/components/layouts/MainLayout";
import BarChart from "@/components/charts/BarChart"; // Placeholder for your bar chart component
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const DevicePage = () => {
  const { deviceId } = useParams(); // Use useParams to get deviceId
  const [logoData, setLogoData] = useState([]);
  const [audioData, setAudioData] = useState([]);
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  useEffect(() => {
    console.log("Device ID:", deviceId); // Log the deviceId
    if (deviceId) {
      // Replace with your data fetching logic
      setLogoData([
        { ts: "2023-01-01", logoDetection: "NBC", confidence: 0.95 },
        { ts: "2023-01-01", logoDetection: "NBC", confidence: 0.65 },
        { ts: "2023-01-01", logoDetection: "NBC", confidence: 0.72 },
        { ts: "2023-01-01", logoDetection: "NBC", confidence: 0.85 },
        { ts: "2023-01-01", logoDetection: "NBC", confidence: 0.68 },
        { ts: "2023-01-01", logoDetection: "NBC", confidence: 0.95 },
        { ts: "2023-01-01", logoDetection: "NBC", confidence: 0.97 },
        { ts: "2023-01-01", logoDetection: "NBC", confidence: 0.75 },
        { ts: "2023-01-01", logoDetection: "NBC", confidence: 0.59 },
        { ts: "2023-01-01", logoDetection: "NBC", confidence: 0.88 },
      ]);
      setAudioData([
        { ts: "2023-01-01", audioDetection: "ABC", confidence: 0.7 },
        { ts: "2023-01-01", audioDetection: "ABC", confidence: 0.97 },
        { ts: "2023-01-01", audioDetection: "ABC", confidence: 0.8 },
        { ts: "2023-01-01", audioDetection: "ABC", confidence: 0.56 },
        { ts: "2023-01-01", audioDetection: "ABC", confidence: 0.76 },
        { ts: "2023-01-01", audioDetection: "ABC", confidence: 0.98 },
        { ts: "2023-01-01", audioDetection: "ABC", confidence: 0.69 },
        { ts: "2023-01-01", audioDetection: "ABC", confidence: 0.9 },
        { ts: "2023-01-01", audioDetection: "ABC", confidence: 0.86 },
      ]);
    }
  }, [deviceId]);

  return (
    <MainLayout>
      <div className="flex flex-col gap-4 ">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleGoBack}
            className="mr-4 w-fit"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Device ID: {deviceId}</h1>
        </div>
        <div className="flex gap-4">
          <div className="w-1/2 bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-10 shadow-inner shadow-accent/50 border p-2 rounded-lg ">
            <h1 className="text-xl font-medium mb-2">Logo Detection Output</h1>

            <div className="max-h-[40vh] w-full overflow-hidden bg-card rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow className="flex w-full justify-between items-center ">
                    <TableHead className="pt-4 m-0">Timestamp</TableHead>
                    <TableHead className="pt-4 m-0">Logo Detection</TableHead>
                    <TableHead className="pt-4 m-0">Confidence</TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
              <ScrollArea className="max-h-[40vh] overflow-y-auto">
                <Table>
                  <TableBody>
                    {logoData.map((item, index) => (
                      <TableRow
                        key={index}
                        className="flex w-full justify-between items-center"
                      >
                        <TableCell>{item.ts}</TableCell>
                        <TableCell>{item.logoDetection}</TableCell>
                        <TableCell>{item.confidence}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          </div>
          <div className="w-1/2 bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-10 shadow-inner shadow-accent/50 border p-2 rounded-lg">
            <h1 className="text-xl font-medium mb-2">Audio Detection Output</h1>
            <div className="max-h-[40vh] w-full overflow-hidden bg-card rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow className="flex w-full justify-between items-center">
                    <TableHead className="pt-4 m-0">Timestamp</TableHead>
                    <TableHead className="pt-4 m-0">Audio Detection</TableHead>
                    <TableHead className="pt-4 m-0">Confidence</TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
              <ScrollArea className="max-h-[40vh] overflow-y-auto">
                <Table>
                  <TableBody>
                    {audioData.map((item, index) => (
                      <TableRow
                        key={index}
                        className="flex w-full justify-between items-center"
                      >
                        <TableCell>{item.ts}</TableCell>
                        <TableCell>{item.audioDetection}</TableCell>
                        <TableCell>{item.confidence}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          </div>
        </div>
        <BarChart logoData={logoData} audioData={audioData} />
      </div>
    </MainLayout>
  );
};

export default DevicePage;
