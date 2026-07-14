"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { SimpleTooltip } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export type LeftNavigationItem = {
  id: string
  label: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  disabled?: boolean
}

export interface LeftNavigationProps extends React.HTMLAttributes<HTMLDivElement> {
  items: LeftNavigationItem[]
  activeId?: string
  onItemSelect?: (item: LeftNavigationItem) => void
  position?: "fixed" | "absolute"
}

const LeftNavigation = React.forwardRef<HTMLDivElement, LeftNavigationProps>(
  ({ items, activeId, onItemSelect, position = "fixed", className, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        aria-label="Primary navigation"
        className={cn(
          position === "fixed"
            ? "fixed left-0 top-0 h-screen"
            : "absolute left-0 top-0 h-full",
          "z-30",
          "flex w-[104px] flex-col items-center gap-1",
          "bg-[var(--color-surface-foreground)] p-4",
          className
        )}
        {...props}
      >
        {items.map((item) => {
          const Icon = item.icon
          const isActive = item.id === activeId

          return (
            <SimpleTooltip key={item.id} content={item.label} side="right">
              <Button
                type="button"
                variant="secondary"
                size="icon-lg"
                aria-label={item.label}
                className={cn(
                  "h-[72px] w-[72px] flex-col items-center justify-center gap-0.5 rounded-[var(--radius-s)]",
                  "bg-transparent text-[var(--color-text-secondary)]",
                  "hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]",
                  isActive &&
                    "bg-[var(--color-surface-selected)] text-[var(--color-text-brand)] hover:bg-[var(--color-surface-selected)]"
                )}
                onClick={() => onItemSelect?.(item)}
                disabled={item.disabled}
              >
                <Icon className="size-6 mx-auto" aria-hidden="true" />
                <span className="w-full text-[11px] font-semibold text-center leading-[10px] whitespace-nowrap truncate">
                  {item.label}
                </span>
              </Button>
            </SimpleTooltip>
          )
        })}
      </nav>
    )
  }
)

LeftNavigation.displayName = "LeftNavigation"

export { LeftNavigation }
