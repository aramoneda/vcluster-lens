"use client"

import { useState } from "react"
import { ComponentPageLayout } from "@/components/component-page-layout"
import { TopNavigation, type TopNavigationItem } from "@/components/ui/top-navigation"
import { registryMetadata } from "@/lib/registry-metadata"

export const dynamic = "force-dynamic"

export const meta = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "top-navigation",
  type: "registry:ui",
  title: "Top Navigation",
  description: "Tab-like top navigation with hover menus and nested submenus.",
  ...registryMetadata["top-navigation"],
  files: [
    {
      path: "ui/top-navigation.tsx",
      type: "registry:ui",
    },
  ],
  dependencies: ["lucide-react"],
  registryDependencies: ["dropdown-menu"],
}

const topNavItems: TopNavigationItem[] = Array.from({ length: 10 }).map((_, index) => ({
  id: `level-2-${index + 1}`,
  label: "Level 2",
  children: [
    { id: `level-3-${index + 1}-1`, label: "Level 3" },
    {
      id: `level-3-${index + 1}-2`,
      label: "Level 3",
      children: [
        { id: `level-4-${index + 1}-1`, label: "Level 4" },
        { id: `level-4-${index + 1}-2`, label: "Level 4" },
        { id: `level-4-${index + 1}-3`, label: "Level 4" },
      ],
    },
    { id: `level-3-${index + 1}-3`, label: "Level 3" },
  ],
}))

export default function TopNavigationPage() {
  const [activeId, setActiveId] = useState(topNavItems[0]?.id)

  return (
    <ComponentPageLayout
      meta={meta}
      title="Top Navigation"
      description="Use as L1 when no left nav is present, or as L2 when left nav exists."
    >
      <div className="rounded-[var(--radius-m)] border border-[var(--color-stroke-default)] bg-[var(--color-surface-background)]">
        <TopNavigation
          items={topNavItems}
          activeId={activeId}
          onItemSelect={(item) => setActiveId(item.id)}
        />
      </div>
    </ComponentPageLayout>
  )
}
