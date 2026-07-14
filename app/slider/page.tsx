import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { ComponentPageLayout } from "@/components/component-page-layout"
import { registryMetadata } from "@/lib/registry-metadata"

// Added dynamic export for force-dynamic rendering
export const dynamic = "force-dynamic"

export const meta = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "slider",
  type: "registry:ui",
  title: "Slider",
  description: "An input where the user selects a value from within a given range.",
  ...registryMetadata["slider"],
  dependencies: ["@radix-ui/react-slider"],
  files: [
    {
      path: "ui/slider.tsx",
      type: "registry:ui",
    },
  ],
}

function SliderExample() {
  return (
    <div className="space-y-6 max-w-sm">
      <div>
        <Label>Volume</Label>
        <Slider defaultValue={[50]} max={100} step={1} className="mt-2" />
      </div>
      <div>
        <Label>Range</Label>
        <Slider defaultValue={[25, 75]} max={100} step={1} className="mt-2" />
      </div>
    </div>
  )
}

export default function SliderPage() {
  return (
    <ComponentPageLayout meta={meta}>
      <SliderExample />
    </ComponentPageLayout>
  )
}
