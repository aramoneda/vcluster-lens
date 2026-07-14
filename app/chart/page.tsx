"use client"

import { ComponentPageLayout } from "@/components/component-page-layout"
import { TrendingUp, TrendingDown } from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
  LineChart,
  Area,
  AreaChart,
  Pie,
  PieChart,
  Cell,
  RadialBar,
  RadialBarChart,
  Legend,
} from "recharts"
import { registryMetadata } from "@/lib/registry-metadata"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  chartColors,
} from "@/components/ui/chart"

// Added dynamic export for force-dynamic rendering
export const dynamic = "force-dynamic"

// Added meta export for registry
export const meta = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "chart",
  type: "registry:ui",
  title: "Chart",
  description: "Legacy Recharts utilities for lightweight chart composition. For v0-generated application views, prefer Highcharts with the BRD Highcharts theme helper.",
  ...registryMetadata["chart"],
  files: [
    {
      path: "ui/chart.tsx",
      type: "registry:ui",
    },
  ],
  dependencies: ["recharts@2.15.4"],
  registryDependencies: ["card"],
}

// Bar Chart Data
const barChartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const barChartConfig = {
  desktop: { label: "Desktop", color: chartColors[1] },
  mobile: { label: "Mobile", color: chartColors[4] },
} satisfies ChartConfig

// Stacked Bar Chart Data
const stackedBarData = [
  { category: "Q1", product: 420, services: 310, support: 180 },
  { category: "Q2", product: 380, services: 420, support: 220 },
  { category: "Q3", product: 520, services: 380, support: 290 },
  { category: "Q4", product: 610, services: 490, support: 340 },
]

const stackedBarConfig = {
  product: { label: "Product", color: chartColors[1] },
  services: { label: "Services", color: chartColors[4] },
  support: { label: "Support", color: chartColors[7] },
} satisfies ChartConfig

// Line Chart Data
const lineChartData = [
  { month: "Jan", revenue: 4000, expenses: 2400, profit: 1600 },
  { month: "Feb", revenue: 3000, expenses: 1398, profit: 1602 },
  { month: "Mar", revenue: 2000, expenses: 9800, profit: -7800 },
  { month: "Apr", revenue: 2780, expenses: 3908, profit: -1128 },
  { month: "May", revenue: 1890, expenses: 4800, profit: -2910 },
  { month: "Jun", revenue: 2390, expenses: 3800, profit: -1410 },
  { month: "Jul", revenue: 3490, expenses: 4300, profit: -810 },
]

const lineChartConfig = {
  revenue: { label: "Revenue", color: chartColors[1] },
  expenses: { label: "Expenses", color: chartColors[14] },
  profit: { label: "Profit", color: chartColors[4] },
} satisfies ChartConfig

// Area Chart Data
const areaChartData = [
  { date: "Week 1", users: 2400, sessions: 4000 },
  { date: "Week 2", users: 1398, sessions: 3000 },
  { date: "Week 3", users: 9800, sessions: 12000 },
  { date: "Week 4", users: 3908, sessions: 5200 },
  { date: "Week 5", users: 4800, sessions: 6100 },
  { date: "Week 6", users: 3800, sessions: 4900 },
]

const areaChartConfig = {
  users: { label: "Users", color: chartColors[9] },
  sessions: { label: "Sessions", color: chartColors[7] },
} satisfies ChartConfig

// Pie Chart Data
const pieChartData = [
  { name: "Chrome", value: 400, fill: chartColors[1] },
  { name: "Safari", value: 300, fill: chartColors[4] },
  { name: "Firefox", value: 200, fill: chartColors[7] },
  { name: "Edge", value: 150, fill: chartColors[9] },
  { name: "Other", value: 100, fill: chartColors[14] },
]

const pieChartConfig = {
  Chrome: { label: "Chrome", color: chartColors[1] },
  Safari: { label: "Safari", color: chartColors[4] },
  Firefox: { label: "Firefox", color: chartColors[7] },
  Edge: { label: "Edge", color: chartColors[9] },
  Other: { label: "Other", color: chartColors[14] },
} satisfies ChartConfig

// Radial Chart Data
const radialChartData = [
  { name: "Goal", value: 85, fill: chartColors[1] },
  { name: "Progress", value: 62, fill: chartColors[4] },
  { name: "Baseline", value: 45, fill: chartColors[7] },
]

const radialChartConfig = {
  Goal: { label: "Goal", color: chartColors[1] },
  Progress: { label: "Progress", color: chartColors[4] },
  Baseline: { label: "Baseline", color: chartColors[7] },
} satisfies ChartConfig

// Multi-series Bar Chart Data (6 series to showcase more colors)
const multiSeriesData = [
  { region: "NA", azure: 420, greenHaze: 310, chetwode: 280, denim: 190, orange: 240, other: 150 },
  { region: "EU", azure: 380, greenHaze: 420, chetwode: 320, denim: 220, orange: 180, other: 200 },
  { region: "APAC", azure: 520, greenHaze: 380, chetwode: 290, denim: 340, orange: 310, other: 180 },
]

const multiSeriesConfig = {
  azure: { label: "Azure", color: chartColors[1] },
  greenHaze: { label: "Green Haze", color: chartColors[4] },
  chetwode: { label: "Chetwode", color: chartColors[7] },
  denim: { label: "Denim", color: chartColors[9] },
  orange: { label: "Orange", color: chartColors[14] },
  other: { label: "Other", color: chartColors[15] },
} satisfies ChartConfig

export default function ChartPage() {
  return (
    <ComponentPageLayout meta={meta}>
      <div className="grid gap-6">
        {/* Color Swatches Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Chart Color Swatches (1-26)</CardTitle>
            <CardDescription>
              26 coordinated colors from Figma design tokens for data visualization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 26 }, (_, i) => (
                <div
                  key={i + 1}
                  className="w-10 h-10 rounded flex items-center justify-center text-xs font-medium"
                  style={{ backgroundColor: `var(--chart-${i + 1})`, color: i < 3 || (i >= 8 && i <= 10) || i === 12 || i === 15 || i === 17 || (i >= 20 && i <= 22) || i === 24 ? '#fff' : '#000' }}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bar Chart - Multiple */}
        <Card>
          <CardHeader>
            <CardTitle>Bar Chart - Multiple Series</CardTitle>
            <CardDescription>January - June 2024</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={barChartConfig}>
              <BarChart accessibilityLayer data={barChartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">Showing total visitors for the last 6 months</div>
          </CardFooter>
        </Card>

        {/* Stacked Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Stacked Bar Chart</CardTitle>
            <CardDescription>Quarterly breakdown by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={stackedBarConfig}>
              <BarChart accessibilityLayer data={stackedBarData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="category" tickLine={false} tickMargin={10} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="product" stackId="a" fill="var(--color-product)" radius={[0, 0, 4, 4]} />
                <Bar dataKey="services" stackId="a" fill="var(--color-services)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="support" stackId="a" fill="var(--color-support)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Line Chart - Multiple Lines</CardTitle>
            <CardDescription>Revenue, Expenses, and Profit over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={lineChartConfig}>
              <LineChart accessibilityLayer data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="expenses" stroke="var(--color-expenses)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="profit" stroke="var(--color-profit)" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              Expenses trending down <TrendingDown className="h-4 w-4" />
            </div>
          </CardFooter>
        </Card>

        {/* Area Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Area Chart - Stacked</CardTitle>
            <CardDescription>Users and Sessions by week</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={areaChartConfig}>
              <AreaChart accessibilityLayer data={areaChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Area type="monotone" dataKey="sessions" stackId="1" stroke="var(--color-sessions)" fill="var(--color-sessions)" fillOpacity={0.4} />
                <Area type="monotone" dataKey="users" stackId="1" stroke="var(--color-users)" fill="var(--color-users)" fillOpacity={0.4} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Pie Chart</CardTitle>
            <CardDescription>Browser market share</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ChartContainer config={pieChartConfig} className="h-[300px]">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={pieChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Radial Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Radial Bar Chart</CardTitle>
            <CardDescription>Goal progress comparison</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ChartContainer config={radialChartConfig} className="h-[300px]">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="30%"
                outerRadius="100%"
                data={radialChartData}
                startAngle={180}
                endAngle={0}
              >
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <RadialBar dataKey="value" background />
                <Legend iconSize={10} layout="horizontal" verticalAlign="bottom" />
              </RadialBarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Multi-Series Bar Chart (6 series) */}
        <Card>
          <CardHeader>
            <CardTitle>Multi-Series Bar Chart (6 Series)</CardTitle>
            <CardDescription>Regional breakdown showcasing multiple chart colors</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={multiSeriesConfig}>
              <BarChart accessibilityLayer data={multiSeriesData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="region" tickLine={false} tickMargin={10} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="azure" fill="var(--color-azure)" radius={4} />
                <Bar dataKey="greenHaze" fill="var(--color-greenHaze)" radius={4} />
                <Bar dataKey="chetwode" fill="var(--color-chetwode)" radius={4} />
                <Bar dataKey="denim" fill="var(--color-denim)" radius={4} />
                <Bar dataKey="orange" fill="var(--color-orange)" radius={4} />
                <Bar dataKey="other" fill="var(--color-other)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </ComponentPageLayout>
  )
}
