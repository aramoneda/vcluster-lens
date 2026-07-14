"use client"

import * as React from "react"

import { ShellBase } from "@/components/shells/shell-base"
import { clientPreset } from "@/lib/shells/shell-presets"
import type { ShellProps } from "@/components/ui/shell"

/**
 * Client Shell — client-centric frame (comfortable density) for portals,
 * account summaries, statements, and self-service. Deactivated by default
 * (status "inactive" in the registry): ships in code but is not auto-selected;
 * use explicitly. Pair with the `client-shell` skill.
 */
export function ClientShell(props: ShellProps) {
  return <ShellBase preset={clientPreset} {...props} />
}

export interface ClientWorkspaceProps {
  title?: string
  children?: React.ReactNode
}

/**
 * ClientWorkspace — FRAMELESS region (no Shell). The Client shell's content
 * scaffold, usable on its own inside another host shell's content area for
 * composition (host keeps the single Shell frame). Token-driven, density-aware
 * via the host shell's `--shell-density-*` tokens.
 */
export function ClientWorkspace({ title = "Client overview", children }: ClientWorkspaceProps) {
  return (
    <section
      aria-label={title}
      className="flex flex-col gap-[var(--shell-density-gap,var(--spacing-sp-24))]"
    >
      {children}
    </section>
  )
}
