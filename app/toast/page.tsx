"use client"

import { ComponentPageLayout } from "@/components/component-page-layout"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { registryMetadata } from "@/lib/registry-metadata"

// Added dynamic export for force-dynamic rendering
export const dynamic = "force-dynamic"

// Updated meta export to match the provided structure
export const meta = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "toast",
  type: "registry:ui",
  title: "Toast",
  description: "Toast primitives and hooks for transient notifications.",
  ...registryMetadata["toast"],
  dependencies: [
    "@radix-ui/react-toast",
    "class-variance-authority",
    "lucide-react",
  ],
  files: [
    {
      path: "ui/toast.tsx",
      type: "registry:ui",
    },
    {
      path: "use-toast.ts",
      type: "registry:hook",
    },
    {
      path: "ui/toaster.tsx",
      type: "registry:ui",
    },
  ],
}

export default function ToastPage() {
  const { toast } = useToast()

  return (
    <ComponentPageLayout meta={meta} title="Toast" description="A succinct message that is displayed temporarily.">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => {
              toast({
                title: "Scheduled: Catch up",
                description: "Friday, February 10, 2023 at 5:57 PM",
  ...registryMetadata["toast"],
              })
            }}
          >
            Show Toast
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              toast({
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your request.",
                variant: "destructive",
              })
            }}
          >
            Show Destructive Toast
          </Button>
        </div>
      </div>
    </ComponentPageLayout>
  )
}
