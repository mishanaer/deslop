"use client"

import type { CSSProperties } from "react"

import { ChartAreaInteractive } from "@/components/charts/area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { BellIcon, CheckIcon, Code2Icon, PlusIcon } from "@/lib/icons"

const metrics = [
  { label: "Revenue", value: "$45,231", change: "+20.1%" },
  { label: "Subscriptions", value: "+2,350", change: "+12.2%" },
  { label: "Active users", value: "12,234", change: "+8.4%" },
]

const projects = [
  { name: "Web UI", status: "Ready", owner: "Design Systems" },
  { name: "Mini App", status: "In progress", owner: "Product" },
  { name: "Primitives", status: "Ready", owner: "Platform" },
]

function DashboardBlock() {
  return (
    <SidebarProvider
      className="relative min-h-[760px] overflow-hidden rounded-section border"
      style={{ "--sidebar-width": "14rem", "--sidebar": "var(--background)" } as CSSProperties}
    >
      <Sidebar collapsible="offcanvas" className="absolute h-full border-r">
        <SidebarHeader className="p-4 font-semibold">Deslop</SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem><SidebarMenuButton isActive><CheckIcon className="size-6!" /><span>Overview</span></SidebarMenuButton></SidebarMenuItem>
                <SidebarMenuItem><SidebarMenuButton><Code2Icon /><span>Projects</span></SidebarMenuButton></SidebarMenuItem>
                <SidebarMenuItem><SidebarMenuButton><BellIcon /><span>Notifications</span></SidebarMenuButton></SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="min-w-0 bg-card">
        <header className="flex h-14 items-center gap-3 border-b px-4">
          <SidebarTrigger />
          <span className="font-medium">Dashboard</span>
          <Button size="sm" className="ml-auto"><PlusIcon /> Add project</Button>
        </header>
        <div className="flex flex-col gap-5 p-4 [&_[data-slot=card]]:border-0 [&_[data-slot=card]]:bg-accent [&_[data-slot=card]]:shadow-none lg:p-6">
          <div className="grid gap-4 md:grid-cols-3">
            {metrics.map((metric) => (
              <Card key={metric.label}>
                <CardHeader>
                  <CardDescription>{metric.label}</CardDescription>
                  <CardTitle className="text-2xl">{metric.value}</CardTitle>
                </CardHeader>
                <CardContent><span className="text-sm text-muted-foreground">{metric.change} from last month</span></CardContent>
              </Card>
            ))}
          </div>
          <ChartAreaInteractive />
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
              <CardDescription>Current design-system workspaces.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Status</TableHead><TableHead>Owner</TableHead></TableRow></TableHeader>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project.name}>
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell>
                        <Badge
                          variant={project.status === "Ready" ? "filled" : "gray"}
                        >
                          {project.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{project.owner}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export { DashboardBlock }
