'use client'

import * as React from 'react'
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

// Size type matching Dialog/Modal component
export type AlertDialogSize = 'xs' | 'sm' | 'md' | 'lg'

const alertDialogContentVariants = cva(
  [
    // Base styling matching Dialog (old Modal)
    'bg-[var(--color-surface-foreground)]',
    'rounded-[var(--radius-s)]',
    // No border
    'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    'z-[201]',
    'outline-none',
    'flex flex-col',
    'gap-6 p-6', // spacing-sp-24
    // Animations
    'data-[state=open]:animate-in data-[state=closed]:animate-out',
    'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
    'data-[state=closed]:zoom-out-[0.96] data-[state=open]:zoom-in-[0.96]',
    'data-[state=closed]:slide-out-to-top-[2%] data-[state=open]:slide-in-from-top-[2%]',
    'duration-150',
  ],
  {
    variants: {
      size: {
        xs: 'w-[500px] min-w-[392px] max-w-[500px] min-h-[260px] max-h-[500px]',
        sm: 'w-[594px] min-w-[594px] max-w-[800px] min-h-[260px] max-h-[800px]',
        md: 'w-[882px] min-w-[882px] max-w-[1050px] min-h-[260px] max-h-[800px]',
        lg: 'w-[1172px] min-w-[1172px] min-h-[400px] max-h-[800px]',
      },
    },
    defaultVariants: {
      size: 'xs',
    },
  }
)

function AlertDialog({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />
}

function AlertDialogTrigger({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  return (
    <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
  )
}

function AlertDialogPortal({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
  )
}

function AlertDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      className={cn(
        // 25% black backdrop matching Dialog
        'fixed inset-0 z-[200] bg-black/25',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'duration-150',
        className,
      )}
      {...props}
    />
  )
}

export interface AlertDialogContentProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>,
    VariantProps<typeof alertDialogContentVariants> {
  /** Size variant of the alert dialog */
  size?: AlertDialogSize
}

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  AlertDialogContentProps
>(({ className, size = 'xs', ...props }, ref) => {
  const localRef = React.useRef<React.ElementRef<typeof AlertDialogPrimitive.Content> | null>(null)
  const composedRef = React.useCallback(
    (node: React.ElementRef<typeof AlertDialogPrimitive.Content> | null) => {
      localRef.current = node
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref) {
        ;(ref as React.MutableRefObject<React.ElementRef<typeof AlertDialogPrimitive.Content> | null>).current = node
      }
    },
    [ref]
  )
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        ref={composedRef}
        data-slot="alert-dialog-content"
        data-size={size}
        className={cn(alertDialogContentVariants({ size }), className)}
        {...props}
      />
    </AlertDialogPortal>
  )
})

AlertDialogContent.displayName = 'AlertDialogContent'

function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn('flex flex-col gap-2 text-left shrink-0', className)}
      {...props}
    />
  )
}

function AlertDialogBody({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-dialog-body"
      className={cn('flex-1 overflow-y-auto', className)}
      {...props}
    />
  )
}

function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn('flex justify-end items-center gap-3 shrink-0 mt-auto', className)}
      {...props}
    />
  )
}

function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn(
        // h4: 20px size, 24px line-height, bold (matching Dialog)
        'text-xl leading-6 font-bold',
        'text-[var(--color-text-primary)]',
        'm-0',
        className
      )}
      {...props}
    />
  )
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn(
        // Body medium: 14px size, 20px line-height (matching Dialog)
        'text-sm leading-5 font-normal',
        'text-[var(--color-text-primary)]',
        className
      )}
      {...props}
    />
  )
}

function AlertDialogAction({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action>) {
  return (
    <AlertDialogPrimitive.Action
      className={cn(buttonVariants({ variant: 'default' }), className)}
      {...props}
    />
  )
}

function AlertDialogCancel({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>) {
  return (
    <AlertDialogPrimitive.Cancel
      className={cn(buttonVariants({ variant: 'secondary' }), className)}
      {...props}
    />
  )
}

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  alertDialogContentVariants,
}
