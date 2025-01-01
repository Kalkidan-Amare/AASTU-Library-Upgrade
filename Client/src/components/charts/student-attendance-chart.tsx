"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
const chartData = [
  { date: "2024-04-01", day: 222, night: 150 },
  { date: "2024-04-02", day: 97, night: 180 },
  { date: "2024-04-03", day: 167, night: 120 },
  { date: "2024-04-04", day: 242, night: 260 },
  { date: "2024-04-05", day: 373, night: 290 },
  { date: "2024-04-06", day: 301, night: 340 },
  { date: "2024-04-07", day: 245, night: 180 },
  { date: "2024-04-08", day: 409, night: 320 },
  { date: "2024-04-09", day: 59, night: 110 },
  { date: "2024-04-10", day: 261, night: 190 },
  { date: "2024-04-11", day: 327, night: 350 },
  { date: "2024-04-12", day: 292, night: 210 },
  { date: "2024-04-13", day: 342, night: 380 },
  { date: "2024-04-14", day: 137, night: 220 },
  { date: "2024-04-15", day: 120, night: 170 },
  { date: "2024-04-16", day: 138, night: 190 },
  { date: "2024-04-17", day: 446, night: 360 },
  { date: "2024-04-18", day: 364, night: 410 },
  { date: "2024-04-19", day: 243, night: 180 },
  { date: "2024-04-20", day: 89, night: 150 },
  { date: "2024-04-21", day: 137, night: 200 },
  { date: "2024-04-22", day: 224, night: 170 },
  { date: "2024-04-23", day: 138, night: 230 },
  { date: "2024-04-24", day: 387, night: 290 },
  { date: "2024-04-25", day: 215, night: 250 },
  { date: "2024-04-26", day: 75, night: 130 },
  { date: "2024-04-27", day: 383, night: 420 },
  { date: "2024-04-28", day: 122, night: 180 },
  { date: "2024-04-29", day: 315, night: 240 },
  { date: "2024-04-30", day: 454, night: 380 },
  { date: "2024-05-01", day: 165, night: 220 },
  { date: "2024-05-02", day: 293, night: 310 },
  { date: "2024-05-03", day: 247, night: 190 },
  { date: "2024-05-04", day: 385, night: 420 },
  { date: "2024-05-05", day: 481, night: 390 },
  { date: "2024-05-06", day: 498, night: 520 },
  { date: "2024-05-07", day: 388, night: 300 },
  { date: "2024-05-08", day: 149, night: 210 },
  { date: "2024-05-09", day: 227, night: 180 },
  { date: "2024-05-10", day: 293, night: 330 },
  { date: "2024-05-11", day: 335, night: 270 },
  { date: "2024-05-12", day: 197, night: 240 },
  { date: "2024-05-13", day: 197, night: 160 },
  { date: "2024-05-14", day: 448, night: 490 },
  { date: "2024-05-15", day: 473, night: 380 },
  { date: "2024-05-16", day: 338, night: 400 },
  { date: "2024-05-17", day: 499, night: 420 },
  { date: "2024-05-18", day: 315, night: 350 },
  { date: "2024-05-19", day: 235, night: 180 },
  { date: "2024-05-20", day: 177, night: 230 },
  { date: "2024-05-21", day: 82, night: 140 },
  { date: "2024-05-22", day: 81, night: 120 },
  { date: "2024-05-23", day: 252, night: 290 },
  { date: "2024-05-24", day: 294, night: 220 },
  { date: "2024-05-25", day: 201, night: 250 },
  { date: "2024-05-26", day: 213, night: 170 },
  { date: "2024-05-27", day: 420, night: 460 },
  { date: "2024-05-28", day: 233, night: 190 },
  { date: "2024-05-29", day: 78, night: 130 },
  { date: "2024-05-30", day: 340, night: 280 },
  { date: "2024-05-31", day: 178, night: 230 },
  { date: "2024-06-01", day: 178, night: 200 },
  { date: "2024-06-02", day: 470, night: 410 },
  { date: "2024-06-03", day: 103, night: 160 },
  { date: "2024-06-04", day: 439, night: 380 },
  { date: "2024-06-05", day: 88, night: 140 },
  { date: "2024-06-06", day: 294, night: 250 },
  { date: "2024-06-07", day: 323, night: 370 },
  { date: "2024-06-08", day: 385, night: 320 },
  { date: "2024-06-09", day: 438, night: 480 },
  { date: "2024-06-10", day: 155, night: 200 },
  { date: "2024-06-11", day: 92, night: 150 },
  { date: "2024-06-12", day: 492, night: 420 },
  { date: "2024-06-13", day: 81, night: 130 },
  { date: "2024-06-14", day: 426, night: 380 },
  { date: "2024-06-15", day: 307, night: 350 },
  { date: "2024-06-16", day: 371, night: 310 },
  { date: "2024-06-17", day: 475, night: 520 },
  { date: "2024-06-18", day: 107, night: 170 },
  { date: "2024-06-19", day: 341, night: 290 },
  { date: "2024-06-20", day: 408, night: 450 },
  { date: "2024-06-21", day: 169, night: 210 },
  { date: "2024-06-22", day: 317, night: 270 },
  { date: "2024-06-23", day: 480, night: 530 },
  { date: "2024-06-24", day: 132, night: 180 },
  { date: "2024-06-25", day: 141, night: 190 },
  { date: "2024-06-26", day: 434, night: 380 },
  { date: "2024-06-27", day: 448, night: 490 },
  { date: "2024-06-28", day: 149, night: 200 },
  { date: "2024-06-29", day: 103, night: 160 },
  { date: "2024-06-30", day: 446, night: 400 },
]

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
} satisfies ChartConfig

export function StudentAttendanceChart() {
  const [timeRange, setTimeRange] = React.useState("90d")

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

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
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
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
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
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
                    })
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
      </CardContent>
    </Card>
  )
}
