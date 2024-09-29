"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  AlertCircle,
  Bell,
  Battery,
  Wifi,
  Settings,
  List,
  Clock,
  CheckCircle,
  BellRing,
} from "lucide-react";

// Alert types and their corresponding icons
const alertIcons = {
  SOS: AlertCircle,
  tamper: Bell,
  sim: Wifi,
  battery: Battery,
  system: Settings,
};

// Sample alert data
const alerts = [
  {
    id: 1,
    type: "SOS",
    date: "2023-04-01",
    deviceId: "100001",
    status: "generated",
  },
  {
    id: 2,
    type: "tamper",
    date: "2023-04-02",
    deviceId: "100002",
    status: "pending",
  },
  {
    id: 3,
    type: "sim",
    date: "2023-04-03",
    deviceId: "100003",
    status: "resolved",
  },
  {
    id: 4,
    type: "battery",
    date: "2023-04-04",
    deviceId: "100004",
    status: "generated",
  },
  {
    id: 5,
    type: "system",
    date: "2023-04-05",
    deviceId: "100005",
    status: "pending",
  },
  {
    id: 6,
    type: "SOS",
    date: "2023-04-06",
    deviceId: "100006",
    status: "resolved",
  },
  {
    id: 7,
    type: "tamper",
    date: "2023-04-07",
    deviceId: "100007",
    status: "generated",
  },
  {
    id: 8,
    type: "sim",
    date: "2023-04-08",
    deviceId: "100008",
    status: "pending",
  },
  {
    id: 9,
    type: "battery",
    date: "2023-04-09",
    deviceId: "100009",
    status: "resolved",
  },
  {
    id: 10,
    type: "system",
    date: "2023-04-10",
    deviceId: "100010",
    status: "generated",
  },
];

export default function AlertsSlider() {
  const [filter, setFilter] = useState("all");
    const [hoveredId, setHoveredId] = useState(null);

  const filteredAlerts = alerts.filter(
    (alert) => filter === "all" || alert.status === filter
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "generated":
        return "bg-[#EEF6FA]";
      case "pending":
        return "bg-[#FFF9E0]";
      case "resolved":
        return "bg-[#E8F9EC]";
      default:
        return "bg-gray-100";
    }
  };

    const getAlertColor = (status) => {
      switch (status) {
        case "generated":
          return "bg-[#32ADE6]";
        case "pending":
          return "bg-[#FFB800]";
        case "resolved":
          return "bg-[#34C759]";
        default:
          return "bg-gray-500";
      }
  };
  
      const iconColor = (status) => {
        switch (status) {
          case "generated":
            return "text-[#32ADE6]";
          case "pending":
            return "text-[#FFB800]";
          case "resolved":
            return "text-[#34C759]";
          default:
            return "text-gray-500";
        }
      };

  return (
    <div className="w-full mt-4">
      <div className="flex justify-between items-center space-x-2">
        <h1 className="text-xl font-bold w-full">All Meter Alarms</h1>
        <div className="flex gap-2 w-full justify-end items-center mb-2">
          <Button
            onClick={() => setFilter("all")}
            variant={filter === "all" ? "default" : "outline"}
            className="rounded-full bg-white text-foreground border-none"
          >
            <List className="mr-2 h-4 w-4" /> All
          </Button>
          <Button
            onClick={() => setFilter("generated")}
            variant={filter === "generated" ? "default" : "outline"}
            className="rounded-full bg-white text-foreground border-none"
          >
            <span className="h-3 w-3 mr-2 rounded-full bg-[#32ADE6]"></span>{" "}
            Generated
          </Button>
          <Button
            onClick={() => setFilter("pending")}
            variant={filter === "pending" ? "default" : "outline"}
            className="rounded-full bg-white text-foreground border-none"
          >
            <span className="h-3 w-3 mr-2 rounded-full bg-[#FFB800]"></span>{" "}
            Pending
          </Button>
          <Button
            onClick={() => setFilter("resolved")}
            variant={filter === "resolved" ? "default" : "outline"}
            className="rounded-full bg-white text-foreground border-none"
          >
            <span className="h-3 w-3 mr-2 rounded-full bg-[#34C759]"></span>{" "}
            Resolved
          </Button>
        </div>
      </div>

      <Carousel className="w-full bg-white p-1 rounded-lg">
        <CarouselContent className="bg-white p-1 rounded-lg">
          {filteredAlerts.map((alert) => {
            const IconComponent = alertIcons[alert.type];
            return (
              <CarouselItem
                key={alert.id}
                className="md:basis-1/2 lg:basis-1/5"
              >
                <div className="p-1">
                  <Card
                    className={`${getStatusColor(
                      alert.status
                    )} border-none cursor-pointer transition-all duration-300 hover:shadow-lg h-0 pb-[50%] relative overflow-hidden`}
                    onMouseEnter={() => setHoveredId(alert.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <CardContent
                      className={`absolute inset-0 flex flex-col justify-between p-4 transition-all duration-300 ${
                        hoveredId === alert.id ? "blur-sm" : ""
                      }`}
                    >
                      <div className="flex justify-between items-start w-full">
                        <IconComponent
                          className={`h-6 w-6 ${iconColor(alert.status)}`}
                        />
                        <span
                          className={`${getAlertColor(
                            alert.status
                          )} text-white p-2 rounded-full -rotate-12`}
                        >
                          <BellRing className="h-6 w-6" />
                        </span>
                      </div>

                      <div className="w-full">
                        <h3 className="text-xl font-semibold">{alert.type}</h3>
                        <p className="text-sm text-gray-600 font-semibold">
                          {alert.date}
                        </p>
                      </div>
                    </CardContent>
                    {hoveredId === alert.id && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-xl font-bold">
                        Device: {alert.deviceId}
                      </div>
                    )}
                  </Card>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
