"use client"

import * as React from "react"
import { Star } from "lucide-react"

import { Chip } from "@/components/ui/chip"
import { ComponentPageLayout } from "@/components/component-page-layout"
import { registryMetadata } from "@/lib/registry-metadata"

export const dynamic = "force-dynamic"

export const meta = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "chip",
  type: "registry:ui",
  title: "Chip",
  description: "Interactive chip for filters, tags, and removable pills.",
  ...registryMetadata["chip"],
  files: [
    {
      path: "ui/chip.tsx",
      type: "registry:ui",
    },
  ],
  dependencies: [
    "class-variance-authority",
  ],
}

const matrixColumns = [
  { color: "grey" as const, size: "default" as const, title: "Grey / Default" },
  { color: "grey" as const, size: "sm" as const, title: "Grey / Small" },
  { color: "white" as const, size: "default" as const, title: "White / Default" },
  { color: "white" as const, size: "sm" as const, title: "White / Small" },
]

function getHoverClassName(color: "grey" | "white", size: "default" | "sm") {
  if (size === "default") {
    return "!bg-[var(--color-surface-chip-hover)] !border-[var(--brand-350)]"
  }

  if (color === "white") {
    return "!bg-[var(--color-surface-chip-default)] !border-[var(--brand-350)]"
  }

  return "!bg-[var(--color-surface-chip-default)] !border-[var(--brand-350)]"
}

function ChipPageExample() {
  const [selectedFilters, setSelectedFilters] = React.useState<string[]>([
    "Technology",
    "Healthcare",
  ])
  const [removableChips, setRemovableChips] = React.useState([
    "Client Assets",
    "Watchlist",
    "Needs Review",
  ])

  const toggleFilter = (label: string) => {
    setSelectedFilters((current) =>
      current.includes(label)
        ? current.filter((item) => item !== label)
        : [...current, label]
    )
  }

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Figma Matrix</h3>
        <div className="overflow-x-auto">
          <div className="min-w-[920px] rounded-[var(--radius-m)] border border-[var(--color-stroke-default)]">
            <div className="grid grid-cols-[140px_repeat(4,minmax(0,1fr))] border-b border-[var(--color-stroke-default)] bg-[var(--color-surface-background)]">
              <div className="border-r border-[var(--color-stroke-default)] p-4 text-sm font-semibold text-[var(--color-text-secondary)]">
                State
              </div>
              {matrixColumns.map((column) => (
                <div
                  key={`${column.color}-${column.size}`}
                  className="border-r border-[var(--color-stroke-default)] p-4 text-sm font-semibold text-[var(--color-text-primary)] last:border-r-0"
                >
                  {column.title}
                </div>
              ))}
            </div>

            {[
              { label: "Default", render: (color: "grey" | "white", size: "default" | "sm") => (
                <Chip color={color} size={size} icon={<Star />} onRemove={() => {}}>
                  Chip Label
                </Chip>
              ) },
              { label: "Hover", render: (color: "grey" | "white", size: "default" | "sm") => (
                <Chip
                  color={color}
                  size={size}
                  icon={<Star />}
                  onClick={() => {}}
                  onRemove={() => {}}
                  className={getHoverClassName(color, size)}
                >
                  Chip Label
                </Chip>
              ) },
              { label: "Selected", render: (color: "grey" | "white", size: "default" | "sm") => (
                <Chip color={color} size={size} icon={<Star />} selected onClick={() => {}} onRemove={() => {}}>
                  Chip Label
                </Chip>
              ) },
            ].map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-[140px_repeat(4,minmax(0,1fr))] border-b border-[var(--color-stroke-default)] last:border-b-0"
              >
                <div className="border-r border-[var(--color-stroke-default)] p-4 font-medium text-[var(--color-text-primary)]">
                  {row.label}
                </div>
                {matrixColumns.map((column) => (
                  <div
                    key={`${row.label}-${column.color}-${column.size}`}
                    className="border-r border-[var(--color-stroke-default)] p-4 last:border-r-0"
                  >
                    {row.render(column.color, column.size)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Interactive Filters</h3>
        <div className="flex flex-wrap gap-3">
          {["Technology", "Healthcare", "Income", "Alternatives"].map((label) => (
            <Chip
              key={label}
              icon={<Star />}
              selected={selectedFilters.includes(label)}
              onClick={() => toggleFilter(label)}
            >
              {label}
            </Chip>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Removable</h3>
        <div className="flex flex-wrap gap-3">
          {removableChips.map((label) => (
            <Chip
              key={label}
              color="white"
              icon={<Star />}
              onClick={() => toggleFilter(label)}
              onRemove={() => {
                setRemovableChips((current) => current.filter((item) => item !== label))
              }}
            >
              {label}
            </Chip>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Sizes</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Chip icon={<Star />}>Default chip</Chip>
          <Chip size="sm" icon={<Star />}>Small chip</Chip>
          <Chip color="white" icon={<Star />}>White chip</Chip>
          <Chip size="sm" color="white" icon={<Star />}>White small</Chip>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Disabled</h3>
        <div className="flex flex-wrap gap-3">
          <Chip icon={<Star />} disabled onClick={() => {}} onRemove={() => {}}>
            Disabled chip
          </Chip>
          <Chip size="sm" color="white" icon={<Star />} disabled>
            Disabled small
          </Chip>
        </div>
      </div>
    </div>
  )
}

export default function ChipPage() {
  return (
    <ComponentPageLayout meta={meta}>
      <ChipPageExample />
    </ComponentPageLayout>
  )
}
