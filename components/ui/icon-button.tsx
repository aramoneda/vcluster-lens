'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import { SimpleTooltip } from '@/components/ui/tooltip'

// Size and color types matching old IconButton
export type IconButtonSize = 'M' | 'S' | 'XS'
export type IconButtonColor = 'Blue' | 'Black'

const iconButtonVariants = cva(
  [
    'inline-flex items-center justify-center',
    'border-0 bg-transparent',
    'cursor-pointer',
    'rounded-[var(--radius-xs)]',
    'transition-all duration-200 ease-out',
    'box-border relative',
    // Focus state
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--denim-300)]',
    // Hover state (when not disabled)
    'hover:not-disabled:bg-[var(--color-surface-hover)]',
    // Pressed state
    'active:not-disabled:bg-[var(--denim-100)]',
    // Disabled state
    'disabled:text-[var(--color-icon-disabled)] disabled:bg-transparent disabled:opacity-60 disabled:cursor-not-allowed',
  ],
  {
    variants: {
      size: {
        M: 'w-8 h-8',      // 32px
        S: 'w-6 h-6',      // 24px
        XS: 'w-4 h-4 p-0.5', // 16px with 2px padding
      },
      color: {
        Blue: 'text-[var(--color-icon-brand)]',
        Black: 'text-[var(--color-icon-dark)]',
      },
      isActive: {
        true: 'bg-[var(--color-surface-selected)] hover:not-disabled:bg-[var(--color-surface-selected)]',
        false: '',
      },
    },
    compoundVariants: [
      // Blue M gets padding on hover/active/pressed
      {
        color: 'Blue',
        size: 'M',
        className: 'hover:not-disabled:p-0.5 active:not-disabled:p-0.5',
      },
      {
        color: 'Blue',
        size: 'M',
        isActive: true,
        className: 'p-0.5',
      },
    ],
    defaultVariants: {
      size: 'M',
      color: 'Blue',
      isActive: false,
    },
  }
)

export interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'>,
    VariantProps<typeof iconButtonVariants> {
  /**
   * Accessible label for the icon button.
   * Required for accessibility and shown in the tooltip.
   */
  ariaLabel: string
  /**
   * The icon element to be rendered inside the button.
   */
  children: React.ReactNode
  /**
   * The size of the icon button.
   * @default 'M'
   */
  size?: IconButtonSize
  /**
   * The color scheme of the icon button.
   * @default 'Blue'
   */
  color?: IconButtonColor
  /**
   * If `true`, the button will be in an active state (e.g., selected).
   * @default false
   */
  isActive?: boolean
  /**
   * The preferred side of the trigger to render the tooltip.
   */
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left'
  /**
   * The offset of the tooltip from the trigger.
   * @default 5
   */
  tooltipSideOffset?: number
  /**
   * The delay duration for the tooltip to open, in milliseconds.
   * @default 700
   */
  tooltipDelayDuration?: number
  /**
   * Allows the component to be rendered as a child of another component.
   * @default false
   */
  asChild?: boolean
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      ariaLabel,
      children,
      size = 'M',
      color = 'Blue',
      isActive = false,
      disabled = false,
      className,
      tooltipSide,
      tooltipSideOffset = 5,
      tooltipDelayDuration = 700,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'

    const buttonElement = (
      <Comp
        ref={ref}
        className={cn(iconButtonVariants({ size, color, isActive }), className)}
        disabled={disabled}
        aria-disabled={disabled}
        aria-label={ariaLabel}
        data-active={isActive ? '' : undefined}
        data-size={size}
        data-color={color}
        {...props}
      >
        {children}
      </Comp>
    )

    // Don't wrap with tooltip if disabled or asChild
    if (disabled || asChild) {
      return buttonElement
    }

    // Wrap enabled button with Tooltip showing ariaLabel
    return (
      <SimpleTooltip
        content={ariaLabel}
        side={tooltipSide}
        sideOffset={tooltipSideOffset}
        delayDuration={tooltipDelayDuration}
      >
        {buttonElement}
      </SimpleTooltip>
    )
  }
)

IconButton.displayName = 'IconButton'

export { IconButton, iconButtonVariants }

