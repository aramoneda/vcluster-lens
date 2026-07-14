"use client"

import * as React from "react"
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"

import { ComponentPageLayout } from "@/components/component-page-layout"
import { registryMetadata } from "@/lib/registry-metadata"
import {
  applyBrdHighchartsTheme,
  brdChartSwatches,
  getBrdDonutChartOptions,
} from "@/lib/brd-highcharts-theme"
import { DonutCenterText } from "@/lib/brd-highcharts-components"

// Apply BRD chart defaults once for this page.
applyBrdHighchartsTheme(Highcharts)

export const meta = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "brd-highcharts",
  type: "registry:ui",
  ...registryMetadata["brd-highcharts"],
  files: [
    { path: "brd-highcharts-theme.ts", type: "registry:lib", target: "lib/brd-highcharts-theme.ts" },
    { path: "tooltip-utilities.ts", type: "registry:lib", target: "lib/tooltip-utilities.ts" },
    { path: "chart-utils.ts", type: "registry:lib", target: "lib/chart-utils.ts" },
    {
      path: "brd-highcharts-components.ts",
      type: "registry:lib",
      target: "lib/brd-highcharts-components.ts",
    },
    { path: "ui/donut-center-text.tsx", type: "registry:ui" },
  ],
  dependencies: ["highcharts", "highcharts-react-official"],
}

const DONUT_DATA = [
  { name: "Equities", value: 55, color: brdChartSwatches[0] },
  { name: "Fixed Income", value: 30, color: brdChartSwatches[1] },
  { name: "Cash", value: 15, color: brdChartSwatches[2] },
]

const COLUMN_OPTIONS: Highcharts.Options = {
  chart: { type: "column", height: 320, backgroundColor: "transparent" },
  title: { text: "" },
  xAxis: { categories: ["Q1", "Q2", "Q3", "Q4"] },
  yAxis: { title: { text: "" } },
  legend: { enabled: true },
  series: [
    {
      type: "column",
      name: "Inflows",
      data: [120, 150, 180, 140],
      color: brdChartSwatches[0],
    },
    {
      type: "column",
      name: "Outflows",
      data: [80, 95, 70, 110],
      color: brdChartSwatches[1],
    },
  ],
}

function ChartCard({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-[var(--spacing-sp-16)]">
      <div className="flex flex-col gap-[var(--spacing-sp-8)]">
        <h3 className="text-[var(--color-text-primary)] [font:var(--font-headline-h5)]">{title}</h3>
        <p className="text-[var(--color-text-secondary)] [font:var(--font-body-medium)]">
          {description}
        </p>
      </div>
      <div className="rounded-[var(--radius-md)] border border-[var(--color-stroke-light)] bg-[var(--color-surface-foreground)] p-[var(--spacing-sp-24)]">
        {children}
      </div>
    </section>
  )
}

export default function BrdHighchartsPage() {
  return (
    <ComponentPageLayout meta={meta}>
      <div className="flex flex-col gap-[var(--spacing-sp-40)]">
        <ChartCard
          title="Themed column chart"
          description="Series colors are assigned from brdChartSwatches in swatch order. Axes, gridlines, fonts, and tooltips all come from the BRD theme via applyBrdHighchartsTheme."
        >
          <HighchartsReact highcharts={Highcharts} options={COLUMN_OPTIONS} />
        </ChartCard>

        <ChartCard
          title="Donut with center text"
          description="getBrdDonutChartOptions builds a BRD donut; the DonutCenterText overlay renders responsive, token-colored center text that shrinks one typography step at a time to fit — never truncated."
        >
          <div className="flex justify-center">
            <div className="relative" style={{ width: 220, height: 220 }}>
              <HighchartsReact highcharts={Highcharts} options={getBrdDonutChartOptions(DONUT_DATA)} />
              <DonutCenterText size={220} label="Total AUM" primaryValue="$2.5M" secondaryValue="2024 YTD" />
            </div>
          </div>
        </ChartCard>
      </div>
    </ComponentPageLayout>
  )
}
