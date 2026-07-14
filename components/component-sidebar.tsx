"use client"

import { SidebarGroupLabel } from "@/components/ui/sidebar"

import type React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import Link from "next/link"

interface ComponentSidebarProps {
  currentComponent: string
  children: React.ReactNode
}

const overviewItems = [
  { label: "Home", href: "/" },
]

const starterItems = [
  { label: "App Starter", href: "/app-starter" },
]

// Alphabetized component pages from app/*
const components = [
  "accordion",
  "alert",
  "alert-dialog",
  "aspect-ratio",
  "avatar",
  "badge",
  "breadcrumb",
  "brd-highcharts",
  "button",
  "button-group",
  "calendar",
  "card",
  "carousel",
  "chart",
  "chip",
  "checkbox",
  "collapsible",
  "command",
  "context-menu",
  "currency-selector",
  "dashboard-grid",
  "data-point-card",
  "dialog",
  "drawer",
  "dropdown-menu",
  "expandable-panel",
  "footer",
  "header",
  "hover-card",
  "icon-button",
  "input",
  "input-otp",
  "label",
  "language-selector",
  "left-navigation",
  "link",
  "menubar",
  "page-container",
  "pagination",
  "popover",
  "progress",
  "radio-group",
  "resizable",
  "scroll-area",
  "select",
  "separator",
  "sheet",
  "shell",
  "side-toolbar",
  "skeleton",
  "slider",
  "sonner",
  "split-button",
  "stepper",
  "switch",
  "table",
  "tabs",
  "textarea",
  "theme",
  "toast",
  "toggle",
  "top-navigation",
  "tooltip",
  "tree-view",
  "user-menu",
  "widget",
]

export function ComponentSidebar({ currentComponent, children }: ComponentSidebarProps) {
  return (
    <SidebarProvider>
      <Sidebar className="border-none bg-transparent">
        <SidebarContent className="bg-transparent">
          <SidebarGroup>
            <SidebarGroupLabel>Overview</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {overviewItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={currentComponent === "home"}
                      className="hover:bg-transparent data-[active=true]:bg-transparent data-[active=true]:font-medium"
                    >
                      <Link href={item.href}>{item.label}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Starters</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {starterItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={currentComponent === "app-starter"}
                      className="hover:bg-transparent data-[active=true]:bg-transparent data-[active=true]:font-medium"
                    >
                      <Link href={item.href}>{item.label}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Components</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {components.map((component) => (
                  <SidebarMenuItem key={component}>
                    <SidebarMenuButton
                      asChild
                      isActive={currentComponent === component}
                      className="hover:bg-transparent data-[active=true]:bg-transparent data-[active=true]:font-medium"
                    >
                      <Link href={`/${component}`}>
                        {component
                          .split("-")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <main className="flex-1">
        {/* Removed border and simplified top bar */}
        <div className="flex h-14 items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="hover:bg-transparent" />
            <div>
              <h1 className="text-lg font-semibold">
                shadcn/v0 registry
              </h1>
            </div>
          </div>
        </div>
        {children}
      </main>
    </SidebarProvider>
  )
}
