"use client";

import MainLayout from "@/components/layouts/MainLayout";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventStreamRecords from "@/components/tabs/meter_management/event_stream/EventStreamRecords";
import { cn } from "@/lib/utils";
import Plot from "@/components/tabs/meter_management/event_stream/Plot";
import RetrivalRequest from "@/components/tabs/meter_management/event_stream/RetrivalRequest";
import ViewAndUpdate from "@/components/tabs/meter_management/config_update/ViewAndUpdate";
import ConfigHistory from "@/components/tabs/meter_management/config_update/ConfigHistory";
import MeterReleaseSearch from "@/components/tabs/meter_management/meter_release_management/MeterReleaseSearch";
import MeterReleaseHistory from "@/components/tabs/meter_management/meter_release_management/MeterReleaseHistory";
import MeterReleaseSubmitJob from "@/components/tabs/meter_management/meter_release_management/MeterReleaseSubmitJob";
import MeterReleaseViewJob from "@/components/tabs/meter_management/meter_release_management/MeterReleaseViewJob";
import ViewReleaseSummary from "@/components/tabs/meter_management/ViewReleaseSummary";
import InstallationArchive from "@/components/tabs/meter_management/InstallationArchive";
import FieldAlarms from "@/components/tabs/meter_management/alerts/FieldAlarms";
import DerivedAlarms from "@/components/tabs/meter_management/alerts/DerivedAlarms";
import Configurations from "@/components/tabs/meter_management/alerts/Configurations";

const MeterManagementPage = () => {
  const [activeEventsStreamTab, setActiveEventsStreamTab] = useState("records");
  const [activeConfigUpdateTab, setActiveConfigUpdateTab] =
    useState("viewUpdate");
  const [activeMeterReleaseTab, setActiveMeterReleaseTab] = useState("search");
  const [activeAlarmsTab, setActiveAlarmsTab] = useState("fieldAlarms");
  const [loading, setLoading] = useState(false);


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div
          className={cn(
            "w-16 h-16 border-4 border-dashed rounded-full animate-spin",
            "border-gray-400 border-t-transparent"
          )}
        ></div>
      </div>
    );
  }

  const renderTabContent = (tab) => {
    switch (tab) {
      case "eventsStream":
        return (
          <Tabs defaultValue="records" className="w-full">
            <TabsList className="bg-transparent rounded-none p-0 ">
              <TabsTrigger
                 className="    rounded-none data-[state=active]:font-semibold border-b data-[state=active]:border-primary data-[state=active]:bg-white data-[state=active]:border-b-2"
                value="records"
                onClick={() => setActiveEventsStreamTab("records")}
              >
                Records
              </TabsTrigger>
              <TabsTrigger
                 className="    rounded-none data-[state=active]:font-semibold border-b data-[state=active]:border-primary data-[state=active]:bg-white data-[state=active]:border-b-2"
                value="plot"
                onClick={() => setActiveEventsStreamTab("plot")}
              >
                Plot
              </TabsTrigger>
              <TabsTrigger
                 className="    rounded-none data-[state=active]:font-semibold border-b data-[state=active]:border-primary data-[state=active]:bg-white data-[state=active]:border-b-2"
                value="retrievalRequest"
                onClick={() => setActiveEventsStreamTab("retrievalRequest")}
              >
                Retrieval Request
              </TabsTrigger>
            </TabsList>

            <div key={activeEventsStreamTab} className="opacity-100 scale-1">
              <TabsContent value="records">
                <EventStreamRecords />
              </TabsContent>
              <TabsContent value="plot">
                <Plot />
              </TabsContent>
              <TabsContent value="retrievalRequest">
                <RetrivalRequest />
              </TabsContent>
            </div>
          </Tabs>
        );
      case "alarms":
        return (
          <Tabs defaultValue="fieldAlarms" className="w-full">
            <TabsList className="bg-transparent rounded-none p-0 ">
              <TabsTrigger
                 className="    rounded-none data-[state=active]:font-semibold border-b data-[state=active]:border-primary data-[state=active]:bg-white data-[state=active]:border-b-2"
                value="fieldAlarms"
                onClick={() => setActiveAlarmsTab("fieldAlarms")}
              >
                Field Alarms
              </TabsTrigger>
              <TabsTrigger
                 className="    rounded-none data-[state=active]:font-semibold border-b data-[state=active]:border-primary data-[state=active]:bg-white data-[state=active]:border-b-2"
                value="derived"
                onClick={() => setActiveAlarmsTab("derived")}
              >
                Derived Alarms
              </TabsTrigger>
              <TabsTrigger
                 className="    rounded-none data-[state=active]:font-semibold border-b data-[state=active]:border-primary data-[state=active]:bg-white data-[state=active]:border-b-2"
                value="configurations"
                onClick={() => setActiveAlarmsTab("configurations")}
              >
                Configuration
              </TabsTrigger>
            </TabsList>

            <div key={activeConfigUpdateTab} className="opacity-100 scale-1">
              <TabsContent value="fieldAlarms">
                <FieldAlarms />
              </TabsContent>
              <TabsContent value="derived">
                <DerivedAlarms />
              </TabsContent>
              <TabsContent value="configurations">
                <Configurations />
              </TabsContent>
            </div>
          </Tabs>
        );
      case "configUpdate":
        return (
          <Tabs defaultValue="viewUpdate" className="w-full">
            <TabsList className="bg-transparent rounded-none p-0 ">
              <TabsTrigger
                 className="    rounded-none data-[state=active]:font-semibold border-b data-[state=active]:border-primary data-[state=active]:bg-white data-[state=active]:border-b-2"
                value="viewUpdate"
                onClick={() => setActiveConfigUpdateTab("viewUpdate")}
              >
                View & Update
              </TabsTrigger>
              <TabsTrigger
                 className="    rounded-none data-[state=active]:font-semibold border-b data-[state=active]:border-primary data-[state=active]:bg-white data-[state=active]:border-b-2"
                value="history"
                onClick={() => setActiveConfigUpdateTab("history")}
              >
                History
              </TabsTrigger>
            </TabsList>

            <div key={activeConfigUpdateTab} className="opacity-100 scale-1">
              <TabsContent value="viewUpdate">
                <ViewAndUpdate />
              </TabsContent>
              <TabsContent value="history">
                <ConfigHistory />
              </TabsContent>
            </div>
          </Tabs>
        );
      case "meterReleaseManagement":
        return (
          <Tabs defaultValue="search" className="w-full">
            <TabsList className="bg-transparent rounded-none p-0 ">
              <TabsTrigger
                 className="    rounded-none data-[state=active]:font-semibold border-b data-[state=active]:border-primary data-[state=active]:bg-white data-[state=active]:border-b-2"
                value="search"
                onClick={() => setActiveMeterReleaseTab("search")}
              >
                Search
              </TabsTrigger>
              <TabsTrigger
                 className="    rounded-none data-[state=active]:font-semibold border-b data-[state=active]:border-primary data-[state=active]:bg-white data-[state=active]:border-b-2"
                value="history"
                onClick={() => setActiveMeterReleaseTab("history")}
              >
                History
              </TabsTrigger>
              <TabsTrigger
                 className="    rounded-none data-[state=active]:font-semibold border-b data-[state=active]:border-primary data-[state=active]:bg-white data-[state=active]:border-b-2"
                value="submitJob"
                onClick={() => setActiveMeterReleaseTab("submitJob")}
              >
                Submit Job
              </TabsTrigger>
              <TabsTrigger
                 className="    rounded-none data-[state=active]:font-semibold border-b data-[state=active]:border-primary data-[state=active]:bg-white data-[state=active]:border-b-2"
                value="viewJob"
                onClick={() => setActiveMeterReleaseTab("viewJob")}
              >
                View Job
              </TabsTrigger>
            </TabsList>

            <div key={activeMeterReleaseTab} className="opacity-100 scale-1">
              <TabsContent value="search">
                <MeterReleaseSearch />
              </TabsContent>
              <TabsContent value="history">
                <MeterReleaseHistory />
              </TabsContent>
              <TabsContent value="submitJob">
                <MeterReleaseSubmitJob />
              </TabsContent>
              <TabsContent value="viewJob">
                <MeterReleaseViewJob />
              </TabsContent>
            </div>
          </Tabs>
        );
      case "meterInsightPanel":
        return <ViewReleaseSummary />;
      case "installationArchive":
        return <InstallationArchive />;
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <MainLayout>
      <div>
        {/* <h1 className="text-2xl font-bold mb-6">Meter Management</h1> */}
        <Tabs defaultValue="eventsStream" className="w-full">
          <div className="overflow-x-auto">
            <TabsList className=" w-full justify-between gap-2 bg-secondary rounded-full border">
              <TabsTrigger
                className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground w-fit "
                value="eventsStream"
              >
                Events Stream
              </TabsTrigger>
              <TabsTrigger
                className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground w-fit "
                value="alarms"
              >
                Alarms
              </TabsTrigger>
              <TabsTrigger
                className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground w-fit "
                value="configUpdate"
              >
                Config & Update
              </TabsTrigger>
              <TabsTrigger
                className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground w-fit "
                value="meterReleaseManagement"
              >
                Device Release Management
              </TabsTrigger>
              <TabsTrigger
                className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground w-fit "
                value="meterInsightPanel"
              >
                Device Insight Panel
              </TabsTrigger>
              <TabsTrigger
                className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground w-fit "
                value="installationArchive"
              >
                Installation Archive
              </TabsTrigger>
            </TabsList>
          </div>
          <div className="mt-6">
            {[
              "eventsStream",
              "alarms",
              "configUpdate",
              "meterReleaseManagement",
              "meterInsightPanel",
              "installationArchive",
            ].map((tab) => (
              <TabsContent
                key={tab}
                value={tab}
                className="bg-white border p-2 rounded-lg"
              >
                <div key={tab} className="opacity-100 scale-1">
                  {renderTabContent(tab)}
                </div>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default MeterManagementPage;
