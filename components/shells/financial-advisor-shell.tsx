"use client"

import { ShellBase } from "@/components/shells/shell-base"
import { financialAdvisorPreset } from "@/lib/shells/shell-presets"
import type { ShellProps } from "@/components/ui/shell"

/**
 * Financial Advisor Shell — the standard BRD frame (comfortable density).
 * Default active shell for advisor dashboards, portfolios, and planning views.
 * Pair with the `financial-advisor-shell` skill for layout guidance.
 */
export function FinancialAdvisorShell(props: ShellProps) {
  return <ShellBase preset={financialAdvisorPreset} {...props} />
}
