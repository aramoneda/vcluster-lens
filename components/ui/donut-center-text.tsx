"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import {
  DONUT_PRIMARY_FONT_SIZES,
  DONUT_SECONDARY_FONT_SIZES,
  getDonutInitialFontIndex,
  getDonutNextFontIndex,
  getDonutSafeTextWidth,
} from "@/lib/chart-utils"

/**
 * Props for {@link DonutCenterText}.
 */
export interface DonutCenterTextProps {
  /** Width/height of the donut chart in pixels. Drives initial font sizing. */
  size: number
  /** Primary value rendered largest in the center (e.g. "$2.5M"). */
  primaryValue: React.ReactNode
  /** Optional supporting value rendered below the primary value. */
  secondaryValue?: React.ReactNode
  /** Optional label rendered above the primary value (e.g. "Total"). */
  label?: React.ReactNode
  /** Optional extra class names for the positioning wrapper. */
  className?: string
}

/**
 * DonutCenterText
 *
 * Renders centered, responsive text inside a BRD donut/pie chart. Intended to be
 * absolutely positioned over a Highcharts donut (innerSize 65%). It starts at a
 * font size appropriate for the donut diameter, then shrinks the primary value
 * one BRD typography step at a time until it fits the inscribed safe width —
 * text is never truncated.
 *
 * Colors use BRD design tokens so the component is correct in light and dark mode.
 *
 * USAGE:
 * ```tsx
 * <div className="relative" style={{ width: 220, height: 220 }}>
 *   <HighchartsReact highcharts={Highcharts} options={getBrdDonutChartOptions(data)} />
 *   <DonutCenterText size={220} label="Total" primaryValue="$2.5M" secondaryValue="2024 YTD" />
 * </div>
 * ```
 */
export function DonutCenterText({
  size,
  primaryValue,
  secondaryValue,
  label,
  className,
}: DonutCenterTextProps) {
  const maxIndex = DONUT_PRIMARY_FONT_SIZES.length - 1
  const initialIndex = React.useMemo(() => getDonutInitialFontIndex(size), [size])
  const safeWidth = React.useMemo(() => getDonutSafeTextWidth(size), [size])

  const [fontIndex, setFontIndex] = React.useState(initialIndex)
  const primaryRef = React.useRef<HTMLDivElement>(null)

  // Reset to the size-appropriate starting index whenever inputs change.
  React.useEffect(() => {
    setFontIndex(initialIndex)
  }, [initialIndex, primaryValue])

  // Measure after paint and shrink the primary value until it fits the safe width.
  React.useEffect(() => {
    let raf = 0
    raf = requestAnimationFrame(() => {
      const el = primaryRef.current
      if (!el) return
      if (el.scrollWidth > safeWidth && fontIndex < maxIndex) {
        setFontIndex((current) => getDonutNextFontIndex(current, maxIndex))
      }
    })
    return () => cancelAnimationFrame(raf)
  }, [fontIndex, maxIndex, safeWidth, primaryValue])

  const primaryFont = DONUT_PRIMARY_FONT_SIZES[fontIndex]
  const secondaryFont = DONUT_SECONDARY_FONT_SIZES[Math.min(fontIndex, DONUT_SECONDARY_FONT_SIZES.length - 1)]

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center",
        className,
      )}
      style={{ fontFamily: "var(--font-family-brand)" }}
      aria-hidden="true"
    >
      {label ? (
        <div
          style={{
            color: "var(--color-text-secondary)",
            fontSize: `${secondaryFont.size}px`,
            lineHeight: `${secondaryFont.lineHeight}px`,
            fontWeight: secondaryFont.weight,
            maxWidth: safeWidth,
          }}
        >
          {label}
        </div>
      ) : null}

      <div
        ref={primaryRef}
        style={{
          color: "var(--color-text-primary)",
          fontSize: `${primaryFont.size}px`,
          lineHeight: `${primaryFont.lineHeight}px`,
          fontWeight: primaryFont.weight,
          maxWidth: safeWidth,
          whiteSpace: "nowrap",
        }}
      >
        {primaryValue}
      </div>

      {secondaryValue ? (
        <div
          style={{
            color: "var(--color-text-secondary)",
            fontSize: `${secondaryFont.size}px`,
            lineHeight: `${secondaryFont.lineHeight}px`,
            fontWeight: secondaryFont.weight,
            maxWidth: safeWidth,
          }}
        >
          {secondaryValue}
        </div>
      ) : null}
    </div>
  )
}

export default DonutCenterText
