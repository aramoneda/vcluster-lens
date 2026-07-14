"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { IconButton, type IconButtonSize } from "@/components/ui/icon-button"
import { Link } from "@/components/ui/link"
import { cn } from "@/lib/utils"

export type DataPointCardColor = "blue" | "gray" | "light" | "superLight"
export type DataPointCardSize = "sm" | "md" | "lg"

export interface DataPointCardAction {
  ariaLabel: string
  icon?: React.ReactNode
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
}

export interface DataPointCardCta {
  label: React.ReactNode
  href?: string
  onClick?: (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void
}

export interface DataPointCardTrend {
  icon?: React.ReactNode
  label?: React.ReactNode
  tone?: "default" | "success" | "error" | "brand"
}

const dataPointCardVariants = cva(
  [
    "flex w-fit min-w-0 flex-col items-start shadow-none",
    "outline-none",
    "[&_[data-slot=data-point-card-header]]:flex [&_[data-slot=data-point-card-header]]:w-full [&_[data-slot=data-point-card-header]]:items-start [&_[data-slot=data-point-card-header]]:justify-between",
    "[&_[data-slot=data-point-card-body]]:flex [&_[data-slot=data-point-card-body]]:w-full [&_[data-slot=data-point-card-body]]:min-w-0 [&_[data-slot=data-point-card-body]]:flex-col",
    "[&_[data-slot=data-point-card-label]]:min-w-0 [&_[data-slot=data-point-card-label]]:text-[var(--color-text-secondary)]",
    "[&_[data-slot=data-point-card-value-group]]:flex [&_[data-slot=data-point-card-value-group]]:min-w-0 [&_[data-slot=data-point-card-value-group]]:flex-wrap [&_[data-slot=data-point-card-value-group]]:items-end",
    "[&_[data-slot=data-point-card-value]]:min-w-0 [&_[data-slot=data-point-card-value]]:text-[var(--color-text-dark-accent)]",
    "[&_[data-slot=data-point-card-accessories]]:flex [&_[data-slot=data-point-card-accessories]]:min-w-0 [&_[data-slot=data-point-card-accessories]]:flex-wrap [&_[data-slot=data-point-card-accessories]]:items-center",
    "[&_[data-slot=data-point-card-top-left-icon]]:inline-flex [&_[data-slot=data-point-card-top-left-icon]]:items-center [&_[data-slot=data-point-card-top-left-icon]]:justify-center [&_[data-slot=data-point-card-top-left-icon]]:text-[var(--color-text-secondary)] [&_[data-slot=data-point-card-top-left-icon]>*]:size-4",
    "[&_[data-slot=data-point-card-trend]]:inline-flex [&_[data-slot=data-point-card-trend]]:items-center [&_[data-slot=data-point-card-trend]]:gap-1",
    "[&_[data-slot=data-point-card-trend-icon]]:inline-flex [&_[data-slot=data-point-card-trend-icon]]:items-center [&_[data-slot=data-point-card-trend-icon]]:justify-center [&_[data-slot=data-point-card-trend-icon]>*]:size-4",
    "[&_[data-slot=data-point-card-trend-label]]:whitespace-nowrap",
    "[&_[data-slot=data-point-card-footer]]:w-full",
  ],
  {
    variants: {
      color: {
        blue: "bg-[var(--color-surface-selected)] border-transparent",
        gray: "bg-[var(--color-surface-background)] border-transparent",
        light: "bg-[var(--color-surface-widget)] border-[var(--color-stroke-light)]",
        superLight: "bg-[var(--color-surface-widget)] border-transparent",
      },
      size: {
        sm: [
          "rounded-[var(--radius-xs)] border p-[var(--spacing-sp-12)] gap-2",
          "[&_[data-slot=data-point-card-body]]:gap-[2px]",
          "[&_[data-slot=data-point-card-value-group]]:gap-2",
          "[&_[data-slot=data-point-card-accessories]]:gap-2",
          "[&_[data-slot=data-point-card-label]]:[font:var(--font-body-medium)]",
          "[&_[data-slot=data-point-card-value]]:[font:var(--font-body-large-bold)]",
          "[&_[data-slot=data-point-card-trend]]:[font:var(--font-body-small-semibold)]",
        ].join(" "),
        md: [
          "rounded-[var(--radius-xs)] border p-[var(--spacing-sp-12)] gap-2",
          "[&_[data-slot=data-point-card-body]]:gap-[2px]",
          "[&_[data-slot=data-point-card-value-group]]:gap-2",
          "[&_[data-slot=data-point-card-accessories]]:gap-2",
          "[&_[data-slot=data-point-card-label]]:[font:var(--font-body-medium)]",
          "[&_[data-slot=data-point-card-value]]:[font:var(--font-headline-h4)]",
          "[&_[data-slot=data-point-card-trend]]:[font:var(--font-body-medium-semibold)]",
        ].join(" "),
        lg: [
          "rounded-[var(--radius-s)] border p-[var(--spacing-sp-24)] gap-[var(--spacing-sp-8)]",
          "[&_[data-slot=data-point-card-body]]:gap-[var(--spacing-sp-8)]",
          "[&_[data-slot=data-point-card-value-group]]:gap-3",
          "[&_[data-slot=data-point-card-accessories]]:gap-3",
          "[&_[data-slot=data-point-card-label]]:[font:var(--font-body-large)]",
          "[&_[data-slot=data-point-card-value]]:[font:var(--font-headline-h2)]",
          "[&_[data-slot=data-point-card-trend]]:[font:var(--font-body-medium-semibold)]",
        ].join(" "),
      },
    },
    defaultVariants: {
      color: "light",
      size: "sm",
    },
  }
)

const trendToneClasses: Record<NonNullable<DataPointCardTrend["tone"]>, string> = {
  default: "text-[var(--color-text-secondary)]",
  success: "text-[var(--color-state-success)]",
  error: "text-[var(--color-state-error)]",
  brand: "text-[var(--color-icon-brand)]",
}

export interface DataPointCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dataPointCardVariants> {
  label: React.ReactNode
  value: React.ReactNode
  color?: DataPointCardColor
  size?: DataPointCardSize
  topLeftIcon?: React.ReactNode
  action?: DataPointCardAction
  trend?: DataPointCardTrend
  badge?: React.ReactNode
  valueAccessory?: React.ReactNode
  cta?: DataPointCardCta
}

function getActionButtonSize(size: DataPointCardSize): IconButtonSize {
  if (size === "lg") {
    return "S"
  }

  return "XS"
}

const DataPointCard = React.forwardRef<HTMLDivElement, DataPointCardProps>(
  (
    {
      label,
      value,
      color = "light",
      size = "sm",
      topLeftIcon,
      action,
      trend,
      badge,
      valueAccessory,
      cta,
      className,
      ...props
    },
    ref
  ) => {
    const hasHeader = Boolean(topLeftIcon) || Boolean(action?.icon)
    const hasFooter = Boolean(cta)
    const hasTrend = Boolean(trend?.icon) || Boolean(trend?.label)
    const trendTone = trend?.tone ?? "default"

    return (
      <div
        ref={ref}
        data-slot="data-point-card"
        className={cn(dataPointCardVariants({ color, size }), className)}
        {...props}
      >
        {hasHeader ? (
          <div data-slot="data-point-card-header">
            <div data-slot="data-point-card-top-left-icon">
              {topLeftIcon}
            </div>
            {action?.icon ? (
              <IconButton
                ariaLabel={action.ariaLabel}
                color="Black"
                size={getActionButtonSize(size)}
                disabled={action.disabled}
                onClick={action.onClick}
              >
                {action.icon}
              </IconButton>
            ) : null}
          </div>
        ) : null}

        <div data-slot="data-point-card-body">
          <div data-slot="data-point-card-label">{label}</div>

          <div data-slot="data-point-card-value-group">
            <div data-slot="data-point-card-value">{value}</div>

            {(hasTrend || badge || valueAccessory) ? (
              <div data-slot="data-point-card-accessories">
                {hasTrend ? (
                  <div
                    data-slot="data-point-card-trend"
                    className={trendToneClasses[trendTone]}
                  >
                    {trend?.icon ? (
                      <span data-slot="data-point-card-trend-icon">
                        {trend.icon}
                      </span>
                    ) : null}
                    {trend?.label ? (
                      <span data-slot="data-point-card-trend-label">
                        {trend.label}
                      </span>
                    ) : null}
                  </div>
                ) : null}

                {badge}
                {valueAccessory}
              </div>
            ) : null}
          </div>
        </div>

        {hasFooter ? (
          <div data-slot="data-point-card-footer">
            {cta?.href ? (
              <Link href={cta.href} onClick={cta.onClick as React.MouseEventHandler<HTMLAnchorElement>}>
                {cta.label}
              </Link>
            ) : (
              <Link asChild>
                <button
                  type="button"
                  onClick={cta?.onClick as React.MouseEventHandler<HTMLButtonElement>}
                >
                  {cta?.label}
                </button>
              </Link>
            )}
          </div>
        ) : null}
      </div>
    )
  }
)

DataPointCard.displayName = "DataPointCard"

export { DataPointCard, dataPointCardVariants }
