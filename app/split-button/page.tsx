"use client"

import { SplitButton } from "@/components/ui/split-button"
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { ComponentPageLayout } from "@/components/component-page-layout"
import { Download, Plus, FileText, FileSpreadsheet, Share2 } from "lucide-react"
import { registryMetadata } from "@/lib/registry-metadata"

export const meta = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "split-button",
  type: "registry:ui",
  title: "Split Button",
  description:
    "A primary action paired with a trailing menu trigger that shares the same Button styling.",
  ...registryMetadata["split-button"],
  files: [
    {
      path: "ui/split-button.tsx",
      type: "registry:ui",
    },
  ],
  registryDependencies: ["button", "dropdown-menu"],
  dependencies: ["class-variance-authority", "lucide-react"],
}

const exampleMenu = (
  <>
    <DropdownMenuItem>
      <FileText />
      Export as PDF
    </DropdownMenuItem>
    <DropdownMenuItem>
      <FileSpreadsheet />
      Export as CSV
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>
      <Share2 />
      Share link
    </DropdownMenuItem>
  </>
)

const variants = [
  { variant: "default", label: "Primary" },
  { variant: "outline", label: "Secondary" },
  { variant: "secondary", label: "Tertiary" },
  { variant: "destructive", label: "Error" },
] as const

function SplitButtonExample() {
  return (
    <div className="space-y-8">
      {/* Variants */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Variants</h3>
        <div className="flex flex-wrap items-center gap-4">
          {variants.map((v) => (
            <SplitButton
              key={v.variant}
              variant={v.variant}
              icon={<Download />}
              menu={exampleMenu}
            >
              {v.label}
            </SplitButton>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Sizes</h3>
        <div className="flex flex-wrap items-center gap-4">
          <SplitButton size="sm" icon={<Download />} menu={exampleMenu}>
            Small
          </SplitButton>
          <SplitButton size="default" icon={<Download />} menu={exampleMenu}>
            Default
          </SplitButton>
          <SplitButton size="lg" icon={<Download />} menu={exampleMenu}>
            Large
          </SplitButton>
        </div>
      </div>

      {/* Without icon */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Label Only</h3>
        <div className="flex flex-wrap items-center gap-4">
          {variants.map((v) => (
            <SplitButton key={v.variant} variant={v.variant} menu={exampleMenu}>
              Split Button
            </SplitButton>
          ))}
        </div>
      </div>

      {/* Custom trigger icon */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Custom Menu Icon</h3>
        <div className="flex flex-wrap items-center gap-4">
          <SplitButton
            icon={<Download />}
            menuIcon={<Plus />}
            menu={exampleMenu}
          >
            Split Button
          </SplitButton>
          <SplitButton
            variant="secondary"
            icon={<Download />}
            menuIcon={<Plus />}
            menu={exampleMenu}
          >
            Split Button
          </SplitButton>
        </div>
      </div>

      {/* Disabled */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Disabled</h3>
        <div className="flex flex-wrap items-center gap-4">
          {variants.map((v) => (
            <SplitButton
              key={v.variant}
              variant={v.variant}
              icon={<Download />}
              menu={exampleMenu}
              disabled
            >
              {v.label}
            </SplitButton>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function SplitButtonPage() {
  return (
    <ComponentPageLayout meta={meta}>
      <SplitButtonExample />
    </ComponentPageLayout>
  )
}
