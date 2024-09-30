import dynamic from "next/dynamic";

const APMLocations = dynamic(() => import("@/components/maps/APMLocations"), {
  loading: () => <div>Loading...</div>,
  ssr: false, // Render the component on the client-side only
});
import AlertsSlider from "@/components/cards/AlertsSlider";
import APMStatistics from "@/components/charts/APMStatistics";
import MainLayout from "@/components/layouts/MainLayout";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SensorData from "@/components/charts/SensorData";
import Analytics from "@/components/charts/Analytics";
import TransformerDashboard from "@/components/tabs/dashboard/TransformerDashboard";

const Page = () => {
  return (
    <MainLayout>
      <>
        {/* Tabs for Overview, Live Charts, and Analytics */}
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
            {/* <TabsTrigger
              className="px-12 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              value="analytics"
            >
              Analytics
            </TabsTrigger> */}
            <TabsTrigger
              className="px-12 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              value="transformer"
            >
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          <div className="mt-6 px-4">
            <TabsContent value="overview">
              <main className="flex flex-col gap-10  justify-between h-full items-center">
                <div className="w-full flex  h-[50vh] flex-col lg:flex-row gap-6">
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
              <h1 className="text-xl font-bold">Live Charts</h1>
              <SensorData />
            </TabsContent>

            {/* <TabsContent value="analytics">
              <h1 className="text-xl font-bold">Analytics</h1>
              <Analytics />
            </TabsContent> */}
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
