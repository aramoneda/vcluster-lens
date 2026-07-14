import { ComponentPageLayout } from "@/components/component-page-layout"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { registryMetadata } from "@/lib/registry-metadata"

// Added dynamic export for force-dynamic rendering
export const dynamic = "force-dynamic"

// Added meta export for registry
export const meta = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "label",
  type: "registry:ui",
  title: "Label",
  description: "Renders an accessible label associated with controls.",
  ...registryMetadata["label"],
  files: [
    {
      path: "ui/label.tsx",
      type: "registry:ui",
    },
  ],
  dependencies: ["@radix-ui/react-label"],
}

function LabelExample() {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  )
}

export default function LabelPage() {
  return (
    <ComponentPageLayout meta={meta}>
      <LabelExample />
    </ComponentPageLayout>
  )
}
