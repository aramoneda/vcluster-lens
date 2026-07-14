'use client'

import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check, Minus } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const checkboxVariants = cva(
  [
    'peer shrink-0 flex items-center justify-center rounded-[var(--radius-xxs)]',
    'border-2 border-[var(--color-stroke-controls-default)] bg-transparent',
    'transition-colors duration-200 ease-out',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-surface-focused)]',
    // Unchecked hover
    'hover:not-disabled:data-[state=unchecked]:border-[var(--color-stroke-controls-hover)]',
    // Checked state
    'data-[state=checked]:bg-[var(--color-surface-controls-selected)] data-[state=checked]:border-0',
    'hover:not-disabled:data-[state=checked]:bg-[var(--color-surface-controls-hover)]',
    // Indeterminate state
    'data-[state=indeterminate]:bg-[var(--color-surface-controls-selected)] data-[state=indeterminate]:border-0',
    'hover:not-disabled:data-[state=indeterminate]:bg-[var(--color-surface-controls-hover)]',
    // Disabled state
    'disabled:cursor-not-allowed',
    'disabled:data-[state=unchecked]:bg-[var(--color-surface-controls-disabled)] disabled:data-[state=unchecked]:border-[var(--color-stroke-controls-disabled)]',
    'disabled:data-[state=checked]:bg-[var(--color-surface-controls-locked)]',
    'disabled:data-[state=indeterminate]:bg-[var(--color-surface-controls-locked)]',
  ],
  {
    variants: {
      size: {
        sm: 'size-[18px]',
        default: 'size-6',
      },
    },
    defaultVariants: {
      size: 'sm',
    },
  }
)

const iconVariants = cva('text-white', {
  variants: {
    size: {
      sm: '',
      default: '',
    },
  },
  defaultVariants: {
    size: 'sm',
  },
})

export type CheckboxSize = 'sm' | 'default'

export interface CheckboxProps
  extends Omit<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, 'asChild'>,
    VariantProps<typeof checkboxVariants> {
  /**
   * A label to be displayed next to the checkbox.
   */
  label?: React.ReactNode
  /**
   * Additional supporting text to be displayed.
   */
  supportingText?: React.ReactNode
}

const Checkbox = React.forwardRef<
  React.ComponentRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, size = 'sm', label, supportingText, id: providedId, disabled, checked, ...props }, ref) => {
  const generatedId = React.useId()
  const checkboxId = providedId || generatedId

  const hasTextContent = label || supportingText

  // Icon sizes based on checkbox size
  const checkIconSize = size === 'default' ? 'size-4' : 'size-3'
  const minusIconSize = size === 'default' ? 'size-3' : 'size-2'

  // Determine which icon to show based on checked state
  const isIndeterminate = checked === 'indeterminate'

  const checkboxElement = (
    <CheckboxPrimitive.Root
      ref={ref}
      id={checkboxId}
      data-slot="checkbox"
      disabled={disabled}
      checked={checked}
      className={cn(checkboxVariants({ size }), className)}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className={cn(
          'flex items-center justify-center',
          iconVariants({ size }),
          disabled && 'text-[var(--color-text-controls-disabled)]'
        )}
      >
        {isIndeterminate ? (
          <Minus className={cn(minusIconSize, 'stroke-[2px]')} aria-hidden />
        ) : (
          <Check className={checkIconSize} aria-hidden />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )

  // If no label/supporting text, return just the checkbox
  if (!hasTextContent) {
    return checkboxElement
  }

  // Return checkbox with label/supporting text wrapper
  return (
    <div
      data-slot="checkbox-wrapper"
      className={cn(
        'flex items-start gap-3',
        disabled && 'cursor-not-allowed'
      )}
    >
      {checkboxElement}
      <div className="flex flex-col gap-0.5">
        {label && (
          <label
            htmlFor={checkboxId}
            className={cn(
              'cursor-pointer font-semibold text-[var(--color-text-primary)]',
              size === 'default' ? 'text-base leading-6' : 'text-sm leading-5',
              disabled && 'cursor-not-allowed text-[var(--color-text-controls-disabled)]'
            )}
          >
            {label}
          </label>
        )}
        {supportingText && (
          <span
            className={cn(
              'text-[var(--color-text-secondary)]',
              size === 'default' ? 'text-base leading-6' : 'text-sm leading-5'
            )}
          >
            {supportingText}
          </span>
        )}
      </div>
    </div>
  )
})

Checkbox.displayName = 'Checkbox'

export { Checkbox, checkboxVariants }
