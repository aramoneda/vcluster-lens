"use client"

import { ComponentPageLayout } from "@/components/component-page-layout"
import { Calendar } from "@/components/ui/calendar"
import { useState } from "react"
import { registryMetadata } from "@/lib/registry-metadata"

// Added dynamic export for force-dynamic rendering
export const dynamic = "force-dynamic"

// Added meta export for registry
export const meta = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "calendar",
  type: "registry:ui",
  title: "Calendar",
  description: "A date field component that allows users to enter and edit date.",
  ...registryMetadata["calendar"],
  files: [
    {
      path: "ui/calendar.tsx",
      type: "registry:ui",
    },
  ],
  dependencies: [
    "lucide-react",
    "react-day-picker@latest",
  ],
  registryDependencies: ["button"],
}

function CalendarExample() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
}

export default function CalendarPage() {
  return (
    <ComponentPageLayout meta={meta}>
      <CalendarExample />
    </ComponentPageLayout>
  )
}
