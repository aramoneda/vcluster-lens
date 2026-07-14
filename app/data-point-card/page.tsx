"use client"

import { ArrowUpRight, LayoutGrid, MoreHorizontal, Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { DataPointCard } from "@/components/ui/data-point-card"
import { ComponentPageLayout } from "@/components/component-page-layout"
import { registryMetadata } from "@/lib/registry-metadata"

export const dynamic = "force-dynamic"

export const meta = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "data-point-card",
  type: "registry:ui",
  title: "Data Point Card",
  description: "Compact metric card for key user-facing values with optional icon, action, trend, badge, and CTA.",
  ...registryMetadata["data-point-card"],
  files: [
    {
      path: "ui/data-point-card.tsx",
      type: "registry:ui",
    },
  ],
  dependencies: [
    "class-variance-authority",
  ],
}

const colors = ["blue", "gray", "light", "superLight"] as const
const sizes = ["sm", "md", "lg"] as const

function DataPointCardExample() {
  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Color Matrix</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {colors.map((color) => (
            <DataPointCard
              key={color}
              color={color}
              size="md"
              label="Available Cash"
              value="$50,000.00"
              topLeftIcon={<LayoutGrid className="size-4" />}
              trend={{ icon: <ArrowUpRight className="size-4" />, label: "+8.2%", tone: "success" }}
              badge={<Badge variant="outline" color="neutral" size="sm">YTD</Badge>}
              action={{ ariaLabel: "More options", icon: <MoreHorizontal className="size-4" />, onClick: () => {} }}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Size Matrix</h3>
        <div className="flex flex-wrap items-end gap-4">
          {sizes.map((size) => (
            <DataPointCard
              key={size}
              color="light"
              size={size}
              label="Portfolio Value"
              value="$1.24M"
              trend={{ icon: <ArrowUpRight className="size-4" />, label: "+2.6%", tone: "success" }}
              badge={<Badge variant="filled" color="sky" size="sm">Live</Badge>}
              cta={size === "lg" ? { label: "View details", href: "#" } : undefined}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Structured Props</h3>
        <div className="grid gap-4 xl:grid-cols-2">
          <DataPointCard
            color="gray"
            size="sm"
            label="Available Cash"
            value="$50,000.00"
          />

          <DataPointCard
            color="blue"
            size="sm"
            label="Net Contributions"
            value="$12,800"
            topLeftIcon={<Sparkles className="size-4" />}
          />

          <DataPointCard
            color="superLight"
            size="md"
            label="Quarterly Return"
            value="8.4%"
            action={{ ariaLabel: "Open metric actions", icon: <MoreHorizontal className="size-4" />, onClick: () => {} }}
            trend={{ icon: <ArrowUpRight className="size-4" />, label: "+1.2%", tone: "success" }}
          />

          <DataPointCard
            color="light"
            size="md"
            label="Rebalancing Status"
            value="On Track"
            badge={<Badge variant="filled" color="grass" size="sm">Healthy</Badge>}
            valueAccessory={<span className="[font:var(--font-body-small-semibold)] text-[var(--color-text-secondary)]">Updated 2h ago</span>}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Large Variant with CTA</h3>
        <div className="flex flex-wrap gap-4">
          <DataPointCard
            color="light"
            size="lg"
            label="Available Cash"
            value="$50,000.00"
            topLeftIcon={<LayoutGrid className="size-4" />}
            action={{ ariaLabel: "More options", icon: <MoreHorizontal className="size-4" />, onClick: () => {} }}
            trend={{ icon: <ArrowUpRight className="size-4" />, label: "+8.2%", tone: "success" }}
            badge={<Badge variant="outline" color="sky" size="sm">YTD</Badge>}
            valueAccessory={<span className="[font:var(--font-body-medium-semibold)] text-[var(--color-text-secondary)]">vs last quarter</span>}
            cta={{ label: "View details", href: "#" }}
          />
        </div>
      </div>
    </div>
  )
}

export default function DataPointCardPage() {
  return (
    <ComponentPageLayout meta={meta}>
      <DataPointCardExample />
    </ComponentPageLayout>
  )
}
