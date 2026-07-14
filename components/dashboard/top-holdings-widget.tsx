'use client'

import * as React from 'react'
import {
  AllCommunityModule,
  ModuleRegistry,
  type ColDef,
} from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'

import { Widget, type WidgetSize } from '@/components/ui/widget'
import { brdAgGridTheme } from '@/lib/brd-ag-grid-theme'

ModuleRegistry.registerModules([AllCommunityModule])

type Holding = {
  symbol: string
  name: string
  weight: number
  dayChange: number
  marketValue: number
  sector: string
  monthChange: number
}

const HOLDINGS: Holding[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', weight: 8.4, dayChange: 1.2, marketValue: 252_000, sector: 'Technology', monthChange: 4.1 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', weight: 7.1, dayChange: 0.6, marketValue: 213_000, sector: 'Technology', monthChange: 3.3 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', weight: 6.5, dayChange: -1.4, marketValue: 195_000, sector: 'Technology', monthChange: 9.8 },
  { symbol: 'JPM', name: 'JPMorgan Chase', weight: 4.9, dayChange: 0.3, marketValue: 147_000, sector: 'Financials', monthChange: -1.2 },
  { symbol: 'XOM', name: 'Exxon Mobil', weight: 4.2, dayChange: -0.8, marketValue: 126_000, sector: 'Energy', monthChange: 2.0 },
]

const currency = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

const pctStyle = (p: { value: unknown }) => ({
  color:
    (p.value as number) >= 0
      ? 'var(--color-state-success)'
      : 'var(--color-state-error)',
})
const pctFmt = (p: { value: unknown }) =>
  `${(p.value as number) > 0 ? '+' : ''}${p.value}%`

const baseColumns: ColDef<Holding>[] = [
  { field: 'symbol', headerName: 'Symbol', width: 96 },
  { field: 'name', headerName: 'Name', flex: 1, minWidth: 150 },
  { field: 'weight', headerName: 'Weight', width: 96, valueFormatter: (p) => `${p.value}%` },
  { field: 'dayChange', headerName: 'Day %', width: 96, valueFormatter: pctFmt, cellStyle: pctStyle },
]

const extraColumns: ColDef<Holding>[] = [
  { field: 'marketValue', headerName: 'Market Value', flex: 1, minWidth: 130, valueFormatter: (p) => currency(p.value as number) },
  { field: 'sector', headerName: 'Sector', width: 130 },
  { field: 'monthChange', headerName: '1M %', width: 96, valueFormatter: pctFmt, cellStyle: pctStyle },
]

function HoldingsGrid({ columns, height }: { columns: ColDef<Holding>[]; height: number }) {
  return (
    <div className="rounded-[var(--radius-s)] bg-[var(--color-surface-widget)] p-[var(--spacing-sp-8)]">
      <div style={{ height }}>
        <AgGridReact<Holding>
          theme={brdAgGridTheme}
          rowData={HOLDINGS}
          columnDefs={columns}
          headerHeight={36}
          rowHeight={36}
          suppressCellFocus
        />
      </div>
    </div>
  )
}

export interface TopHoldingsWidgetProps {
  size?: WidgetSize
  onSizeChange?: (size: WidgetSize) => void
  fluid?: boolean
  resizable?: boolean
}

export function TopHoldingsWidget(props: TopHoldingsWidgetProps) {
  return (
    <Widget
      title="Top Holdings"
      timestamp={Date.now()}
      viewMoreLink={{ label: 'All holdings', href: '#' }}
      renderS={
        <ul className="flex flex-col gap-[var(--spacing-sp-12)]">
          {HOLDINGS.slice(0, 3).map((h) => (
            <li key={h.symbol} className="flex items-center justify-between gap-[var(--spacing-sp-8)]">
              <div className="flex min-w-0 flex-col">
                <span className="text-[var(--color-text-primary)] [font:var(--font-body-medium-semibold)]">
                  {h.symbol}
                </span>
                <span className="truncate text-[var(--color-text-secondary)] [font:var(--font-body-medium)]">
                  {h.name}
                </span>
              </div>
              <span className="text-[var(--color-text-primary)] [font:var(--font-body-medium-semibold)]">
                {h.weight}%
              </span>
            </li>
          ))}
        </ul>
      }
      renderM={<HoldingsGrid columns={baseColumns} height={220} />}
      renderL={<HoldingsGrid columns={[...baseColumns, ...extraColumns]} height={260} />}
      {...props}
    />
  )
}
