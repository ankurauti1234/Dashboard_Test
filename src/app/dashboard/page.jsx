'use client'
import dynamic from "next/dynamic";
import { useState } from "react";
import AlertsSlider from "@/components/cards/AlertsSlider";
import APMStatistics from "@/components/charts/APMStatistics";
import MainLayout from "@/components/layouts/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SensorData from "@/components/charts/SensorData";
import TransformerDashboard from "@/components/tabs/dashboard/TransformerDashboard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Skeleton } from "@/components/ui/skeleton";

const APMLocations = dynamic(() => import("@/components/maps/APMLocations"), {
  loading: () => (
    <div className="w-full h-[50vh]  bg-white rounded-2xl p-2">
      <div className="w-full h-full relative">
        <Skeleton className="w-full h-full rounded-xl " />
        <div className="absolute top-4 left-4 right-4 flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-9 w-full sm:w-1/2 rounded-full" />
          <div className="flex gap-2 w-full sm:w-1/2 justify-center sm:justify-end">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-9 w-20 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  ),
  ssr: false,
});

const Page = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDevice, setSelectedDevice] = useState(null);

  const devices = [
    { id: "device1", name: "Device 1" },
    { id: "device2", name: "Device 2" },
    { id: "device3", name: "Device 3" },
  ];

  const filteredDevices = devices.filter((device) =>
    device.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="flex gap-2 w-fit bg-secondary rounded-full border">
            <TabsTrigger
              className="px-12 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              value="overview"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              className="px-12 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              value="liveCharts"
            >
              Live Charts
            </TabsTrigger>
            <TabsTrigger
              className="px-12 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              value="transformer"
            >
              Analytics
            </TabsTrigger>
          </TabsList>

          <div className="mt-6 px-4">
            <TabsContent value="overview">
              <main className="flex flex-col gap-10 justify-between h-full items-center">
                <div className="w-full flex h-[50vh] flex-col lg:flex-row gap-6">
                  <div className="w-full h-full">
                    <h1 className="text-xl font-black mb-2">
                      All Device Status
                    </h1>
                    <APMStatistics />
                  </div>
                  <div className="w-full h-full">
                    <h1 className="text-xl font-black mb-2">
                      Device Locations
                    </h1>
                    <APMLocations />
                  </div>
                </div>
                <AlertsSlider />
              </main>
            </TabsContent>

            <TabsContent value="liveCharts">
              <h1 className="text-xl font-bold mb-4">Live Charts</h1>
              <div className="mb-4">
                <Input
                  type="text"
                  placeholder="Search devices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <div className="flex flex-col space-y-2 mb-4">
                {filteredDevices.map((device) => (
                  <Button
                    key={device.id}
                    onClick={() => setSelectedDevice(device)}
                    variant={
                      selectedDevice?.id === device.id ? "default" : "outline"
                    }
                  >
                    {device.name}
                  </Button>
                ))}
              </div>
              {selectedDevice && <SensorData deviceId={selectedDevice.id} />}
            </TabsContent>

            <TabsContent value="transformer">
              <TransformerDashboard />
            </TabsContent>
          </div>
        </Tabs>
      </>
    </MainLayout>
  );
};

export default Page;
