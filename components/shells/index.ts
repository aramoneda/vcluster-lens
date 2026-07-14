import type * as React from "react"

import type { ShellProps } from "@/components/ui/shell"
import { FinancialAdvisorShell } from "@/components/shells/financial-advisor-shell"
import { TraderShell } from "@/components/shells/trader-shell"
import { OpsShell } from "@/components/shells/ops-shell"
import { ClientShell } from "@/components/shells/client-shell"
import { OnboardingShell } from "@/components/shells/onboarding-shell"

export { ShellBase } from "@/components/shells/shell-base"
export { FinancialAdvisorShell } from "@/components/shells/financial-advisor-shell"
export { TraderShell } from "@/components/shells/trader-shell"
export { OpsShell } from "@/components/shells/ops-shell"
export { ClientShell, ClientWorkspace } from "@/components/shells/client-shell"
export { OnboardingShell, OnboardingFlow } from "@/components/shells/onboarding-shell"

/**
 * Map of implemented shell wrappers by registry id. The `proxy` shell is a
 * registry placeholder only (no wrapper this pass) and is intentionally absent.
 */
export const shellComponents: Record<string, React.ComponentType<ShellProps>> = {
  "financial-advisor": FinancialAdvisorShell,
  trader: TraderShell,
  ops: OpsShell,
  client: ClientShell,
  onboarding: OnboardingShell,
}

/** Resolve a shell wrapper component by registry id (undefined for placeholders). */
export function getShellComponent(
  id: string,
): React.ComponentType<ShellProps> | undefined {
  return shellComponents[id]
}
