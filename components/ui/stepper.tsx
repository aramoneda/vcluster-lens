import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

export interface StepperItem {
  title: React.ReactNode
  description?: React.ReactNode
}

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: StepperItem[]
  currentStepIndex: number
}

type StepperVisualState = "completed" | "current" | "upcoming"

const stepperVariants = cva(
  "flex min-w-0 flex-col gap-[var(--spacing-sp-16)] lg:flex-row lg:gap-0"
)

const stepperTrackVariants = cva("hidden h-2 rounded-full lg:block", {
  variants: {
    state: {
      completed: "bg-[var(--color-state-success-accent)]",
      current: "bg-[var(--color-state-success-accent)]",
      upcoming: "bg-[var(--neutral-400)]",
    },
    isLast: {
      true: "invisible",
      false: "",
    },
  },
})

const stepperVerticalConnectorVariants = cva(
  "absolute left-[18px] top-[calc(36px+var(--spacing-sp-12))] w-0.5 -translate-x-1/2 lg:hidden",
  {
    variants: {
      state: {
        completed: "bg-[var(--color-state-success-accent)]",
        current: "bg-[var(--color-state-success-accent)]",
        upcoming: "bg-[var(--neutral-400)]",
      },
      isLast: {
        true: "hidden",
        false: "bottom-[calc(var(--spacing-sp-16)*-1)]",
      },
    },
  }
)

const stepperIndicatorVariants = cva(
  [
    "inline-flex size-9 shrink-0 items-center justify-center rounded-full border-2",
    "row-span-2 col-start-1 row-start-1 lg:row-auto lg:col-auto",
  ],
  {
    variants: {
      state: {
        completed:
          "border-[var(--color-state-success-accent)] bg-[var(--color-state-success-accent)] text-[var(--color-surface-foreground)]",
        current:
          "border-[var(--green-haze-300)] bg-[var(--color-surface-foreground)] p-[3px] text-[var(--color-state-success-accent)]",
        upcoming:
          "border-[var(--color-stroke-default)] bg-[var(--color-surface-foreground)] text-transparent",
      },
    },
  }
)

function clampStepIndex(currentStepIndex: number, stepsLength: number) {
  if (stepsLength <= 0) {
    return 0
  }

  if (!Number.isFinite(currentStepIndex)) {
    return 0
  }

  return Math.min(Math.max(currentStepIndex, 0), stepsLength - 1)
}

function getVisualState(index: number, currentStepIndex: number): StepperVisualState {
  if (index < currentStepIndex) {
    return "completed"
  }

  if (index === currentStepIndex) {
    return "current"
  }

  return "upcoming"
}

function CompletedGlyph() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6.5 12.5 10 16l7.5-8" />
    </svg>
  )
}

function CurrentGlyph() {
  return (
    <span className="relative block size-full rounded-full border-[3px] border-current bg-[var(--color-surface-foreground)]">
      <span className="absolute inset-[3px] overflow-hidden rounded-full bg-[var(--color-surface-foreground)]">
        <span className="absolute inset-y-0 right-0 w-1/2 bg-current" />
      </span>
    </span>
  )
}

function StepIndicator({ state }: { state: StepperVisualState }) {
  if (state === "completed") {
    return <CompletedGlyph />
  }

  if (state === "current") {
    return <CurrentGlyph />
  }

  return <span aria-hidden="true" className="size-0" />
}

export function Stepper({
  steps,
  currentStepIndex,
  className,
  ...props
}: StepperProps) {
  if (steps.length === 0) {
    return null
  }

  const clampedCurrentStepIndex = clampStepIndex(currentStepIndex, steps.length)

  return (
    <div
      data-slot="stepper"
      className={cn(stepperVariants(), className)}
      {...props}
    >
      {steps.map((step, index) => {
        const state = getVisualState(index, clampedCurrentStepIndex)
        const isLast = index === steps.length - 1

        return (
          <div
            key={index}
            data-slot="stepper-item"
            className="relative grid min-w-0 grid-cols-[36px_minmax(0,1fr)] items-start gap-x-[var(--spacing-sp-12)] gap-y-[var(--spacing-sp-12)] lg:flex-1 lg:grid-cols-1 lg:grid-rows-[8px_auto] lg:gap-x-0 lg:gap-y-[var(--spacing-sp-12)]"
            aria-current={state === "current" ? "step" : undefined}
          >
            <div
              data-slot="stepper-track"
              className={stepperTrackVariants({ state, isLast })}
            />

            <div
              data-slot="stepper-connector"
              className={stepperVerticalConnectorVariants({ state, isLast })}
            />

            <div
              data-slot="stepper-content"
              className="contents lg:flex lg:min-w-0 lg:items-start lg:gap-[var(--spacing-sp-12)]"
            >
              <div
                data-slot="stepper-indicator"
                className={stepperIndicatorVariants({ state })}
                aria-hidden="true"
              >
                <StepIndicator state={state} />
              </div>

              <div
                data-slot="stepper-text"
                className="col-start-2 row-start-1 min-w-0 self-center lg:min-w-0"
              >
                <div
                  data-slot="stepper-title"
                  className="min-w-0 [font:var(--font-body-medium-semibold)] text-[var(--color-text-dark-accent)] lg:truncate"
                >
                  {step.title}
                  <span className="sr-only">
                    {state === "completed"
                      ? ", completed"
                      : state === "current"
                        ? ", current step"
                        : ", upcoming"}
                  </span>
                </div>

                {step.description ? (
                  <div
                    data-slot="stepper-description"
                    className="mt-[2px] min-w-0 text-[var(--color-text-secondary)] [font:var(--font-body-medium)] lg:truncate"
                  >
                    {step.description}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export { stepperVariants }
