"use client"

import { useState } from "react"
import { ComponentPageLayout } from "@/components/component-page-layout"
import { CurrencySelector, type CurrencyOption } from "@/components/ui/currency-selector"
import { registryMetadata } from "@/lib/registry-metadata"

export const dynamic = "force-dynamic"

export const meta = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "currency-selector",
  type: "registry:ui",
  title: "Currency Selector",
  description: "Input-like trigger that opens a currency dropdown with active selection.",
  ...registryMetadata["currency-selector"],
  files: [
    {
      path: "ui/currency-selector.tsx",
      type: "registry:ui",
    },
  ],
  dependencies: ["lucide-react"],
  registryDependencies: ["dropdown-menu"],
}

const currencyOptions: CurrencyOption[] = [
  { id: "usd", label: "USD" },
  { id: "cad", label: "CAD" },
]

export default function CurrencySelectorPage() {
  const [selectedId, setSelectedId] = useState(currencyOptions[0].id)

  return (
    <ComponentPageLayout
      meta={meta}
      title="Currency Selector"
      description="Input + dropdown menu control with selected currency highlight."
    >
      <div className="space-y-10">
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Interactive
          </h3>
          <CurrencySelector
            options={currencyOptions}
            selectedId={selectedId}
            onSelect={(option) => setSelectedId(option.id)}
          />
        </section>
      </div>
    </ComponentPageLayout>
  )
}
