"use client"

import { useState } from "react"
import { ComponentPageLayout } from "@/components/component-page-layout"
import { LanguageSelector, type LanguageOption } from "@/components/ui/language-selector"
import { registryMetadata } from "@/lib/registry-metadata"

export const dynamic = "force-dynamic"

export const meta = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "language-selector",
  type: "registry:ui",
  title: "Language Selector",
  description: "Input-like trigger that opens a language dropdown with active selection.",
  ...registryMetadata["language-selector"],
  files: [
    {
      path: "ui/language-selector.tsx",
      type: "registry:ui",
    },
  ],
  dependencies: ["lucide-react"],
  registryDependencies: ["dropdown-menu"],
}

const languageOptions: LanguageOption[] = [
  { id: "eng", label: "ENG" },
  { id: "fr", label: "FR" },
]

export default function LanguageSelectorPage() {
  const [selectedId, setSelectedId] = useState(languageOptions[0].id)

  return (
    <ComponentPageLayout
      meta={meta}
      title="Language Selector"
      description="Input + dropdown menu control with selected language highlight."
    >
      <div className="space-y-10">
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Interactive
          </h3>
          <LanguageSelector
            options={languageOptions}
            selectedId={selectedId}
            onSelect={(option) => setSelectedId(option.id)}
          />
        </section>
      </div>
    </ComponentPageLayout>
  )
}
