"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-[4px] font-semibold whitespace-nowrap shrink-0 [&>svg]:pointer-events-none gap-1 transition-colors",
  {
    variants: {
      variant: {
        filled: "",
        outline: "border bg-[var(--color-surface-widget)]",
      },
      color: {
        default: "",
        sky: "",
        grass: "",
        bored: "",
        negative: "",
        neutral: "",
        dark: "",
      },
      size: {
        sm: "px-1 py-0.5 text-xs leading-4 h-5",
        default: "px-1.5 py-0.5 text-sm leading-5 h-6",
        lg: "px-2 py-0.5 text-base leading-6 h-7",
      },
    },
    compoundVariants: [
      // Filled variants
      {
        variant: "filled",
        color: "default",
        className: "bg-[var(--color-badge-filled-default-bg)] text-[var(--color-badge-filled-default-text)]",
      },
      {
        variant: "filled",
        color: "sky",
        className: "bg-[var(--color-badge-filled-sky-bg)] text-[var(--color-badge-filled-sky-text)]",
      },
      {
        variant: "filled",
        color: "grass",
        className: "bg-[var(--color-badge-filled-grass-bg)] text-[var(--color-badge-filled-grass-text)]",
      },
      {
        variant: "filled",
        color: "bored",
        className: "bg-[var(--color-badge-filled-bored-bg)] text-[var(--color-badge-filled-bored-text)]",
      },
      {
        variant: "filled",
        color: "negative",
        className: "bg-[var(--color-badge-filled-negative-bg)] text-[var(--color-badge-filled-negative-text)]",
      },
      {
        variant: "filled",
        color: "neutral",
        className: "bg-[var(--color-badge-filled-neutral-bg)] text-[var(--color-badge-filled-neutral-text)] border border-[var(--color-badge-filled-neutral-border)]",
      },
      {
        variant: "filled",
        color: "dark",
        className: "bg-[var(--color-badge-filled-dark-bg)] text-[var(--color-badge-filled-dark-text)]",
      },
      // Outline variants
      {
        variant: "outline",
        color: "default",
        className: "border-[var(--color-badge-outline-default-border)] text-[var(--color-badge-outline-default-text)]",
      },
      {
        variant: "outline",
        color: "sky",
        className: "border-[var(--color-badge-outline-sky-border)] text-[var(--color-badge-outline-sky-text)]",
      },
      {
        variant: "outline",
        color: "grass",
        className: "border-[var(--color-badge-outline-grass-border)] text-[var(--color-badge-outline-grass-text)]",
      },
      {
        variant: "outline",
        color: "bored",
        className: "border-[var(--color-badge-outline-bored-border)] text-[var(--color-badge-outline-bored-text)]",
      },
      {
        variant: "outline",
        color: "negative",
        className: "border-[var(--color-badge-outline-negative-border)] text-[var(--color-badge-outline-negative-text)]",
      },
      {
        variant: "outline",
        color: "neutral",
        className: "border-[var(--color-badge-outline-neutral-border)] text-[var(--color-badge-outline-neutral-text)]",
      },
      {
        variant: "outline",
        color: "dark",
        className: "border-[var(--color-badge-outline-dark-border)] text-[var(--color-badge-outline-dark-text)]",
      },
    ],
    defaultVariants: {
      variant: "filled",
      color: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean
}

function Badge({
  className,
  variant,
  color,
  size,
  asChild = false,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, color, size }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
