'use client'

import * as React from 'react'
import {
  AllCommunityModule,
  ModuleRegistry,
  type ColDef,
} from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'

import { Widget, type WidgetSize } from '@/components/ui/widget'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { brdAgGridTheme } from '@/lib/brd-ag-grid-theme'

ModuleRegistry.registerModules([AllCommunityModule])

type ClientStatus = 'On Track' | 'Review' | 'At Risk'
type Client = {
  name: string
  initials: string
  aum: number
  risk: 'Conservative' | 'Balanced' | 'Growth'
  lastContact: string
  status: ClientStatus
}

const CLIENTS: Client[] = [
  { name: 'Eleanor Whitfield', initials: 'EW', aum: 4_200_000, risk: 'Balanced', lastContact: '2 days ago', status: 'On Track' },
  { name: 'Marcus Chen', initials: 'MC', aum: 2_850_000, risk: 'Growth', lastContact: '1 week ago', status: 'Review' },
  { name: 'Sofia Alvarez', initials: 'SA', aum: 1_960_000, risk: 'Conservative', lastContact: 'Yesterday', status: 'On Track' },
  { name: 'David Okafor', initials: 'DO', aum: 1_540_000, risk: 'Growth', lastContact: '3 weeks ago', status: 'At Risk' },
  { name: 'Priya Nair', initials: 'PN', aum: 980_000, risk: 'Balanced', lastContact: '4 days ago', status: 'On Track' },
]

const TOTAL_AUM = CLIENTS.reduce((s, c) => s + c.aum, 0)

const currency = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const compactCurrency = (n: number) =>
  `$${(n / 1_000_000).toFixed(1)}M`

const statusColor: Record<ClientStatus, React.ComponentProps<typeof Badge>['color']> = {
  'On Track': 'grass',
  Review: 'sky',
  'At Risk': 'negative',
}

function StatusBadge({ status }: { status: ClientStatus }) {
  return (
    <Badge variant="outline" color={statusColor[status]} size="sm">
      {status}
    </Badge>
  )
}

const columns: ColDef<Client>[] = [
  { field: 'name', headerName: 'Client', flex: 1.4, minWidth: 160 },
  { field: 'aum', headerName: 'AUM', flex: 1, minWidth: 120, valueFormatter: (p) => currency(p.value as number) },
  { field: 'risk', headerName: 'Risk', width: 130 },
  { field: 'lastContact', headerName: 'Last Contact', width: 130 },
  {
    field: 'status',
    headerName: 'Status',
    width: 120,
    cellRenderer: (p: { value: ClientStatus }) => p.value,
  },
]

export interface MyClientsWidgetProps {
  size?: WidgetSize
  onSizeChange?: (size: WidgetSize) => void
  fluid?: boolean
  resizable?: boolean
}

export function MyClientsWidget(props: MyClientsWidgetProps) {
  return (
    <Widget
      title="My Clients"
      timestamp={Date.now()}
      viewMoreLink={{ label: 'View book', href: '#' }}
      renderS={
        <div className="flex h-full flex-col justify-center gap-[var(--spacing-sp-8)]">
          <span className="text-[var(--color-text-primary)] [font:var(--font-headline-h2)]">
            {CLIENTS.length}
          </span>
          <span className="text-[var(--color-text-secondary)] [font:var(--font-body-medium)]">
            Active clients
          </span>
          <span className="mt-[var(--spacing-sp-8)] text-[var(--color-text-primary)] [font:var(--font-body-large)]">
            {currency(TOTAL_AUM)}
          </span>
          <span className="text-[var(--color-text-secondary)] [font:var(--font-body-medium)]">
            Total AUM
          </span>
        </div>
      }
      renderM={
        <ul className="flex flex-col gap-[var(--spacing-sp-12)]">
          {CLIENTS.map((c) => (
            <li key={c.name} className="flex items-center gap-[var(--spacing-sp-12)]">
              <Avatar>
                <AvatarFallback>{c.initials}</AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-[var(--color-text-primary)] [font:var(--font-body-medium-semibold)]">
                  {c.name}
                </span>
                <span className="text-[var(--color-text-secondary)] [font:var(--font-body-medium)]">
                  {compactCurrency(c.aum)} · {c.risk}
                </span>
              </div>
              <StatusBadge status={c.status} />
            </li>
          ))}
        </ul>
      }
      renderL={
        <div className="rounded-[var(--radius-s)] bg-[var(--color-surface-widget)] p-[var(--spacing-sp-8)]">
          <div style={{ height: 260 }}>
            <AgGridReact<Client>
              theme={brdAgGridTheme}
              rowData={CLIENTS}
              columnDefs={columns}
              headerHeight={36}
              rowHeight={40}
              suppressCellFocus
            />
          </div>
        </div>
      }
      {...props}
    />
  )
}
