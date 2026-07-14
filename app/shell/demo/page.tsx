"use client"

import { ShellDemo } from "../shell-demo"

export const dynamic = "force-dynamic"

export default function ShellDemoPage() {
  return (
    <div className="min-h-screen bg-[var(--color-surface-background)]">
      <ShellDemo />
    </div>
  )
}
