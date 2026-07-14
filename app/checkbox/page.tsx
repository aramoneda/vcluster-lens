"use client"

import * as React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { ComponentPageLayout } from "@/components/component-page-layout"
import { registryMetadata } from "@/lib/registry-metadata"

// Added dynamic export for force-dynamic rendering
export const dynamic = "force-dynamic"

export const meta = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "checkbox",
  type: "registry:ui",
  title: "Checkbox",
  description: "A control that allows the user to toggle between checked and not checked. Supports label, supporting text, sizes, and indeterminate state.",
  ...registryMetadata["checkbox"],
  files: [
    {
      path: "ui/checkbox.tsx",
      type: "registry:ui",
    },
  ],
  dependencies: [
    "@radix-ui/react-checkbox",
    "class-variance-authority",
    "lucide-react",
  ],
}

function CheckboxExample() {
  const [checked, setChecked] = React.useState<boolean | "indeterminate">(false)

  return (
    <div className="grid gap-8">
      {/* Basic Examples */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Basic Checkboxes</h3>
        <div className="space-y-4">
          <Checkbox label="Accept terms and conditions" />
          <Checkbox label="Send me marketing emails" supportingText="We'll never share your email with anyone else." />
          <Checkbox label="Remember me" defaultChecked />
        </div>
      </div>

      {/* Size Variants */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Size Variants</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="w-20 text-sm text-muted-foreground">Small (18px):</span>
            <Checkbox size="sm" label="Small checkbox" supportingText="This is the default size" />
          </div>
          <div className="flex items-center gap-4">
            <span className="w-20 text-sm text-muted-foreground">Default (24px):</span>
            <Checkbox size="default" label="Default checkbox" supportingText="This is the larger size" />
          </div>
        </div>
      </div>

      {/* States */}
      <div>
        <h3 className="text-lg font-semibold mb-4">States</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <p className="text-sm font-medium text-muted-foreground">Small (18px)</p>
            <Checkbox size="sm" label="Unchecked" />
            <Checkbox size="sm" label="Checked" defaultChecked />
            <Checkbox size="sm" label="Indeterminate" checked="indeterminate" />
            <Checkbox size="sm" label="Disabled" disabled />
            <Checkbox size="sm" label="Disabled checked" disabled defaultChecked />
            <Checkbox size="sm" label="Disabled indeterminate" disabled checked="indeterminate" />
          </div>
          <div className="space-y-4">
            <p className="text-sm font-medium text-muted-foreground">Default (24px)</p>
            <Checkbox size="default" label="Unchecked" />
            <Checkbox size="default" label="Checked" defaultChecked />
            <Checkbox size="default" label="Indeterminate" checked="indeterminate" />
            <Checkbox size="default" label="Disabled" disabled />
            <Checkbox size="default" label="Disabled checked" disabled defaultChecked />
            <Checkbox size="default" label="Disabled indeterminate" disabled checked="indeterminate" />
          </div>
        </div>
      </div>

      {/* Controlled Example */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Controlled Checkbox</h3>
        <div className="space-y-4">
          <Checkbox
            label="Click me to toggle"
            supportingText={`Current state: ${checked === "indeterminate" ? "indeterminate" : checked ? "checked" : "unchecked"}`}
            checked={checked}
            onCheckedChange={setChecked}
          />
          <div className="flex gap-2">
            <button
              onClick={() => setChecked(false)}
              className="px-3 py-1 text-sm border rounded hover:bg-muted"
            >
              Uncheck
            </button>
            <button
              onClick={() => setChecked(true)}
              className="px-3 py-1 text-sm border rounded hover:bg-muted"
            >
              Check
            </button>
            <button
              onClick={() => setChecked("indeterminate")}
              className="px-3 py-1 text-sm border rounded hover:bg-muted"
            >
              Indeterminate
            </button>
          </div>
        </div>
      </div>

      {/* Without Label (Standalone) */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Standalone (No Label)</h3>
        <div className="flex items-center gap-4">
          <Checkbox size="sm" />
          <Checkbox size="sm" defaultChecked />
          <Checkbox size="sm" checked="indeterminate" />
          <Checkbox size="default" />
          <Checkbox size="default" defaultChecked />
          <Checkbox size="default" checked="indeterminate" />
        </div>
      </div>
    </div>
  )
}

export default function CheckboxPage() {
  return (
    <ComponentPageLayout meta={meta}>
      <CheckboxExample />
    </ComponentPageLayout>
  )
}
