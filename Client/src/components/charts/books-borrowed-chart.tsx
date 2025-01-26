"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { readBooksAction } from "@/lib/student-actions";
import { transformBorrowedBooksData } from "@/lib/transformBorrowedBooksData";
import { Loader } from "lucide-react";

interface BorrowedBook {
  book: {
    id: string;
    title: string;
    description: string;
    bar_code: string;
    status: boolean;
    shelf_no: string;
    author: string;
  };
  borrow: {
    id: string;
    borrow_time: string;
    return_time: string;
    book_id: string;
    user_id: string;
  };
  user: {
    id: string;
    username: string;
    email: string;
    student_id: string;
    password: string;
    role: string;
    borrowed_books: string[];
    is_checked_in: boolean;
    approved: boolean;
  };
}
interface ChartData {
  date: string;
  day: number;
  night: number;
}

const chartConfig = {
  views: {
    label: "Books",
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


export function BooksBorrowedChart() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("day");
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
    queryKey: ["borrowedChartData", activeChart],
    queryFn: async () => {
      if (!localStorage.getItem("token")) {
        throw new Error("No auth token provided");
      }
      const startDate = getStartDate("90d");
      return readBooksAction(localStorage.getItem("token"), startDate, "00:00", endDate, "23:59");
    },
    enabled: !!localStorage.getItem("token"),
    onSuccess: (data) => {
      setChartData(transformBorrowedBooksData(data as BorrowedBook[]));
    },
  });

  const total = React.useMemo(
    () => ({
      day: chartData.reduce((acc, curr) => acc + curr.day, 0),
      night: chartData.reduce((acc, curr) => acc + curr.night, 0),
    }),
    [chartData]
  );

  React.useEffect(() => {
    if (localStorage.getItem("token")) refetch();
  }, [activeChart, localStorage.getItem("token"), refetch]);

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Number of Borrowed Books</CardTitle>
          <CardDescription>
            Showing total borrowed books for the last 3 months
          </CardDescription>
        </div>
        <div className="flex">
          {["day", "night"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6  min-h-72 flex justify-center items-center">
        {isLoading && <p><Loader className="animate-spin"/></p>}
        {isError && <p style={{ color: "red" }}>Error: </p>}
        {!isLoading && !isError && (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
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
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    nameKey="views"
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                    }}
                  />
                }
              />
              <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
