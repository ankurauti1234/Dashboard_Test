"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ThermometerIcon,
  DropletIcon,
  ZapIcon,
  GaugeIcon,
  AlertTriangleIcon,
  Fan,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { keyframes } from "@emotion/react";
import { Toaster, toast } from "sonner";

// Synthetic data generator
const generateSyntheticData = () => {
  let temperature = 74;
  let powerSupply = 11;
  let oilLevel = 80;
  let oilTemperature = 69;

  const temperatureUpperLimit = 80;
  const temperatureLowerLimit = 65;
  const powerSupplyUpperLimit = 17.6;
  const powerSupplyLowerLimit = 4.4;
  const oilLevelUpperLimit = 90;
  const oilTemperatureUpperLimit = 90;

  let inIncreasingTrendTemp = false;
  let inIncreasingTrendPower = false;
  let inIncreasingTrendOil = false;
  let inIncreasingTrendOilTemp = false;

  return (dataCounter) => {
    const newTimestamp = new Date().toISOString();

    if (inIncreasingTrendTemp) {
      temperature += 0.4;
      if (temperature >= temperatureUpperLimit) {
        inIncreasingTrendTemp = false;
      }
    } else if (inIncreasingTrendPower) {
      powerSupply += 0.3;
      if (powerSupply >= powerSupplyUpperLimit) {
        inIncreasingTrendPower = false;
      }
    } else if (inIncreasingTrendOil) {
      oilLevel += 0.3;
      if (oilLevel >= oilLevelUpperLimit) {
        inIncreasingTrendOil = false;
      }
    } else if (inIncreasingTrendOilTemp) {
      oilTemperature += 0.4;
      if (oilTemperature >= oilTemperatureUpperLimit) {
        inIncreasingTrendOilTemp = false;
      }
    } else if (20 <= dataCounter && dataCounter < 28) {
      temperature += 0.5;
      if (dataCounter === 27) {
        inIncreasingTrendTemp = true;
      }
    } else if (50 <= dataCounter && dataCounter < 56) {
      powerSupply += 0.4;
      if (dataCounter === 55) {
        inIncreasingTrendPower = true;
      }
    } else if (90 <= dataCounter && dataCounter < 96) {
      oilLevel += 0.5;
      if (dataCounter === 95) {
        inIncreasingTrendOil = true;
      }
    } else if (130 <= dataCounter && dataCounter < 136) {
      oilTemperature += 0.5;
      if (dataCounter === 135) {
        inIncreasingTrendOilTemp = true;
      }
    } else {
      temperature += (Math.random() - 0.5) * 0.2;
      powerSupply += (Math.random() - 0.5) * 0.1;
      oilLevel += (Math.random() - 0.5) * 0.2;
      oilTemperature += (Math.random() - 0.5) * 0.2;
    }

    return {
      time: newTimestamp,
      temperature: temperature,
      powerSupply: powerSupply,
      oilLevel: oilLevel,
      oilTemperature: oilTemperature,
    };
  };
};

const spinAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export default function TransformerDashboard() {
  const [liveData, setLiveData] = useState({
    temperature: [],
    oilLevel: [],
    moisture: [],
    oilTemperature: [],
    powerConsumption: [],
    pressure: [],
  });

  const [predictions, setPredictions] = useState([]);
  const [isCoolingActive, setIsCoolingActive] = useState(false);

  const dataGenerator = React.useRef(generateSyntheticData());
  const dataCounter = React.useRef(0);

  const showErrorToast = (message, description) => {
    toast.error(message, {
      description: description,
      style: {
        background: "rgb(220, 38, 38)",
        color: "white",
        border: "none",
      },
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const newData = dataGenerator.current(dataCounter.current);
      dataCounter.current += 1;

      setLiveData((prev) => ({
        temperature: [
          ...prev.temperature.slice(-99),
          { time: newData.time, value: newData.temperature },
        ],
        oilLevel: [
          ...prev.oilLevel.slice(-24),
          { time: newData.time, value: newData.oilLevel },
        ],
        moisture: [
          ...prev.moisture.slice(-99),
          { time: newData.time, value: Math.random() * 3 },
        ],
        oilTemperature: [
          ...prev.oilTemperature.slice(-24),
          { time: newData.time, value: newData.oilTemperature },
        ],
        powerConsumption: [
          ...prev.powerConsumption.slice(-99),
          { time: newData.time, value: newData.powerSupply * 0.75 },
        ],
        pressure: [
          ...prev.pressure.slice(-99),
          { time: newData.time, value: 80 + Math.random() * 40 },
        ],
      }));

      // Update predictions
      setPredictions((prev) => {
        const newPredictions = [
          ...prev.slice(1),
          {
            time: new Date(
              new Date(newData.time).getTime() + 3600000
            ).toISOString(),
            actual: newData.powerSupply * 50,
            predicted: newData.powerSupply * 50 + (Math.random() - 0.5) * 20,
            oilTemp: newData.oilTemperature,
            predictedOilTemp:
              newData.oilTemperature + (Math.random() - 0.5) * 5,
          },
        ];
        return newPredictions;
      });

      // Check temperature and activate/deactivate cooling system
      const currentTemp = newData.temperature;
      if (currentTemp > 75 && !isCoolingActive) {
        showErrorToast(
          "High Temperature Alert",
          `Temperature has reached ${currentTemp.toFixed(2)}°C`
        );
        setIsCoolingActive(true);
      } else if (currentTemp < 70 && isCoolingActive) {
        setIsCoolingActive(false);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isCoolingActive]);

  const fanSpeed = Math.min(
    100,
    Math.max(
      0,
      (liveData.temperature[liveData.temperature.length - 1]?.value - 70) *
        10 || 0
    )
  );

  return (
    <div className="flex flex-col gap-4 text-foreground min-h-screen">
      <h1 className="text-3xl font-bold">Transformer Monitoring Dashboard</h1>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Prediction Monitoring</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 ">
              <LiveChart
                data={liveData.temperature}
                title="Transformer Temperature"
                color="hsl(var(--primary))"
                icon={<ThermometerIcon className="h-4 w-4" />}
                unit="°C"
              />
              <LiveChart
                data={liveData.oilLevel}
                title="Oil Level"
                color="hsl(var(--secondary))"
                icon={<DropletIcon className="h-4 w-4" />}
                unit="%"
              />
              <LiveChart
                data={liveData.powerConsumption}
                title="Power Consumption"
                color="hsl(var(--accent))"
                icon={<ZapIcon className="h-4 w-4" />}
                unit="kW"
              />
              <LiveChart
                data={liveData.pressure}
                title="Pressure"
                color="hsl(var(--destructive))"
                icon={<GaugeIcon className="h-4 w-4" />}
                unit="PSI"
              />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white h-fit">
          <CardHeader>
            <CardTitle>Proactive Action: Cooling System</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{fanSpeed.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">
                  Current Fan Speed
                </p>
              </div>
              <div className="w-64 h-4 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${fanSpeed}%` }}
                />
              </div>
              <div>
                <p className="text-sm font-medium">Status:</p>
                <p
                  className={`text-sm ${
                    fanSpeed > 80 ? "text-destructive" : "text-primary"
                  }`}
                >
                  {fanSpeed > 80
                    ? "Critical"
                    : fanSpeed > 50
                    ? "Active"
                    : "Normal"}
                </p>
              </div>
              <Fan
                className={`h-8 w-8 ${
                  isCoolingActive ? "text-primary" : "text-muted-foreground"
                }`}
                style={{
                  animation: isCoolingActive
                    ? `${spinAnimation} 2s linear infinite`
                    : "none",
                }}
              />
            </div>
            {isCoolingActive && (
              <Alert variant="destructive" className="mt-4">
                <AlertTitle>Cooling System Activated</AlertTitle>
                <AlertDescription>
                  The cooling system has been activated due to high temperature.
                  It will deactivate once the temperature drops below 70°C.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Predictions</CardTitle>
        </CardHeader>
        <CardContent>
          <PredictionChart data={predictions} />
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Oil Temperature</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <OilTemperatureChart
                data={liveData.oilTemperature}
                showErrorToast={showErrorToast}
              />
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Moisture Content</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={liveData.moisture}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--secondary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Oil Level</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <OilLevelChart
                data={liveData.oilLevel}
                showErrorToast={showErrorToast}
              />
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function LiveChart({ data, title, color, icon, unit }) {
  const currentValue = data[data.length - 1]?.value || 0;
  const previousValue = data[data.length - 2]?.value || 0;
  const change = currentValue - previousValue;
  const changePercent =
    previousValue !== 0 ? (change / previousValue) * 100 : 0;

  return (
    <Card className="bg-slate-100 shadow-inner">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {currentValue.toFixed(2)}
          {unit}
        </div>
        <p className="text-xs text-muted-foreground">
          {change >= 0 ? (
            <ArrowUpIcon className="h-4 w-4 text-primary inline" />
          ) : (
            <ArrowDownIcon className="h-4 w-4 text-destructive inline" />
          )}
          <span>{Math.abs(changePercent).toFixed(2)}%</span>
        </p>
        <ResponsiveContainer width="100%" height={100}>
          <LineChart data={data}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function PredictionChart({ data }) {
  const [nightChartData, setNightChartData] = useState([]);
  const [morningChartData, setMorningChartData] = useState([]);
  const [afternoonChartData, setAfternoonChartData] = useState([]);

  useEffect(() => {
    if (data.length === 0) {
      setNightChartData([]);
      setMorningChartData([]);
      setAfternoonChartData([]);
      return;
    }

    const currentTime = new Date();
    const nightStart = new Date(currentTime);
    nightStart.setHours(0, 0, 0, 0);
    const morningStart = new Date(currentTime);
    morningStart.setHours(8, 0, 0, 0);
    const afternoonStart = new Date(currentTime);
    afternoonStart.setHours(16, 0, 0, 0);

    const processData = (startTime, endTime) => {
      const filteredData = data.filter(
        (item) =>
          new Date(item.time) >= startTime && new Date(item.time) < endTime
      );

      const processedData = filteredData.map((item) => ({
        time: new Date(item.time).getTime(),
        powerConsumption: item.actual,
        predictedPowerConsumption: item.predicted,
        temperature: item.oilTemp,
        predictedTemperature: item.predictedOilTemp,
      }));

      const lastDataPoint = processedData[processedData.length - 1] || {
        time: startTime.getTime(),
        predictedPowerConsumption: 400,
        predictedTemperature: 70,
      };

      const extendedData = [
        ...processedData,
        ...Array(Math.ceil((endTime - lastDataPoint.time) / 3600000))
          .fill()
          .map((_, i) => ({
            time: lastDataPoint.time + (i + 1) * 3600000,
            powerConsumption: null,
            predictedPowerConsumption:
              lastDataPoint.predictedPowerConsumption +
              (Math.random() - 0.5) * 20,
            temperature: null,
            predictedTemperature:
              lastDataPoint.predictedTemperature + (Math.random() - 0.5) * 5,
          })),
      ];

      return extendedData;
    };

    setNightChartData(processData(nightStart, morningStart));
    setMorningChartData(processData(morningStart, afternoonStart));
    setAfternoonChartData(
      processData(afternoonStart, new Date(nightStart.getTime() + 86400000))
    );
  }, [data]);

  const renderChart = (chartData, title) => (
    <Card className="bg-white mb-4">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis
              dataKey="time"
              type="number"
              domain={["dataMin", "dataMax"]}
              tickFormatter={(unixTime) =>
                new Date(unixTime).toLocaleTimeString()
              }
            />
            <YAxis
              yAxisId="power"
              domain={[200, 600]}
              label={{
                value: "Power Consumption (kW)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <YAxis
              yAxisId="temp"
              orientation="right"
              domain={[40, 100]}
              label={{
                value: "Temperature (°C)",
                angle: 90,
                position: "insideRight",
              }}
            />
            <Tooltip
              labelFormatter={(value) => new Date(value).toLocaleString()}
              formatter={(value, name) => [
                value ? value.toFixed(2) : "N/A",
                name,
              ]}
            />
            <Legend />

            <ReferenceLine
              yAxisId="power"
              y={480}
              stroke="orange"
              strokeDasharray="3 3"
              label="Power UCL (480kW)"
            />
            <ReferenceLine
              yAxisId="power"
              y={300}
              stroke="orange"
              strokeDasharray="3 3"
              label="Power LCL (300kW)"
            />
            <ReferenceLine
              yAxisId="temp"
              y={80}
              stroke="red"
              strokeDasharray="3 3"
              label="Temp UCL (80°C)"
            />
            <ReferenceLine
              yAxisId="temp"
              y={60}
              stroke="red"
              strokeDasharray="3 3"
              label="Temp LCL (60°C)"
            />

            <Line
              yAxisId="power"
              type="monotone"
              dataKey="powerConsumption"
              name="Power Consumption"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
            />
            <Line
              yAxisId="power"
              type="monotone"
              dataKey="predictedPowerConsumption"
              name="Predicted Power"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />

            <Line
              yAxisId="temp"
              type="monotone"
              dataKey="temperature"
              name="Temperature"
              stroke="hsl(var(--destructive))"
              strokeWidth={2}
              dot={false}
            />
            <Line
              yAxisId="temp"
              type="monotone"
              dataKey="predictedTemperature"
              name="Predicted Temperature"
              stroke="hsl(var(--destructive))"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  return (
    <div>
      {renderChart(nightChartData, "Night Predictions (00:00 - 08:00)")}
      {renderChart(morningChartData, "Morning Predictions (08:00 - 16:00)")}
      {renderChart(afternoonChartData, "Afternoon Predictions (16:00 - 00:00)")}
    </div>
  );
}
const OilTemperatureChart = ({ data }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (data.length === 0) {
      setChartData([]);
      return;
    }

    const processedData = data.map((item, index) => ({
      time: new Date(item.time).toLocaleTimeString(),
      realTemp: item.value,
      predictedTemp: item.value + (Math.random() - 0.5) * 5,
    }));

    const lastDataPoint = processedData[processedData.length - 1];

    const extendedData = [
      ...processedData,
      ...Array(5)
        .fill()
        .map((_, i) => ({
          time: new Date(
            new Date(lastDataPoint.time).getTime() + (i + 1) * 10000
          ).toLocaleTimeString(),
          realTemp: null,
          predictedTemp:
            lastDataPoint.predictedTemp + (Math.random() - 0.5) * 5,
        })),
    ];

    setChartData(extendedData);
  }, [data]);

  if (chartData.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="colorRealTemp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4285F4" stopOpacity={0.5} />
            <stop offset="95%" stopColor="#4285F4" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorPredictedTemp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FCCD2A" stopOpacity={0.5} />
            <stop offset="95%" stopColor="#FCCD2A" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="time" />
        <YAxis domain={[0, 100]} />
        <Tooltip />
        <Legend />
        <ReferenceLine
          y={70}
          label="UCL (70°C)"
          stroke="orange"
          strokeDasharray="3 3"
        />
        <ReferenceLine
          y={80}
          label="UL (80°C)"
          stroke="red"
          strokeDasharray="3 3"
        />

        <Area
          type="monotone"
          dataKey="predictedTemp"
          stroke="#FCCD2A"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorPredictedTemp)"
          name="Predicted Temp"
          strokeDasharray="5 5"
          dot={false}
        />
        <Area
          type="monotone"
          dataKey="realTemp"
          stroke="#4285F4"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorRealTemp)"
          name="Real Temp"
          dot={(props) => {
            const { cx, cy, payload } = props;
            if (payload.realTemp > 70) {
              return (
                <g>
                  <circle cx={cx} cy={cy} r={4} fill="red" />
                  <AlertTriangleIcon
                    x={cx - 8}
                    y={cy - 8}
                    size={16}
                    color="red"
                  />
                </g>
              );
            }
            return null;
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

const OilLevelChart = ({ data }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (data.length === 0) {
      setChartData([]);
      return;
    }

    const processedData = data.map((item) => ({
      time: new Date(item.time).toLocaleString(),
      realLevel: item.value,
      predictedLevel: item.value + (Math.random() - 0.5) * 5,
    }));

    const lastDataPoint = processedData[processedData.length - 1];

    const extendedData = [
      ...processedData,
      ...Array(5)
        .fill()
        .map((_, i) => ({
          time: new Date(
            new Date(lastDataPoint.time).getTime() + (i + 1) * 60000
          ).toLocaleString(),
          realLevel: null,
          predictedLevel:
            lastDataPoint.predictedLevel + (Math.random() - 0.5) * 5,
        })),
    ];

    setChartData(extendedData);
  }, [data]);

  if (chartData.length === 0) {
    return <div>No data available</div>;
  }

  const LCL = 30;
  const LL = 15;

  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="colorRealLevel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorPredictedLevel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FCCD2A" stopOpacity={0.5} />
            <stop offset="95%" stopColor="#FCCD2A" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="time" />
        <YAxis domain={[0, 100]} />
        <Tooltip
          labelFormatter={(label) => new Date(label).toLocaleString()}
          formatter={(value, name) => [value.toFixed(2), name]}
        />
        <Legend />
        <ReferenceLine
          y={LCL}
          label="LCL (30%)"
          stroke="orange"
          strokeDasharray="3 3"
        />
        <ReferenceLine
          y={LL}
          label="LL (15%)"
          stroke="red"
          strokeDasharray="3 3"
        />
        <Area
          type="monotone"
          dataKey="realLevel"
          stroke="#82ca9d"
          fillOpacity={1}
          fill="url(#colorRealLevel)"
          name="Real Oil Level"
        />
        <Area
          type="monotone"
          dataKey="predictedLevel"
          stroke="#FCCD2A"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorPredictedLevel)"
          name="Predicted Oil Level"
          strokeDasharray="5 5"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="realLevel"
          stroke="#82ca9d"
          dot={(props) => {
            const { cx, cy, payload } = props;
            if (payload.realLevel < LCL) {
              return <circle cx={cx} cy={cy} r={4} fill="red" stroke="none" />;
            }
            return null;
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
