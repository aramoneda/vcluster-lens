'use client'

import * as React from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

// Size type matching old Popover component
export type PopoverSize = 'M' | 'S' | 'XS'

const popoverContentVariants = cva(
  [
    // Background and appearance
    'bg-[var(--color-surface-foreground)]',
    'text-[var(--color-text-primary)]',
    'rounded-[var(--radius-s)]',
    'shadow-[0px_4px_12px_rgba(0,0,0,0.1),0px_0px_2px_rgba(0,0,0,0.06)]',
    'z-[200]',
    'outline-none',
    // Animations
    'data-[state=open]:animate-in data-[state=closed]:animate-out',
    'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
    'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
    'data-[side=bottom]:slide-in-from-top-2',
    'data-[side=left]:slide-in-from-right-2',
    'data-[side=right]:slide-in-from-left-2',
    'data-[side=top]:slide-in-from-bottom-2',
    'origin-(--radix-popover-content-transform-origin)',
    'duration-200 ease-out',
  ],
  {
    variants: {
      size: {
        M: 'p-6',   // spacing-sp-24 = 24px
        S: 'p-4',   // spacing-sp-16 = 16px
        XS: 'p-3',  // spacing-sp-12 = 12px
      },
    },
    defaultVariants: {
      size: 'M',
    },
  }
)

function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

export interface PopoverContentProps
  extends Omit<React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>, 'asChild'>,
    VariantProps<typeof popoverContentVariants> {
  /** The size of the popover content, affecting padding */
  size?: PopoverSize
}

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(
  (
    {
      className,
      align = 'center',
      sideOffset = 8, // 8px default matching old component
      size = 'M',
      ...props
    },
    ref
  ) => {
    return (
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          ref={ref}
          data-slot="popover-content"
          data-size={size}
          align={align}
          sideOffset={sideOffset}
          className={cn(popoverContentVariants({ size }), className)}
          {...props}
        />
      </PopoverPrimitive.Portal>
    )
  }
)

PopoverContent.displayName = 'PopoverContent'

function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}

function PopoverClose({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Close>) {
  return <PopoverPrimitive.Close data-slot="popover-close" {...props} />
}

export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
  PopoverClose,
  popoverContentVariants,
}
