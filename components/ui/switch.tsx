'use client'

import * as React from 'react'
import * as SwitchPrimitive from '@radix-ui/react-switch'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

// Size type
export type SwitchSize = 'default' | 'small'
export type LabelPosition = 'left' | 'right'

const switchRootVariants = cva(
  [
    'relative inline-flex shrink-0 items-center',
    'rounded-full border-none p-0',
    'cursor-pointer outline-none',
    'transition-colors duration-150',
    '-webkit-tap-highlight-color-transparent',
    // Unchecked state
    'data-[state=unchecked]:bg-[var(--color-surface-toggle-default)]',
    // Checked state
    'data-[state=checked]:bg-[var(--color-surface-toggle-active)]',
    // Focus state
    'focus-visible:ring-2 focus-visible:ring-[var(--brand-300)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-stroke-brand)]',
    // Disabled state
    'disabled:bg-[var(--color-surface-toggle-disabled)]',
    'disabled:cursor-not-allowed',
  ],
  {
    variants: {
      size: {
        default: 'w-10 h-6', // 40px x 24px
        small: 'w-7 h-4',    // 28px x 16px
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
)

const switchThumbVariants = cva(
  [
    'block rounded-full',
    'bg-[var(--color-surface-toggle-ellipse)]',
    'shadow-[0_1px_2px_rgba(0,0,0,0.05)]',
    'transition-transform duration-150',
    'pointer-events-none',
    'will-change-transform',
    // Disabled state
    'data-[disabled]:opacity-60',
  ],
  {
    variants: {
      size: {
        default: [
          'size-4', // 16px (24 - 2*4)
          'data-[state=unchecked]:translate-x-1',  // 4px padding
          'data-[state=checked]:translate-x-5',    // 40 - 16 - 4 = 20px
        ],
        small: [
          'size-3', // 12px (16 - 2*2)
          'data-[state=unchecked]:translate-x-0.5', // 2px padding
          'data-[state=checked]:translate-x-3.5',   // 28 - 12 - 2 = 14px
        ],
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
)

export interface SwitchProps
  extends Omit<React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>, 'children'>,
    VariantProps<typeof switchRootVariants> {
  /** The size of the switch */
  size?: SwitchSize
  /** Optional label text */
  label?: React.ReactNode
  /** Position of the label relative to the switch */
  labelPosition?: LabelPosition
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(
  (
    {
      className,
      size = 'default',
      label,
      labelPosition = 'right',
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId()
    const switchId = id || generatedId
    const labelId = `${switchId}-label`

    const switchElement = (
      <SwitchPrimitive.Root
        ref={ref}
        id={switchId}
        data-slot="switch"
        disabled={disabled}
        aria-labelledby={label ? labelId : undefined}
        className={cn(switchRootVariants({ size }), className)}
        {...props}
      >
        <SwitchPrimitive.Thumb
          data-slot="switch-thumb"
          className={switchThumbVariants({ size })}
        />
      </SwitchPrimitive.Root>
    )

    if (!label) {
      return switchElement
    }

    return (
      <div
        className={cn(
          'inline-flex items-center gap-2',
          labelPosition === 'left' && 'flex-row-reverse',
          disabled && 'cursor-not-allowed'
        )}
      >
        {switchElement}
        <label
          id={labelId}
          htmlFor={switchId}
          className={cn(
            'font-[var(--font-family-brand)]',
            'text-sm font-normal leading-5',
            'text-[var(--color-text-primary)]',
            'cursor-pointer select-none',
            disabled && 'cursor-not-allowed text-[var(--color-text-disabled)]'
          )}
        >
          {label}
        </label>
      </div>
    )
  }
)

Switch.displayName = 'Switch'

export { Switch, switchRootVariants, switchThumbVariants }
