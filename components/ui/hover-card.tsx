'use client'

import * as React from 'react'
import * as HoverCardPrimitive from '@radix-ui/react-hover-card'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

// Size variants matching old Popover
const hoverCardContentVariants = cva(
  [
    // Base styles
    'bg-[var(--color-surface-foreground)]',
    'text-[var(--color-text-primary)]',
    'rounded-[var(--radius-s)]',
    'z-[200]',
    'shadow-[0px_4px_12px_rgba(0,0,0,0.1),0px_0px_2px_rgba(0,0,0,0.06)]',
    'outline-hidden',
    // Animations
    'data-[state=open]:animate-in data-[state=closed]:animate-out',
    'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
    'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
    'data-[side=bottom]:slide-in-from-top-2',
    'data-[side=left]:slide-in-from-right-2',
    'data-[side=right]:slide-in-from-left-2',
    'data-[side=top]:slide-in-from-bottom-2',
    'origin-(--radix-hover-card-content-transform-origin)',
  ],
  {
    variants: {
      size: {
        m: 'p-6', // 24px - spacing-sp-24
        s: 'p-4', // 16px - spacing-sp-16
        xs: 'p-3', // 12px - spacing-sp-12
      },
    },
    defaultVariants: {
      size: 'm',
    },
  }
)

export type HoverCardSize = 'm' | 's' | 'xs'

function HoverCard({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Root>) {
  return <HoverCardPrimitive.Root data-slot="hover-card" {...props} />
}

function HoverCardTrigger({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Trigger>) {
  return (
    <HoverCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
  )
}

export interface HoverCardContentProps
  extends Omit<React.ComponentProps<typeof HoverCardPrimitive.Content>, 'size'>,
    VariantProps<typeof hoverCardContentVariants> {
  /** Size variant affecting padding */
  size?: HoverCardSize
}

function HoverCardContent({
  className,
  align = 'center',
  sideOffset = 8, // 8px default matching old Popover
  size = 'm',
  ...props
}: HoverCardContentProps) {
  return (
    <HoverCardPrimitive.Portal>
      <HoverCardPrimitive.Content
        data-slot="hover-card-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(hoverCardContentVariants({ size }), className)}
        {...props}
      />
    </HoverCardPrimitive.Portal>
  )
}

export { HoverCard, HoverCardTrigger, HoverCardContent, hoverCardContentVariants }
