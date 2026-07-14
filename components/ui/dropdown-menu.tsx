'use client'

import * as React from 'react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { ChevronRightIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'

// Position type for easier positioning
export type DropdownMenuPosition =
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'left'
  | 'right'

function DropdownMenu({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
  )
}

function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  )
}

export interface DropdownMenuContentProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content> {
  position?: DropdownMenuPosition
}

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  DropdownMenuContentProps
>(({ className, sideOffset = 4, position = 'bottom-left', ...props }, ref) => {
  const positionProps = {
    'bottom-left': { side: 'bottom', align: 'start' },
    'bottom-center': { side: 'bottom', align: 'center' },
    'bottom-right': { side: 'bottom', align: 'end' },
    'top-left': { side: 'top', align: 'start' },
    'top-center': { side: 'top', align: 'center' },
    'top-right': { side: 'top', align: 'end' },
    left: { side: 'left', align: 'center' },
    right: { side: 'right', align: 'center' },
  }[position] as {
    side: 'bottom' | 'top' | 'left' | 'right'
    align: 'start' | 'center' | 'end'
  }

  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        ref={ref}
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        {...positionProps}
        className={cn(
          // Base styling from old DropdownMenu
          'min-w-[256px]',
          'bg-[var(--color-surface-foreground)]',
          'rounded-[var(--radius-s)]',
          'p-1', // spacing-sp-4
          'border border-[var(--color-stroke-default)]',
          'shadow-[0px_4px_12px_rgba(0,0,0,0.1),0px_0px_1px_rgba(0,0,0,0.05)]',
          'z-[200]',
          'overflow-hidden',
          // Animation
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
          'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          className,
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
})

DropdownMenuContent.displayName = 'DropdownMenuContent'

function DropdownMenuGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return (
    <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
  )
}

// Base item styles from old DropdownMenu
const itemBaseStyles = [
  'flex items-center relative',
  'py-3 px-4', // spacing-sp-12 / spacing-sp-16
  'rounded-[var(--radius-xs)]',
  'text-sm leading-5 font-normal', // body-medium
  'text-[var(--color-text-primary)]',
  'outline-none select-none cursor-default',
  'gap-3', // spacing-sp-12
  'transition-colors duration-100',
  // Hover/highlighted state
  'data-[highlighted]:bg-[var(--color-surface-hover)]',
  'data-[highlighted]:text-[var(--color-text-primary)]',
  // Focus state
  'data-[focus-visible]:outline-2 data-[focus-visible]:outline-[var(--denim-300)] data-[focus-visible]:outline-offset-2',
  'data-[focus-visible]:bg-[var(--color-surface-hover)]',
  // Disabled state
  'data-[disabled]:text-[var(--color-text-disabled)]',
  'data-[disabled]:pointer-events-none data-[disabled]:opacity-60',
]

export interface DropdownMenuItemProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> {
  inset?: boolean
  isActive?: boolean
  leadingIcon?: React.ReactNode
  leadingVisual?: React.ReactNode
  /**
   * 'custom' turns the item into a flexible slot for arbitrary content
   * (multi-line, rich layouts). Selection/active is shown via background only,
   * so the consumer controls per-line typography and color.
   */
  variant?: 'default' | 'destructive' | 'custom'
}

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  DropdownMenuItemProps
>(
  (
    {
      className,
      inset,
      isActive,
      leadingIcon,
      leadingVisual,
      variant = 'default',
      children,
      ...props
    },
    ref
  ) => {
    const actualLeadingContent = leadingVisual || leadingIcon || null

    return (
      <DropdownMenuPrimitive.Item
        ref={ref}
        data-slot="dropdown-menu-item"
        data-inset={inset}
        data-active={isActive ? 'true' : undefined}
        data-variant={variant}
        className={cn(
          itemBaseStyles,
          // Inset padding for alignment
          inset && 'pl-[calc(theme(spacing.4)+18px+theme(spacing.3))]',
          // Active/selected background (all variants)
          'data-[active=true]:bg-[var(--color-surface-selected)]',
          // Active text color/weight only for non-custom variants
          'data-[variant=default]:data-[active=true]:text-[var(--color-text-selected)] data-[variant=default]:data-[active=true]:font-semibold',
          // Destructive variant
          'data-[variant=destructive]:text-[var(--color-state-error)]',
          'data-[variant=destructive]:data-[highlighted]:bg-[var(--color-state-error)]/10',
          // Custom variant: top-aligned slot, let children control typography
          'data-[variant=custom]:items-start data-[variant=custom]:text-[length:inherit] data-[variant=custom]:leading-normal data-[variant=custom]:font-normal',
          // Icon styling
          "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          className,
        )}
        {...props}
      >
        {actualLeadingContent}
        {children}
      </DropdownMenuPrimitive.Item>
    )
  }
)

DropdownMenuItem.displayName = 'DropdownMenuItem'

export interface DropdownMenuCheckboxItemProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem> {}

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  DropdownMenuCheckboxItemProps
>(({ className, children, checked, onCheckedChange, disabled, ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      ref={ref}
      data-slot="dropdown-menu-checkbox-item"
      className={cn(
        itemBaseStyles,
        // Selected state
        'data-[state=checked]:bg-[var(--color-surface-selected)]',
        'data-[state=checked]:text-[var(--color-text-selected)]',
        'data-[state=checked]:font-semibold',
        className,
      )}
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      {...props}
    >
      <Checkbox
        checked={checked === true || checked === 'indeterminate'}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        aria-hidden
        className="pointer-events-none"
      />
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  )
})

DropdownMenuCheckboxItem.displayName = 'DropdownMenuCheckboxItem'

function DropdownMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  )
}

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => {
  const [indicatorState, setIndicatorState] = React.useState<string | null>(null)
  const localRef = React.useRef<React.ElementRef<typeof DropdownMenuPrimitive.RadioItem> | null>(null)
  const composedRef = React.useCallback(
    (node: React.ElementRef<typeof DropdownMenuPrimitive.RadioItem> | null) => {
      localRef.current = node
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref) {
        ;(ref as React.MutableRefObject<React.ElementRef<typeof DropdownMenuPrimitive.RadioItem> | null>).current = node
      }
    },
    [ref]
  )
  React.useEffect(() => {
    const el = localRef.current
    if (!el) return
    const dataState = el.getAttribute('data-state')
    setIndicatorState(dataState)
  }, [props.value])

  return (
    <DropdownMenuPrimitive.RadioItem
      ref={composedRef}
      data-slot="dropdown-menu-radio-item"
      className={cn(
        itemBaseStyles,
        // Selected state
        'data-[state=checked]:bg-[var(--color-surface-selected)]',
        'data-[state=checked]:text-[var(--color-text-selected)]',
        'data-[state=checked]:font-semibold',
        className,
      )}
      {...props}
    >
      {/* Radio indicator - matches old styling */}
      <span className="flex items-center justify-center w-[18px] h-[18px] shrink-0">
        <span
          className={cn(
            'flex items-center justify-center w-[18px] h-[18px] rounded-full',
            'border-2 border-[var(--color-stroke-controls-default)]',
            'transition-colors duration-150',
            'data-[state=checked]:border-[var(--color-surface-controls-selected)]',
          )}
          data-state={indicatorState ?? undefined}
        >
          <DropdownMenuPrimitive.ItemIndicator>
            <span className="w-[10px] h-[10px] rounded-full bg-[var(--color-surface-controls-selected)]" />
          </DropdownMenuPrimitive.ItemIndicator>
        </span>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  )
})

DropdownMenuRadioItem.displayName = 'DropdownMenuRadioItem'

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean
}) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        'py-2 px-4', // spacing-sp-8 / spacing-sp-16
        'text-sm leading-5 font-normal', // body-medium
        'text-[var(--color-text-secondary)]',
        'select-none',
        inset && 'pl-[calc(theme(spacing.4)+18px+theme(spacing.3))]',
        className,
      )}
      {...props}
    />
  )
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn(
        'h-px bg-[var(--color-stroke-default)]',
        '-mx-1 my-1', // Full width within padded content
        className,
      )}
      {...props}
    />
  )
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        'ml-auto text-xs tracking-widest',
        'text-[var(--color-text-secondary)]',
        className,
      )}
      {...props}
    />
  )
}

function DropdownMenuSub({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean
}) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        itemBaseStyles,
        // Open state
        'data-[state=open]:bg-[var(--color-surface-hover)]',
        // Inset
        inset && 'pl-[calc(theme(spacing.4)+18px+theme(spacing.3))]',
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon
        className={cn(
          'ml-auto size-4',
          'text-[var(--color-icon-dark)]',
          'group-data-[state=open]:text-[var(--color-icon-brand)]',
        )}
        aria-hidden="true"
      />
    </DropdownMenuPrimitive.SubTrigger>
  )
}

function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.SubContent
        data-slot="dropdown-menu-sub-content"
        className={cn(
          // Same styling as main content
          'min-w-[200px]',
          'bg-[var(--color-surface-foreground)]',
          'rounded-[var(--radius-s)]',
          'p-1', // spacing-sp-4
          'border border-[var(--color-stroke-default)]',
          'shadow-[0px_4px_12px_rgba(0,0,0,0.1),0px_0px_1px_rgba(0,0,0,0.05)]',
          'z-[201]',
          'overflow-hidden',
          // Animation
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
          'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          className,
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}

export type { DropdownMenuContentProps, DropdownMenuItemProps, DropdownMenuCheckboxItemProps }
