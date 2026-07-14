"use client"

import React from "react"
import { ComponentPageLayout } from "@/components/component-page-layout"
import { Header } from "@/components/ui/header"
import { registryMetadata } from "@/lib/registry-metadata"

export const dynamic = "force-dynamic"

export const meta = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "header",
  type: "registry:ui",
  title: "Header",
  description: "Responsive top header with logo, selectors, search, notifications, and user menu.",
  ...registryMetadata["header"],
  files: [
    {
      path: "ui/header.tsx",
      type: "registry:ui",
    },
  ],
  dependencies: ["lucide-react"],
  registryDependencies: [
    "currency-selector",
    "language-selector",
    "user-menu",
    "icon-button",
    "input",
  ],
}

const userMenuItems = [
  { id: "profile", label: "Profile" },
  { id: "settings", label: "Settings" },
  { id: "preferences", label: "Preferences" },
  { id: "support", label: "Support" },
  { id: "logout", label: "Log out", variant: "destructive" as const },
]

export default function HeaderPage({
  searchParams,
}: {
  searchParams?: Promise<{ full?: string }>
}) {
  const resolvedSearchParams = React.use(
    searchParams ?? Promise.resolve({})
  )

  if (resolvedSearchParams.full === "1") {
    return (
      <div className="min-h-screen bg-[var(--color-surface-background)]">
        <Header userMenuItems={userMenuItems} />
      </div>
    )
  }

  return (
    <ComponentPageLayout
      meta={meta}
      title="Header"
      description="Responsive header layout without InView. Includes logo, selectors, search, notifications, and user menu."
    >
      <div className="space-y-8">
        <div className="flex">
          <a
            href="/header?full=1"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-[var(--color-text-brand)] hover:underline"
          >
            Open full-screen demo
          </a>
        </div>
        <div className="rounded-[var(--radius-m)] border border-[var(--color-stroke-default)] bg-[var(--color-surface-background)]">
          <Header userMenuItems={userMenuItems} />
        </div>

        <div className="max-w-5xl rounded-[var(--radius-m)] border border-[var(--color-stroke-default)] bg-[var(--color-surface-background)]">
          <Header userMenuItems={userMenuItems} />
        </div>

        <div className="max-w-3xl rounded-[var(--radius-m)] border border-[var(--color-stroke-default)] bg-[var(--color-surface-background)]">
          <Header userMenuItems={userMenuItems} />
        </div>

        <div className="max-w-xl rounded-[var(--radius-m)] border border-[var(--color-stroke-default)] bg-[var(--color-surface-background)]">
          <Header userMenuItems={userMenuItems} />
        </div>
      </div>
    </ComponentPageLayout>
  )
}
