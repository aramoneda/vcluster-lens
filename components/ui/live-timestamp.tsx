"use client"

import * as React from "react"

import {
  formatLastUpdated,
  toDate,
  type TimestampValue,
} from "@/lib/format-timestamp"

export interface LiveTimestampProps
  extends Omit<React.TimeHTMLAttributes<HTMLTimeElement>, "dateTime"> {
  /** A real point in time — a `Date` or epoch milliseconds. */
  value: TimestampValue
  /**
   * How often (ms) to re-render so the relative label stays fresh.
   * Defaults to 30s. Set to 0 to disable the interval.
   */
  refreshInterval?: number
}

/**
 * Renders a live, self-refreshing "last updated" label from a real timestamp.
 * The relative text (e.g. "Updated 2 min ago") recomputes on an interval so it
 * never goes stale. Rendered as a semantic `<time>` with a machine-readable
 * `dateTime`; `suppressHydrationWarning` accounts for the relative label
 * differing between server render and client time.
 */
export function LiveTimestamp({
  value,
  refreshInterval = 30000,
  ...props
}: LiveTimestampProps) {
  const [, forceTick] = React.useReducer((n: number) => n + 1, 0)

  React.useEffect(() => {
    if (refreshInterval <= 0) return
    const id = window.setInterval(forceTick, refreshInterval)
    return () => window.clearInterval(id)
  }, [refreshInterval])

  const date = toDate(value)
  const isoDateTime = Number.isNaN(date.getTime())
    ? undefined
    : date.toISOString()

  return (
    <time dateTime={isoDateTime} suppressHydrationWarning {...props}>
      {formatLastUpdated(value)}
    </time>
  )
}
