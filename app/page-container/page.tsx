"use client"

import { ComponentPageLayout } from "@/components/component-page-layout"
import { PageContainer, PageHeader } from "@/components/ui/page-container"
import { registryMetadata } from "@/lib/registry-metadata"

export const dynamic = "force-dynamic"

export const meta = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "page-container",
  type: "registry:ui",
  title: "Page Container",
  description: "Responsive page container with header and content spacing.",
  ...registryMetadata["page-container"],
  files: [
    {
      path: "ui/page-container.tsx",
      type: "registry:ui",
    },
  ],
  dependencies: ["lucide-react"],
  registryDependencies: ["icon-button"],
}

export default function PageContainerPage() {
  return (
    <ComponentPageLayout
      meta={meta}
      title="Page Container"
      description="Container with responsive margins, header, and content spacing."
    >
      <div className="space-y-8">
        <PageContainer className="border border-[var(--color-stroke-default)] rounded-[var(--radius-m)] bg-[var(--color-surface-background)] py-6">
          <PageHeader
            title="Accounts Overview"
            timestamp={Date.now()}
            onRefresh={() => {}}
            actions={
              <>
                <button className="h-9 rounded-[var(--radius-s)] border border-[var(--color-stroke-default)] px-3 text-sm font-semibold">
                  Filters
                </button>
                <button className="h-9 rounded-[var(--radius-s)] border border-[var(--color-stroke-default)] px-3 text-sm font-semibold">
                  Export
                </button>
              </>
            }
          />
          <div className="rounded-[var(--radius-s)] border border-dashed border-[var(--color-stroke-default)] p-6 text-sm text-[var(--color-text-secondary)]">
            Content area
          </div>
        </PageContainer>
      </div>
    </ComponentPageLayout>
  )
}
