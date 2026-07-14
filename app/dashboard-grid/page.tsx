'use client'

import { ComponentPageLayout } from '@/components/component-page-layout'
import { DashboardGrid, DashboardGridItem } from '@/components/ui/dashboard-grid'
import { AssetAllocationWidget } from '@/components/dashboard/asset-allocation-widget'
import { TopHoldingsWidget } from '@/components/dashboard/top-holdings-widget'
import { MyClientsWidget } from '@/components/dashboard/my-clients-widget'
import { AlertsWidget } from '@/components/dashboard/alerts-widget'
import { NewsWidget } from '@/components/dashboard/news-widget'
import { RecentActivityWidget } from '@/components/dashboard/recent-activity-widget'
import { registryMetadata } from '@/lib/registry-metadata'

export const meta = {
  $schema: 'https://ui.shadcn.com/schema/registry-item.json',
  name: 'dashboard-grid',
  type: 'registry:ui',
  ...registryMetadata['dashboard-grid'],
  files: [{ path: 'ui/dashboard-grid.tsx', type: 'registry:ui' }],
  dependencies: [
    'lucide-react',
    '@dnd-kit/core',
    '@dnd-kit/sortable',
    '@dnd-kit/utilities',
    '@dnd-kit/modifiers',
  ],
  registryDependencies: [
    'https://shad-brd-registery.vercel.app/r/brdcomp-widget.json',
  ],
}

export default function DashboardGridPage() {
  return (
    <ComponentPageLayout meta={meta}>
      <div className="flex flex-col gap-[var(--spacing-sp-16)]">
        <div className="flex flex-col gap-[var(--spacing-sp-8)]">
          <h3 className="text-[var(--color-text-primary)] [font:var(--font-headline-h5)]">
            Responsive, reorderable dashboard
          </h3>
          <p className="text-[var(--color-text-secondary)] [font:var(--font-body-medium)]">
            {
              'Resize the viewport: column spans recompute from the grid container width and tiles densely repack to fill gaps. Hover a widget for its grip handle (top-left) to drag-reorder, or use a widget\u2019s own corner handle to change its S/M/L size.'
            }
          </p>
        </div>
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
    </ComponentPageLayout>
  )
}
