"use client"

import { useId, useState, type ReactNode } from "react"
import {
  Area,
  AreaChart as RechartsAreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Code2Icon, PanelLeftIcon } from "@/lib/icons"

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--accent-blue)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--accent-cyan)",
  },
} satisfies ChartConfig

const chartConfigWithIcons = {
  desktop: {
    label: "Desktop",
    color: "var(--accent-blue)",
    icon: Code2Icon,
  },
  mobile: {
    label: "Mobile",
    color: "var(--accent-cyan)",
    icon: PanelLeftIcon,
  },
} satisfies ChartConfig

type AreaCurve = "natural" | "linear" | "step"

type AreaChartCardProps = {
  title: string
  description: string
  curve?: AreaCurve
  legend?: boolean
  stacked?: boolean
  expanded?: boolean
  gradient?: boolean
  icons?: boolean
  data?: typeof chartData
  action?: ReactNode
}

function AreaChartCard({
  title,
  description,
  curve = "natural",
  legend = false,
  stacked = false,
  expanded = false,
  gradient = false,
  icons = false,
  data = chartData,
  action,
}: AreaChartCardProps) {
  const gradientId = useId().replaceAll(":", "")
  const config = icons ? chartConfigWithIcons : chartConfig

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        {action ? <CardAction>{action}</CardAction> : null}
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-64 w-full">
          <RechartsAreaChart
            accessibilityLayer
            data={data}
            margin={{ left: 4, right: 12 }}
            stackOffset={expanded ? "expand" : undefined}
          >
            {gradient ? (
              <defs>
                <linearGradient id={`${gradientId}-desktop`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-desktop)" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="var(--color-desktop)" stopOpacity={0.06} />
                </linearGradient>
                <linearGradient id={`${gradientId}-mobile`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-mobile)" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="var(--color-mobile)" stopOpacity={0.04} />
                </linearGradient>
              </defs>
            ) : null}
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value: string) => value.slice(0, 3)}
            />
            {expanded ? (
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value: number) => `${Math.round(value * 100)}%`}
              />
            ) : null}
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            {legend ? <ChartLegend content={<ChartLegendContent />} /> : null}
            <Area
              dataKey="mobile"
              type={curve}
              fill={gradient ? `url(#${gradientId}-mobile)` : "var(--color-mobile)"}
              fillOpacity={gradient ? 1 : 0.16}
              stroke="var(--color-mobile)"
              strokeOpacity={0.55}
              stackId={stacked ? "visitors" : undefined}
            />
            <Area
              dataKey="desktop"
              type={curve}
              fill={gradient ? `url(#${gradientId}-desktop)` : "var(--color-desktop)"}
              fillOpacity={gradient ? 1 : 0.24}
              stroke="var(--color-desktop)"
              strokeOpacity={0.55}
              stackId={stacked ? "visitors" : undefined}
            />
          </RechartsAreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        January – June 2024
      </CardFooter>
    </Card>
  )
}

function ChartAreaInteractive() {
  const [range, setRange] = useState<"six" | "three">("six")
  const data = range === "six" ? chartData : chartData.slice(-3)

  return (
    <AreaChartCard
      title="Area Chart — Interactive"
      description="Switch between three and six months."
      data={data}
      gradient
      action={
        <div className="flex gap-1">
          <Button
            size="sm"
            variant={range === "three" ? "secondary" : "ghost"}
            onClick={() => setRange("three")}
          >
            3M
          </Button>
          <Button
            size="sm"
            variant={range === "six" ? "secondary" : "ghost"}
            onClick={() => setRange("six")}
          >
            6M
          </Button>
        </div>
      }
    />
  )
}

function ChartAreaDefault() {
  return <AreaChartCard title="Area Chart" description="A simple natural area chart." />
}

function ChartAreaLinear() {
  return <AreaChartCard title="Area Chart — Linear" description="Straight segments between values." curve="linear" />
}

function ChartAreaStep() {
  return <AreaChartCard title="Area Chart — Step" description="Stepped transitions between values." curve="step" />
}

function ChartAreaLegend() {
  return <AreaChartCard title="Area Chart — Legend" description="A chart with a series legend." legend />
}

function ChartAreaStacked() {
  return <AreaChartCard title="Area Chart — Stacked" description="Two visitor series stacked together." stacked />
}

function ChartAreaStackedExpand() {
  return <AreaChartCard title="Area Chart — Stacked Expanded" description="Series shown as a percentage of the total." stacked expanded />
}

function ChartAreaIcons() {
  return <AreaChartCard title="Area Chart — Icons" description="Legend items use icons from Primitives." legend icons />
}

function ChartAreaGradient() {
  return <AreaChartCard title="Area Chart — Gradient" description="Token-based gradient fills." gradient />
}

export {
  ChartAreaDefault,
  ChartAreaGradient,
  ChartAreaIcons,
  ChartAreaInteractive,
  ChartAreaLegend,
  ChartAreaLinear,
  ChartAreaStacked,
  ChartAreaStackedExpand,
  ChartAreaStep,
}
