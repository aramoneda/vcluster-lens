'use client'

import * as React from 'react'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

// Size type matching old Radio component
export type RadioSize = 'sm' | 'default'

const radioGroupVariants = cva(
  'flex',
  {
    variants: {
      orientation: {
        vertical: 'flex-col gap-6',   // sp-24 = 24px
        horizontal: 'flex-row gap-6', // sp-24 = 24px
      },
    },
    defaultVariants: {
      orientation: 'vertical',
    },
  }
)

const radioItemVariants = cva(
  [
    'rounded-full border-2 bg-transparent',
    'flex items-center justify-center shrink-0',
    'transition-all duration-150 outline-none',
    // Default (unchecked) state
    'border-[var(--color-stroke-controls-default)]',
    // Hover state (unchecked)
    'data-[state=unchecked]:hover:border-[var(--color-stroke-controls-hover)]',
    // Checked state
    'data-[state=checked]:border-[var(--color-surface-controls-selected)]',
    // Focus state
    'focus-visible:ring-2 focus-visible:ring-[var(--denim-300)]',
    // Disabled state
    'disabled:border-[var(--color-stroke-controls-disabled)]',
    'disabled:bg-[var(--color-surface-controls-disabled)]',
    'disabled:cursor-not-allowed',
  ],
  {
    variants: {
      size: {
        sm: 'size-[18px]',      // 18px
        default: 'size-6',      // 24px
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
)

const radioIndicatorVariants = cva(
  [
    'rounded-full',
    'data-[state=checked]:bg-[var(--color-surface-controls-selected)]',
    // Disabled checked state
    'data-[disabled]:data-[state=checked]:bg-[var(--color-stroke-controls-disabled)]',
  ],
  {
    variants: {
      size: {
        sm: 'size-[10px]',     // ~55% of 18px
        default: 'size-[14px]', // ~58% of 24px
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
)

// Context for passing size to children
interface RadioGroupContextValue {
  size: RadioSize
}

const RadioGroupContext = React.createContext<RadioGroupContextValue>({
  size: 'default',
})

export interface RadioGroupProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>,
    VariantProps<typeof radioGroupVariants> {
  /** Size of all radio items in the group */
  size?: RadioSize
}

function RadioGroup({
  className,
  orientation = 'vertical',
  size = 'default',
  children,
  ...props
}: RadioGroupProps) {
  return (
    <RadioGroupContext.Provider value={{ size }}>
      <RadioGroupPrimitive.Root
        data-slot="radio-group"
        orientation={orientation}
        className={cn(radioGroupVariants({ orientation }), className)}
        {...props}
      >
        {children}
      </RadioGroupPrimitive.Root>
    </RadioGroupContext.Provider>
  )
}

export interface RadioGroupItemProps
  extends Omit<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>, 'children'> {
  /** Override size from context */
  size?: RadioSize
  /** Label text for the radio item */
  label?: React.ReactNode
  /** Supporting text below the label */
  supportingText?: React.ReactNode
  /** Whether the item is locked (disabled but visually distinct) */
  locked?: boolean
}

function RadioGroupItem({
  className,
  size: sizeProp,
  label,
  supportingText,
  disabled,
  locked = false,
  ...props
}: RadioGroupItemProps) {
  const { size: contextSize } = React.useContext(RadioGroupContext)
  const size = sizeProp || contextSize
  const isEffectivelyDisabled = disabled || locked

  const radioElement = (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      disabled={isEffectivelyDisabled}
      data-locked={locked || undefined}
      className={cn(radioItemVariants({ size }), className)}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className={radioIndicatorVariants({ size })}
      />
    </RadioGroupPrimitive.Item>
  )

  if (!label && !supportingText) {
    return radioElement
  }

  return (
    <label
      className={cn(
        'inline-flex items-center gap-3 cursor-pointer',
        isEffectivelyDisabled && 'cursor-not-allowed'
      )}
      data-disabled={isEffectivelyDisabled || undefined}
      data-locked={locked || undefined}
    >
      {radioElement}
      <span className="flex flex-col">
        {label && (
          <span
            className={cn(
              'font-[var(--font-family-brand)]',
              size === 'sm' ? 'text-sm font-semibold leading-5' : 'text-base font-semibold leading-6',
              'text-[var(--color-text-primary)]',
              isEffectivelyDisabled && 'text-[var(--color-text-controls-disabled)]'
            )}
          >
            {label}
          </span>
        )}
        {supportingText && (
          <span
            className={cn(
              'font-[var(--font-family-brand)]',
              size === 'sm' ? 'text-sm font-normal leading-5' : 'text-base font-normal leading-6',
              'text-[var(--color-text-secondary)]',
              isEffectivelyDisabled && 'text-[var(--color-text-controls-disabled)]'
            )}
          >
            {supportingText}
          </span>
        )}
      </span>
    </label>
  )
}

export {
  RadioGroup,
  RadioGroupItem,
  radioGroupVariants,
  radioItemVariants,
  radioIndicatorVariants,
}
