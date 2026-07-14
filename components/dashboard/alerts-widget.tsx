'use client'

import * as React from 'react'
import { AlertTriangle, Info, ShieldAlert } from 'lucide-react'

import { Widget, type WidgetSize } from '@/components/ui/widget'
import { Badge } from '@/components/ui/badge'
import { Chip } from '@/components/ui/chip'

type Severity = 'Critical' | 'Warning' | 'Info'
type AlertItem = {
  id: string
  severity: Severity
  title: string
  detail: string
  time: string
}

const ALERTS: AlertItem[] = [
  { id: '1', severity: 'Critical', title: 'Cash drift exceeds 5%', detail: 'Okafor Family Trust is 6.2% over cash target.', time: '12m ago' },
  { id: '2', severity: 'Critical', title: 'Concentration breach', detail: 'Chen account NVDA weight above 6% policy.', time: '40m ago' },
  { id: '3', severity: 'Warning', title: 'Review due', detail: 'Annual review for Alvarez is overdue.', time: '2h ago' },
  { id: '4', severity: 'Warning', title: 'Document expiring', detail: 'IPS for Whitfield expires in 7 days.', time: '5h ago' },
  { id: '5', severity: 'Info', title: 'Dividend posted', detail: 'AAPL dividend credited across 3 accounts.', time: 'Yesterday' },
]

const severityMeta: Record<
  Severity,
  { color: React.ComponentProps<typeof Badge>['color']; dot: string; icon: React.ReactNode }
> = {
  Critical: { color: 'negative', dot: 'var(--color-state-error)', icon: <ShieldAlert size={16} /> },
  Warning: { color: 'sky', dot: 'var(--color-state-warning)', icon: <AlertTriangle size={16} /> },
  Info: { color: 'neutral', dot: 'var(--color-text-secondary)', icon: <Info size={16} /> },
}

const criticalCount = ALERTS.filter((a) => a.severity === 'Critical').length

function AlertRow({ item, withDetail }: { item: AlertItem; withDetail?: boolean }) {
  const meta = severityMeta[item.severity]
  return (
    <li className="flex items-start gap-[var(--spacing-sp-8)]">
      <span
        aria-hidden
        className="mt-1 size-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: meta.dot }}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-[var(--color-text-primary)] [font:var(--font-body-medium-semibold)]">
          {item.title}
        </span>
        {withDetail && (
          <span className="text-[var(--color-text-secondary)] [font:var(--font-body-medium)]">
            {item.detail}
          </span>
        )}
      </div>
      <span className="shrink-0 text-[var(--color-text-secondary)] [font:var(--font-body-medium)]">
        {item.time}
      </span>
    </li>
  )
}

export interface AlertsWidgetProps {
  size?: WidgetSize
  onSizeChange?: (size: WidgetSize) => void
  fluid?: boolean
  resizable?: boolean
}

export function AlertsWidget(props: AlertsWidgetProps) {
  const [filter, setFilter] = React.useState<Severity | 'All'>('All')
  const visible = filter === 'All' ? ALERTS : ALERTS.filter((a) => a.severity === filter)

  return (
    <Widget
      title="Alerts"
      timestamp={Date.now()}
      viewMoreLink={{ label: 'All alerts', href: '#' }}
      renderS={
        <div className="flex h-full flex-col gap-[var(--spacing-sp-12)]">
          <div className="flex items-center gap-[var(--spacing-sp-8)]">
            <Badge variant="filled" color="negative">
              {criticalCount} critical
            </Badge>
          </div>
          <AlertRow item={ALERTS[0]} withDetail />
        </div>
      }
      renderM={
        <ul className="flex flex-col gap-[var(--spacing-sp-12)]">
          {ALERTS.slice(0, 4).map((a) => (
            <AlertRow key={a.id} item={a} />
          ))}
        </ul>
      }
      renderL={
        <div className="flex h-full flex-col gap-[var(--spacing-sp-16)]">
          <div className="flex flex-wrap items-center gap-[var(--spacing-sp-8)]">
            {(['All', 'Critical', 'Warning', 'Info'] as const).map((f) => (
              <Chip key={f} selected={filter === f} onClick={() => setFilter(f)}>
                {f}
              </Chip>
            ))}
          </div>
          <ul className="flex flex-col gap-[var(--spacing-sp-12)]">
            {visible.map((a) => (
              <AlertRow key={a.id} item={a} withDetail />
            ))}
          </ul>
        </div>
      }
      {...props}
    />
  )
}
