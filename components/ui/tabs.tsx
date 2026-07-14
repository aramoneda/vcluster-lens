'use client'

import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

// Size variants matching old Tabset: title, medium, small
export type TabsVariant = 'title' | 'medium' | 'small'

// Context for passing variant to children
interface TabsContextValue {
  variant: TabsVariant
}

const TabsContext = React.createContext<TabsContextValue>({
  variant: 'title',
})

const tabsListVariants = cva(
  [
    'relative flex',
    // Border line at the bottom using pseudo-element for precise alignment
    'after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0',
    'after:h-[2px] after:bg-[var(--color-stroke-default)]',
  ],
  {
    variants: {
      variant: {
        title: 'gap-6',  // spacing-sp-24 = 24px
        medium: 'gap-6', // spacing-sp-24 = 24px
        small: 'gap-3 after:hidden', // spacing-sp-12 = 12px, no border
      },
    },
    defaultVariants: {
      variant: 'title',
    },
  }
)

const tabsTriggerVariants = cva(
  [
    'relative inline-flex items-center justify-center',
    'bg-transparent border-none rounded-none',
    'cursor-pointer outline-none',
    'text-[var(--color-text-secondary)]',
    'transition-colors duration-150',
    'pb-3', // padding-bottom for space to underline
    // Underline via pseudo-element - positioned at bottom of trigger
    'after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0',
    'after:h-[2px] after:bg-transparent',
    'after:z-10', // Above the list border
    // Active state
    'data-[state=active]:text-[var(--color-text-primary)]',
    'data-[state=active]:after:bg-[var(--color-stroke-brand)]',
    // Hover state (inactive)
    'data-[state=inactive]:hover:text-[var(--color-text-primary)]',
    'data-[state=inactive]:hover:after:bg-[var(--color-stroke-dark)]',
    // Pressed state (inactive)
    'data-[state=inactive]:active:text-[var(--color-text-link-default)]',
    'data-[state=inactive]:active:after:bg-[var(--color-stroke-brand)]',
    // Focus state
    'focus-visible:ring-2 focus-visible:ring-[var(--denim-300)]',
    // Disabled state
    'disabled:text-[var(--color-text-disabled)]',
    'disabled:cursor-not-allowed',
    'disabled:after:bg-transparent',
  ],
  {
    variants: {
      variant: {
        title: [
          'min-w-[58px]',
          'font-[var(--font-family-brand)]',
          'text-lg font-semibold leading-9', // h-9 equivalent via line-height
        ],
        medium: [
          'min-w-[40px]',
          'font-[var(--font-family-brand)]',
          'text-sm font-semibold leading-8', // h-8 equivalent via line-height
        ],
        small: [
          'min-w-[40px]',
          'font-[var(--font-family-brand)]',
          'text-sm font-semibold leading-7', // h-7 equivalent via line-height
          'pb-2', // smaller padding for small variant
        ],
      },
    },
    defaultVariants: {
      variant: 'title',
    },
  }
)

export interface TabsProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>,
    VariantProps<typeof tabsListVariants> {
  /** The visual variant of the tabs */
  variant?: TabsVariant
}

function Tabs({
  className,
  variant = 'title',
  children,
  ...props
}: TabsProps) {
  return (
    <TabsContext.Provider value={{ variant }}>
      <TabsPrimitive.Root
        data-slot="tabs"
        data-variant={variant}
        className={cn('flex flex-col', className)}
        {...props}
      >
        {children}
      </TabsPrimitive.Root>
    </TabsContext.Provider>
  )
}

export interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  /** Override the variant from context */
  variant?: TabsVariant
}

function TabsList({
  className,
  variant: variantProp,
  ...props
}: TabsListProps) {
  const { variant: contextVariant } = React.useContext(TabsContext)
  const variant = variantProp || contextVariant

  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

export interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
  /** Override the variant from context */
  variant?: TabsVariant
}

function TabsTrigger({
  className,
  variant: variantProp,
  children,
  ...props
}: TabsTriggerProps) {
  const { variant: contextVariant } = React.useContext(TabsContext)
  const variant = variantProp || contextVariant

  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      data-variant={variant}
      className={cn(tabsTriggerVariants({ variant }), className)}
      {...props}
    >
      <span className="whitespace-nowrap">{children}</span>
    </TabsPrimitive.Trigger>
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn('flex-1 outline-none p-4', className)}
      {...props}
    />
  )
}

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  tabsListVariants,
  tabsTriggerVariants,
}
