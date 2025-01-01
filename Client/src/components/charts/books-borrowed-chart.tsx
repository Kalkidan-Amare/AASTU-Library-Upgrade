"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
const chartData = [
    { date: "2024-04-01", day: 56, night: 38 },
    { date: "2024-04-02", day: 25, night: 45 },
    { date: "2024-04-03", day: 42, night: 30 },
    { date: "2024-04-04", day: 61, night: 65 },
    { date: "2024-04-05", day: 94, night: 73 },
    { date: "2024-04-06", day: 76, night: 85 },
    { date: "2024-04-07", day: 62, night: 45 },
    { date: "2024-04-08", day: 103, night: 80 },
    { date: "2024-04-09", day: 15, night: 28 },
    { date: "2024-04-10", day: 66, night: 48 },
    { date: "2024-04-11", day: 82, night: 88 },
    { date: "2024-04-12", day: 74, night: 53 },
    { date: "2024-04-13", day: 86, night: 95 },
    { date: "2024-04-14", day: 35, night: 55 },
    { date: "2024-04-15", day: 30, night: 43 },
    { date: "2024-04-16", day: 35, night: 48 },
    { date: "2024-04-17", day: 112, night: 90 },
    { date: "2024-04-18", day: 92, night: 103 },
    { date: "2024-04-19", day: 61, night: 45 },
    { date: "2024-04-20", day: 23, night: 38 },
    { date: "2024-04-21", day: 35, night: 50 },
    { date: "2024-04-22", day: 56, night: 43 },
    { date: "2024-04-23", day: 35, night: 58 },
    { date: "2024-04-24", day: 97, night: 73 },
    { date: "2024-04-25", day: 54, night: 63 },
    { date: "2024-04-26", day: 19, night: 33 },
    { date: "2024-04-27", day: 96, night: 105 },
    { date: "2024-04-28", day: 31, night: 45 },
    { date: "2024-04-29", day: 79, night: 60 },
    { date: "2024-04-30", day: 114, night: 95 },
    { date: "2024-05-01", day: 42, night: 55 },
    { date: "2024-05-02", day: 74, night: 78 },
    { date: "2024-05-03", day: 62, night: 48 },
    { date: "2024-05-04", day: 97, night: 105 },
    { date: "2024-05-05", day: 121, night: 98 },
    { date: "2024-05-06", day: 125, night: 130 },
    { date: "2024-05-07", day: 97, night: 75 },
    { date: "2024-05-08", day: 38, night: 53 },
    { date: "2024-05-09", day: 57, night: 45 },
    { date: "2024-05-10", day: 74, night: 83 },
    { date: "2024-05-11", day: 84, night: 68 },
    { date: "2024-05-12", day: 50, night: 60 },
    { date: "2024-05-13", day: 50, night: 40 },
    { date: "2024-05-14", day: 112, night: 123 },
    { date: "2024-05-15", day: 119, night: 95 },
    { date: "2024-05-16", day: 85, night: 100 },
    { date: "2024-05-17", day: 125, night: 105 },
    { date: "2024-05-18", day: 79, night: 88 },
    { date: "2024-05-19", day: 59, night: 45 },
    { date: "2024-05-20", day: 45, night: 58 },
    { date: "2024-05-21", day: 21, night: 35 },
    { date: "2024-05-22", day: 21, night: 30 },
    { date: "2024-05-23", day: 63, night: 73 },
    { date: "2024-05-24", day: 74, night: 55 },
    { date: "2024-05-25", day: 51, night: 63 },
    { date: "2024-05-26", day: 54, night: 43 },
    { date: "2024-05-27", day: 105, night: 115 },
    { date: "2024-05-28", day: 59, night: 48 },
    { date: "2024-05-29", day: 20, night: 33 },
    { date: "2024-05-30", day: 85, night: 70 },
    { date: "2024-05-31", day: 45, night: 58 },
    { date: "2024-06-01", day: 45, night: 50 },
    { date: "2024-06-02", day: 118, night: 103 },
    { date: "2024-06-03", day: 26, night: 40 },
    { date: "2024-06-04", day: 110, night: 95 },
    { date: "2024-06-05", day: 22, night: 35 },
    { date: "2024-06-06", day: 74, night: 63 },
    { date: "2024-06-07", day: 81, night: 93 },
    { date: "2024-06-08", day: 97, night: 80 },
    { date: "2024-06-09", day: 110, night: 120 },
    { date: "2024-06-10", day: 39, night: 50 },
    { date: "2024-06-11", day: 24, night: 38 },
    { date: "2024-06-12", day: 123, night: 105 },
    { date: "2024-06-13", day: 21, night: 33 },
    { date: "2024-06-14", day: 107, night: 95 },
    { date: "2024-06-15", day: 77, night: 88 },
    { date: "2024-06-16", day: 93, night: 78 },
    { date: "2024-06-17", day: 119, night: 130 },
    { date: "2024-06-18", day: 27, night: 43 },
    { date: "2024-06-19", day: 86, night: 73 },
    { date: "2024-06-20", day: 102, night: 113 },
    { date: "2024-06-21", day: 43, night: 53 },
    { date: "2024-06-22", day: 80, night: 68 },
    { date: "2024-06-23", day: 120, night: 133 },
    { date: "2024-06-24", day: 34, night: 45 },
    { date: "2024-06-25", day: 36, night: 48 },
    { date: "2024-06-26", day: 109, night: 95 },
    { date: "2024-06-27", day: 112, night: 123 },
    { date: "2024-06-28", day: 38, night: 50 },
    { date: "2024-06-29", day: 26, night: 40 },
    { date: "2024-06-30", day: 112, night: 100 },
  ];
  

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
} satisfies ChartConfig

export function BooksBorrowedChart() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("day")

  const total = React.useMemo(
    () => ({
      day: chartData.reduce((acc, curr) => acc + curr.day, 0),
      night: chartData.reduce((acc, curr) => acc + curr.night, 0),
    }),
    []
  )

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
            const chart = key as keyof typeof chartConfig
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
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
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
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
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
                    })
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
