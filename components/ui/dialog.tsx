'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { cva, type VariantProps } from 'class-variance-authority'
import { XIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { IconButton } from '@/components/ui/icon-button'
import { Button, type ButtonProps } from '@/components/ui/button'

// Size type matching old Modal component
export type DialogSize = 'xs' | 'sm' | 'md' | 'lg' | 'fluid'

const dialogContentVariants = cva(
  [
    // Base styling from old Modal
    'bg-[var(--color-surface-foreground)]',
    'rounded-[var(--radius-s)]',
    // No border (old Modal had border-style but no border-color)
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
        fluid: '',
      },
    },
    defaultVariants: {
      size: 'xs',
    },
  }
)

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        // 25% black backdrop from old Modal
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

export interface DialogContentProps
  extends Omit<React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>, 'title'>,
    VariantProps<typeof dialogContentVariants> {
  /** Size variant of the dialog */
  size?: DialogSize
  /** Title text rendered in header */
  titleText?: string
  /** Description text rendered in body */
  descriptionText?: string
  /** Hide the close button */
  hideCloseButton?: boolean
  /** Additional elements for the header (next to title) */
  headerActions?: React.ReactNode
  /** Custom footer content (replaces default buttons) */
  footerContent?: React.ReactNode
  /** Hide the footer entirely */
  hideFooter?: boolean
  /** Primary action button label */
  primaryActionLabel?: string
  /** Primary action callback */
  onPrimaryAction?: () => void
  /** Additional props for primary button */
  primaryActionProps?: Partial<ButtonProps>
  /** Secondary action button label */
  secondaryActionLabel?: string
  /** Secondary action callback */
  onSecondaryAction?: () => void
  /** Additional props for secondary button */
  secondaryActionProps?: Partial<ButtonProps>
}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(
  (
    {
      className,
      children,
      size = 'xs',
      titleText,
      descriptionText,
      hideCloseButton = false,
      headerActions,
      footerContent,
      hideFooter = false,
      primaryActionLabel = 'Confirm',
      onPrimaryAction,
      primaryActionProps,
      secondaryActionLabel = 'Cancel',
      onSecondaryAction,
      secondaryActionProps,
      ...props
    },
    ref
  ) => {
    const localRef = React.useRef<React.ElementRef<typeof DialogPrimitive.Content> | null>(null)
    const composedRef = React.useCallback(
      (node: React.ElementRef<typeof DialogPrimitive.Content> | null) => {
        localRef.current = node
        if (typeof ref === 'function') {
          ref(node)
        } else if (ref) {
          ;(ref as React.MutableRefObject<React.ElementRef<typeof DialogPrimitive.Content> | null>).current = node
        }
      },
      [ref]
    )
    return (
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          ref={composedRef}
          data-slot="dialog-content"
          data-size={size}
          className={cn(dialogContentVariants({ size }), className)}
          {...props}
        >
          {/* Header */}
          <div className="flex justify-between items-center shrink-0">
            {titleText && <DialogTitle>{titleText}</DialogTitle>}
            {headerActions}
            {!hideCloseButton && (
              <DialogPrimitive.Close asChild>
                <IconButton
                  ariaLabel="Close modal"
                  size="M"
                  color="Blue"
                  className="ml-auto"
                >
                  <XIcon className="w-5 h-5" />
                </IconButton>
              </DialogPrimitive.Close>
            )}
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto">
            {descriptionText && <DialogDescription>{descriptionText}</DialogDescription>}
            {children}
          </div>

          {/* Footer */}
          {!hideFooter && (
            <div className="flex justify-end items-center gap-3 shrink-0">
              {footerContent !== undefined ? (
                footerContent
              ) : (
                <>
                  {onSecondaryAction && (
                    <Button
                      variant="secondary"
                      onClick={onSecondaryAction}
                      {...secondaryActionProps}
                    >
                      {secondaryActionLabel}
                    </Button>
                  )}
                  {onPrimaryAction && (
                    <Button
                      variant="default"
                      onClick={onPrimaryAction}
                      {...primaryActionProps}
                    >
                      {primaryActionLabel}
                    </Button>
                  )}
                </>
              )}
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPortal>
    )
  }
)

DialogContent.displayName = 'DialogContent'

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-header"
      className={cn('flex justify-between items-center shrink-0', className)}
      {...props}
    />
  )
}

function DialogBody({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-body"
      className={cn('flex-1 overflow-y-auto', className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn('flex justify-end items-center gap-3 shrink-0', className)}
      {...props}
    />
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
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

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        // Body medium: 14px size, 20px line-height, regular weight
        'text-sm leading-5 font-normal',
        'text-[var(--color-text-primary)]',
        'mt-1 mb-0',
        className
      )}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogBody,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  dialogContentVariants,
}
