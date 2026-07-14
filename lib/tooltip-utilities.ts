/**
 * BRD Tooltip Utilities - Consolidated
 * 
 * Central hub for all tooltip formatters and configurations used across BRD charts.
 * This file contains:
 * - 6 formatter functions for all chart types
 * - Pre-configured constants for common chart setups
 * - Design standards and best practices
 * - Developer implementation guide
 * 
 * All formatters use BRD design tokens:
 * - Font family: var(--font-family-brand)
 * - Text size: var(--font-body-small-size)
 * - Bold weights: var(--font-body-small-bold-weight), var(--font-body-small-semibold-weight)
 * - Text colors: var(--color-text-primary) for values (light/dark aware)
 * - Markers: Circle shapes matching series colors
 * 
 * @module lib/tooltip-utilities
 */

import type Highcharts from "highcharts"

// ============================================================================
// FORMATTER FUNCTIONS
// ============================================================================

/**
 * Tooltip configuration for multi-series shared tooltips
 * Used for: Line charts, multi-series columns, bars with shared flag
 * 
 * FORMATTING:
 * - Title: Category name in bold semibold (from x-axis, not numeric index)
 * - Rows: Color marker (circle) + series label + bold value
 * - Layout: Flex column, small font with proper spacing
 */
export function createMultiSeriesSharedTooltip(config: {
  isMonetary?: boolean
  isPercentage?: boolean
  decimalPlaces?: number
  prefix?: string
  suffix?: string
} = {}) {
  const { isMonetary = false, isPercentage = false, decimalPlaces = 2, prefix = "", suffix = "" } = config

  return function(this: any) {
    if (!this.points) return ""

    // Get the category name from the first point's category (not from this.x which is numeric index)
    const categoryName = this.points[0]?.category || this.points[0]?.series?.xAxis?.categories?.[this.x] || `${this.x}`

    const html = [
      `<div style="display: flex; flex-direction: column; font-family: var(--font-family-brand); font-size: var(--font-body-small-size);">`,
      // Header - category/x-value in bold semibold
      `<div style="font-weight: var(--font-body-small-semibold-weight); margin-bottom: 4px;">${categoryName}</div>`,
    ]

    // Each series as a row with proper alignment
    this.points.forEach((point: any) => {
      const value = point.y ?? 0
      let formatted = ""

      if (isMonetary) {
        formatted = `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
      } else if (isPercentage) {
        formatted = `${value.toFixed(decimalPlaces)}%`
      } else {
        formatted = value.toLocaleString(undefined, { maximumFractionDigits: decimalPlaces })
      }

      // Row Layout: Marker (left) + Label (left-aligned) + Data (bold, black, right-aligned)
      html.push(
        `<div style="display: flex; align-items: center; gap: 8px; justify-content: space-between;">`,
        `<div style="display: flex; align-items: center; gap: 8px; flex: 1;">`,
        `<span style="color: ${point.color}; width: 10px; height: 10px; border-radius: 50%; background-color: ${point.color}; display: inline-block; flex-shrink: 0;"></span>`,
        `<span>${point.series.name}</span>`,
        `</div>`,
        `<span style="font-weight: var(--font-body-small-bold-weight); color: var(--color-text-primary); text-align: right;">${prefix}${formatted}${suffix}</span>`,
        `</div>`
      )
    })

    html.push(`</div>`)

    return html.join("")
  }
}

/**
 * Tooltip configuration for stacked column charts
 * Used for: Stacked column charts, showing all stacked values in one tooltip
 * 
 * FORMATTING:
 * - Title: Category name in bold semibold (from x-axis, not numeric index)
 * - Rows: Color marker (6px circle) + label + bold value
 * - Always use shared: true for stacked columns
 */
export function createStackedColumnTooltip(config: {
  isMonetary?: boolean
  isPercentage?: boolean
  decimalPlaces?: number
  prefix?: string
  suffix?: string
} = {}) {
  const { isMonetary = false, isPercentage = false, decimalPlaces = 2, prefix = "", suffix = "" } = config

  return function(this: any) {
    if (!this.points) return ""

    // Get the category name from the first point's category (not from this.x which is numeric index)
    const categoryName = this.points[0]?.category || this.points[0]?.series?.xAxis?.categories?.[this.x] || `${this.x}`

    const html = [
      `<div style="display: flex; flex-direction: column; gap: 6px; font-family: var(--font-family-brand); font-size: var(--font-body-small-size);">`,
      // Header - category/x-value in bold semibold
      `<div style="font-weight: var(--font-body-small-semibold-weight); margin-bottom: 2px;">${categoryName}</div>`,
    ]

    // Each series as a row with proper alignment
    this.points.forEach((point: any) => {
      const value = point.y ?? 0
      let formatted = ""

      if (isMonetary) {
        formatted = `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
      } else if (isPercentage) {
        formatted = `${value.toFixed(decimalPlaces)}%`
      } else {
        formatted = value.toLocaleString(undefined, { maximumFractionDigits: decimalPlaces })
      }

      // Row Layout: Marker (circle, 6px) + Label (left) + Data (bold, black, right)
      html.push(
        `<div style="display: flex; align-items: center; gap: 8px; justify-content: space-between;">`,
        `<div style="display: flex; align-items: center; gap: 8px; flex: 1;">`,
        `<span style="width: 12px; height: 12px; border-radius: 50%; background-color: ${point.color}; display: inline-block; flex-shrink: 0;"></span>`,
        `<span>${point.series.name}</span>`,
        `</div>`,
        `<span style="font-weight: var(--font-body-small-bold-weight); color: var(--color-text-primary); text-align: right; white-space: nowrap;">${prefix}${formatted}${suffix}</span>`,
        `</div>`
      )
    })

    html.push(`</div>`)

    return html.join("")
  }
}

/**
 * Tooltip configuration for horizontal bar charts
 * Used for: Single bar charts showing x-axis category as vertical label
 * 
 * FORMATTING:
 * - Label: Category name in bold semibold (x-axis category, not numeric index)
 * - Value: Bold, black, right-aligned
 * - Single series per point
 */
export function createBarChartTooltip(config: {
  isMonetary?: boolean
  isPercentage?: boolean
  decimalPlaces?: number
  prefix?: string
  suffix?: string
  labelFormat?: (point: any) => string
} = {}) {
  const { isMonetary = false, isPercentage = false, decimalPlaces = 2, prefix = "", suffix = "", labelFormat } = config

  return function(this: any) {
    // Get the x-axis category name (not numeric index)
    const categoryName = this.category || this.series?.xAxis?.categories?.[this.x] || `${this.x}`
    
    // Get the series label if exists
    const seriesLabel = this.series?.name ? this.series.name : ""
    
    const value = this.y ?? 0
    let formatted = ""

    if (isMonetary) {
      formatted = `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    } else if (isPercentage) {
      formatted = `${value.toFixed(decimalPlaces)}%`
    } else {
      formatted = value.toLocaleString(undefined, { maximumFractionDigits: decimalPlaces })
    }

    const html = [
      `<div style="display: flex; flex-direction: column; gap: 4px; font-family: var(--font-family-brand); font-size: var(--font-body-small-size);">`,
      // Category label in bold semibold
      `<div style="font-weight: var(--font-body-small-semibold-weight);">${categoryName}</div>`,
    ]

    // Add series name if available
    if (seriesLabel) {
      html.push(`<div style="font-size: var(--font-body-small-size); color: var(--color-text-secondary);">${seriesLabel}</div>`)
    }

    // Add value in bold
    html.push(`<div style="font-weight: var(--font-body-small-bold-weight); color: var(--color-text-primary);">${prefix}${formatted}${suffix}</div>`)
    html.push(`</div>`)

    return html.join("")
  }
}

/**
 * Tooltip configuration for stacked horizontal bar charts
 * Used for: Stacked bar charts, showing all stacked values in one merged tooltip
 * 
 * FORMATTING:
 * - Title: Category name in bold semibold (x-axis category, not numeric index)
 * - Rows: Color marker (6px circle) + label + bold value
 * - Always use shared: true for stacked bars
 */
export function createStackedBarChartTooltip(config: {
  isMonetary?: boolean
  isPercentage?: boolean
  decimalPlaces?: number
  prefix?: string
  suffix?: string
} = {}) {
  const { isMonetary = false, isPercentage = false, decimalPlaces = 2, prefix = "", suffix = "" } = config

  return function(this: any) {
    if (!this.points) return ""

    // Get the x-axis category name (displayed as vertical label in stacked bar)
    const categoryName = this.points[0]?.category || this.points[0]?.series?.xAxis?.categories?.[this.x] || `${this.x}`

    const html = [
      `<div style="display: flex; flex-direction: column; gap: 6px; font-family: var(--font-family-brand); font-size: var(--font-body-small-size);">`,
      // Header - category/x-value in bold semibold
      `<div style="font-weight: var(--font-body-small-semibold-weight); margin-bottom: 2px;">${categoryName}</div>`,
    ]

    // Each series as a row with proper alignment
    this.points.forEach((point: any) => {
      const value = point.y ?? 0
      let formatted = ""

      if (isMonetary) {
        formatted = `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
      } else if (isPercentage) {
        formatted = `${value.toFixed(decimalPlaces)}%`
      } else {
        formatted = value.toLocaleString(undefined, { maximumFractionDigits: decimalPlaces })
      }

      // Row Layout: Marker (circle, 6px) + Label (left) + Data (bold, black, right)
      html.push(
        `<div style="display: flex; align-items: center; gap: 8px; justify-content: space-between;">`,
        `<div style="display: flex; align-items: center; gap: 8px; flex: 1;">`,
        `<span style="width: 12px; height: 12px; border-radius: 50%; background-color: ${point.color}; display: inline-block; flex-shrink: 0;"></span>`,
        `<span>${point.series.name}</span>`,
        `</div>`,
        `<span style="font-weight: var(--font-body-small-bold-weight); color: var(--color-text-primary); text-align: right; white-space: nowrap;">${prefix}${formatted}${suffix}</span>`,
        `</div>`
      )
    })

    html.push(`</div>`)

    return html.join("")
  }
}

/**
 * Tooltip configuration for universal/single series charts
 * Used for: Pie charts, donut charts, basic single-value tooltips
 * 
 * FORMATTING:
 * - Value in bold
 * - Single series or category display
 */
export function createUniversalTooltip(config: {
  isMonetary?: boolean
  isPercentage?: boolean
  decimalPlaces?: number
  prefix?: string
  suffix?: string
} = {}) {
  const { isMonetary = false, isPercentage = false, decimalPlaces = 2, prefix = "", suffix = "" } = config

  return function(this: any) {
    if (!this.series) return ""

    const value = this.y ?? 0
    let formatted = ""

    if (isMonetary) {
      formatted = `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    } else if (isPercentage) {
      formatted = `${value.toFixed(decimalPlaces)}%`
    } else {
      formatted = value.toLocaleString(undefined, { maximumFractionDigits: decimalPlaces })
    }

    return `<div style="font-family: var(--font-family-brand); font-size: var(--font-body-small-size);"><b>${this.point.name}</b><br/>${prefix}${formatted}${suffix}</div>`
  }
}

/**
 * Tooltip configuration for donut/pie charts
 * Used for: Donut and pie charts with percentage and value display
 * 
 * FORMATTING:
 * - Name in bold
 * - Value and percentage both shown
 * - Proper text alignment and spacing
 */
export function createDonutTooltip(config: {
  isMonetary?: boolean
  isPercentage?: boolean
  decimalPlaces?: number
  prefix?: string
  suffix?: string
} = {}) {
  const { isMonetary = false, isPercentage = false, decimalPlaces = 2, prefix = "", suffix = "" } = config

  return function(this: any) {
    if (!this.point) return ""

    const value = this.y ?? 0
    const percentage = this.point.percentage ?? 0

    let formatted = ""
    if (isMonetary) {
      formatted = `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    } else if (isPercentage) {
      formatted = `${value.toFixed(decimalPlaces)}%`
    } else {
      formatted = value.toLocaleString(undefined, { maximumFractionDigits: decimalPlaces })
    }

    const html = [
      `<div style="font-family: var(--font-family-brand); font-size: var(--font-body-small-size); display: flex; flex-direction: column; gap: 4px;">`,
      // Title - name
      `<div style="font-weight: var(--font-body-small-semibold-weight); border-bottom: 1px solid var(--color-stroke-light); padding-bottom: 4px;">${this.point.name}</div>`,
      // Value row
      `<div style="display: flex; justify-content: space-between; gap: 16px;">`,
      `<span>Value:</span>`,
      `<span style="font-weight: var(--font-body-small-bold-weight); color: var(--color-text-primary);">${prefix}${formatted}${suffix}</span>`,
      `</div>`,
      // Percentage row
      `<div style="display: flex; justify-content: space-between; gap: 16px;">`,
      `<span>Percentage:</span>`,
      `<span style="font-weight: var(--font-body-small-bold-weight); color: var(--color-text-primary);">${percentage.toFixed(1)}%</span>`,
      `</div>`,
    ]

    // Add additional legend columns if available in point custom data
    const point = this.point
    if (point.securityNumber) {
      html.push(
        `<div style="display: flex; justify-content: space-between; gap: 16px;">`,
        `<span>Security #:</span>`,
        `<span style="font-weight: var(--font-body-small-bold-weight); color: var(--color-text-primary);">${point.securityNumber}</span>`,
        `</div>`
      )
    }

    if (point.contracts !== undefined) {
      html.push(
        `<div style="display: flex; justify-content: space-between; gap: 16px;">`,
        `<span>Contracts:</span>`,
        `<span style="font-weight: var(--font-body-small-bold-weight); color: var(--color-text-primary);">${Number(point.contracts).toLocaleString()}</span>`,
        `</div>`
      )
    }

    if (point.amount !== undefined) {
      html.push(
        `<div style="display: flex; justify-content: space-between; gap: 16px;">`,
        `<span>Amount:</span>`,
        `<span style="font-weight: var(--font-body-small-bold-weight); color: var(--color-text-primary);">$${Number(point.amount).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>`,
        `</div>`
      )
    }

    html.push(`</div>`)

    return html.join("")
  }
}

// ============================================================================
// CONFIGURATION CONSTANTS
// ============================================================================

/**
 * BRD Tooltip Design Standards
 * 
 * FONT FAMILY: var(--font-family-brand)
 * TEXT SIZE: var(--font-body-small-size) for all text
 * FONT WEIGHTS:
 *   - Semibold: var(--font-body-small-semibold-weight) for titles/labels
 *   - Bold: var(--font-body-small-bold-weight) for values
 * TEXT COLORS:
 *   - Primary: var(--color-text-primary) for values (light/dark aware)
 *   - Secondary: var(--color-text-secondary) for supporting text
 * MARKERS:
 *   - Circle shape with border-radius: 50%
 *   - Size: 6px for stacked charts, 10px for multi-series
 *   - Background color matches the series color
 */

/**
 * Highcharts tooltip configuration base
 * Use ...brdHighchartsTheme.tooltip to include base styling
 */
export const TOOLTIP_BASE_CONFIG = {
  useHTML: true,
  shared: false,
} as const

/**
 * Tooltip configuration for stacked column charts
 * 
 * @example
 * tooltip: {
 *   ...brdHighchartsTheme.tooltip,
 *   ...TOOLTIP_STACKED_COLUMN,
 *   formatter: createStackedColumnTooltip({ isMonetary: true })
 * }
 */
export const TOOLTIP_STACKED_COLUMN = {
  shared: true,
  useHTML: true,
} as const

/**
 * Tooltip configuration for column + line combo charts
 * 
 * Always use shared: true to show columns and line values together
 * 
 * @example
 * tooltip: {
 *   ...brdHighchartsTheme.tooltip,
 *   ...TOOLTIP_COLUMN_LINE_COMBO,
 *   formatter: displayMode === "line" 
 *     ? createMultiSeriesSharedTooltip({ isMonetary: true })
 *     : createStackedColumnTooltip({ isMonetary: true })
 * }
 */
export const TOOLTIP_COLUMN_LINE_COMBO = {
  shared: true,
  useHTML: true,
} as const

/**
 * Tooltip configuration for multi-series line charts
 * 
 * @example
 * tooltip: {
 *   ...brdHighchartsTheme.tooltip,
 *   ...TOOLTIP_MULTI_SERIES_LINE,
 *   formatter: createMultiSeriesSharedTooltip({ isMonetary: true })
 * }
 */
export const TOOLTIP_MULTI_SERIES_LINE = {
  shared: true,
  useHTML: true,
} as const

/**
 * Tooltip configuration for stacked bar charts
 * 
 * Always use shared: true to show all stacked segments together
 * 
 * @example
 * tooltip: {
 *   ...brdHighchartsTheme.tooltip,
 *   ...TOOLTIP_STACKED_BAR,
 *   formatter: createStackedBarChartTooltip({ isMonetary: true })
 * }
 */
export const TOOLTIP_STACKED_BAR = {
  shared: true,
  useHTML: true,
} as const

/**
 * Tooltip configuration for single bar charts
 * 
 * @example
 * tooltip: {
 *   ...brdHighchartsTheme.tooltip,
 *   ...TOOLTIP_SINGLE_BAR,
 *   formatter: createBarChartTooltip({ isMonetary: true })
 * }
 */
export const TOOLTIP_SINGLE_BAR = {
  shared: false,
  useHTML: true,
} as const

/**
 * Tooltip configuration for donut/pie charts
 * 
 * @example
 * tooltip: {
 *   ...brdHighchartsTheme.tooltip,
 *   ...TOOLTIP_DONUT,
 *   formatter: createDonutTooltip({ isMonetary: true })
 * }
 */
export const TOOLTIP_DONUT = {
  shared: false,
  useHTML: true,
} as const

/**
 * Tooltip formatter selection by chart type
 * Use this as a reference when choosing which formatter to use
 */
export const FORMATTER_SELECTION_GUIDE = {
  "stacked-column": {
    formatter: "createStackedColumnTooltip()",
    config: "TOOLTIP_STACKED_COLUMN",
    shared: true,
    description: "Stacked columns: shows all segments in one tooltip",
  },
  "column-line-combo": {
    formatter: "createStackedColumnTooltip() or createMultiSeriesSharedTooltip()",
    config: "TOOLTIP_COLUMN_LINE_COMBO",
    shared: true,
    description: "Column + line combo: shows columns and line together",
  },
  "multi-series-line": {
    formatter: "createMultiSeriesSharedTooltip()",
    config: "TOOLTIP_MULTI_SERIES_LINE",
    shared: true,
    description: "Multiple line series: shows all lines at point",
  },
  "stacked-bar": {
    formatter: "createStackedBarChartTooltip()",
    config: "TOOLTIP_STACKED_BAR",
    shared: true,
    description: "Stacked bars: shows all segments in one tooltip",
  },
  "single-bar": {
    formatter: "createBarChartTooltip()",
    config: "TOOLTIP_SINGLE_BAR",
    shared: false,
    description: "Single bar chart: shows one bar at a time",
  },
  "donut-pie": {
    formatter: "createDonutTooltip()",
    config: "TOOLTIP_DONUT",
    shared: false,
    description: "Donut/pie chart: shows segment with value and percentage",
  },
} as const

/**
 * Example implementations by chart type
 */
export const TOOLTIP_IMPLEMENTATION_EXAMPLES = {
  "stacked-column-example": `
    tooltip: {
      ...brdHighchartsTheme.tooltip,
      shared: true,
      useHTML: true,
      formatter: createStackedColumnTooltip({ 
        isMonetary: viewMode === "amount" 
      })
    }
  `,

  "column-line-combo-example": `
    tooltip: {
      ...brdHighchartsTheme.tooltip,
      shared: true,
      useHTML: true,
      formatter: displayMode === "line" 
        ? createMultiSeriesSharedTooltip({ isMonetary: viewMode === "amount" })
        : createStackedColumnTooltip({ isMonetary: viewMode === "amount" })
    }
  `,

  "stacked-bar-example": `
    tooltip: {
      ...brdHighchartsTheme.tooltip,
      shared: true,
      useHTML: true,
      formatter: createStackedBarChartTooltip()
    }
  `,

  "single-bar-example": `
    tooltip: {
      ...brdHighchartsTheme.tooltip,
      shared: false,
      useHTML: true,
      formatter: createBarChartTooltip({ isMonetary: true })
    }
  `,

  "donut-example": `
    tooltip: {
      ...brdHighchartsTheme.tooltip,
      shared: false,
      useHTML: true,
      formatter: createDonutTooltip({ isMonetary: true })
    }
  `,
} as const

// ============================================================================
// DEVELOPER GUIDE
// ============================================================================

/**
 * DEVELOPER GUIDE: Implementing Tooltips
 * 
 * STEP 1: Import what you need
 * ```ts
 * import { brdHighchartsTheme } from "@/lib/brd-highcharts-theme"
 * import { createStackedColumnTooltip } from "@/lib/tooltip-utilities"
 * ```
 * 
 * STEP 2: Apply to your chart configuration
 * ```ts
 * const chartOptions: Highcharts.Options = {
 *   tooltip: {
 *     ...brdHighchartsTheme.tooltip,
 *     shared: true,
 *     useHTML: true,
 *     formatter: createStackedColumnTooltip({ isMonetary: viewMode === "amount" })
 *   }
 * }
 * ```
 * 
 * KEY POINTS:
 * - Always spread brdHighchartsTheme.tooltip first for base styling
 * - useHTML: true enables HTML formatting and is required for all BRD tooltips
 * - shared: true MUST be used for stacked charts and combo charts
 * - shared: false for single-value charts (pie, donut, basic bar)
 * - Never create custom formatters - always use the 6 provided formatter functions
 * 
 * CATEGORY NAMES IN TOOLTIPS:
 * - All formatters automatically extract x-axis category names (not numeric indices)
 * - For bar charts: vertical labels come from xAxis.categories
 * - For column charts: bottom labels come from xAxis.categories
 * - If your chart has no categories, numeric indices will be displayed
 * 
 * FORMATTING OPTIONS:
 * All formatters accept a config object with:
 * - isMonetary: boolean - formats value as $X,XXX
 * - isPercentage: boolean - formats value with % suffix
 * - decimalPlaces: number - decimal precision (default: 2)
 * - prefix: string - text before value (e.g., "$")
 * - suffix: string - text after value (e.g., "%")
 * 
 * CHART TYPE MAPPING:
 * 1. Stacked column charts → createStackedColumnTooltip() with shared: true
 * 2. Column + line combo → Mixed formatters with shared: true
 * 3. Multi-series line → createMultiSeriesSharedTooltip() with shared: true
 * 4. Stacked bar charts → createStackedBarChartTooltip() with shared: true
 * 5. Single bar charts → createBarChartTooltip() with shared: false
 * 6. Donut/pie charts → createDonutTooltip() with shared: false
 */
