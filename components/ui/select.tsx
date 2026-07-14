'use client'

import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
  className,
  size = 'default',
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: 'xs' | 'sm' | 'default'
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        [
          'flex w-fit items-center justify-between gap-2 overflow-hidden whitespace-nowrap',
          'rounded-[var(--radius-xs)] border border-[var(--color-stroke-default)]',
          'bg-[var(--color-surface-input-default)] px-3',
          'text-[var(--color-text-primary)] [font:var(--font-body-medium-semibold)]',
          'outline-none transition-[border-color,box-shadow] duration-200',
          'hover:border-[var(--color-stroke-dark)]',
          'focus-visible:border-[var(--color-stroke-brand)]',
          'focus-visible:shadow-[0_0_0_1px_var(--color-stroke-brand),0_0_0_2px_var(--denim-300)]',
          'disabled:cursor-not-allowed disabled:border-[var(--color-stroke-default)]',
          'disabled:bg-[var(--color-surface-input-disabled)] disabled:text-[var(--color-text-secondary)]',
          'disabled:hover:border-[var(--color-stroke-default)]',
          'aria-invalid:border-[var(--error-accent)]',
          'aria-invalid:focus-visible:border-[var(--error-accent)]',
          'aria-invalid:focus-visible:shadow-[0_0_0_1px_var(--error-accent),0_0_0_2px_var(--error-accent)]',
          'data-[size=default]:h-9 data-[size=sm]:h-8 data-[size=xs]:h-6',
          'data-[size=xs]:px-2 data-[size=xs]:gap-1 data-[size=xs]:[font:var(--font-body-small-semibold)]',
          'data-[size=xs]:[&_svg:not([class*=size-])]:size-3.5',
          'data-[placeholder]:text-[var(--color-text-secondary)] data-[placeholder]:font-normal',
          '*:data-[slot=select-value]:line-clamp-1',
          '*:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2',
          '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=size-])]:size-4',
        ],
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 text-[var(--color-text-secondary)]" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  position = 'popper',
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          [
            'relative z-[200] max-h-(--radix-select-content-available-height) overflow-x-hidden overflow-y-auto',
            'min-w-[256px] origin-(--radix-select-content-transform-origin)',
            'rounded-[var(--radius-s)] border border-[var(--color-stroke-default)]',
            'bg-[var(--color-surface-foreground)] p-1 text-[var(--color-text-primary)]',
            'shadow-[0px_4px_12px_rgba(0,0,0,0.1),0px_0px_1px_rgba(0,0,0,0.05)]',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
            'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          ],
          position === 'popper' &&
            'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
          className,
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            'min-w-0',
            position === 'popper' &&
              'w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1',
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn(
        'px-4 py-2 text-[var(--color-text-secondary)] [font:var(--font-body-small)]',
        className,
      )}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  variant = 'default',
  triggerLabel,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item> & {
  /**
   * 'default' renders standard single-line text with a check indicator.
   * 'custom' turns the item into a flexible slot for arbitrary content
   * (multi-line, rich layouts). Selection is shown via background only,
   * so the consumer controls per-line typography and color.
   */
  variant?: 'default' | 'custom'
  /**
   * Custom variant only. Compact, single-line content shown in the closed
   * trigger when this item is selected. The rich `children` are reserved for
   * the dropdown list. Falls back to `children` if omitted (which may overflow
   * the trigger for multi-line content). Usually a short label like an ID.
   */
  triggerLabel?: React.ReactNode
}) {
  const isCustom = variant === 'custom'
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      data-variant={variant}
      className={cn(
        [
          'relative flex w-full cursor-default gap-3 rounded-[var(--radius-xs)]',
          'px-4 py-3 outline-none select-none',
          'text-[var(--color-text-primary)]',
          'transition-colors duration-100',
          'data-[highlighted]:bg-[var(--color-surface-hover)]',
          'data-[highlighted]:text-[var(--color-text-primary)]',
          'data-[state=checked]:bg-[var(--color-surface-selected)]',
          'data-[disabled]:pointer-events-none data-[disabled]:opacity-60',
          'data-[disabled]:text-[var(--color-text-disabled)]',
          'data-[focus-visible]:outline-2 data-[focus-visible]:outline-[var(--denim-300)] data-[focus-visible]:outline-offset-2',
          '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=size-])]:size-4',
          // Default variant: single-line, forced typography + selected color
          'data-[variant=default]:items-center',
          'data-[variant=default]:[font:var(--font-body-medium)]',
          'data-[variant=default]:data-[state=checked]:text-[var(--color-text-selected)]',
          'data-[variant=default]:data-[state=checked]:[font:var(--font-body-medium-semibold)]',
          'data-[variant=default]:*:[span]:last:flex data-[variant=default]:*:[span]:last:items-center data-[variant=default]:*:[span]:last:gap-2',
          // Custom variant: top-aligned slot, no forced typography (children control it)
          'data-[variant=custom]:items-start',
        ],
        className,
      )}
      {...props}
    >
      {!isCustom && (
        <span className="absolute right-4 flex size-4 items-center justify-center">
          <SelectPrimitive.ItemIndicator>
            <CheckIcon className="size-4" />
          </SelectPrimitive.ItemIndicator>
        </span>
      )}
      {isCustom ? (
        <>
          {/*
            Radix portals ItemText's *children* into the trigger and ignores its
            className. Wrap it in an sr-only span so the compact label is hidden
            in the dropdown but still mirrors into the closed (single-line) trigger.
          */}
          <span className="sr-only">
            <SelectPrimitive.ItemText>
              {triggerLabel ?? children}
            </SelectPrimitive.ItemText>
          </span>
          <span className="block w-full">{children}</span>
        </>
      ) : (
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      )}
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn(
        'pointer-events-none mx-1 my-1 h-px bg-[var(--color-stroke-default)]',
        className,
      )}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        'flex cursor-default items-center justify-center py-1 text-[var(--color-text-secondary)]',
        className,
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        'flex cursor-default items-center justify-center py-1 text-[var(--color-text-secondary)]',
        className,
      )}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
