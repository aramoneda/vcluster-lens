import { Skeleton } from "@/components/ui/skeleton"
import { ComponentPageLayout } from "@/components/component-page-layout"
import { registryMetadata } from "@/lib/registry-metadata"

// Added dynamic export for force-dynamic rendering
export const dynamic = "force-dynamic"

export const meta = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "skeleton",
  type: "registry:ui",
  title: "Skeleton",
  description: "Use to show a placeholder while content is loading.",
  ...registryMetadata["skeleton"],
  files: [
    {
      path: "ui/skeleton.tsx",
      type: "registry:ui",
    },
  ],
}

function SkeletonExample() {
  return (
    <div className="space-y-4 max-w-sm">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
      <Skeleton className="h-4 w-[150px]" />
      <div className="space-y-2">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    </div>
  )
}

export default function SkeletonPage() {
  return (
    <ComponentPageLayout meta={meta}>
      <SkeletonExample />
    </ComponentPageLayout>
  )
}
