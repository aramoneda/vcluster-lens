'use client'

import * as React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'

import { cn } from '@/lib/utils'

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  )
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  )
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

function TooltipContent({
  className,
  sideOffset = 4,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          // Layout & sizing from Figma
          'z-[9999] max-w-[250px] px-3 py-2 rounded-[var(--radius-s)]',
          // Colors - dark background, white text
          'bg-[var(--color-surface-tooltip)] text-[var(--color-text-tooltip)]',
          // Typography - body medium
          'text-sm leading-5 font-normal',
          // Shadow
          'shadow-[0px_2px_8px_rgba(0,0,0,0.15)]',
          // Animations
          'animate-in fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
          'data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1',
          'data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1',
          // Text handling
          'break-words',
          className,
        )}
        {...props}
      >
        {children}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

/**
 * Composite Tooltip component matching Old API.
 * Usage: <SimpleTooltip content="Tooltip text"><Button>Hover me</Button></SimpleTooltip>
 */
export interface SimpleTooltipProps
  extends Pick<
      React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider>,
      'delayDuration' | 'skipDelayDuration' | 'disableHoverableContent'
    >,
    Pick<
      React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>,
      'open' | 'defaultOpen' | 'onOpenChange'
    >,
    Pick<
      React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>,
      'side' | 'sideOffset' | 'align' | 'alignOffset'
    > {
  /** The trigger element for the tooltip */
  children: React.ReactNode
  /** The content to display within the tooltip */
  content: React.ReactNode
  /** Optional class name for the content */
  contentClassName?: string
}

const SimpleTooltip = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Content>,
  SimpleTooltipProps
>(
  (
    {
      // Provider Props
      delayDuration,
      skipDelayDuration,
      disableHoverableContent,
      // Root Props
      open,
      defaultOpen,
      onOpenChange,
      // Trigger Props
      children,
      // Content Props
      content,
      side,
      sideOffset = 4,
      align,
      alignOffset,
      contentClassName,
    },
    ref
  ) => {
    return (
      <TooltipPrimitive.Provider
        delayDuration={delayDuration}
        skipDelayDuration={skipDelayDuration}
        disableHoverableContent={disableHoverableContent}
      >
        <TooltipPrimitive.Root
          open={open}
          defaultOpen={defaultOpen}
          onOpenChange={onOpenChange}
        >
          <TooltipPrimitive.Trigger asChild>
            {children}
          </TooltipPrimitive.Trigger>
          <TooltipPrimitive.Portal>
            <TooltipPrimitive.Content
              ref={ref}
              side={side}
              sideOffset={sideOffset}
              align={align}
              alignOffset={alignOffset}
              className={cn(
                'z-[9999] max-w-[250px] px-3 py-2 rounded-[var(--radius-s)]',
                'bg-[var(--color-surface-tooltip)] text-[var(--color-text-tooltip)]',
                'text-sm leading-5 font-normal',
                'shadow-[0px_2px_8px_rgba(0,0,0,0.15)]',
                'animate-in fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
                'data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1',
                'data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1',
                'break-words',
                contentClassName,
              )}
            >
              {content}
            </TooltipPrimitive.Content>
          </TooltipPrimitive.Portal>
        </TooltipPrimitive.Root>
      </TooltipPrimitive.Provider>
    )
  }
)
SimpleTooltip.displayName = 'SimpleTooltip'

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, SimpleTooltip }
