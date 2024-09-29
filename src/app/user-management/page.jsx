"use client";
import MainLayout from "@/components/layouts/MainLayout";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateUser from "@/components/tabs/user_management/CreateUser";
import SearchUser from "@/components/tabs/user_management/SearchUser";
import RoleManagement from "@/components/tabs/user_management/RoleManagement";
// import APMStatistics from "@/components/charts/APMStatistics";
// import createUser from "@/components/tabs/asset_management/createUser";
// import FileUploadAssets from "@/components/tabs/asset_management/FileUploadAssets";

const Page = () => {
  const [ActiveUserManagementTab, setActiveUserManagementTab] = useState("createUser");

  const renderTabContent = (tab) => {
    switch (tab) {
      case "userManagement":
        return (
          <Tabs defaultValue="createUser" className="w-full">
            <TabsList className="bg-transparent rounded-none p-0 ">
              <TabsTrigger
                className="    rounded-none data-[state=active]:font-semibold border-b data-[state=active]:border-primary data-[state=active]:bg-white data-[state=active]:border-b-2"
                value="createUser"
                onClick={() => setActiveUserManagementTab("createUser")}
              >
                Create User
              </TabsTrigger>
              <TabsTrigger
                className="    rounded-none data-[state=active]:font-semibold border-b data-[state=active]:border-primary data-[state=active]:bg-white data-[state=active]:border-b-2"
                value="searchUser"
                onClick={() => setActiveUserManagementTab("searchUser")}
              >
                Search User
              </TabsTrigger>
            </TabsList>
            <TabsContent value="createUser"><CreateUser/></TabsContent>
            <TabsContent value="searchUser">
              <SearchUser/>
            </TabsContent>
            
          </Tabs>
        );
   
      case "roleManagement":
        return <RoleManagement/>;
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <MainLayout>
      <div className="p-6">
        <Tabs defaultValue="userManagement" className="w-full">
          <TabsList className="flex gap-2 w-fit bg-secondary rounded-full border">
            <TabsTrigger
              className=" px-12 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              value="userManagement"
            >
              User Management
            </TabsTrigger>
            <TabsTrigger
              className=" px-12 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              value="roleManagement"
            >
              Role Management
            </TabsTrigger>
          </TabsList>
          <div className="mt-6">
            {["userManagement", "roleManagement"].map((tab) => (
              <TabsContent
                key={tab}
                value={tab}
                className="bg-white p-2 rounded-lg"
              >
                {renderTabContent(tab)}
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Page;
