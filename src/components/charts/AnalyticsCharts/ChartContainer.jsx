import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ChartContainer = ({ title, children }) => {
  return (
    <Card className="bg-white">
      <CardHeader className="px-4 py-2 border-b">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">{children}</div>
      </CardContent>
    </Card>
  );
};

export default ChartContainer;
