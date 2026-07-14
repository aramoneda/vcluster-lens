"use client"

import * as React from "react"

import { ShellBase } from "@/components/shells/shell-base"
import { onboardingPreset } from "@/lib/shells/shell-presets"
import type { ShellProps } from "@/components/ui/shell"
import { Button } from "@/components/ui/button"
import { Stepper, type StepperItem } from "@/components/ui/stepper"

/**
 * Onboarding Shell — focused frame (comfortable density) for guided flows and
 * wizards (KYC, account opening, setup). Deactivated by default (status
 * "inactive" in the registry): ships in code but is not auto-selected; use
 * explicitly. Pair with the `onboarding-shell` skill.
 */
export function OnboardingShell(props: ShellProps) {
  return <ShellBase preset={onboardingPreset} {...props} />
}

export interface OnboardingFlowProps {
  /** Ordered steps for the progress indicator. */
  steps: StepperItem[]
  /** Zero-based index of the active step. */
  currentStepIndex: number
  /** Optional heading shown above the stepper. */
  title?: string
  /** Step body content. */
  children?: React.ReactNode
  backLabel?: string
  nextLabel?: string
  onBack?: () => void
  onNext?: () => void
  /** Hide the built-in Back/Next action row (supply your own actions). */
  hideActions?: boolean
}

/**
 * OnboardingFlow — FRAMELESS composition region (no Shell). This is the
 * Onboarding shell's content scaffold extracted for embedding inside ANOTHER
 * host shell's content area (e.g. add a client onboarding flow inside
 * `ClientShell` without rendering a second Shell). The host keeps the single
 * Shell frame; this contributes only content structure. Density-aware via the
 * host's `--shell-density-*` tokens, fully token-driven for dark mode.
 */
export function OnboardingFlow({
  steps,
  currentStepIndex,
  title,
  children,
  backLabel = "Back",
  nextLabel = "Continue",
  onBack,
  onNext,
  hideActions = false,
}: OnboardingFlowProps) {
  const isFirstStep = currentStepIndex <= 0
  const isLastStep = currentStepIndex >= steps.length - 1

  return (
    <section
      aria-label={title ?? "Onboarding flow"}
      className="mx-auto flex w-full max-w-3xl flex-col gap-[var(--shell-density-gap,var(--spacing-sp-24))]"
    >
      {title ? (
        <h1
          className="text-[var(--color-text-primary)]"
          style={{ font: "var(--font-headline-h3)" }}
        >
          {title}
        </h1>
      ) : null}

      <Stepper steps={steps} currentStepIndex={currentStepIndex} />

      <div className="flex flex-col gap-[var(--shell-density-gap-tight,var(--spacing-sp-16))]">
        {children}
      </div>

      {!hideActions ? (
        <div className="flex items-center justify-between gap-[var(--spacing-sp-12)]">
          <Button variant="outline" onClick={onBack} disabled={isFirstStep}>
            {backLabel}
          </Button>
          <Button onClick={onNext}>{isLastStep ? "Finish" : nextLabel}</Button>
        </div>
      ) : null}
    </section>
  )
}
