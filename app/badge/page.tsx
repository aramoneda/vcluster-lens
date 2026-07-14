import { Badge } from "@/components/ui/badge"
import { ComponentPageLayout } from "@/components/component-page-layout"
import { registryMetadata } from "@/lib/registry-metadata"

// Added dynamic export for force-dynamic rendering
export const dynamic = "force-dynamic"

export const meta = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "badge",
  type: "registry:ui",
  title: "Badge",
  description: "Displays a badge or a component that looks like a badge.",
  ...registryMetadata["badge"],
  files: [
    {
      path: "ui/badge.tsx",
      type: "registry:ui",
    },
  ],
  dependencies: [
    "@radix-ui/react-slot",
    "class-variance-authority",
  ],
}

const colors = ["default", "sky", "grass", "bored", "negative", "neutral", "dark"] as const

function BadgeExample() {
  return (
    <div className="space-y-8">
      {/* Filled Variants */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Filled</h3>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <Badge key={color} variant="filled" color={color}>
              {color}
            </Badge>
          ))}
        </div>
      </div>

      {/* Outline Variants */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Outline</h3>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <Badge key={color} variant="outline" color={color}>
              {color}
            </Badge>
          ))}
        </div>
      </div>

      {/* Size Variants */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Sizes</h3>
        <div className="flex flex-wrap items-center gap-2">
          <Badge size="sm">Small</Badge>
          <Badge size="default">Default</Badge>
          <Badge size="lg">Large</Badge>
        </div>
      </div>

      {/* Combined Example */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Combined</h3>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="filled" color="grass" size="sm">Success</Badge>
          <Badge variant="filled" color="negative" size="default">Error</Badge>
          <Badge variant="outline" color="sky" size="lg">Info</Badge>
          <Badge variant="filled" color="bored" size="default">Warning</Badge>
        </div>
      </div>
    </div>
  )
}

export default function BadgePage() {
  return (
    <ComponentPageLayout meta={meta}>
      <BadgeExample />
    </ComponentPageLayout>
  )
}
