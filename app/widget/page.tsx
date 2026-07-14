'use client'

import { TrendingUp } from 'lucide-react'

import { ComponentPageLayout } from '@/components/component-page-layout'
import { Widget } from '@/components/ui/widget'
import { WidgetGrid, WidgetGridItem } from '@/components/ui/widget-grid'
import { registryMetadata } from '@/lib/registry-metadata'

export const meta = {
  $schema: 'https://ui.shadcn.com/schema/registry-item.json',
  name: 'widget',
  type: 'registry:ui',
  ...registryMetadata.widget,
  files: [
    { path: 'ui/widget.tsx', type: 'registry:ui' },
    { path: 'ui/widget-grid.tsx', type: 'registry:ui' },
  ],
  dependencies: [
    'class-variance-authority',
    'lucide-react',
    '@dnd-kit/core',
    '@dnd-kit/sortable',
    '@dnd-kit/utilities',
  ],
}

const REVENUE = {
  value: '$1,234,567',
  change: '+12.5%',
}

function SizeBadge({ size }: { size: string }) {
  return (
    <span className="inline-flex items-center rounded-[var(--radius-xs)] bg-[var(--color-surface-hover)] px-[var(--spacing-sp-8)] py-[var(--spacing-sp-4)] text-[var(--color-text-secondary)] [font:var(--font-body-small-semibold)]">
      {size}
    </span>
  )
}

/** Distinct content per size so resizing visibly swaps the representation. */
function revenueSlots() {
  const headline = (
    <div className="flex flex-wrap items-center gap-[var(--spacing-sp-12)]">
      <span className="text-[var(--color-text-primary)] [font:var(--font-headline-h3)]">
        {REVENUE.value}
      </span>
      <div className="flex items-center gap-[var(--spacing-sp-4)]">
        <TrendingUp className="size-5 text-[var(--color-state-success)]" />
        <span className="text-[var(--color-state-success)] [font:var(--font-body-medium-semibold)]">
          {REVENUE.change}
        </span>
      </div>
    </div>
  )

  return {
    renderS: (
      <div className="flex flex-1 flex-col justify-between gap-[var(--spacing-sp-16)]">
        <SizeBadge size="S — condensed mobile view" />
        {headline}
        <p className="text-[var(--color-text-secondary)] [font:var(--font-body-medium)]">
          A single KPI and trend. The S view is the mobile representation of M.
        </p>
      </div>
    ),
    renderM: (
      <div className="flex flex-1 flex-col gap-[var(--spacing-sp-16)]">
        <SizeBadge size="M — default view (also shown on Zoom)" />
        {headline}
        <div className="grid flex-1 gap-[var(--spacing-sp-12)] sm:grid-cols-2">
          <div className="rounded-[var(--radius-xs)] bg-[var(--color-surface-background)] p-[var(--spacing-sp-16)] text-[var(--color-text-secondary)] [font:var(--font-body-medium)]">
            Primary chart region.
          </div>
          <div className="rounded-[var(--radius-xs)] bg-[var(--color-surface-background)] p-[var(--spacing-sp-16)] text-[var(--color-text-secondary)] [font:var(--font-body-medium)]">
            Summary metrics.
          </div>
        </div>
      </div>
    ),
    renderL: (
      <div className="flex flex-1 flex-col gap-[var(--spacing-sp-16)]">
        <SizeBadge size="L — expanded view" />
        {headline}
        <div className="grid flex-1 gap-[var(--spacing-sp-12)] md:grid-cols-3">
          <div className="rounded-[var(--radius-xs)] bg-[var(--color-surface-background)] p-[var(--spacing-sp-16)] text-[var(--color-text-secondary)] [font:var(--font-body-medium)] md:col-span-2">
            Large chart with full axis detail.
          </div>
          <div className="rounded-[var(--radius-xs)] bg-[var(--color-surface-background)] p-[var(--spacing-sp-16)] text-[var(--color-text-secondary)] [font:var(--font-body-medium)]">
            Breakdown table / legend.
          </div>
        </div>
      </div>
    ),
  }
}

export default function WidgetPage() {
  const slots = revenueSlots()

  return (
    <ComponentPageLayout meta={meta}>
      <div className="flex flex-col gap-[var(--spacing-sp-40)]">
        {/* Resizable single widget */}
        <section className="flex flex-col gap-[var(--spacing-sp-16)]">
          <div className="flex flex-col gap-[var(--spacing-sp-8)]">
            <h3 className="text-[var(--color-text-primary)] [font:var(--font-headline-h5)]">
              Size-keyed content + resize handle
            </h3>
            <p className="text-[var(--color-text-secondary)] [font:var(--font-body-medium)]">
              {
                'Drag the bottom-right corner (or focus it and use arrow keys) to cycle S → M → L. Each size renders its own content; Zoom repeats the M view.'
              }
            </p>
          </div>
          <Widget
            size="M"
            title="Revenue Overview"
            timestamp={Date.now() - 2 * 60 * 60 * 1000}
            onRefresh={() => console.log('[v0] Refresh')}
            onInfoClick={() => console.log('[v0] Info')}
            menuItems={[
              { label: 'Export data', onClick: () => console.log('[v0] Export') },
              { label: 'Settings', onClick: () => console.log('[v0] Settings') },
            ]}
            sourceLink={{ label: 'View source', href: '#' }}
            viewMoreLink={{ label: 'View details', href: '#' }}
            renderS={slots.renderS}
            renderM={slots.renderM}
            renderL={slots.renderL}
          />
        </section>

        {/* Draggable grid */}
        <section className="flex flex-col gap-[var(--spacing-sp-16)]">
          <div className="flex flex-col gap-[var(--spacing-sp-8)]">
            <h3 className="text-[var(--color-text-primary)] [font:var(--font-headline-h5)]">
              WidgetGrid — drag to reorder
            </h3>
            <p className="text-[var(--color-text-secondary)] [font:var(--font-body-medium)]">
              {
                'Hover a widget to reveal the grip handle (top-left), then drag to reposition. Each widget still resizes independently via its own corner handle.'
              }
            </p>
          </div>
          <WidgetGrid>
            {[1, 2, 3].map((n) => (
              <WidgetGridItem key={n} id={`widget-${n}`}>
                <Widget
                  size="S"
                  title={`Panel ${n}`}
                  timestamp={Date.now() - n * 30 * 60 * 1000}
                  onRefresh={() => console.log('[v0] Refresh', n)}
                  renderS={
                    <div className="flex flex-1 flex-col justify-center gap-[var(--spacing-sp-8)]">
                      <span className="text-[var(--color-text-primary)] [font:var(--font-headline-h3)]">
                        {`${n * 12}.${n}%`}
                      </span>
                      <span className="text-[var(--color-text-secondary)] [font:var(--font-body-medium)]">
                        Allocation share
                      </span>
                    </div>
                  }
                  renderM={
                    <div className="flex flex-1 items-center justify-center rounded-[var(--radius-xs)] bg-[var(--color-surface-background)] text-[var(--color-text-secondary)] [font:var(--font-body-medium)]">
                      {`Panel ${n} — medium content`}
                    </div>
                  }
                />
              </WidgetGridItem>
            ))}
          </WidgetGrid>
        </section>
      </div>
    </ComponentPageLayout>
  )
}
