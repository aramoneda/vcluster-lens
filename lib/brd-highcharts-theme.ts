import type Highcharts from "highcharts"

/**
 * ============================================
 * BRD HIGHCHARTS STANDARD CONSTANTS
 * ============================================
 * These constants define the BRD chart spacing and sizing rules.
 * Use these in all chart implementations for consistency.
 * 
 * USAGE: Import individual constants or utility functions as needed.
 * All widgets should use these constants instead of hardcoded values.
 */

/**
 * ============================================
 * BRD CHART FILL CONTAINER STANDARD (DEFAULT BEHAVIOR)
 * ============================================
 * ALL charts using brdHighchartsTheme automatically fill their container.
 * This is the default behavior - no extra configuration needed.
 * 
 * HOW IT WORKS:
 * 1. brdHighchartsTheme.chart includes height: "100%" and reflow: true
 * 2. Charts automatically resize to fill their container
 * 3. Just ensure the container has a defined height (flex-1, h-full, explicit px)
 * 
 * STANDARD USAGE (RECOMMENDED):
 * ```tsx
 * import { brdHighchartsTheme } from "@/lib/brd-highcharts-theme"
 * 
 * const chartOptions: Highcharts.Options = {
 *   ...brdHighchartsTheme,
 *   chart: {
 *     ...brdHighchartsTheme.chart,
 *     type: "column",
 *   },
 *   series: [...],
 * }
 * 
 * // In widget content area (already has flex-1 from Widget component)
 * <div className="h-full w-full">
 *   <HighchartsReact 
 *     highcharts={Highcharts} 
 *     options={chartOptions}
 *     containerProps={{ style: { height: "100%", width: "100%" } }}
 *   />
 * </div>
 * ```
 * 
 * IMPORTANT NOTES:
 * - The container div MUST have a defined height (h-full, flex-1, or explicit px)
 * - Always pass containerProps with height/width 100% to HighchartsReact
 * - Works with any chart type: column, bar, line, area, pie, etc.
 * - Charts automatically reflow when container resizes
 */



/**
 * Minimum bar/column width in pixels.
 * 
 * PURPOSE: Ensures bars remain visually distinguishable and clickable.
 * Bars narrower than 12px become difficult to see and interact with.
 * 
 * USED IN: getPointWidth() calculation, responsive bar sizing.
 */
export const BRD_MIN_BAR_WIDTH = 12

/**
 * Maximum bar/column width in pixels.
 * 
 * PURPOSE: Prevents bars from becoming excessively wide on large screens
 * or when there are few data points. Maintains visual balance.
 * 
 * USED IN: getPointWidth() calculation, plotOptions.column.maxPointWidth.
 */
export const BRD_MAX_BAR_WIDTH = 80

/**
 * Minimum visible category slots to maintain consistent spacing.
 * 
 * PURPOSE: When a chart has fewer than 5 categories, this ensures
 * the bars don't stretch too wide. Extra empty slots are added to
 * center the data and maintain proportional bar widths.
 * 
 * EXAMPLE: A chart with 3 categories will render as if it has 5 slots,
 * with the 3 bars centered and appropriately sized.
 * 
 * USED IN: getVisibleSlots(), getXAxisRange(), getPointWidth().
 */
export const BRD_MIN_VISIBLE_SLOTS = 5

/**
 * Category fill ratio - portion of slot width the bar should occupy.
 * 
 * PURPOSE: Controls the gap between bars. At 0.75, each bar fills 75%
 * of its slot, leaving 25% as whitespace between bars.
 * 
 * VALUE RANGE: 0.0 to 1.0 (0% to 100% of slot width).
 * 
 * USED IN: getPointWidth() calculation.
 */
export const BRD_CATEGORY_FILL_RATIO = 0.75

/**
 * Minimum bar width required to display data labels inside the bar.
 * 
 * PURPOSE: Data labels need sufficient space to be readable.
 * When bars are narrower than 32px, labels are hidden to prevent
 * overflow and visual clutter.
 * 
 * CALCULATION: Approximately 3-4 characters at 10px font + padding.
 * 
 * USED IN: shouldShowDataLabels(), dataLabels.enabled conditions.
 */
export const BRD_MIN_LABEL_BAR_WIDTH = 32

/**
 * Minimum segment height for stacked bar data labels.
 * 
 * PURPOSE: In stacked charts, individual segments may be too small
 * to display labels. This threshold ensures labels only appear
 * when there's enough vertical space (10px font + 4px padding each side).
 * 
 * USED IN: Stacked bar/column dataLabels formatter functions.
 */
export const BRD_MIN_LABEL_SEGMENT_HEIGHT = 18

/**
 * Minimum bar length for horizontal bar charts.
 * 
 * PURPOSE: Ensures very small values are still visible as a minimal bar
 * rather than appearing as zero. Helps users see that a value exists
 * even if it's proportionally tiny.
 * 
 * USED IN: plotOptions.bar.minPointLength.
 */
export const BRD_MIN_POINT_LENGTH = 12

/**
 * Standard gap between chart area and legend (matches BRD sp-8 token).
 * 
 * PURPOSE: Creates consistent vertical spacing between the chart
 * visualization and the legend below it. Also used for top/bottom
 * chart padding to accommodate stack labels.
 * 
 * DESIGN TOKEN: Equivalent to var(--spacing-8) or 8px.
 * 
 * USED IN: chart.spacing[], legend.margin.
 */
export const BRD_CHART_LEGEND_GAP = 8
export const BRD_STACK_LABEL_GAP = 4

/**
 * Gap between stack totals and top of column (matches BRD sp-4 token).
 * 
 * PURPOSE: Positions the stack total label slightly above the column
 * without touching it. Provides visual separation while keeping
 * the label clearly associated with its column.
 * 
 * DESIGN TOKEN: Equivalent to var(--spacing-4) or 4px.
 * 
 * USED IN: yAxis.stackLabels.y (negative value to position above).
 */

/**
 * Line chart marker radius (produces 12px diameter circles).
 * 
 * PURPOSE: Creates visible data point markers on line charts.
 * The 12px diameter (6px radius) is large enough to be clickable
 * and visible, while not overwhelming the line itself.
 * 
 * USED IN: plotOptions.line.marker.radius, line series marker config.
 */
export const BRD_LINE_MARKER_RADIUS = 6

/**
 * Standard tooltip padding for all chart types.
 * 
 * PURPOSE: Consistent spacing inside tooltips following BRD design standards.
 * 24px padding creates a spacious, professional appearance with proper content separation.
 * 
 * USED IN: createMultiSeriesSharedTooltip() and all tooltip formatters.
 * APPLIES TO: Line charts, multi-series charts, and all other chart tooltips.
 */
export const BRD_TOOLTIP_PADDING = 24

/**
 * Border radius for column and bar chart corners.
 * 
 * PURPOSE: Adds subtle rounded corners to bars for a softer,
 * more modern appearance. Matches BRD design system styling.
 * 
 * USED IN: plotOptions.column.borderRadius, plotOptions.bar.borderRadius.
 */
export const BRD_COLUMN_BORDER_RADIUS = 4

/**
 * Standard group padding for non-stacked column charts.
 * 
 * PURPOSE: Controls horizontal spacing between groups of bars
 * (e.g., in grouped bar charts). Expressed as a ratio of the
 * category width (0.12 = 12% padding on each side of the group).
 * 
 * USED IN: plotOptions.column.groupPadding for non-stacked charts.
 */
export const BRD_GROUP_PADDING = 0.12

/**
 * Standard point padding for non-stacked column charts.
 * 
 * PURPOSE: Controls horizontal spacing between individual bars
 * within a group. Expressed as a ratio (0.08 = 8% padding).
 * 
 * USED IN: plotOptions.column.pointPadding for non-stacked charts.
 */
export const BRD_POINT_PADDING = 0.08

/**
 * Group padding for stacked column/bar charts (tighter than standard).
 * 
 * PURPOSE: Stacked charts don't have multiple bars per category,
 * so less padding is needed. The tighter spacing maximizes
 * the visible data area.
 * 
 * USED IN: Stacked chart plotOptions configurations.
 */
export const BRD_STACKED_GROUP_PADDING = 0.08

/**
 * Point padding for stacked column/bar charts (minimal).
 * 
 * PURPOSE: Stacked charts have segments within a single bar,
 * so point padding is minimal. This creates a cohesive stack
 * appearance.
 * 
 * USED IN: Stacked chart plotOptions configurations.
 */
export const BRD_STACKED_POINT_PADDING = 0.02

/**
 * Minimum chart width for horizontal scrolling.
 * 
 * PURPOSE: When M-size widgets contain many categories (24+),
 * horizontal scrolling enables readability without cramping columns.
 * This constant defines when to enable scroll mode.
 * 
 * CALCULATION: Min column width (12px) + spacing (4px per column) 
 * × 24 categories + axis labels (80px) = ~500px minimum.
 * 
 * USED IN: Widget scroll logic to detect when overflow is needed.
 */
export const BRD_SCROLL_TRIGGER_WIDTH = 500

/**
 * Calculated width per category for scroll-enabled charts.
 * 
 * PURPOSE: When horizontal scrolling is enabled, each category
 * gets fixed width allocation to maintain consistent column sizing
 * and prevent cramping even with many data points.
 * 
 * FORMULA: 24 categories × 24px per category = 576px for chart area.
 * 
 * USED IN: Chart container width calculation when scroll is needed.
 */
export const BRD_CATEGORY_WIDTH_SCROLL = 24

/**
 * ============================================
 * BRD HORIZONTAL SCROLL STANDARDS
 * ============================================
 * Standardized approach for enabling horizontal scroll on charts
 * with many categories that don't fit in M-size or smaller widgets.
 * 
 * PROBLEM: When charts have 20+ categories (like 24-month data),
 * they crush together on mobile/M-size views without horizontal scroll.
 * 
 * SOLUTION: These utilities calculate when scroll is needed and
 * maintain minimum bar width (12px) + gap (8px) regardless of viewport.
 * 
 * USAGE EXAMPLE:
 * ```tsx
 * import { shouldEnableChartScroll, getChartScrollWidth } from "@/lib/brd-highcharts-theme"
 * 
 * const categoryCount = data.categories.length
 * const needsScroll = shouldEnableChartScroll(containerWidth, categoryCount)
 * const chartWidth = getChartScrollWidth(categoryCount, needsScroll)
 * 
 * <div className={needsScroll ? "overflow-x-auto" : ""} style={{ scrollbarGutter: "stable" }}>
 *   <div style={{ width: chartWidth }}>
 *     <HighchartsReact {...} />
 *   </div>
 * </div>
 * ```
 */

/**
 * Determine if horizontal scroll should be enabled for a chart.
 * 
 * CALCULATION: Checks if available width (container - reserves) can fit
 * minimum column width (12px) + spacing (8px) for all categories.
 * 
 * RESERVES: Account for y-axis labels (~80px) + padding (16px each side) = 112px
 * 
 * @param containerWidth - Current container width in pixels
 * @param categoryCount - Number of data categories/columns
 * @returns boolean - True if scroll should be enabled
 */
export function shouldEnableChartScroll(containerWidth: number, categoryCount: number): boolean {
  const AXIS_AND_PADDING_RESERVE = 112
  const availableWidth = Math.max(0, containerWidth - AXIS_AND_PADDING_RESERVE)
  const minTotalWidth = categoryCount * (12 + 8) // MIN_BAR_WIDTH (12px) + gap (8px)
  return availableWidth > 0 && availableWidth < minTotalWidth
}

/**
 * Calculate chart container width when scroll is enabled or disabled.
 * 
 * WHEN SCROLL ENABLED: Each category gets fixed 24px width (BRD_CATEGORY_WIDTH_SCROLL)
 * to maintain consistent column sizing across all viewports.
 * 
 * WHEN SCROLL DISABLED: Use "100%" to fill available container width.
 * 
 * @param categoryCount - Number of data categories/columns
 * @param needsScroll - Whether horizontal scroll is enabled
 * @returns string | number - CSS width value (percentage string or pixel number)
 */
export function getChartScrollWidth(categoryCount: number, needsScroll: boolean): string | number {
  if (needsScroll) {
    return categoryCount * BRD_CATEGORY_WIDTH_SCROLL
  }
  return "100%"
}

/**
 * Calculate point/bar width when scroll is enabled or disabled.
 * 
 * WHEN SCROLL ENABLED: Use fixed 22px per bar (24px - 2px margin)
 * WHEN SCROLL DISABLED: Call getPointWidth from chart-utils
 * 
 * @param needsScroll - Whether horizontal scroll is enabled
 * @param containerWidth - Available chart width in pixels
 * @param categoryCount - Number of data categories
 * @param stackCount - Number of stacked series
 * @returns number - Bar width in pixels
 */
export function calculateBarWidth(
  needsScroll: boolean,
  containerWidth: number,
  categoryCount: number,
  stackCount: number
): number {
  if (needsScroll) {
    return 22 // Fixed 22px when scrolling (24px - 2px margin)
  }
  // Import and use getPointWidth from chart-utils for responsive calculation
  return containerWidth / categoryCount / stackCount
}

/**
 * ============================================
 * BRD CHART COLOR SWATCHES
 * ============================================
 * Sequential color palette for chart series.
 * 
 * PURPOSE: Provides a consistent, accessible color sequence for all charts.
 * Colors are ordered to maximize contrast between adjacent series.
 * 
 * USAGE: Highcharts automatically cycles through these colors for each series.
 * You can also reference individual swatches: brdChartSwatches[0] for first color.
 * 
 * ACCESSIBILITY: Colors are tested for sufficient contrast and colorblind-friendliness.
 */
export const brdChartSwatches = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
  "var(--chart-8)",
  "var(--chart-9)",
  "var(--chart-10)",
  "var(--chart-11)",
  "var(--chart-12)",
  "var(--chart-13)",
  "var(--chart-14)",
  "var(--chart-15)",
  "var(--chart-16)",
  "var(--chart-17)",
  "var(--chart-18)",
  "var(--chart-19)",
  "var(--chart-20)",
  "var(--chart-21)",
  "var(--chart-22)",
  "var(--chart-23)",
  "var(--chart-24)",
] as const

/**
 * Format x-axis labels to wrap across multiple lines (up to 3) before truncating.
 * 
 * PURPOSE: Allows readable x-axis labels by wrapping text instead of truncating
 * with ellipsis. After 3 lines, remaining text is truncated.
 * 
 * @param value - The label value to format (can be string or number)
 * @param maxCharsPerLine - Characters before line break (default 15)
 * @returns HTML string with line breaks, or truncated text after 3 lines
 * 
 * EXAMPLES:
 * - "First Extension - Cash Calls" => "First Extension -<br/>Cash Calls"
 * - "Very Long Label Text That Should Wrap" => "Very Long Label<br/>Text That Should<br/>Wrap"
 */
export function formatXAxisLabel(value: any, maxCharsPerLine: number = 15): string {
  // Handle non-string values
  if (value === null || value === undefined) {
    return ""
  }
  
  const text = String(value)
  
  // If text is short enough, return as-is
  if (text.length <= maxCharsPerLine) {
    return text
  }
  
  const words = text.split(" ")
  let lines: string[] = [""]
  let lineIndex = 0
  
  for (const word of words) {
    const currentLine = lines[lineIndex]
    const potentialLine = currentLine ? `${currentLine} ${word}` : word
    
    if (potentialLine.length <= maxCharsPerLine) {
      lines[lineIndex] = potentialLine
    } else {
      // Move to next line
      lineIndex++
      if (lineIndex >= 3) {
        // Already have 3 lines, truncate
        if (lines[2]) {
          lines[2] = lines[2] + "..."
        }
        break
      }
      lines[lineIndex] = word
    }
  }
  
  return lines.join("<br/>")
}

/**
 * Format large numbers with K, M, B suffixes for y-axis labels.
 * 
 * PURPOSE: Makes large numbers readable on axis labels without taking
 * excessive horizontal space. Uses 0-1 decimal places based on precision needs.
 * 
 * NOTE: This formatter uses FEWER decimals (0-1) than data labels (2 decimals)
 * because axis labels need to be compact while data labels can be more precise.
 * 
 * @param value - The numeric value to format
 * @param prefix - Optional prefix (e.g., "$" for currency)
 * @returns Formatted string like "$1.5M" or "200K"
 * 
 * EXAMPLES:
 * - formatAxisLabel(1500000, "$") => "$1.5M"
 * - formatAxisLabel(2000000000) => "2B"
 * - formatAxisLabel(500) => "500"
 */
export function formatAxisLabel(value: number, prefix: string = ""): string {
  const absValue = Math.abs(value)
  const sign = value < 0 ? "-" : ""
  
  if (absValue >= 1_000_000_000_000) {
    const formatted = (absValue / 1_000_000_000_000)
    return sign + prefix + (formatted % 1 === 0 ? formatted.toFixed(0) : formatted.toFixed(1)) + "T"
  }
  if (absValue >= 1_000_000_000) {
    const formatted = (absValue / 1_000_000_000)
    return sign + prefix + (formatted % 1 === 0 ? formatted.toFixed(0) : formatted.toFixed(1)) + "B"
  }
  if (absValue >= 1_000_000) {
    const formatted = (absValue / 1_000_000)
    return sign + prefix + (formatted % 1 === 0 ? formatted.toFixed(0) : formatted.toFixed(1)) + "M"
  }
  if (absValue >= 1_000) {
    const formatted = (absValue / 1_000)
    return sign + prefix + (formatted % 1 === 0 ? formatted.toFixed(0) : formatted.toFixed(1)) + "K"
  }
  return sign + prefix + absValue.toString()
}

/**
 * ============================================
 * BRD HIGHCHARTS THEME OBJECT
 * ============================================
 * Global theme configuration applied to all Highcharts instances.
 * 
 * USAGE: Apply this theme globally with applyBrdHighchartsTheme(Highcharts)
 * or spread individual sections into chart options.
 * 
 * STRUCTURE:
 * - colors: Default series color palette
 * - chart: Container styling and spacing
 * - title/subtitle: Header text styling
 * - xAxis/yAxis: Axis lines, labels, and grid styling
 * - legend: Legend position, symbols, and text styling
 * - tooltip: Hover tooltip appearance
 * - plotOptions: Default series-type configurations
 * - credits: Highcharts branding (disabled)
 */
export const brdHighchartsTheme = {
  /**
   * Default color palette - cycles through brdChartSwatches for series.
   * Each new series gets the next color in sequence.
   */
  colors: [...brdChartSwatches],
  
  /**
   * Chart container configuration.
   * 
   * HEIGHT: Set to '100%' by default - charts automatically fill their container.
   *   - The container (div wrapping HighchartsReact) must have a defined height
   *   - Use containerProps={{ style: { height: "100%", width: "100%" } }} on HighchartsReact
   *   - Works with flex containers (flex-1, h-full) or explicit heights
   * 
   * backgroundColor: Transparent to inherit from widget container.
   * spacing: [top, right, bottom, left] padding inside chart container.
   *   - 8px top/bottom for stack labels and legend gap
   *   - 4px left/right to prevent axis label cutoff
   * reflow: true - automatically resize when container size changes.
   * style: Default text styling inherited by all chart elements.
   * 
   * USAGE: Charts using brdHighchartsTheme will auto-fill their container.
   * ```tsx
   * <div className="h-full w-full">  // Container with defined height
   *   <HighchartsReact 
   *     highcharts={Highcharts} 
   *     options={{ ...brdHighchartsTheme, series: [...] }}
   *     containerProps={{ style: { height: "100%", width: "100%" } }}
   *   />
   * </div>
   * ```
   */
  chart: {
    height: "100%",              // DYNAMIC: Fill container height automatically
    backgroundColor: "transparent",
    spacing: [BRD_CHART_LEGEND_GAP, 4, BRD_CHART_LEGEND_GAP, 4],
    reflow: true,               // Auto-resize on container changes
    style: {
      color: "var(--color-text-primary)",
      fontFamily: "var(--font-family-brand)",
      fontSize: "var(--font-body-medium-size)",
      fontWeight: "var(--font-body-medium-regular-weight)",
    },
  },
  
  /**
   * Chart title styling (rarely used - Widget component provides titles).
   */
  title: {
    align: "left",
    style: {
      color: "var(--color-text-primary)",
      fontFamily: "var(--font-family-brand)",
      fontSize: "var(--font-headline-h5-size)",
      fontWeight: "var(--font-headline-h5-weight)",
      lineHeight: "var(--font-headline-h5-line-height)",
    },
  },
  
  /**
   * Chart subtitle styling (rarely used).
   */
  subtitle: {
    align: "left",
    style: {
      color: "var(--color-text-secondary)",
      fontFamily: "var(--font-family-brand)",
      fontSize: "var(--font-body-small-size)",
      fontWeight: "var(--font-body-small-regular-weight)",
      lineHeight: "var(--font-body-small-line-height)",
    },
  },
  
  /**
   * X-Axis configuration (horizontal axis, typically categories).
   * 
   * KEY RULES:
   * - Labels are BOLD (fontWeight: 600) for data point emphasis
   * - Never slant/rotate labels - truncate or wrap instead
   * - Use horizontal text only for readability
   */
  xAxis: {
    lineColor: "var(--color-stroke-light)",
    tickColor: "var(--color-stroke-light)",
    labels: {
      rotation: 0,              // Never slant - keep horizontal
      autoRotation: false,      // Disable auto-rotation
      useHTML: true,            // Enable HTML for text wrapping
      style: {
        color: "var(--color-text-secondary)",
        fontFamily: "var(--font-family-brand)",
        fontSize: "var(--font-body-small-size)",
        fontWeight: "600",      // BOLD for x-axis data points (BRD standard)
      },
    },
    title: {
      style: {
        color: "var(--color-text-secondary)",
        fontFamily: "var(--font-family-brand)",
        fontSize: "var(--font-body-small-size)",
        fontWeight: "var(--font-body-small-semibold-weight)",
      },
    },
  },
  
  /**
   * Y-Axis configuration (vertical axis, typically values).
   * 
   * KEY RULES:
   * - Labels are REGULAR weight (not bold) for visual hierarchy
   * - Uses formatAxisLabel() for abbreviated large numbers
   * - Grid lines use dashed style for subtlety
   */
  yAxis: {
    gridLineColor: "var(--color-stroke-light)",
    gridLineDashStyle: "Dash",  // Dashed lines for all grid lines except 0
    lineColor: "var(--color-stroke-light)",
    tickColor: "var(--color-stroke-light)",
    plotLines: [
      {
        // Solid line at 0 value for visual reference (column/bar/line charts)
        value: 0,
        color: "var(--color-stroke-light)",
        width: 1,
        dashStyle: "Solid",  // Single solid line at 0, not dashed
        zIndex: 3,
      },
    ],
    labels: {
      rotation: 0,
      autoRotation: false,
      formatter: function(this: Highcharts.AxisLabelsFormatterContextObject): string {
        return formatAxisLabel(this.value as number)
      },
      style: {
        color: "var(--color-text-secondary)",
        fontFamily: "var(--font-family-brand)",
        fontSize: "var(--font-body-small-size)",
        fontWeight: "var(--font-body-small-regular-weight)",  // Regular weight (not bold)
      },
    },
    title: {
      style: {
        color: "var(--color-text-secondary)",
        fontFamily: "var(--font-family-brand)",
        fontSize: "var(--font-body-small-size)",
        fontWeight: "var(--font-body-small-semibold-weight)",
      },
    },
  },
  
  /**
   * Legend configuration.
   * 
   * POSITION: Centered at bottom, horizontal layout.
   * SYMBOLS: Circles (not squares) with 10px height, 16px width for line visibility.
   * SPACING: 20px between items, 8px gap from chart area.
   */
  legend: {
    enabled: true,
    align: "center",
    verticalAlign: "bottom",
    layout: "horizontal",
    itemDistance: 20,           // Gap between legend items
    margin: BRD_CHART_LEGEND_GAP, // Gap between chart and legend (8px)
    padding: 4,
    y: 0,
    squareSymbol: false,        // Use circles, not squares
    symbolRadius: 5,            // Circle radius for legend markers
    symbolHeight: 10,
    symbolWidth: 16,            // Width for line to extend beyond circle
    itemStyle: {
      color: "var(--color-text-primary)",
      fontFamily: "var(--font-family-brand)",
      fontSize: "var(--font-body-small-size)",
      fontWeight: "var(--font-body-small-regular-weight)",
      cursor: "pointer",
    },
    itemHoverStyle: {
      color: "var(--color-text-primary)",
    },
    itemHiddenStyle: {
      color: "var(--color-text-disabled)",
      textDecoration: "line-through",
    },
  },
  
  /**
   * Tooltip configuration for hover states.
   * 
   * outside: true renders tooltip outside chart container to avoid
   * z-index issues with donut centers and other overlapping elements.
   * 
   * shadow: Enabled with custom drop shadow for better visibility and depth.
   * borderColor: Slightly darker border for better contrast and readability.
   */
  /**
   * Tooltip configuration for hover states.
   * 
   * outside: true renders tooltip outside chart container to avoid z-index issues.
   * shadow: Enabled for better visibility and depth perception.
   * useHTML: true enables rich HTML formatting for tooltips.
   * borderColor: Uses stroke-light from BRD registry for consistency.
   * 
   * TOOLTIP FORMATTING (APPLIES TO ALL CHART TYPES):
   * ================================================
   * 
   * MULTI-SERIES LINE/AREA CHARTS:
   * - Use: createMultiSeriesSharedTooltip({ isMonetary, isPercentage, prefix, suffix })
   * - tooltip: { shared: true, useHTML: true, formatter: createMultiSeriesSharedTooltip() }
   * - Shows ALL series values vertically in ONE tooltip with default spacing
   * - Layout per row: marker (left) + label (left) + data (bold black, right-aligned)
   * - Header: X-value in bold
   * 
   * SINGLE-SERIES & PIE/DONUT CHARTS:
   * - Use: createUniversalTooltip({ isMonetary, isPercentage, prefix, suffix })
   * - tooltip: { useHTML: true, formatter: createUniversalTooltip() }
   * - Works for: column, bar, pie, donut, area, scatter, any single series
   * - Layout: marker (left) + label (left) + data (bold black, right-aligned)
   * 
   * DATA FORMATTING:
   * - Data values: bold, using var(--color-text-primary) for light/dark support
   * - Marker: colored circle on the left
   * - Labels: on the left next to marker
   * - Uses default Highcharts padding and spacing
   * 
   * EXAMPLE IMPLEMENTATIONS:
   * 
   * Multi-series line chart:
   * ```tsx
   * tooltip: {
   *   ...brdHighchartsTheme.tooltip,
   *   shared: true,
   *   formatter: createMultiSeriesSharedTooltip({ isMonetary: true })
   * }
   * ```
   * 
   * Single-series column chart:
   * ```tsx
   * tooltip: {
   *   ...brdHighchartsTheme.tooltip,
   *   formatter: createUniversalTooltip({ isMonetary: true })
   * }
   * ```
   * 
   * Pie chart with percentage:
   * ```tsx
   * tooltip: {
   *   ...brdHighchartsTheme.tooltip,
   *   formatter: createUniversalTooltip()  // Percentage added automatically
   * }
   * ```
   * 
   * Stacked column chart (or combo with columns + line):
   * ```tsx
   * tooltip: {
   *   ...brdHighchartsTheme.tooltip,
   *   shared: true,  // IMPORTANT: Always use shared for stacked columns to show all series at once
   *   formatter: createStackedColumnTooltip({ isMonetary: true })
   * }
   * ```
   * 
   * Column + Line combo chart:
   * ```tsx
   * tooltip: {
   *   ...brdHighchartsTheme.tooltip,
   *   shared: true,  // IMPORTANT: Always use shared to show columns + line values together
   *   formatter: displayMode === "line" 
   *     ? createMultiSeriesSharedTooltip({ isMonetary: true })
   *     : createStackedColumnTooltip({ isMonetary: true })
   * }
   * ```
   */
  tooltip: {
    backgroundColor: "var(--color-surface-foreground)",
    borderColor: "var(--color-stroke-light)",
    borderRadius: 8,
    borderWidth: 1.5,
    shadow: {
      color: "rgba(0, 0, 0, 0.16)",
      offsetX: 0,
      offsetY: 4,
      opacity: 1,
      width: 8,
    },
    useHTML: true,
    outside: true,
    style: {
      color: "var(--color-text-primary)",
      fontFamily: "var(--font-family-brand)",
      fontSize: "var(--font-body-small-size)",
      fontWeight: "var(--font-body-small-regular-weight)",
    },
    valueDecimals: 2,
    shared: false,                      // Default to false - individual data point tooltips without background highlight
    pointFormatter: function(this: Highcharts.Point): string {        // Custom formatter to include circle symbol
      return (
        '<span style="color:' + this.color + '; font-weight: 600;">' +
        '● </span>' +
        this.series.name + ': <b>' +
        (typeof this.y === 'number' ? this.y.toFixed(2) : this.y) +
        '</b><br/>'
      )
    },
  },
  
  /**
   * Default plot options for each series type.
   * 
   * These can be overridden in individual chart configurations.
   * For stacked charts, use getStackedColumnPlotOptions() helper instead.
   */
  plotOptions: {
    /**
     * Common series defaults.
     */
    series: {
      marker: {
        symbol: "circle",       // All markers are circles
      },
      dataLabels: {
        style: {
          color: "var(--color-text-primary)",
          fontFamily: "var(--font-family-brand)",
          fontSize: "var(--font-body-small-size)",
          fontWeight: "var(--font-body-small-semibold-weight)",
          textOutline: "none",  // No outline for cleaner appearance
        },
      },
    },
    
    /**
     * Column chart defaults (vertical bars).
     */
    column: {
      borderRadius: BRD_COLUMN_BORDER_RADIUS,  // 4px rounded corners
      groupPadding: BRD_GROUP_PADDING,         // 12% group spacing
      pointPadding: BRD_POINT_PADDING,         // 8% point spacing
    },
    
    /**
     * Bar chart defaults (horizontal bars).
     */
    bar: {
      borderRadius: BRD_COLUMN_BORDER_RADIUS,
    },
    
    /**
     * Line chart defaults.
     * 
     * Markers are enabled and visible (6px radius = 12px diameter).
     * This ensures the legend shows the line with marker circle.
     * 
     * HOVER STANDARD (HARD RULE):
     * - Pure line charts MUST display vertical 1px light stroke crosshair on hover
     * - Configure in chart xAxis: crosshair: { color: "var(--color-stroke-light)", width: 1 }
     * - Set tooltip.shared: false to enable crosshair properly
     * - NEVER apply crosshair to combo charts (line + column) - use shared: true instead
     * See docs/BRD-HIGHCHARTS-DEVELOPER-GUIDE.md for complete standards
     */
    line: {
      marker: {
        enabled: true,
        symbol: "circle",
        radius: BRD_LINE_MARKER_RADIUS,  // 6px radius = 12px diameter
      },
      lineWidth: 2,
      showInLegend: true,                // Show in legend by default
    },
    
    /**
     * Area chart defaults (line with filled area below).
     */
    area: {
      marker: {
        enabled: false,
        symbol: "circle",
      },
    },
    
    /**
     * Pie/Donut chart defaults.
     */
    pie: {
      borderWidth: 0,
      borderRadius: 0,         // No rounded corners on pie segments
      showInLegend: true,
    },
    
    /**
     * Scatter plot defaults.
     */
    scatter: {
      marker: {
        symbol: "circle",
        radius: 6,             // 12px diameter
      },
    },
  },
  
  /**
   * Disable Highcharts watermark/credits.
   */
  credits: {
    enabled: false,
  },
} as unknown as Highcharts.Options

/**
 * Apply the BRD Highcharts theme globally.
 *
 * Backward-compatible helper that merges `brdHighchartsTheme` into the
 * Highcharts global options via `Highcharts.setOptions`. Call this once per
 * module (e.g. at the top of a chart component file) so every chart instance
 * inherits BRD colors, typography, spacing, axis, and tooltip defaults without
 * having to spread `brdHighchartsTheme` into each chart's options.
 *
 * Spreading `brdHighchartsTheme` directly into a chart's `options` still works
 * and takes precedence; this is purely a convenience for global setup.
 *
 * USAGE:
 * ```ts
 * import Highcharts from "highcharts"
 * import { applyBrdHighchartsTheme } from "@/lib/brd-highcharts-theme"
 * applyBrdHighchartsTheme(Highcharts)
 * ```
 */
export function applyBrdHighchartsTheme(highcharts: typeof Highcharts): void {
  highcharts.setOptions(brdHighchartsTheme)
}

/**
 * Get line chart specific legend with proper marker styling.
 * 
 * PURPOSE: Line charts need specific legend symbol sizing to properly display
 * the line extending beyond the center circle marker. This provides better visual
 * clarity in legends compared to standard legend configuration.
 * 
 * DIFFERS FROM brdHighchartsTheme.legend:
 * - symbolWidth: 20px (vs 16px in standard) - Wider area for line visibility
 * - alignColumns: false - Ensures proper item alignment
 * 
 * USED BY: Multiple widgets
 * - cash-differences-resolution-analysis-widget.tsx
 * - stock-record-settled-positions-widget.tsx
 * - trade-breaks-widget.tsx
 * - Any other line chart needing enhanced legend
 */
export function getLineChartLegendConfig(): Highcharts.LegendOptions {
  return {
    ...brdHighchartsTheme.legend,
    symbolRadius: 5,
    symbolHeight: 10,
    symbolWidth: 20,
    alignColumns: false, // Center align legend items
    width: undefined, // Auto width to fit all items
    useHTML: false, // Use SVG for better alignment
    navigation: {
      enabled: false,
    },
  }
}



/**
 * ============================================
 * BRD CHART UTILITY FUNCTIONS
 * ============================================
 */

/**
 * Calculate y-axis max with n+1 headroom for stack labels (Grid Line Rule)
 * Ensures stack totals displayed above bars stay within the chart area
 * Adds extra headroom (1-2 ticks) above the highest data point for stack labels
 * 
 * @param maxStackTotal - the maximum total value across all stacks
 * @param tickInterval - the tick interval being used for the y-axis
 * @returns the y-axis max value with extra tick interval of headroom
 * 
 * @example
 * // maxStackTotal=801, tickInterval=200 -> returns 1200 (ceiling + 1 tick)
 * // maxStackTotal=800, tickInterval=200 -> returns 1200 (exact match + 2 ticks)
 */
export function getYAxisMaxWithHeadroom(maxStackTotal: number, tickInterval: number): number {
  const ticksToMax = maxStackTotal / tickInterval
  // If exact match, add 2 ticks; otherwise ceil + 1 tick
  const ticksNeeded = Number.isInteger(ticksToMax) ? ticksToMax + 2 : Math.ceil(ticksToMax) + 1
  return ticksNeeded * tickInterval
}

/**
 * Calculate a reasonable tick interval for a given max value
 * Uses nice round numbers (1, 2, 5, 10, 20, 50, 100, etc.)
 * 
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
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

/**
 * Calculate visible slots for x-axis centering
 * Ensures minimum number of slots for consistent spacing
 */
export function getVisibleSlots(categoryCount: number): number {
  return Math.max(categoryCount, BRD_MIN_VISIBLE_SLOTS)
}

/**
 * Calculate x-axis range for centering fewer categories
 * Adds padding on both sides when categoryCount < MIN_VISIBLE_SLOTS
 */
export function getXAxisRange(categoryCount: number): { min: number; max: number } {
  const extraSlots = Math.max(0, BRD_MIN_VISIBLE_SLOTS - categoryCount) / 2
  return {
    min: -extraSlots,
    max: categoryCount - 1 + extraSlots
  }
}

/**
 * Calculate optimal bar/column width based on container size
 * 
 * @param containerWidth - width of the chart container in pixels
 * @param categoryCount - number of categories on x-axis
 * @param stackCount - number of stacks (grouped series)
 * @returns calculated point width clamped between MIN and MAX
 */
export function getPointWidth(
  containerWidth: number,
  categoryCount: number,
  stackCount: number = 1
): number {
  if (!containerWidth || containerWidth <= 0) return BRD_MAX_BAR_WIDTH

  const visibleSlots = getVisibleSlots(categoryCount)
  const drawableWidth = containerWidth - 80 // Account for axis labels/padding
  const slotWidth = drawableWidth / visibleSlots
  const rawWidth = (slotWidth * BRD_CATEGORY_FILL_RATIO) / stackCount

  return Math.round(clamp(rawWidth, BRD_MIN_BAR_WIDTH, BRD_MAX_BAR_WIDTH))
}

/**
 * Check if data labels should be visible based on bar width
 * Labels need at least BRD_MIN_LABEL_BAR_WIDTH to display properly
 */
export function shouldShowDataLabels(pointWidth: number): boolean {
  return pointWidth >= BRD_MIN_LABEL_BAR_WIDTH
}

/**
 * Format number with abbreviation (K, M, B) for data labels
 * Always uses 2 decimal places for amounts
 * 
 * @param value - number to format
 * @param prefix - optional prefix like "$"
 * @param suffix - optional suffix like "%"
 * @returns formatted string or empty string if value is 0
 */
export function formatAbbreviatedNumber(value: number, prefix: string = "", suffix: string = ""): string {
  if (value === 0) return ""
  
  const absValue = Math.abs(value)
  const sign = value < 0 ? "-" : ""
  
  if (absValue >= 1000000000000) {
    return `${sign}${prefix}${(absValue / 1000000000000).toFixed(2)}T${suffix}`
  }
  if (absValue >= 1000000000) {
    return `${sign}${prefix}${(absValue / 1000000000).toFixed(2)}B${suffix}`
  }
  if (absValue >= 1000000) {
    return `${sign}${prefix}${(absValue / 1000000).toFixed(2)}M${suffix}`
  }
  if (absValue >= 1000) {
    return `${sign}${prefix}${(absValue / 1000).toFixed(2)}K${suffix}`
  }
  return `${sign}${prefix}${absValue.toFixed(2)}${suffix}`
}

/**
 * Standard stack labels configuration for stacked column charts
 * Shows total above each stack with BRD_STACK_LABEL_GAP (4px) spacing
 */
export function getStackLabelsConfig(pointWidth: number, prefix: string = "", suffix: string = "") {
  return {
    enabled: shouldShowDataLabels(pointWidth),
    allowOverlap: false,
    overflow: "allow" as const,
    crop: false,
    formatter: function(this: { total?: number }): string {
      return formatAbbreviatedNumber(this.total ?? 0, prefix, suffix)
    },
    style: {
      fontSize: "10px",
      fontWeight: "600",
      textOutline: "none",
      color: "var(--color-text-primary)",
    },
    verticalAlign: "top" as const,
    y: -BRD_STACK_LABEL_GAP,
  }
}

/**
 * Standard stack labels configuration for horizontal stacked bar charts
 * Shows total to the right of each stack with BRD_STACK_LABEL_GAP (4px) spacing
 */
export function getHorizontalStackLabelsConfig(barHeight: number, prefix: string = "", suffix: string = "") {
  return {
    enabled: shouldShowDataLabels(barHeight),
    allowOverlap: false,
    overflow: "allow" as const,
    crop: false,
    formatter: function(this: { total?: number }): string {
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
    x: BRD_STACK_LABEL_GAP,
    y: 0,
  }
}

/**
 * Standard plotOptions for stacked column charts
 * Uses BRD spacing rules and 'contrast' color for ADA-compliant labels
 */
export function getStackedColumnPlotOptions(pointWidth: number, showLabels: boolean = true) {
  return {
    stacking: "normal" as const,
    pointWidth,
    groupPadding: BRD_STACKED_GROUP_PADDING,
    pointPadding: BRD_STACKED_POINT_PADDING,
    borderWidth: 0,
    borderRadius: BRD_COLUMN_BORDER_RADIUS,
    maxPointWidth: BRD_MAX_BAR_WIDTH,
    dataLabels: {
      enabled: showLabels && shouldShowDataLabels(pointWidth),
      inside: true,
      verticalAlign: "middle" as const,
      style: {
        fontSize: "10px",
        fontWeight: "600",
        textOutline: "none",
        color: "contrast",
      },
    },
  }
}

/**
 * Standard plotOptions for stacked bar charts (horizontal)
 * Uses BRD spacing rules and 'contrast' color for ADA-compliant labels
 */
export function getStackedBarPlotOptions(pointWidth: number, showLabels: boolean = true) {
  return {
    stacking: "normal" as const,
    pointWidth,
    minPointLength: BRD_MIN_POINT_LENGTH,
    groupPadding: BRD_STACKED_GROUP_PADDING,
    pointPadding: BRD_STACKED_POINT_PADDING,
    borderWidth: 0,
    borderRadius: BRD_COLUMN_BORDER_RADIUS,
    maxPointWidth: BRD_MAX_BAR_WIDTH,
    dataLabels: {
      enabled: showLabels && shouldShowDataLabels(pointWidth),
      inside: true,
      align: "center" as const,
      verticalAlign: "middle" as const,
      style: {
        fontSize: "10px",
        fontWeight: "600",
        textOutline: "none",
        color: "contrast",
      },
    },
  }
}

/**
 * ============================================
 * BRD DONUT CHART STANDARD
 * ============================================
 * Standard donut chart size of 220x220px with 65% inner size.
 * Use DonutCenterText component for center text display.
 */
export const BRD_DONUT_SIZE = 220
export const BRD_DONUT_INNER_SIZE = "65%"

/**
 * Get standard BRD donut chart options
 * 
 * USAGE:
 * ```tsx
 * const donutOptions = getBrdDonutChartOptions(data, hiddenSeries)
 * <HighchartsReact options={donutOptions} />
 * <DonutCenterText size={BRD_DONUT_SIZE} label="Total" primaryValue={total} />
 * ```
 * 
 * @param data - Array of { name, value, color } objects
 * @param hiddenSeries - Set of series names to hide (for interactive legend)
 * @returns Complete Highcharts options for a donut chart
 */
export function getBrdDonutChartOptions(
  data: Array<{ name: string; value: number; color: string }>,
  hiddenSeries: Set<string> = new Set()
): Highcharts.Options {
  const visibleData = data.filter(item => !hiddenSeries.has(item.name))
  
  return {
    ...brdHighchartsTheme,
    chart: {
      ...brdHighchartsTheme.chart,
      type: "pie",
      height: BRD_DONUT_SIZE,
      width: BRD_DONUT_SIZE,
      backgroundColor: "transparent",
      spacing: [0, 0, 0, 0],
    },
    title: { text: "" },
    tooltip: {
      ...brdHighchartsTheme.tooltip,
      pointFormat: "{point.name}: <b>{point.percentage:.1f}%</b>",
    },
    plotOptions: {
      pie: {
        innerSize: BRD_DONUT_INNER_SIZE,
        dataLabels: { enabled: false },
        showInLegend: false,
        borderWidth: 0,
        borderRadius: 0,
        states: {
          hover: { brightness: 0.1 },
        },
      },
    },
    series: [{
      type: "pie",
      data: visibleData.map(item => ({
        name: item.name,
        y: item.value,
        color: item.color,
      })),
    }],
  }
}

/**
 * ============================================
 * BRD CHART FILL WIDGET STANDARD
 * ============================================
 * Charts using brdHighchartsTheme automatically fill their container height
 * and adapt to responsive layouts. This is the standard behavior.
 * 
 * STANDARD USAGE:
 * ```tsx
 * const chartOptions: Highcharts.Options = {
 *   ...brdHighchartsTheme,
 *   chart: {
 *     ...brdHighchartsTheme.chart,
 *     type: "column",
 *   },
 *   series: [...],
 * }
 * 
 * <div className="h-full w-full">
 *   <HighchartsReact 
 *     highcharts={Highcharts} 
 *     options={chartOptions}
 *     containerProps={{ style: { height: "100%", width: "100%" } }}
 *   />
 * </div>
 * ```
 */

/**
 * Standard chart container configuration for widget fill
 * 
 * Includes height: "100%" for dynamic container fill.
 * 
 * USAGE:
 * ```tsx
 * const chartOptions = {
 *   chart: {
 *     ...BRD_CHART_CONTAINER_CONFIG,
 *     type: "column",
 *   },
 *   // ... other options
 * }
 * 
 * <div className="h-full w-full">
 *   <HighchartsReact
 *     containerProps={{ style: { height: "100%", width: "100%" } }}
 *     options={chartOptions}
 *   />
 * </div>
 * ```
 */
/**
 * Reusable x-axis labels configuration (horizontal, never slanted, bold).
 * Mirrors the base theme's xAxis.labels so chart helpers can reuse it.
 */
export const BRD_XAXIS_LABELS_CONFIG = {
  rotation: 0,
  autoRotation: false,
  useHTML: true,
  style: {
    color: "var(--color-text-secondary)",
    fontFamily: "var(--font-family-brand)",
    fontSize: "var(--font-body-small-size)",
    fontWeight: "600",
  },
} as unknown as Highcharts.XAxisLabelsOptions

/**
 * Makes a chart dynamically fill its container. Spread into chart options
 * together with `containerProps={{ style: { height: "100%", width: "100%" } }}`.
 */
export const BRD_CHART_FILL_CONTAINER: Highcharts.ChartOptions = {
  height: "100%",
  reflow: true,
}

export const BRD_CHART_CONTAINER_CONFIG: Highcharts.ChartOptions = {
  height: "100%",              // Dynamic: fill container height
  backgroundColor: "transparent",
  spacing: [BRD_CHART_LEGEND_GAP, 4, BRD_CHART_LEGEND_GAP, 4], // [top, right, bottom, left]
  reflow: true,                // Auto-resize on container changes
  style: {
    color: "var(--color-text-primary)",
    fontFamily: "var(--font-family-brand)",
    fontSize: "var(--font-body-medium-size)",
  },
}

/**
 * Standard legend configuration for bottom-aligned legends with proper gap
 * 
 * RULES:
 * - Positioned at center-bottom with 8px gap from chart area
 * - Horizontal layout with proper item spacing
 * - Circle symbols for line charts, square for others
 */
export const BRD_BOTTOM_LEGEND_CONFIG: Highcharts.LegendOptions = {
  enabled: true,
  align: "center",
  verticalAlign: "bottom",
  layout: "horizontal",
  floating: false,
  itemDistance: 16,
  margin: BRD_CHART_LEGEND_GAP,
  padding: 0,
  y: 0,
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
 * Get complete chart options for a widget-filling chart
 * 
 * This helper returns a complete options object with all BRD standards applied:
 * - Transparent background
 * - Dynamic height to fill container (when used with BRD_CHART_CONTAINER_PROPS)
 * - Proper spacing for legend alignment
 * - X-axis labels without rotation or excessive height
 * - Bottom-aligned legend with proper gap
 * 
 * @param chartType - The type of chart (column, bar, line, etc.)
 * @returns Partial Highcharts options to spread into your chart config
 * 
 * USAGE:
 * ```tsx
 * // Chart options - height is undefined to fill container
 * const chartOptions: Highcharts.Options = {
 *   ...getBrdChartBaseOptions("column"),
 *   xAxis: {
 *     ...getBrdChartBaseOptions("column").xAxis,
 *     categories: myCategories,
 *   },
 *   series: mySeries,
 * }
 * 
 * // Render with container props to fill space
 * <div className={BRD_CHART_CONTAINER_CLASS}>
 *   <HighchartsReact 
 *     highcharts={Highcharts} 
 *     options={chartOptions}
 *     containerProps={BRD_CHART_CONTAINER_PROPS}
 *   />
 * </div>
 * ```
 */
export function getBrdChartBaseOptions(chartType: "column" | "bar" | "line" | "area" | "pie" = "column"): Partial<Highcharts.Options> {
  return {
    chart: {
      ...BRD_CHART_CONTAINER_CONFIG,
      ...BRD_CHART_FILL_CONTAINER,  // Makes chart fill its container dynamically
      type: chartType,
    },
    title: { text: "" },
    xAxis: {
      labels: BRD_XAXIS_LABELS_CONFIG,
      tickLength: 0,
      lineWidth: 1,
      lineColor: "var(--color-stroke-light)",
    },
    yAxis: {
      ...brdHighchartsTheme.yAxis,
      title: { text: "" },
      gridLineColor: "var(--color-stroke-light)",
      gridLineDashStyle: "Dash",
    },
    legend: BRD_BOTTOM_LEGEND_CONFIG,
    tooltip: brdHighchartsTheme.tooltip,
    credits: { enabled: false },
  }
}

/**
 * ============================================
 * GROUPED/STACKED COLUMN CHART X-AXIS LABELS STANDARD
 * ============================================
 * For stacked and grouped column charts, x-axis labels should have:
 * - Width matching the group width (all stacks combined in that category)
 * - Minimum 80px width guarantee
 * - Uses getGroupedColumnLabelWidth() from chart-utils.ts to calculate
 * 
 * USAGE:
 * ```tsx
 * import { getGroupedColumnLabelWidth } from "@/lib/chart-utils"
 * 
 * const labelWidth = getGroupedColumnLabelWidth(containerWidth, categoryCount, stackCount)
 * 
 * const chartOptions: Highcharts.Options = {
 *   ...brdHighchartsTheme,
 *   xAxis: {
 *     ...brdHighchartsTheme.xAxis,
 *     labels: {
 *       ...brdHighchartsTheme.xAxis.labels,
 *       style: {
 *         ...brdHighchartsTheme.xAxis.labels.style,
 *         width: labelWidth,
 *         maxWidth: labelWidth,
 *       },
 *     },
 *   },
 * }
 * ```
 */
