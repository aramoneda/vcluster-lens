import { ComponentPageLayout } from "@/components/component-page-layout"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { registryMetadata } from "@/lib/registry-metadata"

// Added dynamic export for force-dynamic rendering
export const dynamic = "force-dynamic"

export const meta = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "aspect-ratio",
  type: "registry:ui",
  title: "Aspect Ratio",
  description: "Displays content within a desired ratio.",
  ...registryMetadata["aspect-ratio"],
  files: [
    {
      path: "ui/aspect-ratio.tsx",
      type: "registry:ui",
    },
  ],
  dependencies: ["@radix-ui/react-aspect-ratio"],
}

function AspectRatioExample() {
  return (
    <div className="w-[450px]">
      <AspectRatio ratio={16 / 9} className="bg-muted">
        <img
          src="/placeholder.svg?height=225&width=400"
          alt="Photo by Drew Beamer"
          className="rounded-md object-cover h-full w-full"
        />
      </AspectRatio>
    </div>
  )
}

export default function AspectRatioPage() {
  return (
    <ComponentPageLayout meta={meta}>
      <AspectRatioExample />
    </ComponentPageLayout>
  )
}
