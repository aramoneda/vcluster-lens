"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

export type ChipColor = "grey" | "white"
export type ChipSize = "default" | "sm"

const chipVariants = cva(
  [
    "inline-flex w-fit shrink-0 items-center justify-center gap-[var(--spacing-sp-4)] whitespace-nowrap rounded-[var(--radius-s)] border px-[var(--spacing-sp-4)]",
    "border-[length:var(--border-width-100)] shadow-none outline-none transition-colors",
    "[&_[data-slot=chip-leading-icon]]:inline-flex [&_[data-slot=chip-leading-icon]]:shrink-0 [&_[data-slot=chip-leading-icon]>*]:size-4",
    "[&_[data-slot=chip-remove]]:inline-flex [&_[data-slot=chip-remove]]:shrink-0 [&_[data-slot=chip-remove]>*]:size-4",
    "[&_[data-slot=chip-label]]:truncate",
  ],
  {
    variants: {
      color: {
        grey: "",
        white: "",
      },
      size: {
        default:
          "h-8 [font:var(--font-body-medium-semibold)]",
        sm:
          "h-6 [font:var(--font-body-small-semibold)]",
      },
      selected: {
        true: "",
        false: "",
      },
      clickable: {
        true:
          "cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring-color)]",
        false: "",
      },
      disabled: {
        true:
          "cursor-not-allowed opacity-60 [&_[data-slot=chip-label]]:text-[var(--color-text-disabled)] [&_[data-slot=chip-leading-icon]]:text-[var(--color-icon-disabled)] [&_[data-slot=chip-remove]]:text-[var(--color-icon-disabled)]",
        false: "",
      },
      hasIcon: {
        true: "",
        false: "",
      },
      removable: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        color: "grey",
        selected: false,
        disabled: false,
        className:
          "bg-[var(--color-surface-chip-default)] border-[var(--color-stroke-light)] [&_[data-slot=chip-label]]:text-[var(--color-text-dark-accent)] [&_[data-slot=chip-leading-icon]]:text-[var(--color-icon-dark)] [&_[data-slot=chip-remove]]:text-[var(--color-icon-dark)]",
      },
      {
        color: "white",
        selected: false,
        disabled: false,
        className:
          "bg-[var(--color-surface-chip-default-white)] border-[var(--color-stroke-light)] [&_[data-slot=chip-label]]:text-[var(--color-text-dark-accent)] [&_[data-slot=chip-leading-icon]]:text-[var(--color-icon-dark)] [&_[data-slot=chip-remove]]:text-[var(--color-icon-dark)]",
      },
      {
        color: "grey",
        selected: true,
        disabled: false,
        className:
          "bg-[var(--color-surface-chip-selected)] border-[var(--color-stroke-brand)] [&_[data-slot=chip-label]]:text-[var(--color-text-selected)] [&_[data-slot=chip-leading-icon]]:text-[var(--color-icon-brand)] [&_[data-slot=chip-remove]]:text-[var(--color-icon-dark)]",
      },
      {
        color: "white",
        selected: true,
        disabled: false,
        className:
          "bg-[var(--color-surface-chip-selected)] border-[var(--color-stroke-brand)] [&_[data-slot=chip-label]]:text-[var(--color-text-selected)] [&_[data-slot=chip-leading-icon]]:text-[var(--color-icon-brand)] [&_[data-slot=chip-remove]]:text-[var(--color-icon-dark)]",
      },
      {
        color: "grey",
        size: "default",
        selected: false,
        clickable: true,
        disabled: false,
        className:
          "hover:bg-[var(--color-surface-chip-hover)] hover:border-[var(--brand-350)]",
      },
      {
        color: "white",
        size: "default",
        selected: false,
        clickable: true,
        disabled: false,
        className:
          "hover:bg-[var(--color-surface-chip-hover)] hover:border-[var(--brand-350)]",
      },
      {
        color: "grey",
        size: "sm",
        selected: false,
        clickable: true,
        disabled: false,
        className:
          "hover:bg-[var(--color-surface-chip-default)] hover:border-[var(--brand-350)]",
      },
      {
        color: "white",
        size: "sm",
        selected: false,
        clickable: true,
        disabled: false,
        className:
          "hover:bg-[var(--color-surface-chip-default)] hover:border-[var(--brand-350)]",
      },
    ],
    defaultVariants: {
      color: "grey",
      size: "default",
      selected: false,
      clickable: false,
      disabled: false,
      hasIcon: false,
      removable: false,
    },
  }
)

export interface ChipProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onClick">,
    VariantProps<typeof chipVariants> {
  children: React.ReactNode
  color?: ChipColor
  size?: ChipSize
  selected?: boolean
  disabled?: boolean
  icon?: React.ReactNode
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void
  onRemove?: (event: React.MouseEvent<HTMLButtonElement>) => void
  removeLabel?: string
}

const Chip = React.forwardRef<HTMLDivElement, ChipProps>(
  (
    {
      children,
      color = "grey",
      size = "default",
      selected = false,
      disabled = false,
      icon,
      onClick,
      onRemove,
      removeLabel = "Remove chip",
      className,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const clickable = Boolean(onClick) && !disabled
    const removable = Boolean(onRemove)
    const hasIcon = Boolean(icon)

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event)

      if (event.defaultPrevented || !clickable) {
        return
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault()
        event.currentTarget.click()
      }
    }

    const handleRemoveClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation()
      onRemove?.(event)
    }

    return (
      <div
        ref={ref}
        data-slot="chip"
        data-selected={selected ? "" : undefined}
        data-disabled={disabled ? "" : undefined}
        role={clickable ? "button" : undefined}
        tabIndex={clickable ? 0 : undefined}
        aria-pressed={clickable ? selected : undefined}
        aria-disabled={disabled || undefined}
        onClick={clickable ? onClick : undefined}
        onKeyDown={handleKeyDown}
        className={cn(
          chipVariants({
            color,
            size,
            selected,
            clickable,
            disabled,
            hasIcon,
            removable,
          }),
          className
        )}
        {...props}
      >
        {icon ? <span data-slot="chip-leading-icon">{icon}</span> : null}
        <span data-slot="chip-label">{children}</span>
        {onRemove ? (
          <button
            type="button"
            data-slot="chip-remove"
            className="inline-flex items-center justify-center rounded-[var(--radius-xs)] bg-transparent p-0 outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--focus-ring-color)] disabled:cursor-not-allowed"
            aria-label={removeLabel}
            disabled={disabled}
            onClick={handleRemoveClick}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        ) : null}
      </div>
    )
  }
)

Chip.displayName = "Chip"

export { Chip, chipVariants }
