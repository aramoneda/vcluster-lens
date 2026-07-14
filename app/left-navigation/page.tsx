"use client"

import { useState } from "react"
import { Building2, Grid3X3, Home, LayoutDashboard, Users } from "lucide-react"
import { ComponentPageLayout } from "@/components/component-page-layout"
import { LeftNavigation, type LeftNavigationItem } from "@/components/ui/left-navigation"
import { registryMetadata } from "@/lib/registry-metadata"

export const dynamic = "force-dynamic"

export const meta = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "left-navigation",
  type: "registry:ui",
  title: "Left Navigation",
  description: "Fixed left-side L1 navigation with icon labels and hover tooltips.",
  ...registryMetadata["left-navigation"],
  files: [
    {
      path: "ui/left-navigation.tsx",
      type: "registry:ui",
    },
  ],
  dependencies: [],
  registryDependencies: ["button", "tooltip"],
}

const navItems: LeftNavigationItem[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "clients", label: "Clients", icon: Users },
  { id: "business", label: "Business", icon: Building2 },
  { id: "apps", label: "Apps", icon: Grid3X3 },
]

export default function LeftNavigationPage() {
  const [activeId, setActiveId] = useState(navItems[2].id)

  return (
    <ComponentPageLayout
      meta={meta}
      title="Left Navigation"
      description="Fixed left navigation with active L1 state and hover tooltips."
    >
      <div className="relative min-h-[520px] overflow-hidden rounded-[var(--radius-m)] border border-[var(--color-stroke-default)] bg-[var(--color-surface-background)]">
        <div className="max-w-2xl space-y-4 p-6 pl-28">
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Demo
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)]">
            The left navigation stays fixed on the viewport edge. Hover to view
            tooltips and click items to set the active L1 view.
          </p>
        </div>

        <LeftNavigation
          items={navItems}
          activeId={activeId}
          onItemSelect={(item) => setActiveId(item.id)}
          className="absolute h-full"
        />
      </div>
    </ComponentPageLayout>
  )
}
