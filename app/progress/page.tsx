import { Progress } from "@/components/ui/progress"
import { ComponentPageLayout } from "@/components/component-page-layout"
import { registryMetadata } from "@/lib/registry-metadata"

// Added dynamic export for force-dynamic rendering
export const dynamic = "force-dynamic"

export const meta = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "progress",
  type: "registry:ui",
  title: "Progress",
  description:
    "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  ...registryMetadata["progress"],
  files: [
    {
      path: "ui/progress.tsx",
      type: "registry:ui",
    },
  ],
  dependencies: ["@radix-ui/react-progress"],
}

function ProgressExample() {
  return (
    <div className="space-y-4 max-w-sm">
      <Progress value={33} />
      <Progress value={66} />
      <Progress value={88} />
    </div>
  )
}

export default function ProgressPage() {
  return (
    <ComponentPageLayout meta={meta}>
      <ProgressExample />
    </ComponentPageLayout>
  )
}
