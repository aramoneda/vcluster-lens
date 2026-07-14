"use client"

import { useState } from "react"
import {
  Bookmark,
  Building2,
  Calendar,
  Grid3X3,
  Home,
  Info,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Users,
} from "lucide-react"

import { Shell } from "@/components/ui/shell"
import { PageHeader } from "@/components/ui/page-container"
import type { LeftNavigationItem } from "@/components/ui/left-navigation"
import type { SideToolbarItem } from "@/components/ui/side-toolbar"
import type { TopNavigationItem } from "@/components/ui/top-navigation"
import { cn } from "@/lib/utils"

interface ShellDemoProps {
  embedded?: boolean
  className?: string
}

const topNavItems: TopNavigationItem[] = [
  {
    id: "overview",
    label: "Overview",
  },
  {
    id: "clients",
    label: "Clients",
    children: [
      { id: "clients-active", label: "Active clients" },
      { id: "clients-pending", label: "Pending clients" },
      { id: "clients-archived", label: "Archived" },
    ],
  },
  {
    id: "reporting",
    label: "Reporting",
    children: [
      { id: "reports-1", label: "Monthly" },
      { id: "reports-2", label: "Quarterly" },
    ],
  },
  {
    id: "settings",
    label: "Settings",
  },
]

const leftNavItems: LeftNavigationItem[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "clients", label: "Clients", icon: Users },
  { id: "business", label: "Business", icon: Building2 },
  { id: "apps", label: "Apps", icon: Grid3X3 },
]

const toolbarItems: SideToolbarItem[] = [
  {
    id: "info",
    label: "Info",
    icon: Info,
  },
  {
    id: "bookmarks",
    label: "Bookmarks",
    icon: Bookmark,
  },
  {
    id: "messages",
    label: "Messages",
    icon: MessageSquare,
  },
  {
    id: "calendar",
    label: "Calendar",
    icon: Calendar,
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
  },
]

export function ShellDemo({ embedded, className }: ShellDemoProps) {
  const [activeTopId, setActiveTopId] = useState(topNavItems[0]?.id)
  const [activeLeftId, setActiveLeftId] = useState(leftNavItems[1]?.id)
  const [activeToolbarId, setActiveToolbarId] = useState(toolbarItems[0]?.id)

  return (
    <div
      className={cn(
        embedded &&
          "rounded-[var(--radius-m)] border border-[var(--color-stroke-default)] bg-[var(--color-surface-background)]",
        className
      )}
    >
      <Shell
        headerProps={{
          userName: "Ada Lovelace",
          userInitials: "AL",
          notificationCount: 3,
        }}
        topNavigationProps={{
          items: topNavItems,
          activeId: activeTopId,
          onItemSelect: (item) => setActiveTopId(item.id),
        }}
        leftNavigationProps={{
          items: leftNavItems,
          activeId: activeLeftId,
          onItemSelect: (item) => setActiveLeftId(item.id),
          position: embedded ? "absolute" : "fixed",
          className: embedded ? "!left-0 !top-0 !h-full" : undefined,
        }}
        sideToolbarProps={{
          items: toolbarItems,
          activeId: activeToolbarId,
          onItemSelect: (item) => setActiveToolbarId(item.id),
          position: embedded ? "absolute" : "fixed",
          className: embedded ? "!right-4 !top-1/2" : undefined,
        }}
        contentClassName={embedded ? "min-h-[600px] overflow-hidden" : undefined}
      >
        <div className="flex flex-col gap-6">
          <PageHeader
            title="Account Overview"
            timestamp={Date.now()}
            onRefresh={() => {}}
            actions={
              <>
                <button className="h-9 rounded-[var(--radius-s)] border border-[var(--color-stroke-default)] px-3 text-sm font-semibold">
                  Filters
                </button>
                <button className="h-9 rounded-[var(--radius-s)] border border-[var(--color-stroke-default)] px-3 text-sm font-semibold">
                  Export
                </button>
              </>
            }
          />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[var(--radius-s)] border border-dashed border-[var(--color-stroke-default)] p-6 text-sm text-[var(--color-text-secondary)]">
              Primary content
            </div>
            <div className="rounded-[var(--radius-s)] border border-dashed border-[var(--color-stroke-default)] p-6 text-sm text-[var(--color-text-secondary)]">
              Secondary content
            </div>
          </div>
        </div>
      </Shell>
    </div>
  )
}
