"use client"

import { Stepper } from "@/components/ui/stepper"
import { ComponentPageLayout } from "@/components/component-page-layout"
import { registryMetadata } from "@/lib/registry-metadata"

export const dynamic = "force-dynamic"

export const meta = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "stepper",
  type: "registry:ui",
  title: "Stepper",
  description: "Onboarding and workflow progress indicator for multi-step flows.",
  ...registryMetadata["stepper"],
  files: [
    {
      path: "ui/stepper.tsx",
      type: "registry:ui",
    },
  ],
  dependencies: [
    "class-variance-authority",
  ],
}

const onboardingSteps = [
  { title: "Company details", description: "Website and location" },
  { title: "Your details", description: "Name and email" },
  { title: "Plan selection", description: "Choose a setup" },
  { title: "Verification", description: "Confirm your account" },
  { title: "Review and launch", description: "Complete onboarding" },
]

function StepperExample() {
  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Five-Step Onboarding</h3>
        <Stepper steps={onboardingSteps} currentStepIndex={1} />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Current Step Positions</h3>
        <div className="space-y-6">
          <Stepper
            steps={onboardingSteps}
            currentStepIndex={0}
          />
          <Stepper
            steps={onboardingSteps}
            currentStepIndex={2}
          />
          <Stepper
            steps={onboardingSteps}
            currentStepIndex={4}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Three-Step Flow</h3>
        <Stepper
          currentStepIndex={1}
          steps={[
            { title: "Workspace", description: "Set up company basics" },
            { title: "Users", description: "Invite your team" },
            { title: "Finalize", description: "Review and continue" },
          ]}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Without Descriptions</h3>
        <Stepper
          currentStepIndex={2}
          steps={[
            { title: "Profile" },
            { title: "Preferences" },
            { title: "Permissions" },
            { title: "Finish" },
          ]}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Constrained Width</h3>
        <div className="max-w-md rounded-[var(--radius-s)] border border-dashed border-[var(--color-stroke-default)] p-4">
          <Stepper
            currentStepIndex={1}
            steps={[
              { title: "Organization profile", description: "Company name and website" },
              { title: "Primary contact", description: "Email address and phone" },
              { title: "Review and confirm", description: "Validate the onboarding data" },
            ]}
          />
        </div>
      </div>
    </div>
  )
}

export default function StepperPage() {
  return (
    <ComponentPageLayout meta={meta}>
      <StepperExample />
    </ComponentPageLayout>
  )
}
