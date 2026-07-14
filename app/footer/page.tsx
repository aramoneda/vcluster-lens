"use client"

import { ComponentPageLayout } from "@/components/component-page-layout"
import { Footer } from "@/components/ui/footer"
import { registryMetadata } from "@/lib/registry-metadata"

export const dynamic = "force-dynamic"

export const meta = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "footer",
  type: "registry:ui",
  title: "Footer",
  description: "Responsive footer with logo and copyright line.",
  ...registryMetadata["footer"],
  files: [
    {
      path: "ui/footer.tsx",
      type: "registry:ui",
    },
  ],
  dependencies: [],
}

export default function FooterPage() {
  return (
    <ComponentPageLayout
      meta={meta}
      title="Footer"
      description="Footer layout with logo and copyright text."
    >
      <div className="space-y-6">
        <Footer />
        <div className="max-w-4xl">
          <Footer />
        </div>
        <div className="max-w-xl">
          <Footer />
        </div>
      </div>
    </ComponentPageLayout>
  )
}
