/**
 * Shared timestamp formatting for BRD "last updated" indicators
 * (PageHeader, Widget, and any future shell surface).
 *
 * The design system treats "timestamp" as a real point in time — a `Date` or
 * epoch-milliseconds number — never a pre-formatted string. Rendering and the
 * live "time ago" refresh are centralized here so every surface stays
 * consistent.
 */

/** A real point in time. Either a `Date` or epoch milliseconds. */
export type TimestampValue = Date | number

/** Normalize a {@link TimestampValue} to a `Date`. */
export function toDate(value: TimestampValue): Date {
  return value instanceof Date ? value : new Date(value)
}

/**
 * Format a timestamp as a human "last updated" label, e.g.
 * "Updated just now", "Updated 5 min ago", "Updated 3 hr ago", or
 * "Updated Jun 3 at 10:30 AM" for anything older than a day.
 *
 * `now` is injectable for deterministic testing.
 */
export function formatLastUpdated(
  value: TimestampValue,
  now: number = Date.now(),
): string {
  const date = toDate(value)
  const time = date.getTime()
  if (Number.isNaN(time)) return ""

  const diffSec = Math.round((now - time) / 1000)

  // Future or sub-10s clock skew both read as "just now".
  if (diffSec < 10) return "Updated just now"
  if (diffSec < 60) return `Updated ${diffSec} sec ago`

  const diffMin = Math.round(diffSec / 60)
  if (diffMin < 60) return `Updated ${diffMin} min ago`

  const diffHr = Math.round(diffMin / 60)
  if (diffHr < 24) return `Updated ${diffHr} hr ago`

  return `Updated ${date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  })} at ${date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  })}`
}
