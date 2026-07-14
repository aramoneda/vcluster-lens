'use client'

import * as React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { AllCommunityModule, ModuleRegistry, type ColDef } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'

import { Widget, type WidgetSize } from '@/components/ui/widget'
import {
  applyBrdHighchartsTheme,
  brdChartSwatches,
  getBrdDonutChartOptions,
} from '@/lib/brd-highcharts-theme'
import { DonutCenterText } from '@/lib/brd-highcharts-components'
import { brdAgGridTheme } from '@/lib/brd-ag-grid-theme'

ModuleRegistry.registerModules([AllCommunityModule])
applyBrdHighchartsTheme(Highcharts)

type AllocationRow = {
  assetClass: string
  value: number
  pct: number
  delta: number
}

const ALLOCATION: AllocationRow[] = [
  { assetClass: 'Equities', value: 1_420_000, pct: 47, delta: 1.8 },
  { assetClass: 'Fixed Income', value: 720_000, pct: 24, delta: -0.6 },
  { assetClass: 'Alternatives', value: 450_000, pct: 15, delta: 0.9 },
  { assetClass: 'Real Estate', value: 270_000, pct: 9, delta: 0.2 },
  { assetClass: 'Cash', value: 150_000, pct: 5, delta: -0.3 },
]

const TOTAL_VALUE = ALLOCATION.reduce((sum, r) => sum + r.value, 0)

const currency = (n: number) =>
  n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })

/** Donut data with BRD swatch colors, shared by the chart and legend. */
const DONUT_DATA = ALLOCATION.map((r, i) => ({
  name: r.assetClass,
  value: r.pct,
  color: brdChartSwatches[i % brdChartSwatches.length],
  /** Carried through to the tooltip so it can show the dollar value. */
  dollars: r.value,
}))

/** Donut chart that reflows when its container resizes (grid span changes). */
function AllocationDonut({ size }: { size: number }) {
  const ref = React.useRef<HighchartsReact.RefObject>(null)
  const wrapRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const node = wrapRef.current
    if (!node) return
    const observer = new ResizeObserver(() => {
      ref.current?.chart?.reflow()
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const options = React.useMemo<Highcharts.Options>(() => {
    const base = getBrdDonutChartOptions(DONUT_DATA)
    const baseSeries = (base.series?.[0] ?? {}) as Highcharts.SeriesPieOptions
    return {
      ...base,
      chart: { ...base.chart, height: size, width: size },
      tooltip: {
        ...base.tooltip,
        // Keep the kit's themed (dark-mode-safe) tooltip box, but show the
        // dollar value alongside the percentage for this allocation donut.
        pointFormat: undefined,
        pointFormatter: function (this: Highcharts.Point) {
          const dollars = (this.options as { dollars?: number }).dollars
          return (
            `${this.name}: <b>${this.percentage?.toFixed(1)}%</b>` +
            (typeof dollars === 'number' ? `<br/>${currency(dollars)}` : '')
          )
        },
      },
      series: [
        {
          ...baseSeries,
          data: DONUT_DATA.map((d) => ({
            name: d.name,
            y: d.value,
            color: d.color,
            dollars: d.dollars,
          })),
        },
      ],
    }
  }, [size])

  return (
    <div
      ref={wrapRef}
      className="relative mx-auto"
      style={{ width: size, height: size }}
    >
      <HighchartsReact ref={ref} highcharts={Highcharts} options={options} />
      <DonutCenterText
        size={size}
        label="Total"
        primaryValue={currency(TOTAL_VALUE)}
      />
    </div>
  )
}

function LegendList() {
  return (
    <ul className="flex flex-col gap-[var(--spacing-sp-8)]">
      {ALLOCATION.map((r, i) => (
        <li key={r.assetClass} className="flex items-center gap-[var(--spacing-sp-8)]">
          <span
            aria-hidden
            className="size-3 shrink-0 rounded-[var(--radius-xxs)]"
            style={{ backgroundColor: brdChartSwatches[i % brdChartSwatches.length] }}
          />
          <span className="min-w-0 flex-1 truncate text-[var(--color-text-primary)] [font:var(--font-body-medium)]">
            {r.assetClass}
          </span>
          <span className="text-[var(--color-text-secondary)] [font:var(--font-body-medium-semibold)]">
            {r.pct}%
          </span>
        </li>
      ))}
    </ul>
  )
}

const columns: ColDef<AllocationRow>[] = [
  { field: 'assetClass', headerName: 'Asset Class', flex: 1.4, minWidth: 130 },
  {
    field: 'value',
    headerName: 'Value',
    flex: 1,
    minWidth: 110,
    valueFormatter: (p) => currency(p.value as number),
  },
  {
    field: 'pct',
    headerName: '%',
    width: 80,
    valueFormatter: (p) => `${p.value}%`,
  },
  {
    field: 'delta',
    headerName: 'Δ 1M',
    width: 90,
    valueFormatter: (p) => `${(p.value as number) > 0 ? '+' : ''}${p.value}%`,
    cellStyle: (p) => ({
      color:
        (p.value as number) >= 0
          ? 'var(--color-state-success)'
          : 'var(--color-state-error)',
    }),
  },
]

function AllocationGrid() {
  return (
    <div className="rounded-[var(--radius-s)] bg-[var(--color-surface-widget)] p-[var(--spacing-sp-8)]">
      <div style={{ height: 220 }}>
        <AgGridReact<AllocationRow>
          theme={brdAgGridTheme}
          rowData={ALLOCATION}
          columnDefs={columns}
          headerHeight={36}
          rowHeight={36}
          suppressCellFocus
        />
      </div>
    </div>
  )
}

export interface AssetAllocationWidgetProps {
  size?: WidgetSize
  onSizeChange?: (size: WidgetSize) => void
  fluid?: boolean
  resizable?: boolean
}

export function AssetAllocationWidget(props: AssetAllocationWidgetProps) {
  return (
    <Widget
      title="Asset Allocation"
      timestamp={Date.now()}
      viewMoreLink={{ label: 'View allocation', href: '#' }}
      renderS={
        <div className="flex h-full items-center justify-center">
          <AllocationDonut size={180} />
        </div>
      }
      renderM={
        <div className="flex h-full flex-col gap-[var(--spacing-sp-16)] md:flex-row md:items-center">
          <div className="md:flex-1">
            <AllocationDonut size={220} />
          </div>
          <div className="md:flex-1">
            <LegendList />
          </div>
        </div>
      }
      renderL={
        <div className="flex h-full flex-col gap-[var(--spacing-sp-16)] lg:flex-row">
          <div className="flex flex-col gap-[var(--spacing-sp-16)] lg:w-[320px] lg:shrink-0">
            <AllocationDonut size={220} />
            <LegendList />
          </div>
          <div className="min-w-0 flex-1">
            <AllocationGrid />
          </div>
        </div>
      }
      {...props}
    />
  )
}
