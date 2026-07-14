import { ComponentPageLayout } from "@/components/component-page-layout"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { registryMetadata } from "@/lib/registry-metadata"

// Added dynamic export for force-dynamic rendering
export const dynamic = "force-dynamic"

const tags = Array.from({ length: 50 }).map((_, i, a) => `v1.2.0-beta.${a.length - i}`)

// Added meta export for proper page metadata
export const meta = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "scroll-area",
  type: "registry:ui",
  title: "Scroll Area",
  description: "A scrollable container with custom scrollbars.",
  ...registryMetadata["scroll-area"],
  dependencies: ["@radix-ui/react-scroll-area"],
  files: [
    {
      path: "ui/scroll-area.tsx",
      type: "registry:ui",
    },
  ],
}

export default function ScrollAreaPage() {
  return (
    <ComponentPageLayout meta={meta}>
      <div className="space-y-4">
        <ScrollArea className="h-72 w-48 rounded-md border">
          <div className="p-4">
            <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
            {tags.map((tag, index) => (
              <>
                <div key={tag} className="text-sm">
                  {tag}
                </div>
                {index < tags.length - 1 && <Separator className="my-2" />}
              </>
            ))}
          </div>
        </ScrollArea>
      </div>
    </ComponentPageLayout>
  )
}
