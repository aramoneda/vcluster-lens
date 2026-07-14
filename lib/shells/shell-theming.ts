import type Highcharts from "highcharts"

import { brdAgGridTheme } from "@/lib/brd-ag-grid-theme"
import { brdHighchartsTheme } from "@/lib/brd-highcharts-theme"
import type { ShellDensity } from "@/components/ui/shell"
import { getShell } from "@/lib/shells/shell-registry"

/**
 * Per-shell chart + grid theming. These helpers wrap the shared BRD theme
 * helpers (`brdAgGridTheme`, `brdHighchartsTheme`) and apply the shell's
 * density WITHOUT mutating the shared singletons — so every shell gets
 * correctly-sized Highcharts + AG Grid out of the box, and dark mode still
 * flows through the underlying token-based themes.
 */

interface DensitySizing {
  /** AG Grid internal spacing param (drives padding, filter input height). */
  gridSpacing: number
  /** AG Grid data row height. */
  gridRowHeight: number
  /** AG Grid header height. */
  gridHeaderHeight: number
  /** AG Grid floating-filter band height. */
  gridFloatingFilterHeight: number
  /** Highcharts outer chart spacing (px, applied to all four sides). */
  chartSpacing: number
}

const DENSITY_SIZING: Record<ShellDensity, DensitySizing> = {
  comfortable: {
    gridSpacing: 8,
    gridRowHeight: 40,
    gridHeaderHeight: 44,
    gridFloatingFilterHeight: 40,
    chartSpacing: 16,
  },
  compact: {
    // Matches the trader-persona dense grid rules: spacing 4, 24px rows.
    gridSpacing: 4,
    gridRowHeight: 24,
    gridHeaderHeight: 28,
    gridFloatingFilterHeight: 28,
    chartSpacing: 8,
  },
}

function densityFor(shellId: string): ShellDensity {
  return getShell(shellId)?.density ?? "comfortable"
}

/** Resolve numeric grid/chart sizing for a shell (for AgGridReact height props). */
export function getShellSizing(shellId: string): DensitySizing {
  return DENSITY_SIZING[densityFor(shellId)]
}

/**
 * AG Grid theme for a shell. Pass to `<AgGridReact theme={...}>`. Applies the
 * shell's density via the `spacing` param (the sanctioned "override only
 * spacing" path) without editing the shared theme.
 */
export function getShellGridTheme(shellId: string) {
  const { gridSpacing } = getShellSizing(shellId)
  return brdAgGridTheme.withParams({ spacing: gridSpacing })
}

/**
 * Convenience grid props (theme + heights) for a shell. Spread onto
 * `<AgGridReact {...getShellGridProps(id)} />` for correctly-sized rows,
 * header, and floating filters at the shell's density.
 */
export function getShellGridProps(shellId: string) {
  const sizing = getShellSizing(shellId)
  return {
    theme: getShellGridTheme(shellId),
    rowHeight: sizing.gridRowHeight,
    headerHeight: sizing.gridHeaderHeight,
    floatingFiltersHeight: sizing.gridFloatingFilterHeight,
  }
}

/**
 * Highcharts options for a shell — the BRD theme with density-aware outer
 * spacing. Merge into a chart's options (or pass to Highcharts as a base).
 */
export function getShellChartOptions(shellId: string): Highcharts.Options {
  const { chartSpacing } = getShellSizing(shellId)
  return {
    ...brdHighchartsTheme,
    chart: {
      ...brdHighchartsTheme.chart,
      spacing: [chartSpacing, chartSpacing, chartSpacing, chartSpacing],
    },
  }
}
