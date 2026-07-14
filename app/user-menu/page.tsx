"use client"

import { useState } from "react"
import { ComponentPageLayout } from "@/components/component-page-layout"
import { UserMenu, type UserMenuItem } from "@/components/ui/user-menu"
import { registryMetadata } from "@/lib/registry-metadata"

export const dynamic = "force-dynamic"

export const meta = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "user-menu",
  type: "registry:ui",
  title: "User Menu",
  description: "Name trigger that opens a dropdown menu of user actions.",
  ...registryMetadata["user-menu"],
  files: [
    {
      path: "ui/user-menu.tsx",
      type: "registry:ui",
    },
  ],
  dependencies: ["lucide-react"],
  registryDependencies: ["dropdown-menu"],
}

const userMenuItems: UserMenuItem[] = [
  { id: "profile", label: "Profile" },
  { id: "settings", label: "Settings" },
  { id: "preferences", label: "Preferences" },
  { id: "support", label: "Support" },
  { id: "logout", label: "Log out", variant: "destructive" },
]

export default function UserMenuPage() {
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined)

  return (
    <ComponentPageLayout
      meta={meta}
      title="User Menu"
      description="User name trigger with hover and open states, plus a dropdown list of actions."
    >
      <div className="space-y-10">
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Interactive
          </h3>
          <div className="inline-flex">
            <UserMenu
              name="John Smith"
              items={userMenuItems}
              selectedId={selectedId}
              onSelect={(item) => setSelectedId(item.id)}
            />
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Trigger states
          </h3>
          <div className="flex flex-col gap-6">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-[var(--radius-s)] px-3 py-2 text-sm font-semibold text-[var(--color-text-brand)]"
            >
              <span>John Smith</span>
              <span className="text-[var(--color-icon-brand)]">▾</span>
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-[var(--radius-s)] px-3 py-2 text-sm font-semibold text-[var(--color-text-brand)] bg-[var(--color-surface-hover)]"
            >
              <span>John Smith</span>
              <span className="text-[var(--color-icon-brand)]">▾</span>
            </button>
            <button
              type="button"
              data-state="open"
              className="inline-flex items-center gap-2 rounded-[var(--radius-s)] px-3 py-2 text-sm font-semibold text-[var(--color-text-brand)] bg-[var(--color-surface-selected)]"
            >
              <span>John Smith</span>
              <span className="text-[var(--color-icon-brand)]">▴</span>
            </button>
          </div>
        </section>
      </div>
    </ComponentPageLayout>
  )
}
