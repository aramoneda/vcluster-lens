import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const linkVariants = cva(
  "inline-flex items-center gap-1 font-semibold underline transition-colors cursor-pointer rounded-[var(--radius-xs)] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--denim-300)] text-[var(--color-text-link-default)] hover:text-[var(--color-text-link-hover)] active:text-[var(--color-text-link-pressed)] visited:text-[var(--color-text-link-visited)] aria-disabled:text-[var(--color-text-link-disabled)] aria-disabled:cursor-not-allowed aria-disabled:pointer-events-none",
  {
    variants: {
      size: {
        default: "text-sm",
        sm: "text-xs",
        lg: "text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export interface LinkProps
  extends React.ComponentProps<"a">,
    VariantProps<typeof linkVariants> {
  /**
   * Optional icon to display within the link.
   */
  icon?: React.ReactNode
  /**
   * If true, the icon will be placed after the text.
   * @default false
   */
  trailingIcon?: boolean
  /**
   * Whether the link is disabled.
   * @default false
   */
  disabled?: boolean
  /**
   * If true, the component will render its child and pass all props to it.
   * @default false
   */
  asChild?: boolean
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      children,
      icon,
      trailingIcon = false,
      disabled = false,
      asChild = false,
      className,
      href,
      size,
      ...rest
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "a"

    const iconSpan = icon && (
      <span className="inline-flex items-center justify-center [&>svg]:size-4">
        {icon}
      </span>
    )

    if (asChild) {
      return (
        <Comp
          ref={ref}
          data-slot="link"
          className={cn(linkVariants({ size }), className)}
          aria-disabled={disabled || undefined}
          data-disabled={disabled ? "" : undefined}
          {...rest}
        >
          {children}
        </Comp>
      )
    }

    return (
      <Comp
        ref={ref}
        data-slot="link"
        className={cn(linkVariants({ size }), className)}
        href={disabled ? undefined : href}
        aria-disabled={disabled || undefined}
        data-disabled={disabled ? "" : undefined}
        {...(disabled && { tabIndex: -1 })}
        {...rest}
      >
        {!trailingIcon && iconSpan}
        {children}
        {trailingIcon && iconSpan}
      </Comp>
    )
  }
)

Link.displayName = "Link"

export { Link, linkVariants }

