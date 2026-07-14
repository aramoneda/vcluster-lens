"use client"

import { ShellBase } from "@/components/shells/shell-base"
import { traderPreset } from "@/lib/shells/shell-presets"
import type { ShellProps } from "@/components/ui/shell"

/**
 * Trader Shell — high-density frame (compact density) for blotters, order
 * tickets, dense tables, and watchlists. Defaults to small component variants
 * and tight spacing. Pair with the `trader-shell` / `trader-persona` skill and
 * use `getShellGridProps("trader")` / `getShellChartOptions("trader")` for
 * correctly-sized AG Grid + Highcharts out of the box.
 */
export function TraderShell(props: ShellProps) {
  return <ShellBase preset={traderPreset} {...props} />
}
