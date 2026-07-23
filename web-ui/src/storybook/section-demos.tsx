import { DashboardBlock } from "@/components/blocks/dashboard"
import { LoginBlock } from "@/components/blocks/login"
import { SignupBlock } from "@/components/blocks/signup"
import { SidebarBlock } from "@/components/blocks/sidebar"
import {
  ChartAreaDefault,
  ChartAreaGradient,
  ChartAreaIcons,
  ChartAreaInteractive,
  ChartAreaLegend,
  ChartAreaLinear,
  ChartAreaStacked,
  ChartAreaStackedExpand,
  ChartAreaStep,
} from "@/components/charts/area"

function BlockPreview({ slug }: { slug: string }) {
  switch (slug) {
    case "dashboard-01": return <DashboardBlock />
    case "sidebar-01": return <SidebarBlock />
    case "login-01": return <LoginBlock />
    case "signup-01": return <SignupBlock />
    default: return null
  }
}

function AreaChartPreview({ slug }: { slug: string }) {
  switch (slug) {
    case "interactive": return <ChartAreaInteractive />
    case "default": return <ChartAreaDefault />
    case "linear": return <ChartAreaLinear />
    case "step": return <ChartAreaStep />
    case "legend": return <ChartAreaLegend />
    case "stacked": return <ChartAreaStacked />
    case "stacked-expand": return <ChartAreaStackedExpand />
    case "icons": return <ChartAreaIcons />
    case "gradient": return <ChartAreaGradient />
    default: return null
  }
}

export { AreaChartPreview, BlockPreview }
