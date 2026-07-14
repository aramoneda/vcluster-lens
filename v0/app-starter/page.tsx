"use client"

/**
 * v0 starter contract:
 * - Keep button icons and labels on one horizontal row inside `<Button>`.
 * - Do not use `flex-col`, `h-auto`, or stacked icon/text button layouts.
 * - Use `var(--font-family-brand)` and BRD typography tokens for all custom text styles.
 * - Prefer composed BRD font tokens for full text styles and use granular tokens only when an API needs separate values.
 * - Do not use generic `text-*` / `leading-*` Tailwind typography utilities when a BRD font token exists.
 * - Use BRD `var(--spacing-sp-X)` tokens for layout spacing.
 * - Do not add shadows unless a BRD component already includes them or the user explicitly asks for them.
 * - Use Highcharts for data visualization via `@/lib/brd-highcharts-theme`.
 * - Use AG Grid for application tables via `@/lib/brd-ag-grid-theme`.
 * - Wrap AG Grid in a borderless BRD surface container with `var(--spacing-sp-8)` padding and no extra outer border.
 * - Keep chart series colors in BRD chart swatch order 1 through 24.
 *
 * Dashboard layout:
 * - Build the workspace with `DashboardGrid` + `DashboardGridItem` (the canonical
 *   responsive, drag-reorderable, gap-filling grid). Give each item a stable `id`
 *   and a `defaultSize` (S/M/L). The grid handles column spans, dense packing,
 *   and fluid widget sizing automatically — it measures its OWN width, so it
 *   adapts to the nav/toolbar open/close state.
 */

import {
  Filter,
  Plus,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/ui/page-container"
import { FinancialAdvisorShell } from "@/components/shells/financial-advisor-shell"
import type { TopNavigationItem } from "@/components/ui/top-navigation"
import {
  DashboardGrid,
  DashboardGridItem,
} from "@/components/ui/dashboard-grid"
import { AssetAllocationWidget } from "@/components/dashboard/asset-allocation-widget"
import { TopHoldingsWidget } from "@/components/dashboard/top-holdings-widget"
import { MyClientsWidget } from "@/components/dashboard/my-clients-widget"
import { AlertsWidget } from "@/components/dashboard/alerts-widget"
import { NewsWidget } from "@/components/dashboard/news-widget"
import { RecentActivityWidget } from "@/components/dashboard/recent-activity-widget"

const topNavigationItems: TopNavigationItem[] = [
  { id: "overview", label: "Overview" },
  { id: "workflows", label: "Workflows" },
  { id: "analytics", label: "Analytics" },
  { id: "documents", label: "Documents" },
]

export function AppStarterPage() {
  return (
    <FinancialAdvisorShell
      topNavigationProps={{
        items: topNavigationItems,
        activeId: "overview",
      }}
    >
      <div className="flex flex-col gap-[var(--spacing-sp-24)]">
        <PageHeader
          title="Advisor Dashboard"
          timestamp={Date.now()}
          actions={(
            <>
              <Button variant="outline" icon={<Filter className="h-4 w-4" />}>Filters</Button>
              <Button icon={<Plus className="h-4 w-4" />}>New workflow</Button>
            </>
          )}
        />

        <DashboardGrid>
          <DashboardGridItem id="asset-allocation" defaultSize="M">
            <AssetAllocationWidget />
          </DashboardGridItem>
          <DashboardGridItem id="top-holdings" defaultSize="M">
            <TopHoldingsWidget />
          </DashboardGridItem>
          <DashboardGridItem id="my-clients" defaultSize="M">
            <MyClientsWidget />
          </DashboardGridItem>
          <DashboardGridItem id="alerts" defaultSize="S">
            <AlertsWidget />
          </DashboardGridItem>
          <DashboardGridItem id="news" defaultSize="S">
            <NewsWidget />
          </DashboardGridItem>
          <DashboardGridItem id="recent-activity" defaultSize="M">
            <RecentActivityWidget />
          </DashboardGridItem>
        </DashboardGrid>
      </div>
    </FinancialAdvisorShell>
  )
}

export default AppStarterPage
