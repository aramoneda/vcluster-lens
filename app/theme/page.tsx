"use client"

import { registryMetadata } from "@/lib/registry-metadata"
// Theme metadata for registry - this provides CSS variables to v0
export const meta = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "theme",
  type: "registry:theme",
  title: "BRD Theme",
  description: "BRD Design System theme with Figma design tokens and CSS variables",
  ...registryMetadata["theme"],
  files: [
    {
      path: "globals.css",
      type: "registry:style",
      target: "app/globals.css"
    }
  ]
}

export default function ThemePage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">BRD Theme</h1>
      <p className="text-muted-foreground mb-8">
        This theme provides all the CSS variables and design tokens from the BRD Figma design system.
      </p>
      
      <div className="grid gap-6">
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Primary Colors</h2>
          <div className="flex gap-4">
            <div className="w-16 h-16 rounded bg-[var(--color-surface-button-primary-default)]" />
            <div className="w-16 h-16 rounded bg-[var(--color-surface-button-primary-hover)]" />
            <div className="w-16 h-16 rounded bg-[var(--color-surface-button-primary-pressed)]" />
          </div>
        </div>
        
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Grey Palette</h2>
          <div className="flex gap-2">
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
              <div 
                key={shade}
                className="w-10 h-10 rounded"
                style={{ backgroundColor: `var(--grey-${shade})` }}
                title={`grey-${shade}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

