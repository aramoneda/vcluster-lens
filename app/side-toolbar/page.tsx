"use client"

import { useState } from "react"
import { Bookmark, Calendar, CheckSquare, FileText, History, Info, Plus, Printer } from "lucide-react"
import { ComponentPageLayout } from "@/components/component-page-layout"
import { SideToolbar, type SideToolbarItem } from "@/components/ui/side-toolbar"
import { Drawer, DrawerContent, DrawerDescription } from "@/components/ui/drawer"
import { registryMetadata } from "@/lib/registry-metadata"

export const dynamic = "force-dynamic"

export const meta = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "side-toolbar",
  type: "registry:ui",
  title: "Side Toolbar",
  description: "Fixed, right-edge vertical action bar with icon buttons for quick access.",
  ...registryMetadata["side-toolbar"],
  files: [
    {
      path: "ui/side-toolbar.tsx",
      type: "registry:ui",
    },
  ],
  dependencies: [],
  registryDependencies: ["button", "tooltip"],
}

const toolbarItems: Array<SideToolbarItem & { description: string }> = [
  {
    id: "info",
    label: "Info",
    icon: Info,
    description: "Show contextual information about the current record.",
  },
  {
    id: "bookmarks",
    label: "Bookmarks",
    icon: Bookmark,
    description: "View and manage your saved bookmarks.",
  },
  {
    id: "recents",
    label: "Recents",
    icon: History,
    description: "Jump back to recently viewed items and activity.",
  },
  {
    id: "print",
    label: "Print",
    icon: Printer,
    description: "Prepare a print-friendly summary or export.",
  },
  {
    id: "calendar",
    label: "Calendar",
    icon: Calendar,
    description: "Open the schedule view for upcoming events.",
  },
  {
    id: "tasks",
    label: "Tasks",
    icon: CheckSquare,
    description: "Review assigned tasks and outstanding to-dos.",
  },
  {
    id: "notes",
    label: "Notes",
    icon: FileText,
    description: "Capture quick notes and reminders in context.",
  },
  {
    id: "add",
    label: "Add",
    icon: Plus,
    description: "Create a new item from the current view.",
  },
]

export default function SideToolbarPage() {
  const [activeId, setActiveId] = useState(toolbarItems[0].id)
  const [open, setOpen] = useState(false)
  const activeItem = toolbarItems.find((item) => item.id === activeId) ?? toolbarItems[0]

  return (
    <ComponentPageLayout
      meta={meta}
      title="Side Toolbar"
      description="Fixed, right-edge toolbar for quick actions that can open supporting panels."
    >
      <div className="relative min-h-[520px] overflow-hidden rounded-[var(--radius-m)] border border-[var(--color-stroke-default)] bg-[var(--color-surface-background)]">
        <div className="max-w-2xl space-y-4 p-6 pr-24">
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Demo
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)]">
            The toolbar stays fixed on the right edge of the viewport. Select any
            action to open a Drawer with contextual content.
          </p>
        </div>

        <SideToolbar
          items={toolbarItems}
          activeId={open ? activeId : undefined}
          onItemSelect={(item) => {
            setActiveId(item.id)
            setOpen(true)
          }}
        />

        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent headerTitle={activeItem.label}>
            <div className="space-y-3">
              <DrawerDescription>{activeItem.description}</DrawerDescription>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Replace this content with real modules such as details, filters,
                or creation forms for each toolbar action.
              </p>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </ComponentPageLayout>
  )
}
