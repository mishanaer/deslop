"use client"

import type { CSSProperties } from "react"

import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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
import { BellIcon, CheckIcon, Code2Icon, PlusIcon } from "@/lib/icons"

const navigation = [
  { label: "Overview", icon: CheckIcon },
  { label: "Projects", icon: Code2Icon },
  { label: "Notifications", icon: BellIcon },
]

function SidebarBlock() {
  return (
    <SidebarProvider
      className="relative min-h-[560px] overflow-hidden rounded-section border"
      style={{ "--sidebar-width": "14rem", "--sidebar": "var(--background)" } as CSSProperties}
    >
      <Sidebar collapsible="offcanvas" className="absolute h-full border-r">
        <SidebarHeader className="p-4">
          <div className="font-semibold">Deslop</div>
          <div className="text-xs text-muted-foreground">Product workspace</div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigation.map((item, index) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton isActive={index === 0}>
                      <item.icon className={index === 0 ? "size-6!" : undefined} />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="p-3">
          <Button className="w-full"><PlusIcon /> New project</Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="min-w-0 bg-card">
        <header className="flex h-14 items-center gap-3 border-b px-4">
          <SidebarTrigger />
          <span className="font-medium">Overview</span>
        </header>
        <div className="grid flex-1 gap-4 p-4 [&>div]:border-0 [&>div]:bg-subtle-surface [&>div]:shadow-none sm:grid-cols-2">
          <div className="rounded-section border p-5">
            <p className="font-medium">Active projects</p>
            <p className="mt-2 text-3xl font-semibold">12</p>
          </div>
          <div className="rounded-section border p-5">
            <p className="font-medium">Team members</p>
            <p className="mt-2 text-3xl font-semibold">24</p>
          </div>
          <div className="min-h-64 rounded-section border p-5 sm:col-span-2">
            <p className="font-medium">Workspace activity</p>
            <p className="mt-2 text-sm text-muted-foreground">Select an item in the sidebar to open its content.</p>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export { SidebarBlock }
