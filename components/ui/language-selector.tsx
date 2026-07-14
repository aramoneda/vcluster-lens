"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export type LanguageOption = {
  id: string
  label: string
  disabled?: boolean
}

export interface LanguageSelectorProps {
  options: LanguageOption[]
  selectedId: string
  onSelect?: (option: LanguageOption) => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
  triggerClassName?: string
  menuClassName?: string
}

function LanguageSelector({
  options,
  selectedId,
  onSelect,
  open,
  onOpenChange,
  triggerClassName,
  menuClassName,
}: LanguageSelectorProps) {
  const selectedOption = options.find((option) => option.id === selectedId) ?? options[0]

  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "group inline-flex items-center gap-2 rounded-[var(--radius-s)] px-4 py-3",
            "border border-[var(--color-stroke-default)]",
            "bg-[var(--color-surface-foreground)] text-sm font-semibold text-[var(--color-text-primary)]",
            "hover:border-[var(--color-stroke-strong)]",
            "data-[state=open]:border-[var(--color-stroke-brand)]",
            "data-[state=open]:ring-2 data-[state=open]:ring-[var(--color-surface-focused)]",
            triggerClassName
          )}
        >
          <span>{selectedOption?.label ?? ""}</span>
          <ChevronDown
            className={cn(
              "size-4 text-[var(--color-icon-brand)] transition-transform",
              "group-data-[state=open]:rotate-180"
            )}
            aria-hidden="true"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        position="bottom-left"
        className={cn("min-w-[90px]", menuClassName)}
      >
        {options.map((option) => (
          <DropdownMenuItem
            key={option.id}
            isActive={option.id === selectedId}
            onSelect={() => onSelect?.(option)}
            disabled={option.disabled}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { LanguageSelector }
