'use client'

import * as React from 'react'

import { Widget, type WidgetSize } from '@/components/ui/widget'
import { Link } from '@/components/ui/link'

type NewsItem = {
  id: string
  headline: string
  source: string
  time: string
  summary: string
}

const NEWS: NewsItem[] = [
  { id: '1', headline: 'Fed holds rates steady, signals patience on cuts', source: 'Market Wire', time: '18m ago', summary: 'Policymakers kept the benchmark unchanged, citing sticky core inflation and resilient labor data.' },
  { id: '2', headline: 'Tech megacaps lead broad equity rally', source: 'Bloomberg', time: '1h ago', summary: 'Semiconductors extended gains as AI capex guidance topped consensus across the sector.' },
  { id: '3', headline: 'Treasury yields slip ahead of CPI print', source: 'Reuters', time: '3h ago', summary: 'The 10-year eased to 4.18% as traders positioned for softer inflation.' },
  { id: '4', headline: 'Energy sector lags on crude pullback', source: 'WSJ', time: '5h ago', summary: 'Brent slipped below $79 on demand concerns and rising inventories.' },
]

function HeadlineMeta({ item }: { item: NewsItem }) {
  return (
    <span className="text-[var(--color-text-secondary)] [font:var(--font-body-medium)]">
      {item.source} · {item.time}
    </span>
  )
}

export interface NewsWidgetProps {
  size?: WidgetSize
  onSizeChange?: (size: WidgetSize) => void
  fluid?: boolean
  resizable?: boolean
}

export function NewsWidget(props: NewsWidgetProps) {
  return (
    <Widget
      title="Market News"
      timestamp={Date.now()}
      viewMoreLink={{ label: 'More headlines', href: '#' }}
      renderS={
        <div className="flex h-full flex-col gap-[var(--spacing-sp-8)]">
          <Link href="#" className="[font:var(--font-body-medium-semibold)]">
            {NEWS[0].headline}
          </Link>
          <HeadlineMeta item={NEWS[0]} />
        </div>
      }
      renderM={
        <ul className="flex flex-col gap-[var(--spacing-sp-16)]">
          {NEWS.map((n) => (
            <li key={n.id} className="flex flex-col gap-[var(--spacing-sp-4)]">
              <Link href="#" className="[font:var(--font-body-medium-semibold)]">
                {n.headline}
              </Link>
              <HeadlineMeta item={n} />
            </li>
          ))}
        </ul>
      }
      renderL={
        <ul className="flex flex-col gap-[var(--spacing-sp-16)]">
          {NEWS.map((n) => (
            <li
              key={n.id}
              className="flex flex-col gap-[var(--spacing-sp-4)] border-b border-[var(--color-stroke-light)] pb-[var(--spacing-sp-16)] last:border-0 last:pb-0"
            >
              <Link href="#" className="[font:var(--font-body-medium-semibold)]">
                {n.headline}
              </Link>
              <HeadlineMeta item={n} />
              <p className="m-0 text-[var(--color-text-secondary)] [font:var(--font-body-medium)]">
                {n.summary}
              </p>
            </li>
          ))}
        </ul>
      }
      {...props}
    />
  )
}
