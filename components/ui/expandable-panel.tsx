'use client'

import * as React from 'react'
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible'
import { ChevronDownIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

/* -------------------------------------------------------------------------------------------------
 * ExpandableProgress — convenience accessory: a pill progress bar + "{pct}% {current} / {total}".
 * Turns red automatically when the allocation exceeds the total (over 100%).
 * ------------------------------------------------------------------------------------------------*/

export interface ExpandableProgressProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Amount currently allocated. */
  current: number
  /** Target / maximum amount. */
  total: number
  /** Force the color state. By default it is "error" when current > total, else "default". */
  variant?: 'default' | 'error'
  /** Override the auto-formatted numbers (e.g. for currency). */
  formatValue?: (value: number) => string
}

const formatNumber = (value: number) =>
  new Intl.NumberFormat('en-US').format(value)

function ExpandableProgress({
  current,
  total,
  variant,
  formatValue = formatNumber,
  className,
  ...props
}: ExpandableProgressProps) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0
  const isError = variant ? variant === 'error' : current > total
  const fillWidth = Math.min(pct, 100)

  return (
    <div
      data-slot="expandable-progress"
      data-variant={isError ? 'error' : 'default'}
      className={cn('flex items-center gap-[var(--spacing-sp-12)]', className)}
      {...props}
    >
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2 w-24 overflow-hidden rounded-[var(--radius-full)] bg-[var(--color-surface-hover)]"
      >
        <div
          className={cn(
            'h-full rounded-[var(--radius-full)] transition-[width] duration-300',
            isError
              ? 'bg-[var(--color-state-error)]'
              : 'bg-[var(--color-surface-controls-selected)]',
          )}
          style={{ width: `${fillWidth}%` }}
        />
      </div>
      <span className="whitespace-nowrap text-[var(--color-text-primary)] [font:var(--font-body-large)]">
        {pct}% {formatValue(current)} / {formatValue(total)}
      </span>
    </div>
  )
}

/* -------------------------------------------------------------------------------------------------
 * ExpandablePanel — a single collapsible section (Expansion/Accordion behavior) with a title,
 * an optional accessory region (progress, inline value, etc.) and a chevron toggle.
 * Built on Radix Collapsible so it is fully keyboard accessible and animated.
 * ------------------------------------------------------------------------------------------------*/

export interface ExpandablePanelProps
  extends Omit<
    React.ComponentProps<typeof CollapsiblePrimitive.Root>,
    'title'
  > {
  /** Title shown on the left of the header. */
  title: React.ReactNode
  /** Optional content shown between the title and the chevron (progress bar, value, badges…). */
  accessory?: React.ReactNode
  /** Visual treatment of the panel container. */
  variant?: 'outlined' | 'plain'
  /** Class applied to the header trigger row. */
  headerClassName?: string
  /** Class applied to the content body wrapper. */
  contentClassName?: string
}

function ExpandablePanel({
  title,
  accessory,
  variant = 'outlined',
  className,
  headerClassName,
  contentClassName,
  children,
  disabled,
  ...props
}: ExpandablePanelProps) {
  return (
    <CollapsiblePrimitive.Root
      data-slot="expandable-panel"
      data-variant={variant}
      disabled={disabled}
      className={cn(
        'w-full overflow-hidden bg-[var(--color-surface-background)] text-[var(--color-text-primary)]',
        className,
      )}
      {...props}
    >
      <CollapsiblePrimitive.Trigger
        data-slot="expandable-panel-trigger"
        className={cn(
          'group flex w-full items-center gap-[var(--spacing-sp-16)] px-[var(--spacing-sp-16)] py-[var(--spacing-sp-12)] text-left outline-none',
          'transition-colors hover:bg-[var(--color-surface-hover)]',
          'focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]',
          'disabled:cursor-not-allowed disabled:opacity-60',
          headerClassName,
        )}
      >
        <span className="text-[var(--color-text-primary)] [font:var(--font-headline-h5)]">
          {title}
        </span>
        {accessory != null && (
          <span className="ml-auto flex items-center">{accessory}</span>
        )}
        <ChevronDownIcon
          aria-hidden="true"
          className={cn(
            'size-5 shrink-0 text-[var(--color-text-link-default)] transition-transform duration-200',
            'group-data-[state=open]:rotate-180',
            accessory == null && 'ml-auto',
          )}
        />
      </CollapsiblePrimitive.Trigger>
      <CollapsiblePrimitive.Content
        data-slot="expandable-panel-content"
        className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down"
      >
        <div
          className={cn(
            'p-[var(--spacing-sp-16)]',
            variant === 'plain' && 'px-0',
            contentClassName,
          )}
        >
          {children}
        </div>
      </CollapsiblePrimitive.Content>
    </CollapsiblePrimitive.Root>
  )
}

export { ExpandablePanel, ExpandableProgress }
