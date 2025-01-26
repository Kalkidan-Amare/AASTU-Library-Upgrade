"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { useQuery } from "@tanstack/react-query";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { intervalCheckInsAction } from "@/lib/student-actions";
import { transformCheckinData } from "@/lib/transformData";
import { Loader } from "lucide-react";

interface Checkin {
  id: string;
  user_id: string;
  student_id: string;
  checkin_at: string;
  checkout_at: string;
}

interface IntervalCheckinsSuccess {
  data: Checkin[];
  message: string;
}

interface ChartData {
  date: string;
  day: number;
  night: number;
}

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  day: {
    label: "day",
    color: "hsl(var(--chart-1))",
  },
  night: {
    label: "night",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;


export function StudentAttendanceChart() {
  const [timeRange, setTimeRange] = React.useState("90d");
  const [chartData, setChartData] = React.useState<ChartData[]>([]);

  const getStartDate = (range: string): string => {
    const today = new Date();
    let daysToSubtract = 90;
    if (range === "30d") {
      daysToSubtract = 30;
    } else if (range === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - daysToSubtract);

    const year = startDate.getFullYear();
    const month = String(startDate.getMonth() + 1).padStart(2, "0");
    const day = String(startDate.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };
  const endDate = (() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  })();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["chartData", timeRange],
    queryFn: async () => {
      if (!localStorage.getItem("token")) {
        throw new Error("No auth token provided");
      }
      const startDate = getStartDate(timeRange);
      return intervalCheckInsAction(
        localStorage.getItem("token"),
        startDate,
        "00:00",
        endDate,
        "23:59"
      );
    },
    enabled: !!localStorage.getItem("token"),
    onSuccess: (data) => {
      if (data) setChartData(transformCheckinData(data));
    },
  });

  const filteredData = React.useMemo(() => {
    const today = new Date();
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - daysToSubtract);
    return chartData.filter((item) => {
      const date = new Date(item.date);
      return date >= startDate;
    });
  }, [chartData, timeRange]);

  React.useEffect(() => {
    if (localStorage.getItem("token")) refetch();
  }, [timeRange, localStorage.getItem("token"), refetch]);

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Student Attendance</CardTitle>
          <CardDescription>
            Showing total student attendance for the last 3 months
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 min-h-72 flex justify-center items-center">
        {isLoading && <p><Loader className="animate-spin" /></p>}
        {isError && <p style={{ color: "red" }}>Error: </p>}
        {!isLoading && !isError && (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillday" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-day)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-day)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillnight" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-night)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-night)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="night"
                type="natural"
                fill="url(#fillnight)"
                stroke="var(--color-night)"
                stackId="a"
              />
              <Area
                dataKey="day"
                type="natural"
                fill="url(#fillday)"
                stroke="var(--color-day)"
                stackId="a"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
