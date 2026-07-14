"use client"

import * as React from "react"

import { Shell, type ShellProps } from "@/components/ui/shell"
import type { ShellPreset } from "@/lib/shells/shell-presets"

/** Shallow-merge a single region's props: preset defaults + caller overrides. */
function mergeRegion<T extends object>(base?: T, override?: T): T | undefined {
  if (!base) return override
  if (!override) return base
  return { ...base, ...override }
}

export interface ShellBaseProps extends ShellProps {
  /** Persona preset providing the shell's default ShellProps. */
  preset: ShellPreset
}

/**
 * Internal foundation for every persona shell wrapper. Renders the shared
 * `Shell` EXACTLY ONCE, deep-merging the persona preset with caller-provided
 * per-region props (caller wins). Named wrappers (FinancialAdvisorShell,
 * TraderShell, ...) are thin components over this so the "Shell used once"
 * rule is structurally guaranteed.
 */
export function ShellBase({
  preset,
  density,
  headerProps,
  topNavigationProps,
  leftNavigationProps,
  sideToolbarProps,
  pageContainerProps,
  footerProps,
  children,
  ...rest
}: ShellBaseProps) {
  return (
    <Shell
      density={density ?? preset.density}
      headerProps={mergeRegion(preset.headerProps, headerProps)}
      topNavigationProps={mergeRegion(preset.topNavigationProps, topNavigationProps)}
      leftNavigationProps={mergeRegion(preset.leftNavigationProps, leftNavigationProps)}
      sideToolbarProps={mergeRegion(preset.sideToolbarProps, sideToolbarProps)}
      pageContainerProps={mergeRegion(preset.pageContainerProps, pageContainerProps)}
      footerProps={mergeRegion(preset.footerProps, footerProps)}
      {...rest}
    >
      {children}
    </Shell>
  )
}
