"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { SimpleTooltip } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export type SideToolbarItem = {
  id: string
  label: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  disabled?: boolean
}

export interface SideToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  items: SideToolbarItem[]
  activeId?: string
  onItemSelect?: (item: SideToolbarItem) => void
  position?: "fixed" | "absolute"
}

const SideToolbar = React.forwardRef<HTMLDivElement, SideToolbarProps>(
  ({ items, activeId, onItemSelect, position = "fixed", className, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        aria-label="Side toolbar"
        className={cn(
          position === "fixed"
            ? "fixed right-0 top-1/2 -translate-y-1/2"
            : "absolute right-0 top-1/2 -translate-y-1/2",
          "z-30",
          "flex flex-col items-center gap-3 rounded-l-[var(--radius-s)]",
          "bg-[var(--color-surface-foreground)] p-1",
          className
        )}
        {...props}
      >
        {items.map((item) => {
          const Icon = item.icon
          const isActive = item.id === activeId

          return (
            <SimpleTooltip key={item.id} content={item.label} side="left">
              <Button
                type="button"
                variant="secondary"
                size="icon-lg"
                aria-label={item.label}
                className={cn(
                  "bg-[var(--color-surface-foreground)] text-[var(--color-icon-dark)]",
                  "hover:bg-[var(--color-surface-hover)]",
                  "active:bg-[var(--color-surface-selected)]",
                  "rounded-[var(--radius-xs)]",
                  isActive &&
                    "bg-[var(--color-surface-selected)] text-[var(--color-icon-brand)] hover:bg-[var(--color-surface-selected)]"
                )}
                onClick={() => onItemSelect?.(item)}
                disabled={item.disabled}
              >
                <Icon className="size-5" aria-hidden="true" />
              </Button>
            </SimpleTooltip>
          )
        })}
      </nav>
    )
  }
)

SideToolbar.displayName = "SideToolbar"

export { SideToolbar }
