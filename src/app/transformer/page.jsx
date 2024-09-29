"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Scatter,
  ScatterChart,
  ComposedChart,
  Legend,
} from "recharts";
import {
  Thermometer,
  Droplet,
  Zap,
  Gauge,
  Fan,
  AlertTriangle,
  Bell,
  Settings,
  BarChart2,
  Activity,
  Battery,
  Wifi,
  RefreshCw,
  Power,
  Percent,
} from "lucide-react";
import MainLayout from "@/components/layouts/MainLayout";

// Expanded mock data for charts
const liveData = [
  {
    time: "00:00",
    temperature: 65,
    oilLevel: 80,
    moisture: 20,
    oilTemperature: 55,
    powerConsumption: 100,
    pressure: 50,
    efficiency: 92,
    vibration: 0.5,
    harmonics: 2.5,
    loadFactor: 0.7,
  },
  {
    time: "02:00",
    temperature: 66,
    oilLevel: 79,
    moisture: 21,
    oilTemperature: 56,
    powerConsumption: 105,
    pressure: 51,
    efficiency: 91,
    vibration: 0.6,
    harmonics: 2.7,
    loadFactor: 0.72,
  },
  {
    time: "04:00",
    temperature: 68,
    oilLevel: 78,
    moisture: 22,
    oilTemperature: 57,
    powerConsumption: 120,
    pressure: 52,
    efficiency: 90,
    vibration: 0.7,
    harmonics: 2.9,
    loadFactor: 0.75,
  },
  {
    time: "06:00",
    temperature: 70,
    oilLevel: 77,
    moisture: 23,
    oilTemperature: 58,
    powerConsumption: 135,
    pressure: 53,
    efficiency: 89,
    vibration: 0.8,
    harmonics: 3.1,
    loadFactor: 0.78,
  },
  {
    time: "08:00",
    temperature: 72,
    oilLevel: 76,
    moisture: 24,
    oilTemperature: 60,
    powerConsumption: 150,
    pressure: 55,
    efficiency: 88,
    vibration: 0.9,
    harmonics: 3.3,
    loadFactor: 0.82,
  },
  {
    time: "10:00",
    temperature: 74,
    oilLevel: 75,
    moisture: 25,
    oilTemperature: 61,
    powerConsumption: 165,
    pressure: 56,
    efficiency: 87,
    vibration: 1.0,
    harmonics: 3.5,
    loadFactor: 0.85,
  },
  {
    time: "12:00",
    temperature: 75,
    oilLevel: 74,
    moisture: 26,
    oilTemperature: 62,
    powerConsumption: 180,
    pressure: 58,
    efficiency: 86,
    vibration: 1.1,
    harmonics: 3.7,
    loadFactor: 0.88,
  },
  {
    time: "14:00",
    temperature: 74,
    oilLevel: 73,
    moisture: 25,
    oilTemperature: 61,
    powerConsumption: 170,
    pressure: 57,
    efficiency: 87,
    vibration: 1.0,
    harmonics: 3.5,
    loadFactor: 0.86,
  },
  {
    time: "16:00",
    temperature: 73,
    oilLevel: 72,
    moisture: 25,
    oilTemperature: 61,
    powerConsumption: 160,
    pressure: 56,
    efficiency: 88,
    vibration: 0.9,
    harmonics: 3.3,
    loadFactor: 0.84,
  },
  {
    time: "18:00",
    temperature: 71,
    oilLevel: 73,
    moisture: 24,
    oilTemperature: 59,
    powerConsumption: 140,
    pressure: 54,
    efficiency: 89,
    vibration: 0.8,
    harmonics: 3.1,
    loadFactor: 0.8,
  },
  {
    time: "20:00",
    temperature: 70,
    oilLevel: 75,
    moisture: 23,
    oilTemperature: 58,
    powerConsumption: 130,
    pressure: 53,
    efficiency: 90,
    vibration: 0.7,
    harmonics: 2.9,
    loadFactor: 0.76,
  },
  {
    time: "22:00",
    temperature: 68,
    oilLevel: 76,
    moisture: 22,
    oilTemperature: 57,
    powerConsumption: 115,
    pressure: 52,
    efficiency: 91,
    vibration: 0.6,
    harmonics: 2.7,
    loadFactor: 0.73,
  },
];

const predictionData = {
  morning: [
    {
      time: "06:00",
      temperature: 68,
      powerConsumption: 110,
      efficiency: 91,
      load: 60,
      riskScore: 15,
    },
    {
      time: "07:00",
      temperature: 70,
      powerConsumption: 130,
      efficiency: 90,
      load: 70,
      riskScore: 18,
    },
    {
      time: "08:00",
      temperature: 72,
      powerConsumption: 150,
      efficiency: 89,
      load: 80,
      riskScore: 22,
    },
    {
      time: "09:00",
      temperature: 74,
      powerConsumption: 170,
      efficiency: 88,
      load: 90,
      riskScore: 25,
    },
  ],
  afternoon: [
    {
      time: "12:00",
      temperature: 76,
      powerConsumption: 190,
      efficiency: 87,
      load: 95,
      riskScore: 30,
    },
    {
      time: "13:00",
      temperature: 77,
      powerConsumption: 200,
      efficiency: 86,
      load: 100,
      riskScore: 35,
    },
    {
      time: "14:00",
      temperature: 78,
      powerConsumption: 210,
      efficiency: 85,
      load: 100,
      riskScore: 38,
    },
    {
      time: "15:00",
      temperature: 77,
      powerConsumption: 200,
      efficiency: 86,
      load: 95,
      riskScore: 34,
    },
  ],
  night: [
    {
      time: "20:00",
      temperature: 72,
      powerConsumption: 140,
      efficiency: 89,
      load: 75,
      riskScore: 20,
    },
    {
      time: "21:00",
      temperature: 70,
      powerConsumption: 120,
      efficiency: 90,
      load: 65,
      riskScore: 17,
    },
    {
      time: "22:00",
      temperature: 68,
      powerConsumption: 100,
      efficiency: 91,
      load: 55,
      riskScore: 14,
    },
    {
      time: "23:00",
      temperature: 66,
      powerConsumption: 90,
      efficiency: 92,
      load: 50,
      riskScore: 12,
    },
  ],
};

const oilAnalysisData = [
  { name: "Acidity", value: 0.15, fullMark: 0.5 },
  { name: "Moisture", value: 25, fullMark: 35 },
  { name: "Dielectric Strength", value: 45, fullMark: 60 },
  { name: "Interfacial Tension", value: 32, fullMark: 40 },
  { name: "Color", value: 2.5, fullMark: 5 },
  { name: "Dissolved Gas", value: 1500, fullMark: 2500 },
];

const harmonicData = [
  { harmonic: "1st", voltage: 100, current: 100 },
  { harmonic: "3rd", voltage: 33, current: 45 },
  { harmonic: "5th", voltage: 20, current: 25 },
  { harmonic: "7th", voltage: 14, current: 18 },
  { harmonic: "9th", voltage: 11, current: 12 },
  { harmonic: "11th", voltage: 9, current: 8 },
];

const efficiencyData = [
  { name: "Efficient", value: 85 },
  { name: "Loss", value: 15 },
];

const maintenanceSchedule = [
  { task: "Oil Sample Analysis", date: "2023-10-15", status: "Scheduled" },
  { task: "Insulation Resistance Test", date: "2023-11-01", status: "Pending" },
  { task: "Thermal Imaging Scan", date: "2023-11-15", status: "Scheduled" },
  { task: "Bushing Inspection", date: "2023-12-01", status: "Pending" },
];

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "hsl(var(--accent))",
  "hsl(var(--muted))",
  "hsl(var(--primary))",
];

export default function Dashboard() {
  const [fanSpeed, setFanSpeed] = React.useState(0);
  const [autoMode, setAutoMode] = React.useState(true);

  React.useEffect(() => {
    const currentTemperature = liveData[liveData.length - 1].temperature;
    if (autoMode && currentTemperature > 70) {
      setFanSpeed(Math.min(100, (currentTemperature - 70) * 10));
    } else if (autoMode) {
      setFanSpeed(0);
    }
  }, [autoMode]);

  return (
    <MainLayout>
      <div className="flex flex-col min-h-screen bg-background text-foreground p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">
              Advanced Transformer Monitoring
            </h1>
            <p className="text-muted-foreground">
              Real-time analytics and predictive maintenance
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-4 gap-4 mb-8">
          <MetricCard
            title="Transformer Temperature"
            value={liveData[liveData.length - 1].temperature}
            unit="°C"
            icon={<Thermometer className="w-4 h-4" />}
          />
          <MetricCard
            title="Oil Level"
            value={liveData[liveData.length - 1].oilLevel}
            unit="%"
            icon={<Droplet className="w-4 h-4" />}
          />
          <MetricCard
            title="Power Consumption"
            value={liveData[liveData.length - 1].powerConsumption}
            unit="kW"
            icon={<Zap className="w-4 h-4" />}
          />
          <MetricCard
            title="Efficiency"
            value={liveData[liveData.length - 1].efficiency}
            unit="%"
            icon={<Percent className="w-4 h-4" />}
          />
        </div>

        <div className="grid grid-cols-3 gap-8 mb-8">
          <Card className="col-span-2 bg-white">
            <CardHeader>
              <CardTitle>Multi-Parameter Trend Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={liveData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--muted))"
                  />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                  <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      borderColor: "hsl(var(--border))",
                    }}
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="temperature"
                    stroke="hsl(var(--destructive))"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="powerConsumption"
                    stroke="hsl(var(--primary))"
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="oilLevel"
                    stroke="#23ea12"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="loadFactor"
                    fill="#323232"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Efficiency Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={efficiencyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="hsl(var(--primary))"
                    paddingAngle={5}
                    dataKey="value"
                    label
                  >
                    {efficiencyData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      borderColor: "hsl(var(--border))",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Current Efficiency</p>
                  <p className="text-2xl font-bold">
                    {liveData[liveData.length - 1].efficiency}%
                  </p>
                </div>
                <Progress
                  value={liveData[liveData.length - 1].efficiency}
                  className="w-1/2"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Harmonic Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={harmonicData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--muted))"
                  />
                  <XAxis
                    dataKey="harmonic"
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      borderColor: "hsl(var(--border))",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="voltage" fill="hsl(var(--primary))" />
                  <Bar dataKey="current" fill="hsl(var(--secondary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Oil Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart
                  cx="50%"
                  cy="50%"
                  outerRadius="80%"
                  data={oilAnalysisData}
                >
                  <PolarGrid stroke="hsl(var(--muted))" />
                  <PolarAngleAxis
                    dataKey="name"
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <PolarRadiusAxis stroke="hsl(var(--muted-foreground))" />
                  <Radar
                    name="Oil Quality"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.6}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      borderColor: "hsl(var(--border))",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white mb-8">
          <CardHeader>
            <CardTitle>Predictive Load Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="morning">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="morning">Morning</TabsTrigger>
                <TabsTrigger value="afternoon">Afternoon</TabsTrigger>
                <TabsTrigger value="night">Night</TabsTrigger>
              </TabsList>
              <TabsContent value="morning">
                <PredictionChart data={predictionData.morning} />
              </TabsContent>
              <TabsContent value="afternoon">
                <PredictionChart data={predictionData.afternoon} />
              </TabsContent>
              <TabsContent value="night">
                <PredictionChart data={predictionData.night} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Proactive Cooling System Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Fan className="w-6 h-6 text-primary" />
                  <span>Cooling Fan Speed</span>
                </div>
                <div className="text-2xl font-bold">{fanSpeed}%</div>
              </div>
              <Slider
                value={[fanSpeed]}
                onValueChange={(value) => setFanSpeed(value[0])}
                max={100}
                step={1}
                className="mb-4"
                disabled={autoMode}
              />
              <div className="flex items-center justify-between">
                <span>Auto Mode</span>
                <Switch checked={autoMode} onCheckedChange={setAutoMode} />
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Fan speed is {autoMode ? "automatically" : "manually"} adjusted
                to optimize cooling efficiency and prevent overheating.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Maintenance Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {maintenanceSchedule.map((task, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{task.task}</p>
                      <p className="text-sm text-muted-foreground">
                        {task.date}
                      </p>
                    </div>
                    <Badge
                      variant={
                        task.status === "Scheduled" ? "default" : "secondary"
                      }
                    >
                      {task.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle>System Health Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <HealthIndicator
                icon={<Battery className="w-4 h-4" />}
                label="Battery"
                value={95}
                unit="%"
              />
              <HealthIndicator
                icon={<Wifi className="w-4 h-4" />}
                label="Connectivity"
                value={100}
                unit="%"
              />
              <HealthIndicator
                icon={<Activity className="w-4 h-4" />}
                label="Overall Health"
                value={92}
                unit="%"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

function MetricCard({ title, value, unit, icon }) {
  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value}
          {unit}
        </div>
      </CardContent>
    </Card>
  );
}

function PredictionChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
        <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
        <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" />
        <YAxis
          yAxisId="right"
          orientation="right"
          stroke="hsl(var(--muted-foreground))"
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--popover))",
            borderColor: "hsl(var(--border))",
          }}
        />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="temperature"
          stroke="hsl(var(--destructive))"
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="powerConsumption"
          stroke="hsl(var(--primary))"
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="efficiency"
          stroke="hsl(var(--secondary))"
        />
        <Bar yAxisId="right" dataKey="load" fill="hsl(var(--accent))" />
        <Area
          yAxisId="right"
          type="monotone"
          dataKey="riskScore"
          fill="hsl(var(--warning))"
          stroke="hsl(var(--warning))"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

function HealthIndicator({ icon, label, value, unit }) {
  return (
    <div className="flex items-center space-x-4">
      <div className="bg-primary/20 p-2 rounded-full">{icon}</div>
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-2xl font-bold">
          {value}
          {unit}
        </p>
      </div>
    </div>
  );
}
