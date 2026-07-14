// Bar width clamping utilities for Highcharts stacked column charts
// Re-export tooltip formatters from centralized location
export {
  createMultiSeriesSharedTooltip,
  createStackedColumnTooltip,
  createBarChartTooltip,
  createStackedBarChartTooltip,
  createUniversalTooltip,
  createDonutTooltip,
} from "./tooltip-utilities"

export const MIN_BAR_WIDTH = 12
export const MAX_BAR_WIDTH = 80
export const MIN_POINT_LENGTH = 12  // Minimum bar height for horizontal bar charts
export const MIN_VISIBLE_SLOTS = 5
export const CATEGORY_FILL_RATIO = 0.75

/**
 * INTERNAL UTILITY: Clamp a value between min and max.
 * 
 * NOT EXPORTED - Used only internally within getPointWidth().
 * This is not part of the public API and should not be used outside this file.
 * 
 * @param value - The value to clamp
 * @param min - Minimum bound (inclusive)
 * @param max - Maximum bound (inclusive)
 * @returns The clamped value
 */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

export function getVisibleSlots(categoryCount: number): number {
  return Math.max(categoryCount, MIN_VISIBLE_SLOTS)
}

export function getStackCount(series: Array<{ stack?: string; name: string }>): number {
  const stacks = new Set<string>()
  series.forEach(s => {
    stacks.add(s.stack || s.name)
  })
  return stacks.size
}

export function getPointWidth(
  containerWidth: number,
  categoryCount: number,
  stackCount: number
): number {
  if (!containerWidth || containerWidth <= 0) {
    return MAX_BAR_WIDTH
  }

  const visibleSlots = getVisibleSlots(categoryCount)
  const drawableWidth = containerWidth - 80 // Account for axis labels/padding
  const slotWidth = drawableWidth / visibleSlots

  const rawWidth = (slotWidth * CATEGORY_FILL_RATIO) / stackCount

  return Math.round(clamp(rawWidth, MIN_BAR_WIDTH, MAX_BAR_WIDTH))
}

/**
 * Calculate the MINIMUM column width in a chart to ensure consistent label visibility
 * across all categories. If the narrowest column can't fit labels, no labels show.
 */
export function getMinPointWidth(
  containerWidth: number,
  categoryCount: number,
  stackCount: number
): number {
  if (!containerWidth || containerWidth <= 0) {
    return MAX_BAR_WIDTH
  }

  // Minimum width is based on actual category count (not visible slots with padding)
  const drawableWidth = containerWidth - 80
  const categoryWidth = drawableWidth / categoryCount
  const rawWidth = (categoryWidth * CATEGORY_FILL_RATIO) / stackCount

  return Math.round(clamp(rawWidth, MIN_BAR_WIDTH, MAX_BAR_WIDTH))
}

export function getXAxisRange(categoryCount: number): { min: number; max: number } {
  const extraSlots = Math.max(0, MIN_VISIBLE_SLOTS - categoryCount) / 2
  return {
    min: -extraSlots,
    max: categoryCount - 1 + extraSlots
  }
}

// Minimum bar width to show data labels (must accommodate label text without overflow)
export const MIN_LABEL_BAR_WIDTH = 32

// Minimum segment height to show data labels (font size 10px + 4px padding each side = 18px)
export const MIN_LABEL_SEGMENT_HEIGHT = 18

/**
 * Check if data labels should be visible based on bar width
 * Labels need at least MIN_LABEL_BAR_WIDTH (32px) to display properly
 */
export function shouldShowDataLabels(pointWidth: number): boolean {
  return pointWidth >= MIN_LABEL_BAR_WIDTH
}

/**
 * Standard plotOptions for grouped (non-stacked) column charts
 * Data labels appear at top of bars using contrast color for visibility
 * Applies org-level spacing rules: groupPadding 0.08, pointPadding 0.02
 * Labels hidden when bar width < 32px or bar height < 18px (font 10px + 4px padding each side)
 */
export function getGroupedColumnPlotOptions(pointWidth: number, showLabels: boolean = true) {
  return {
    grouping: true,
    pointWidth,
    groupPadding: 0.08,
    pointPadding: 0.02,
    borderWidth: 0,
    maxPointWidth: MAX_BAR_WIDTH,
    dataLabels: {
      enabled: showLabels && shouldShowDataLabels(pointWidth),
      inside: true,
      verticalAlign: "top" as const,
      y: 4, // 4px padding from top edge
      padding: 4, // 4px padding on all sides
      style: {
        fontSize: "10px",
        fontWeight: "600",
        textOutline: "none",
        color: "contrast", // Highcharts auto-contrasts with bar color
      },
      // Formatter checks segment height and hides label if too small
      formatter: function(this: { y?: number | null; point?: { shapeArgs?: { height?: number; width?: number } } }): string {
        // Check bar height - hide label if bar too small (font 10px + 4px padding each side = 18px min)
        const barHeight = this.point?.shapeArgs?.height
        if (barHeight !== undefined && barHeight < MIN_LABEL_SEGMENT_HEIGHT) {
          return ""
        }
        const value = this.y ?? 0
        if (value === 0) return ""
        return Math.round(value).toLocaleString()
      },
    },
  }
}

/**
 * Standard plotOptions for stacked column/bar charts
 * Applies org-level spacing rules: groupPadding 0.08, pointPadding 0.02
 * Uses Highcharts 'contrast' color for ADA-compliant data labels
 * Labels hidden when bar width < 32px or segment height < 18px (font 10px + 4px padding each side)
 */
export function getStackedColumnPlotOptions(pointWidth: number, showLabels: boolean = true) {
  return {
    stacking: "normal" as const,
    pointWidth,
    groupPadding: 0.08,
    pointPadding: 0.02,
    borderWidth: 0,
    maxPointWidth: MAX_BAR_WIDTH,
    dataLabels: {
      enabled: showLabels && shouldShowDataLabels(pointWidth),
      inside: true,
      verticalAlign: "middle" as const,
      padding: 4, // 4px padding on all sides
      style: {
        fontSize: "10px",
        fontWeight: "600",
        textOutline: "none",
        color: "contrast", // Highcharts auto-contrasts: white on dark, black on light
      },
      // Formatter checks segment height and hides label if too small
      formatter: function(this: { y?: number | null; point?: { shapeArgs?: { height?: number; width?: number } } }): string {
        // Check segment height - hide label if segment too small (font 10px + 4px padding each side = 18px min)
        const segmentHeight = this.point?.shapeArgs?.height
        if (segmentHeight !== undefined && segmentHeight < MIN_LABEL_SEGMENT_HEIGHT) {
          return ""
        }
        const value = this.y ?? 0
        if (value === 0) return ""
        return Math.round(value).toLocaleString()
      },
    },
  }
}

/**
 * Standard plotOptions for stacked bar charts (horizontal)
 * Uses Highcharts 'contrast' color for ADA-compliant data labels
 * Labels hidden when bar height < 32px or segment width < 18px (font 10px + 4px padding each side)
 */
export function getStackedBarPlotOptions(pointWidth: number, showLabels: boolean = true) {
  return {
    stacking: "normal" as const,
    pointWidth,
    minPointLength: MIN_POINT_LENGTH,
    groupPadding: 0.08,
    pointPadding: 0.02,
    borderWidth: 0,
    maxPointWidth: MAX_BAR_WIDTH,
    dataLabels: {
      enabled: showLabels && shouldShowDataLabels(pointWidth),
      inside: true,
      align: "center" as const,
      verticalAlign: "middle" as const,
      padding: 4, // 4px padding on all sides
      style: {
        fontSize: "10px",
        fontWeight: "600",
        textOutline: "none",
        color: "contrast", // Highcharts auto-contrasts: white on dark, black on light
      },
      // Formatter checks segment width and hides label if too small
      formatter: function(this: { y?: number | null; point?: { shapeArgs?: { height?: number; width?: number } } }): string {
        // For horizontal bars, check segment width (not height)
        const segmentWidth = this.point?.shapeArgs?.width
        if (segmentWidth !== undefined && segmentWidth < MIN_LABEL_SEGMENT_HEIGHT) {
          return ""
        }
        const value = this.y ?? 0
        if (value === 0) return ""
        return Math.round(value).toLocaleString()
      },
    },
  }
}

/**
 * Standard legend configuration for Highcharts.
 * Ensures consistent legend styling and positioning across all widgets.
 * - Center-aligned horizontally at bottom
 * - Circular symbols (not squares) for line charts
 * - Proper spacing and font styling per BRD design system
 */
export const standardLegendConfig = {
  enabled: true,
  align: "center" as const,
  verticalAlign: "bottom" as const,
  layout: "horizontal" as const,
  floating: false,
  itemDistance: 20,
  itemMarginTop: 4,
  itemMarginBottom: 4,
  squareSymbol: false, // Use circles, not squares for line charts
  symbolRadius: 5,
  symbolHeight: 10,
  symbolWidth: 16,
  margin: 8,
  padding: 4,
  y: 0,
  itemStyle: {
    fontSize: "12px",
    fontWeight: "400",
    fontFamily: "var(--font-family-brand)",
    cursor: "pointer",
    color: "var(--color-text-primary)",
  },
  itemHoverStyle: {
    color: "var(--color-text-primary)",
  },
  itemHiddenStyle: {
    color: "var(--color-text-disabled)",
    textDecoration: "line-through",
  },
}

/**
 * Line chart specific legend configuration
 * Uses wider symbol width to show line with marker
 */
export const lineChartLegendConfig = {
  ...standardLegendConfig,
  symbolWidth: 20, // Wider for line + marker visibility
}

/**
 * Standard chart spacing with room for legend at bottom
 * [top, right, bottom, left]
 */
export const standardChartSpacing: [number, number, number, number] = [10, 10, 8, 10]

/**
 * Format number with abbreviation (K, M, B) for data labels
 * Uses 2 decimal places for amounts, no decimals for counts
 * Returns abbreviated string or empty string if value is 0
 * @param value - the number to format
 * @param prefix - optional prefix like "$" for currency
 * @param suffix - optional suffix like "%" for percentage
 * @param useDecimals - whether to use 2 decimal places (true for amounts, false for counts)
 */
export function formatAbbreviatedNumber(value: number, prefix: string = "", suffix: string = "", useDecimals: boolean = true): string {
  if (value === 0) return ""
  
  const absValue = Math.abs(value)
  const sign = value < 0 ? "-" : ""
  const decimals = useDecimals ? 2 : 0
  
  if (absValue >= 1000000000000) {
    const formatted = (absValue / 1000000000000)
    return `${sign}${prefix}${formatted.toFixed(decimals)}T${suffix}`
  }
  if (absValue >= 1000000000) {
    const formatted = (absValue / 1000000000)
    return `${sign}${prefix}${formatted.toFixed(decimals)}B${suffix}`
  }
  if (absValue >= 1000000) {
    const formatted = (absValue / 1000000)
    return `${sign}${prefix}${formatted.toFixed(decimals)}M${suffix}`
  }
  if (absValue >= 1000) {
    const formatted = (absValue / 1000)
    return `${sign}${prefix}${formatted.toFixed(decimals)}K${suffix}`
  }
  return `${sign}${prefix}${useDecimals ? absValue.toFixed(decimals) : Math.round(absValue)}${suffix}`
}

/**
 * Get data label formatter for Highcharts based on pointWidth
 * - If bar is too narrow (< MIN_LABEL_BAR_WIDTH), returns empty string
 * - If segment height is too small (< MIN_LABEL_SEGMENT_HEIGHT), returns empty string
 * - Otherwise returns abbreviated number
 * @param pointWidth - current bar width
 * @param prefix - optional prefix like "$" for currency
 * @param suffix - optional suffix like "%" for percentage
 * @param useDecimals - whether to use 2 decimal places (true for amounts, false for counts)
 */
export function getDataLabelFormatter(pointWidth: number, prefix: string = "", suffix: string = "", useDecimals: boolean = true) {
  return function(this: { y?: number | null; point?: { shapeArgs?: { height?: number; width?: number } } }): string {
    if (pointWidth < MIN_LABEL_BAR_WIDTH) return ""
    
    // Check segment height for stacked charts - hide label if segment too small
    const segmentHeight = this.point?.shapeArgs?.height
    if (segmentHeight !== undefined && segmentHeight < MIN_LABEL_SEGMENT_HEIGHT) {
      return ""
    }
    
    const value = this.y ?? 0
    return formatAbbreviatedNumber(value, prefix, suffix, useDecimals)
  }
}

/**
 * Get data label formatter for stacked charts that checks segment height
 * Hides labels when segment is too small to fit text with 4px padding on each side
 * @param prefix - optional prefix like "$" for currency
 * @param suffix - optional suffix like "%" for percentage
 * @param useDecimals - whether to use 2 decimal places (true for amounts, false for counts)
 */
export function getStackedDataLabelFormatter(prefix: string = "", suffix: string = "", useDecimals: boolean = true) {
  return function(this: { y?: number | null; point?: { shapeArgs?: { height?: number; width?: number } } }): string {
    // Check segment height - hide label if segment too small (font 10px + 4px padding each side = 18px min)
    const segmentHeight = this.point?.shapeArgs?.height
    if (segmentHeight !== undefined && segmentHeight < MIN_LABEL_SEGMENT_HEIGHT) {
      return ""
    }
    
    const value = this.y ?? 0
    if (value === 0) return ""
    return formatAbbreviatedNumber(value, prefix, suffix, useDecimals)
  }
}

/**
 * Standard stack labels configuration for stacked column/bar charts
 * Shows total above each stack when there's sufficient space (>= 32px width)
 * Gap between label and column top follows BRD sp-4 (4px) spacing
 * Labels will not overflow into adjacent bar space
 * IMPORTANT: The enabled flag applies consistently to ALL columns in the chart
 * @param pointWidth - current bar width to determine if labels should show
 * @param prefix - optional prefix like "$" for currency
 * @param suffix - optional suffix like "%" for percentage
 * @param useDecimals - whether to use 2 decimal places (true for amounts, false for counts)
 */
export function getStackLabelsConfig(pointWidth: number, prefix: string = "", suffix: string = "", useDecimals: boolean = true) {
  const enabled = pointWidth >= MIN_LABEL_BAR_WIDTH
  return {
    enabled,
    allowOverlap: false, // Prevent labels from overlapping
    overflow: "allow" as const, // Allow labels to overflow into chart margin
    crop: false, // Don't crop labels that extend beyond plot area
    formatter: function(this: { total?: number }): string {
      // Always return formatted value - visibility is controlled by `enabled` flag
      return formatAbbreviatedNumber(this.total ?? 0, prefix, suffix, useDecimals)
    },
    style: {
      fontSize: "10px",
      fontWeight: "600",
      textOutline: "none",
      color: "var(--color-text-primary)",
    },
    verticalAlign: "top" as const,
    y: -4, // Position above the stack with sp-4 (4px) gap
  }
}

/**
 * Standard stack labels configuration for horizontal stacked bar charts
 * Shows total to the right of each stack with sp-4 (4px) gap
 * Labels will not overflow into adjacent bar space
 * IMPORTANT: The enabled flag applies consistently to ALL bars in the chart
 * @param barHeight - current bar height to determine if labels should show
 * @param prefix - optional prefix like "$" for currency
 * @param suffix - optional suffix like "%" for percentage
 */
export function getHorizontalStackLabelsConfig(barHeight: number, prefix: string = "", suffix: string = "") {
  const enabled = barHeight >= MIN_LABEL_BAR_WIDTH
  return {
    enabled,
    allowOverlap: false,
    overflow: "allow" as const, // Allow labels to overflow into chart margin
    crop: false, // Don't crop labels that extend beyond plot area
    formatter: function(this: { total?: number }): string {
      // Always return formatted value - visibility is controlled by `enabled` flag
      return formatAbbreviatedNumber(this.total ?? 0, prefix, suffix)
    },
    style: {
      fontSize: "10px",
      fontWeight: "600",
      textOutline: "none",
      color: "var(--color-text-primary)",
    },
    align: "left" as const,
    verticalAlign: "middle" as const,
    x: 4, // Position to the right of the stack with sp-4 (4px) gap
    y: 0,
  }
}

/**
 * Calculate y-axis max with n+1 headroom for stack labels
 * Ensures stack totals displayed above bars stay within the chart area
 * Adds extra headroom (1.5 ticks) above the highest data point for stack labels
 * @param maxStackTotal - the maximum total value across all stacks
 * @param tickInterval - the tick interval being used for the y-axis (optional, will calculate if not provided)
 * @returns the y-axis max value with extra tick interval of headroom for stack labels
 */
export function getYAxisMaxWithHeadroom(maxStackTotal: number, tickInterval?: number): number {
  // If no tick interval provided, calculate a reasonable one
  const interval = tickInterval ?? calculateTickInterval(maxStackTotal)
  
  // n+1.5 rule: find the first tick that is strictly greater than maxStackTotal
  // and add extra 0.5 tick headroom for stack labels to fit
  // Example: maxStackTotal=801, interval=200 -> ceil(801/200)=5 -> (5+1)*200=1200 (two ticks above 801)
  // Example: maxStackTotal=800, interval=200 -> ceil(800/200)=4 -> but 800==4*200, so (4+2)*200=1200
  const ticksToMax = maxStackTotal / interval
  const ticksNeeded = Number.isInteger(ticksToMax) ? ticksToMax + 2 : Math.ceil(ticksToMax) + 1
  return ticksNeeded * interval
}

/**
 * Calculate a reasonable tick interval for a given max value
 * Uses nice round numbers (1, 2, 5, 10, 20, 50, 100, etc.)
 * @param maxValue - the maximum data value
 * @param targetTicks - desired number of ticks (default 5-7)
 * @returns a nice round tick interval
 */
export function calculateTickInterval(maxValue: number, targetTicks: number = 6): number {
  if (maxValue <= 0) return 1
  
  const rawInterval = maxValue / targetTicks
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawInterval)))
  const normalized = rawInterval / magnitude
  
  // Choose nice round number: 1, 2, 5, or 10
  let niceInterval: number
  if (normalized <= 1) niceInterval = 1
  else if (normalized <= 2) niceInterval = 2
  else if (normalized <= 5) niceInterval = 5
  else niceInterval = 10
  
  return niceInterval * magnitude
}

/**
 * Calculate x-axis label width for stacked/grouped column charts
 * Label width should match the group width (all stacks combined) with minimum 80px
 * Group width = (slotWidth * CATEGORY_FILL_RATIO)
 * @param containerWidth - the chart container width
 * @param categoryCount - number of categories
 * @param stackCount - number of stacks (for grouped columns, this is series count)
 * @returns the calculated label width or 80px minimum
 */
export function getGroupedColumnLabelWidth(
  containerWidth: number,
  categoryCount: number,
  stackCount: number
): number {
  const MIN_LABEL_WIDTH = 80 // Minimum 80px as per standard
  
  if (!containerWidth || containerWidth <= 0 || categoryCount <= 0) {
    return MIN_LABEL_WIDTH
  }

  const visibleSlots = getVisibleSlots(categoryCount)
  const drawableWidth = containerWidth - 80 // Account for axis labels/padding
  const slotWidth = drawableWidth / visibleSlots
  
  // Group width = entire slot * CATEGORY_FILL_RATIO (for all stacks combined)
  const groupWidth = slotWidth * CATEGORY_FILL_RATIO
  
  // Use group width or minimum 80px, whichever is larger
  return Math.max(groupWidth, MIN_LABEL_WIDTH)
}

/**
 * Calculate max stack totals from series data
 * @param seriesData - array of series, each with data array
 * @returns the maximum total across all categories/stacks
 */
export function getMaxStackTotal(seriesData: Array<{ data: number[] }>): number {
  if (!seriesData.length || !seriesData[0].data.length) return 0
  
  const categoryCount = seriesData[0].data.length
  let maxTotal = 0
  
  for (let i = 0; i < categoryCount; i++) {
    const categoryTotal = seriesData.reduce((sum, series) => {
      const value = series.data[i]
      return sum + (typeof value === 'number' ? value : 0)
    }, 0)
    maxTotal = Math.max(maxTotal, categoryTotal)
  }
  
  return maxTotal
}

/**
 * Tooltip formatter for use with shared: false
 * Displays single point data with color legend, series name, and formatted value
 * For column, bar, and line charts
 */
export function createTooltipFormatter(options?: {
  isMonetary?: boolean
  isPercentage?: boolean
  decimalPlaces?: number
}) {
  const { isMonetary = false, isPercentage = false, decimalPlaces = 2 } = options || {}
  
  return function(this: any) {
    // For shared: false, use this.point or this.y
    const point = this.point || this
    const seriesName = this.series?.name || ""
    const value = this.y ?? point.y ?? 0
    let formatted = ""
    
    if (isMonetary) {
      formatted = `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    } else if (isPercentage) {
      formatted = `${value.toFixed(decimalPlaces)}%`
    } else {
      formatted = value.toLocaleString(undefined, { maximumFractionDigits: decimalPlaces })
    }
    
    const color = this.color || point.color || "#999"
    const categoryLabel = this.x || point.x || ""
    
    return `<b>${categoryLabel}</b><br/><span style="color:${color}">●</span> ${seriesName}: <b>${formatted}</b>`
  }
}

/**
 * Tooltip formatter for multi-series shared tooltips (when shared: true is used)
 * Displays all series values for a category with color legends
 */
export function createSharedTooltipFormatter(options?: {
  isMonetary?: boolean
  isPercentage?: boolean
  decimalPlaces?: number
}) {
  const { isMonetary = false, isPercentage = false, decimalPlaces = 2 } = options || {}
  
  return function(this: any) {
    let tooltip = `<b>${this.x}</b><br/>`
    
    if (this.points && Array.isArray(this.points)) {
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
        
        tooltip += `<span style="color:${point.color}">●</span> ${point.series.name}: <b>${formatted}</b><br/>`
      })
    }
    
    return tooltip
  }
}

// ============================================================================
// DONUT CHART RESPONSIVE FONT SIZE UTILITIES
// ============================================================================

/**
 * BRD font size scale for donut chart primary value (main number displayed)
 * Scale follows BRD headline typography: h2 -> h3 -> h4 -> h5 -> body-medium -> body-small
 */
export const DONUT_PRIMARY_FONT_SIZES = [
  { size: 28, lineHeight: 32, weight: 800, token: "h2" },     // headline-h2
  { size: 24, lineHeight: 28, weight: 700, token: "h3" },     // headline-h3
  { size: 20, lineHeight: 24, weight: 700, token: "h4" },     // headline-h4
  { size: 16, lineHeight: 20, weight: 600, token: "h5" },     // headline-h5
  { size: 14, lineHeight: 20, weight: 600, token: "body-medium" }, // body-medium-semibold
  { size: 12, lineHeight: 16, weight: 600, token: "body-small" },  // body-small-semibold
] as const

/**
 * BRD font size scale for donut chart secondary text (label and secondary value)
 * Scale follows BRD body typography: body-medium -> body-small
 */
export const DONUT_SECONDARY_FONT_SIZES = [
  { size: 14, lineHeight: 20, weight: 400, token: "body-medium" },
  { size: 12, lineHeight: 16, weight: 400, token: "body-small" },
] as const

/**
 * Calculate the initial font size index for donut chart based on donut size
 * Ensures text starts at appropriate size without overflow
 * 
 * @param donutSize - Width/height of donut chart in pixels
 * @returns Starting font index for DONUT_PRIMARY_FONT_SIZES array
 * 
 * @example
 * const donutSize = 220
 * const initialIndex = getDonutInitialFontIndex(donutSize) // returns 0 (h2)
 */
export function getDonutInitialFontIndex(donutSize: number): number {
  if (donutSize >= 220) return 0 // h2
  if (donutSize >= 180) return 1 // h3
  if (donutSize >= 150) return 2 // h4
  if (donutSize >= 120) return 3 // h5
  return 4 // body-medium
}

/**
 * Calculate safe text width for donut chart inner circle
 * Text must fit inside the inner circle without overlapping the donut ring
 * 
 * Formula:
 * 1. Inner diameter = donutSize * 0.65 (innerSize: 65% per BRD standard)
 * 2. Subtract 2px padding on each side (sp-2 BRD spacing)
 * 3. Calculate inscribed square: diameter / sqrt(2) for safe text area
 * 
 * @param donutSize - Width/height of donut chart in pixels
 * @returns Maximum safe width for text content in pixels
 * 
 * @example
 * const donutSize = 220
 * const safeWidth = getDonutSafeTextWidth(donutSize) // ~100px
 */
export function getDonutSafeTextWidth(donutSize: number): number {
  const innerDiameter = donutSize * 0.65 // innerSize: 65%
  const padding = 2 // sp-2 = 2px
  const availableDiameter = innerDiameter - (padding * 2)
  
  // Inscribed square inside circle: side = diameter / sqrt(2)
  return availableDiameter / Math.sqrt(2)
}

/**
 * Get next larger font size index for responsive font scaling
 * Used when text overflows and needs to be reduced
 * 
 * @param currentIndex - Current font size index
 * @param maxIndex - Maximum index in the font sizes array (length - 1)
 * @returns Next font index (one size smaller), clamped to maxIndex
 * 
 * @example
 * const nextIndex = getDonutNextFontIndex(0, DONUT_PRIMARY_FONT_SIZES.length - 1)
 * // returns 1 (h3, which is smaller than h2)
 */
export function getDonutNextFontIndex(currentIndex: number, maxIndex: number): number {
  return Math.min(currentIndex + 1, maxIndex)
}

// ============================================================================
// CENTERED LEGEND CONFIGURATION
// ============================================================================

/**
 * Get centered legend configuration for charts
 * Provides proper centering for both single-line and multi-line wrapped legends
 * 
 * @returns Highcharts Legend options with center alignment for all rows
 * 
 * @example
 * legend: getCenteredLegendConfig()
 */
export function getCenteredLegendConfig(): Partial<Highcharts.LegendOptions> {
  return {
    enabled: true,
    align: "center" as const,
    verticalAlign: "bottom" as const,
    layout: "horizontal" as const,
    itemDistance: 20,  // Gap between legend items
    margin: 8,         // Gap between chart and legend
    padding: 4,        // Padding inside legend container
    y: 0,
    // Center-alignment wrapper for multi-row legends
    // When legend wraps, items on wrapped rows will also be center-aligned
    x: 0,
    // Use x offset to auto-center the legend wrapper
    floating: false,
    useHTML: true,
    squareSymbol: false,
    symbolRadius: 5,
    symbolHeight: 10,
    symbolWidth: 16,
    itemStyle: {
      color: "var(--color-text-primary)",
      fontFamily: "var(--font-family-brand)",
      fontSize: "var(--font-body-small-size)",
      fontWeight: "var(--font-body-small-regular-weight)",
      cursor: "pointer",
      textAlign: "center" as any,
    },
    itemHoverStyle: {
      color: "var(--color-text-primary)",
    },
    itemHiddenStyle: {
      color: "var(--color-text-disabled)",
      textDecoration: "line-through",
    },
  }
}

