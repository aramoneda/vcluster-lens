"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export type SimpleNavigationItem = {
  id: string
  label: string
  disabled?: boolean
}

export interface SimpleNavigationProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  items: SimpleNavigationItem[]
  activeId?: string
  onSelect?: (item: SimpleNavigationItem) => void
}

/**
 * SimpleNavigation
 *
 * A compact segmented "pill" control used to switch between views
 * (e.g. Summary / Blotter / Positions). Intended to live inside the
 * Header center slot, but can be used anywhere a lightweight view
 * switcher is needed.
 */
const SimpleNavigation = React.forwardRef<HTMLDivElement, SimpleNavigationProps>(
  ({ items, activeId, onSelect, className, ...props }, ref) => {
    const resolvedActiveId = activeId ?? items[0]?.id

    return (
      <div
        ref={ref}
        role="tablist"
        aria-label="View navigation"
        className={cn(
          "inline-flex items-center gap-1 rounded-full bg-[var(--color-surface-background)] p-1",
          className
        )}
        {...props}
      >
        {items.map((item) => {
          const isActive = item.id === resolvedActiveId

          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              disabled={item.disabled}
              onClick={() => onSelect?.(item)}
              className={cn(
                "rounded-full px-4 py-2 transition-colors disabled:pointer-events-none disabled:opacity-50",
                "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--denim-300)]",
                isActive
                  ? "bg-[var(--color-surface-foreground)] text-[var(--color-text-brand)]"
                  : "bg-transparent text-[var(--color-text-primary)] hover:text-[var(--color-text-brand)]"
              )}
              style={{ font: "var(--font-body-medium-semibold)" }}
            >
              {item.label}
            </button>
          )
        })}
      </div>
    )
  }
)

SimpleNavigation.displayName = "SimpleNavigation"

export { SimpleNavigation }
