"use client"

import { Button } from "@/components/ui/button"
import { ComponentPageLayout } from "@/components/component-page-layout"
import { Mail, ArrowRight, Download } from "lucide-react"
import { registryMetadata } from "@/lib/registry-metadata"

export const meta = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "button",
  type: "registry:ui",
  title: "Button",
  description: "Displays a button or a component that looks like a button.",
  ...registryMetadata["button"],
  files: [
    {
      path: "ui/button.tsx",
      type: "registry:ui",
    },
  ],
  dependencies: [
    "@radix-ui/react-slot",
    "class-variance-authority",
  ],
}

function ButtonExample() {
  return (
    <div className="space-y-8">
      {/* Variants */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Variants</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="default">Primary</Button>
          <Button variant="outline">Secondary</Button>
          <Button variant="secondary">Tertiary</Button>
          <Button variant="destructive">Error</Button>
        </div>
      </div>

      {/* Sizes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Sizes</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
        </div>
      </div>

      {/* With Icons */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">With Icons</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Button>
            <Mail />
            Send Email
          </Button>
          <Button variant="outline">
            <Download />
            Download
          </Button>
          <Button variant="secondary">
            Continue
            <ArrowRight />
          </Button>
        </div>
      </div>

      {/* Icon Only */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Icon Only</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="icon-sm" icon={<Mail />} aria-label="Send email" />
          <Button size="icon" icon={<Mail />} aria-label="Send email" />
          <Button size="icon-lg" icon={<Mail />} aria-label="Send email" />
        </div>
      </div>

      {/* Loading States */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Loading</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Button isLoading>Primary Loading</Button>
          <Button variant="outline" isLoading>Secondary Loading</Button>
          <Button variant="secondary" isLoading>Tertiary Loading</Button>
          <Button variant="destructive" isLoading>Error Loading</Button>
        </div>
      </div>

      {/* Disabled States */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Disabled</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Button disabled>Primary Disabled</Button>
          <Button variant="outline" disabled>Secondary Disabled</Button>
          <Button variant="secondary" disabled>Tertiary Disabled</Button>
          <Button variant="destructive" disabled>Error Disabled</Button>
        </div>
      </div>

      {/* Deprecated (kept for backward compatibility) */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-muted-foreground">Deprecated</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </div>
    </div>
  )
}

export default function ButtonPage() {
  return (
    <ComponentPageLayout meta={meta}>
      <ButtonExample />
    </ComponentPageLayout>
  )
}
