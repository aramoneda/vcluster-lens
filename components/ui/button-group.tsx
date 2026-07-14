'use client'

import * as React from 'react'
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

export type ButtonGroupSize = 'xs' | 'sm' | 'default' | 'lg'

const buttonGroupVariants = cva(
  [
    'inline-flex items-center box-border',
    'rounded-[var(--radius-s)]',
    'bg-[var(--color-surface-button-group-background)]',
  ],
  {
    variants: {
      size: {
        xs: 'gap-0.5 p-0.5',
        sm: 'gap-1 p-1',
        default: 'gap-2 p-1',
        lg: 'gap-2 p-1',
      },
    },
    defaultVariants: {
      size: 'lg',
    },
  }
)

const buttonGroupItemVariants = cva(
  [
    'inline-flex items-center justify-center cursor-pointer whitespace-nowrap',
    'rounded-[var(--radius-xs)] border border-transparent',
    'text-[var(--color-text-primary)] bg-transparent',
    'font-[var(--font-family-brand)]',
    'transition-[background-color,color,border-color] duration-150 ease-in-out',
    'hover:not-[data-state=on]:not-disabled:bg-[var(--color-surface-button-group-hover)]',
    'data-[state=on]:bg-[var(--color-surface-button-group-active)]',
    'data-[state=on]:text-[var(--color-text-link-default)]',
    'focus-visible:outline-none focus-visible:border-[var(--color-stroke-brand)]',
    'focus-visible:ring-2 focus-visible:ring-[var(--color-surface-focused)]',
    'disabled:text-[var(--color-text-disabled)] disabled:bg-transparent',
    'disabled:border-transparent disabled:cursor-not-allowed',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
  ],
  {
    variants: {
      size: {
        xs: [
          'h-5 px-1',
          'text-xs font-semibold leading-4',
          '[&_svg]:size-3',
        ],
        sm: [
          'h-7 px-1.5',
          'text-xs font-semibold leading-4',
          '[&_svg]:size-3.5',
        ],
        default: [
          'h-8 px-1',
          'text-sm font-semibold leading-5',
          '[&_svg]:size-4',
        ],
        lg: [
          'h-12 px-2',
          'text-base font-semibold leading-6',
          '[&_svg]:size-5',
        ],
      },
      iconOnly: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      { size: 'xs', iconOnly: true, class: 'w-5 px-0' },
      { size: 'sm', iconOnly: true, class: 'w-7 px-0' },
      { size: 'default', iconOnly: true, class: 'w-8 px-0' },
      { size: 'lg', iconOnly: true, class: 'w-12 px-0' },
    ],
    defaultVariants: {
      size: 'lg',
      iconOnly: false,
    },
  }
)

interface ButtonGroupContextValue {
  size: ButtonGroupSize
}

const ButtonGroupContext = React.createContext<ButtonGroupContextValue>({
  size: 'lg',
})

export interface ButtonGroupProps
  extends React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>,
    VariantProps<typeof buttonGroupVariants> {}

function ButtonGroup({
  className,
  size = 'lg',
  children,
  ...props
}: ButtonGroupProps) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="button-group"
      data-size={size}
      className={cn(buttonGroupVariants({ size }), className)}
      {...props}
    >
      <ButtonGroupContext.Provider value={{ size: size || 'lg' }}>
        {children}
      </ButtonGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  )
}

export interface ButtonGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> {
  icon?: React.ReactNode
  iconOnly?: boolean
}

function ButtonGroupItem({
  className,
  children,
  icon,
  iconOnly = false,
  ...props
}: ButtonGroupItemProps) {
  const { size } = React.useContext(ButtonGroupContext)
  const effectiveIconOnly = iconOnly || (!!icon && !children)

  let content: React.ReactNode = children
  if (effectiveIconOnly && icon) {
    content = <span className="inline-flex items-center justify-center">{icon}</span>
  } else if (icon && children) {
    content = (
      <>
        <span className="inline-flex items-center justify-center">{icon}</span>
        <span className={cn(size === 'xs' || size === 'sm' ? 'ml-0.5' : 'ml-1')}>{children}</span>
      </>
    )
  } else if (icon) {
    content = <span className="inline-flex items-center justify-center">{icon}</span>
  }

  return (
    <ToggleGroupPrimitive.Item
      data-slot="button-group-item"
      className={cn(
        buttonGroupItemVariants({ size, iconOnly: effectiveIconOnly }),
        className,
      )}
      {...props}
    >
      {content}
    </ToggleGroupPrimitive.Item>
  )
}

export {
  ButtonGroup,
  ButtonGroupItem,
  buttonGroupVariants,
  buttonGroupItemVariants,
}
