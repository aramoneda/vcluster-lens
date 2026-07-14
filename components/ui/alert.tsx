"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X, Info, CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Link, type LinkProps } from "@/components/ui/link"

const alertVariants = cva(
  "relative w-full rounded-[var(--radius-s)] border p-3 flex items-start gap-3",
  {
    variants: {
      variant: {
        info: "bg-[var(--color-alert-info-bg)] border-[var(--color-alert-info-border)] text-[var(--color-text-primary)] [&>svg]:text-[var(--color-alert-info-icon)]",
        success: "bg-[var(--color-alert-success-bg)] border-[var(--color-alert-success-border)] text-[var(--color-text-primary)] [&>svg]:text-[var(--color-alert-success-icon)]",
        warning: "bg-[var(--color-alert-warning-bg)] border-[var(--color-alert-warning-border)] text-[var(--color-text-primary)] [&>svg]:text-[var(--color-alert-warning-icon)]",
        critical: "bg-[var(--color-alert-critical-bg)] border-[var(--color-alert-critical-border)] text-[var(--color-text-primary)] [&>svg]:text-[var(--color-alert-critical-icon)]",
        // Keep default and destructive for backward compatibility
        default: "bg-card text-card-foreground",
        destructive: "bg-[var(--color-alert-critical-bg)] border-[var(--color-alert-critical-border)] text-[var(--color-text-primary)] [&>svg]:text-[var(--color-alert-critical-icon)]",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
)

const variantIcons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  critical: AlertCircle,
  default: Info,
  destructive: AlertCircle,
} as const

export interface AlertProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof alertVariants> {
  /**
   * If true, shows a close button
   */
  dismissible?: boolean
  /**
   * Callback when close button is clicked
   */
  onDismiss?: () => void
  /**
   * Custom icon to display. If not provided, uses variant-specific icon
   */
  icon?: React.ReactNode
  /**
   * If false, hides the icon
   */
  showIcon?: boolean
}

function Alert({
  className,
  variant = "info",
  dismissible = false,
  onDismiss,
  icon,
  showIcon = true,
  children,
  ...props
}: AlertProps) {
  const [isVisible, setIsVisible] = React.useState(true)

  const handleDismiss = () => {
    onDismiss?.()
    setIsVisible(false)
  }

  if (!isVisible && dismissible) {
    return null
  }

  const IconComponent = variant ? variantIcons[variant] : Info
  const role = variant === "warning" || variant === "critical" || variant === "destructive" ? "alert" : "status"

  return (
    <div
      data-slot="alert"
      role={role}
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {showIcon && (
        <span className="flex-shrink-0 mt-0.5">
          {icon ?? <IconComponent className="size-5" aria-hidden="true" />}
        </span>
      )}
      <div className="flex-1 flex flex-col gap-1">
        {children}
      </div>
      {dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          className="flex-shrink-0 p-1 -m-1 rounded hover:bg-foreground/10 transition-colors"
          aria-label="Dismiss"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="alert-title"
      className={cn(
        "font-semibold text-sm leading-5 tracking-tight",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-sm leading-5 [&_p]:leading-relaxed",
        className
      )}
      {...props}
    />
  )
}

function AlertActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-actions"
      className={cn("mt-2 flex items-center gap-2", className)}
      {...props}
    />
  )
}

function AlertLink({ className, size = "sm", ...props }: LinkProps) {
  return (
    <Link
      data-slot="alert-link"
      size={size}
      className={cn("", className)}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription, AlertActions, AlertLink }
