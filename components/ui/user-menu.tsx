"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  type DropdownMenuItemProps,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export type UserMenuItem = {
  id: string
  label: string
  disabled?: boolean
  variant?: DropdownMenuItemProps["variant"]
}

export interface UserMenuProps {
  name: string
  items: UserMenuItem[]
  selectedId?: string
  onSelect?: (item: UserMenuItem) => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
  triggerClassName?: string
  menuClassName?: string
}

function UserMenu({
  name,
  items,
  selectedId,
  onSelect,
  open,
  onOpenChange,
  triggerClassName,
  menuClassName,
}: UserMenuProps) {
  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "group inline-flex items-center gap-2 rounded-[var(--radius-s)] px-3 py-2",
            "text-sm font-semibold text-[var(--color-text-brand)]",
            "bg-transparent transition-colors",
            "hover:bg-[var(--color-surface-hover)]",
            "data-[state=open]:bg-[var(--color-surface-selected)]",
            triggerClassName
          )}
        >
          <span>{name}</span>
          <ChevronDown
            className={cn(
              "size-4 transition-transform",
              "text-[var(--color-icon-brand)]",
              "group-data-[state=open]:rotate-180"
            )}
            aria-hidden="true"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent position="bottom-right" className={cn("min-w-[220px]", menuClassName)}>
        {items.map((item) => (
          <DropdownMenuItem
            key={item.id}
            isActive={item.id === selectedId}
            onSelect={() => onSelect?.(item)}
            disabled={item.disabled}
            variant={item.variant}
          >
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { UserMenu }
