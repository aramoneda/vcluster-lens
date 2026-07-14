"use client"

import { ShellBase } from "@/components/shells/shell-base"
import { opsPreset } from "@/lib/shells/shell-presets"
import type { ShellProps } from "@/components/ui/shell"

/**
 * Ops Shell — power-user frame (compact density) for exception queues,
 * reconciliation, bulk actions, and monitoring. Deactivated by default
 * (status "inactive" in the registry): ships in code but is not auto-selected
 * by the router; use explicitly. Pair with the `ops-shell` skill.
 */
export function OpsShell(props: ShellProps) {
  return <ShellBase preset={opsPreset} {...props} />
}
