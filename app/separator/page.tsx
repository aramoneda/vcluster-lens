import { ComponentPageLayout } from "@/components/component-page-layout"
import { Separator } from "@/components/ui/separator"
import { registryMetadata } from "@/lib/registry-metadata"

// Added dynamic export for force-dynamic rendering
export const dynamic = "force-dynamic"

// Added meta export for proper page metadata
export const meta = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "separator",
  type: "registry:ui",
  title: "Separator",
  description: "A horizontal or vertical divider for separating content.",
  ...registryMetadata["separator"],
  dependencies: ["@radix-ui/react-separator"],
  files: [
    {
      path: "ui/separator.tsx",
      type: "registry:ui",
    },
  ],
}

export default function SeparatorPage() {
  return (
    <ComponentPageLayout meta={meta}>
      <div className="space-y-4">
        <div>
          <div className="space-y-1">
            <h4 className="text-sm font-medium leading-none">Radix Primitives</h4>
            <p className="text-sm text-muted-foreground">An open-source UI component library.</p>
          </div>
          <Separator className="my-4" />
          <div className="flex h-5 items-center space-x-4 text-sm">
            <div>Blog</div>
            <Separator orientation="vertical" />
            <div>Docs</div>
            <Separator orientation="vertical" />
            <div>Source</div>
          </div>
        </div>
      </div>
    </ComponentPageLayout>
  )
}
