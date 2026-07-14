"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex flex-row flex-nowrap items-center justify-center gap-1 whitespace-nowrap rounded-[var(--radius-xs)] font-semibold transition-all disabled:pointer-events-none disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:shrink-0 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--denim-300)]",
  {
    variants: {
      variant: {
        // Primary (default) - solid blue button
        default:
          "bg-[var(--color-surface-button-primary-default)] text-[var(--color-text-button-primary-default)] hover:bg-[var(--color-surface-button-primary-hover)] active:bg-[var(--color-surface-button-primary-pressed)] focus-visible:bg-[var(--color-surface-button-primary-focused)] disabled:bg-[var(--color-surface-button-primary-disabled)] disabled:text-[var(--color-text-button-primary-disabled)]",
        // Destructive/Error - solid red button
        destructive:
          "bg-[var(--color-surface-button-error-default)] text-[var(--color-text-button-error-default)] hover:bg-[var(--color-surface-button-error-hover)] active:bg-[var(--color-surface-button-error-pressed)] focus-visible:bg-[var(--color-surface-button-error-focused)] disabled:bg-[var(--color-surface-button-error-disabled)] disabled:text-[var(--color-text-button-error-disabled)]",
        // Outline/Secondary - bordered button
        outline:
          "bg-[var(--color-surface-button-secondary-default)] text-[var(--color-text-button-secondary-default)] border border-[var(--color-stroke-button-secondary-default)] hover:bg-[var(--color-surface-button-secondary-hover)] hover:text-[var(--color-text-button-secondary-hover)] hover:border-[var(--color-stroke-button-secondary-hover)] active:bg-[var(--color-surface-button-secondary-pressed)] active:text-[var(--color-text-button-secondary-pressed)] active:border-[var(--color-stroke-button-secondary-pressed)] focus-visible:bg-[var(--color-surface-button-secondary-focused)] disabled:bg-[var(--color-surface-button-secondary-disabled)] disabled:text-[var(--color-text-button-secondary-disabled)] disabled:border-[var(--color-stroke-default)]",
        // Secondary/Tertiary - light blue background
        secondary:
          "bg-[var(--color-surface-button-tertiary-default)] text-[var(--color-text-button-tertiary-default)] hover:bg-[var(--color-surface-button-tertiary-hover)] active:bg-[var(--color-surface-button-tertiary-pressed)] focus-visible:bg-[var(--color-surface-button-tertiary-focused)] disabled:bg-[var(--color-surface-button-tertiary-disabled)] disabled:text-[var(--color-text-button-tertiary-disabled)]",
        // Ghost - deprecated, kept for backward compatibility
        ghost:
          "hover:bg-accent hover:text-accent-foreground",
        // Link - deprecated, use Link component instead
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "min-w-[72px] h-9 px-2 py-1.5 text-sm [&_svg]:size-5",
        sm: "min-w-[56px] h-6 px-1 py-1 text-xs [&_svg]:size-3",
        lg: "min-w-[88px] h-10 px-3 py-2 text-base [&_svg]:size-6",
        icon: "size-9 p-2",
        "icon-sm": "size-6 p-1",
        "icon-lg": "size-10 p-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
  /** @deprecated Prefer placing the icon directly inside the button before the label. Use IconButton for icon-only actions. */
  icon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      icon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const localRef = React.useRef<HTMLButtonElement | null>(null)
    const composedRef = React.useCallback(
      (node: HTMLButtonElement | null) => {
        localRef.current = node
        if (typeof ref === "function") {
          ref(node)
        } else if (ref) {
          ;(ref as React.MutableRefObject<HTMLButtonElement | null>).current = node
        }
      },
      [ref]
    )
    const Comp = asChild ? Slot : "button"

    // Loading dots component
    const LoadingDots = () => (
      <span className="flex items-center justify-center gap-0.5">
        <span className="size-1 rounded-full bg-current animate-[flicker_1.4s_infinite_both]" />
        <span className="size-1 rounded-full bg-current animate-[flicker_1.4s_0.2s_infinite_both]" />
        <span className="size-1 rounded-full bg-current animate-[flicker_1.4s_0.4s_infinite_both]" />
      </span>
    )

    if (asChild) {
      return (
        <Comp
          ref={composedRef}
          data-slot="button"
          className={cn(buttonVariants({ variant, size }), className)}
          disabled={disabled || isLoading}
          data-loading={isLoading ? "" : undefined}
          {...props}
        >
          {children}
        </Comp>
      )
    }

    return (
      <Comp
        ref={composedRef}
        data-slot="button"
        className={cn(
          buttonVariants({ variant, size }),
          isLoading && "cursor-wait",
          className
        )}
        disabled={disabled || isLoading}
        data-loading={isLoading ? "" : undefined}
        {...props}
      >
        {isLoading ? (
          <LoadingDots />
        ) : (
          <span className="inline-flex flex-row flex-nowrap items-center gap-1">
            {icon && <span className="inline-flex items-center justify-center shrink-0">{icon}</span>}
            {children && <span className="px-1">{children}</span>}
          </span>
        )}
      </Comp>
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }
