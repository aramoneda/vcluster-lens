'use client'

import * as React from 'react'
import { ArrowDownLeft, ArrowUpRight, FileText, UserPlus } from 'lucide-react'

import { Widget, type WidgetSize } from '@/components/ui/widget'

type ActivityType = 'buy' | 'sell' | 'document' | 'client'
type Activity = {
  id: string
  type: ActivityType
  action: string
  detail: string
  time: string
  day: 'Today' | 'Yesterday'
}

const ACTIVITY: Activity[] = [
  { id: '1', type: 'buy', action: 'Bought 1,200 AAPL', detail: 'Whitfield · $252,000', time: '09:42', day: 'Today' },
  { id: '2', type: 'document', action: 'IPS signed', detail: 'Alvarez · annual review', time: '08:15', day: 'Today' },
  { id: '3', type: 'client', action: 'New client onboarded', detail: 'Priya Nair · Balanced', time: '16:30', day: 'Yesterday' },
  { id: '4', type: 'sell', action: 'Sold 800 XOM', detail: 'Chen · $98,400', time: '14:05', day: 'Yesterday' },
  { id: '5', type: 'document', action: 'Statement generated', detail: 'Q2 · 5 accounts', time: '11:20', day: 'Yesterday' },
]

const typeMeta: Record<ActivityType, { icon: React.ReactNode; tint: string }> = {
  buy: { icon: <ArrowUpRight size={16} />, tint: 'var(--color-state-success)' },
  sell: { icon: <ArrowDownLeft size={16} />, tint: 'var(--color-state-error)' },
  document: { icon: <FileText size={16} />, tint: 'var(--color-text-secondary)' },
  client: { icon: <UserPlus size={16} />, tint: 'var(--color-icon-brand)' },
}

function ActivityRow({ item }: { item: Activity }) {
  const meta = typeMeta[item.type]
  return (
    <li className="flex items-start gap-[var(--spacing-sp-12)]">
      <span
        aria-hidden
        className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-[var(--color-surface-background)]"
        style={{ color: meta.tint }}
      >
        {meta.icon}
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-[var(--color-text-primary)] [font:var(--font-body-medium-semibold)]">
          {item.action}
        </span>
        <span className="truncate text-[var(--color-text-secondary)] [font:var(--font-body-medium)]">
          {item.detail}
        </span>
      </div>
      <span className="shrink-0 text-[var(--color-text-secondary)] [font:var(--font-body-medium)]">
        {item.time}
      </span>
    </li>
  )
}

export interface RecentActivityWidgetProps {
  size?: WidgetSize
  onSizeChange?: (size: WidgetSize) => void
  fluid?: boolean
  resizable?: boolean
}

export function RecentActivityWidget(props: RecentActivityWidgetProps) {
  const days: Array<'Today' | 'Yesterday'> = ['Today', 'Yesterday']
  return (
    <Widget
      title="Recent Activity"
      timestamp={Date.now()}
      viewMoreLink={{ label: 'Full history', href: '#' }}
      renderS={
        <div className="flex h-full flex-col gap-[var(--spacing-sp-8)]">
          <ActivityRow item={ACTIVITY[0]} />
        </div>
      }
      renderM={
        <ul className="flex flex-col gap-[var(--spacing-sp-16)]">
          {ACTIVITY.map((a) => (
            <ActivityRow key={a.id} item={a} />
          ))}
        </ul>
      }
      renderL={
        <div className="flex flex-col gap-[var(--spacing-sp-16)]">
          {days.map((day) => {
            const rows = ACTIVITY.filter((a) => a.day === day)
            if (rows.length === 0) return null
            return (
              <div key={day} className="flex flex-col gap-[var(--spacing-sp-12)]">
                <span className="text-[var(--color-text-secondary)] [font:var(--font-body-medium-semibold)]">
                  {day}
                </span>
                <ul className="flex flex-col gap-[var(--spacing-sp-16)]">
                  {rows.map((a) => (
                    <ActivityRow key={a.id} item={a} />
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      }
      {...props}
    />
  )
}
