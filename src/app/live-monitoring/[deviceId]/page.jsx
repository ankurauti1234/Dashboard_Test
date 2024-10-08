"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import MainLayout from "@/components/layouts/MainLayout";
import BarChart from "@/components/charts/BarChart";
import { ArrowLeft, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DevicePage = () => {
  const { deviceId } = useParams();
  const [logoData, setLogoData] = useState([]);
  const [audioData, setAudioData] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = (data) => {
    if (!sortConfig.key) return data;
    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  };

  useEffect(() => {
    console.log("Device ID:", deviceId);
    if (deviceId) {
      // Replace with your data fetching logic
      setLogoData([
        {
          ts: "2023-01-01 09:00:00",
          logoDetection: "NBC",
          confidence: 0.95,
          logoId: "12345",
        },
        {
          ts: "2023-01-01 09:05:00",
          logoDetection: "CBS",
          confidence: 0.65,
          logoId: "23456",
        },
        {
          ts: "2023-01-01 09:10:00",
          logoDetection: "ABC",
          confidence: 0.72,
          logoId: "34567",
        },
        {
          ts: "2023-01-01 09:15:00",
          logoDetection: "FOX",
          confidence: 0.85,
          logoId: "45678",
        },
        {
          ts: "2023-01-01 09:20:00",
          logoDetection: "CNN",
          confidence: 0.68,
          logoId: "56789",
        },
        {
          ts: "2023-01-01 09:25:00",
          logoDetection: "NBC",
          confidence: 0.91,
          logoId: "12345",
        },
        {
          ts: "2023-01-01 09:30:00",
          logoDetection: "CBS",
          confidence: 0.78,
          logoId: "23456",
        },
        {
          ts: "2023-01-01 09:35:00",
          logoDetection: "ABC",
          confidence: 0.83,
          logoId: "34567",
        },
        {
          ts: "2023-01-01 09:40:00",
          logoDetection: "FOX",
          confidence: 0.79,
          logoId: "45678",
        },
        {
          ts: "2023-01-01 09:45:00",
          logoDetection: "CNN",
          confidence: 0.88,
          logoId: "56789",
        },
      ]);
      setAudioData([
        {
          ts: "2023-01-01 09:00:00",
          audioDetection: "ABC",
          confidence: 0.7,
          audioId: "67890",
        },
        {
          ts: "2023-01-01 09:05:00",
          audioDetection: "NBC",
          confidence: 0.97,
          audioId: "78901",
        },
        {
          ts: "2023-01-01 09:10:00",
          audioDetection: "CBS",
          confidence: 0.8,
          audioId: "89012",
        },
        {
          ts: "2023-01-01 09:15:00",
          audioDetection: "FOX",
          confidence: 0.56,
          audioId: "90123",
        },
        {
          ts: "2023-01-01 09:20:00",
          audioDetection: "CNN",
          confidence: 0.76,
          audioId: "01234",
        },
        {
          ts: "2023-01-01 09:25:00",
          audioDetection: "ABC",
          confidence: 0.82,
          audioId: "67890",
        },
        {
          ts: "2023-01-01 09:30:00",
          audioDetection: "NBC",
          confidence: 0.93,
          audioId: "78901",
        },
        {
          ts: "2023-01-01 09:35:00",
          audioDetection: "CBS",
          confidence: 0.87,
          audioId: "89012",
        },
        {
          ts: "2023-01-01 09:40:00",
          audioDetection: "FOX",
          confidence: 0.71,
          audioId: "90123",
        },
        {
          ts: "2023-01-01 09:45:00",
          audioDetection: "CNN",
          confidence: 0.89,
          audioId: "01234",
        },
      ]);
    }
  }, [deviceId]);

  const renderTable = (data, type) => (
    <Card className="w-full rounded-xl">
      <CardHeader>
        <CardTitle>
          {type === "logo" ? "Logo Detection Output" : "Audio Detection Output"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-2xl ">
          <Table>
            <TableHeader className="sticky top-0 bg-white z-10  ">
              <TableRow className=" flex items-center justify-between border rounded-t-2xl bg-accent">
                <TableHead className="w-[180px] h-full flex items-center justify-center">
                  <Button variant="ghost" onClick={() => handleSort("ts")}>
                    Timestamp
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="h-full flex items-center justify-center">
                  Detection
                </TableHead>
                <TableHead className="text-right h-full flex items-center justify-center">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("confidence")}
                  >
                    Confidence
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
          </Table>
          <ScrollArea className="h-[40vh]">
            <Table>
              <TableBody className="border rounded-b-2xl">
                {sortedData(data).map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.ts}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="relative w-10 h-10">
                          <Image
                            src={`https://avatars.githubusercontent.com/u/${
                              item[type === "logo" ? "logoId" : "audioId"]
                            }`}
                            alt={
                              item[
                                type === "logo"
                                  ? "logoDetection"
                                  : "audioDetection"
                              ]
                            }
                            layout="fill"
                            objectFit="cover"
                            className="rounded-full"
                          />
                        </div>
                        <span>
                          {
                            item[
                              type === "logo"
                                ? "logoDetection"
                                : "audioDetection"
                            ]
                          }
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={
                          item.confidence > 0.8
                            ? "success"
                            : item.confidence > 0.6
                            ? "warning"
                            : "destructive"
                        }
                      >
                        {(item.confidence * 100).toFixed(1)}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <MainLayout>
      <div className="flex flex-col gap-6 ">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">
            Device ID:{" "}
            <span className="text-primary underline">{deviceId}</span> Live Feed
          </h1>
          <Button variant="outline" onClick={handleGoBack} className="gap-2 bg-white rounded-full text-primary">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderTable(logoData, "logo")}
          {renderTable(audioData, "audio")}
        </div>
        <BarChart logoData={logoData} audioData={audioData} />
      </div>
    </MainLayout>
  );
};

export default DevicePage;
