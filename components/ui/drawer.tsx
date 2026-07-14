'use client'

import * as React from 'react'
import { Drawer as DrawerPrimitive } from 'vaul'
import { X, ChevronLeft } from 'lucide-react'

import { cn } from '@/lib/utils'
import { IconButton } from '@/components/ui/icon-button'

type DrawerVariant = 'default' | 'horizontal'

const DrawerVariantContext = React.createContext<DrawerVariant>('default')

function Drawer({
  variant = 'default',
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root> & {
  /**
   * 'default' slides in from the right edge (full-height side panel).
   * 'horizontal' slides up from the bottom of the viewport, capped at a
   * 450px max height, with a subtle elevation shadow.
   */
  variant?: DrawerVariant
}) {
  // Horizontal opens from the bottom; default keeps the right-edge behavior.
  const direction = variant === 'horizontal' ? 'bottom' : 'right'
  return (
    <DrawerVariantContext.Provider value={variant}>
      <DrawerPrimitive.Root data-slot="drawer" direction={direction} {...props} />
    </DrawerVariantContext.Provider>
  )
}

function DrawerTrigger({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />
}

function DrawerPortal({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />
}

function DrawerClose({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Close>) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />
}

function DrawerOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Overlay>) {
  return (
    <DrawerPrimitive.Overlay
      data-slot="drawer-overlay"
      className={cn(
        // 25% black backdrop matching old Drawer
        'fixed inset-0 z-[40] bg-black/25',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'duration-300',
        className,
      )}
      {...props}
    />
  )
}

export interface DrawerContentProps
  extends React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content> {
  /** Title text for the header */
  headerTitle?: React.ReactNode
  /** Callback for back button (shows back button if provided) */
  onBack?: () => void
  /** Custom footer content */
  footerContent?: React.ReactNode
  /** Hide the close button */
  hideCloseButton?: boolean
}

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  DrawerContentProps
>(
  (
    {
      className,
      children,
      headerTitle,
      onBack,
      footerContent,
      hideCloseButton = false,
      ...props
    },
    ref
  ) => {
    const variant = React.useContext(DrawerVariantContext)
    const isHorizontal = variant === 'horizontal'
    return (
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerPrimitive.Content
          ref={ref}
          data-slot="drawer-content"
          data-variant={variant}
          className={cn(
            'group/drawer-content',
            // Base styling from old Drawer
            'bg-[var(--color-surface-foreground)]',
            'fixed z-[50] flex flex-col',
            'gap-6', // spacing-sp-24
            'overflow-hidden',
            'duration-300',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            isHorizontal
              ? [
                  // Bottom positioning: full width, capped height
                  'rounded-t-[var(--radius-s)]',
                  'inset-x-0 bottom-0',
                  'w-full',
                  'max-h-[450px]',
                  // Subtle elevation shadow (horizontal variant only)
                  'shadow-[0_-4px_24px_-6px_rgba(0,0,0,0.18)]',
                  // Slide up from bottom
                  'data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom',
                ]
              : [
                  // Right side positioning (default)
                  'rounded-l-[var(--radius-s)]',
                  'inset-y-0 right-0',
                  'w-[578px] min-w-[360px] max-w-[90vw]',
                  'h-screen',
                  'data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right',
                ],
            className,
          )}
          {...props}
        >
          {/* Header */}
          <div className="flex items-center shrink-0 p-6 pb-0">
            {onBack && (
              <IconButton
                ariaLabel="Back"
                size="M"
                color="Blue"
                onClick={onBack}
                className="mr-2"
              >
                <ChevronLeft className="w-5 h-5" />
              </IconButton>
            )}
            {headerTitle && <DrawerTitle>{headerTitle}</DrawerTitle>}
            {!hideCloseButton && (
              <DrawerPrimitive.Close asChild className="ml-auto">
                <IconButton ariaLabel="Close" size="M" color="Blue">
                  <X className="w-5 h-5" />
                </IconButton>
              </DrawerPrimitive.Close>
            )}
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6">
            {children}
          </div>

          {/* Footer */}
          {footerContent && (
            <div className="flex justify-end items-center gap-3 shrink-0 p-6 pt-0">
              {footerContent}
            </div>
          )}
        </DrawerPrimitive.Content>
      </DrawerPortal>
    )
  }
)

DrawerContent.displayName = 'DrawerContent'

function DrawerHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="drawer-header"
      className={cn('flex items-center shrink-0 p-6 pb-0', className)}
      {...props}
    />
  )
}

function DrawerBody({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="drawer-body"
      className={cn('flex-1 overflow-y-auto px-6', className)}
      {...props}
    />
  )
}

function DrawerFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn('flex justify-end items-center gap-3 shrink-0 p-6 pt-0', className)}
      {...props}
    />
  )
}

function DrawerTitle({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn(
        // h4: 20px size, 24px line-height, bold
        'text-xl leading-6 font-bold',
        'text-[var(--color-text-primary)]',
        'm-0',
        className
      )}
      {...props}
    />
  )
}

function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn(
        'text-sm leading-5 font-normal',
        'text-[var(--color-text-secondary)]',
        'mt-1 mb-4',
        className
      )}
      {...props}
    />
  )
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
