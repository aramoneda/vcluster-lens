"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  type DropdownMenuContentProps,
} from "@/components/ui/dropdown-menu"

export interface SplitButtonProps
  extends Omit<React.ComponentProps<"button">, "onClick">,
    VariantProps<typeof buttonVariants> {
  /** Label rendered in the main action segment. */
  children?: React.ReactNode
  /** Optional leading icon for the main action segment. */
  icon?: React.ReactNode
  /** Click handler for the main (left) action segment. */
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  /** Menu content rendered when the trailing segment is opened (e.g. DropdownMenuItem children). */
  menu: React.ReactNode
  /** Icon for the trailing menu trigger. Defaults to a chevron-down. */
  menuIcon?: React.ReactNode
  /** Accessible label for the trailing menu trigger. */
  menuLabel?: string
  /** Props forwarded to the underlying DropdownMenuContent (alignment, position, etc). */
  menuContentProps?: DropdownMenuContentProps
  /** Controlled open state for the menu. */
  open?: boolean
  /** Open-state change handler for the menu. */
  onOpenChange?: (open: boolean) => void
  /** className applied to the outer wrapper. */
  className?: string
}

/**
 * SplitButton pairs a primary action with a trailing menu trigger that shares
 * the exact same Button styling, variants, and sizes. The main segment fires
 * `onClick`; the trailing segment opens a dropdown menu. The two segments are
 * joined by a subtle divider that adapts to every variant.
 */
const SplitButton = React.forwardRef<HTMLButtonElement, SplitButtonProps>(
  (
    {
      className,
      variant,
      size,
      icon,
      children,
      onClick,
      disabled,
      menu,
      menuIcon,
      menuLabel = "More options",
      menuContentProps,
      open,
      onOpenChange,
      ...props
    },
    ref
  ) => {
    return (
      <div
        data-slot="split-button"
        className={cn("inline-flex items-stretch", className)}
      >
        {/* Main action segment */}
        <Button
          ref={ref}
          variant={variant}
          size={size}
          disabled={disabled}
          onClick={onClick}
          icon={icon}
          className="rounded-r-none"
          {...props}
        >
          {children}
        </Button>

        {/* Trailing menu trigger segment */}
        <DropdownMenu open={open} onOpenChange={onOpenChange}>
          <DropdownMenuTrigger asChild>
            <Button
              variant={variant}
              size={size}
              disabled={disabled}
              aria-label={menuLabel}
              // Square trigger that joins the main segment: overlap the seam,
              // drop the left radius, and draw a subtle divider via the current
              // text color so it reads correctly on every variant.
              className="aspect-square min-w-0 rounded-l-none border-l border-l-current/20 px-0 -ml-px"
            >
              {menuIcon ?? <ChevronDown aria-hidden="true" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" {...menuContentProps}>
            {menu}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }
)

SplitButton.displayName = "SplitButton"

export { SplitButton }
