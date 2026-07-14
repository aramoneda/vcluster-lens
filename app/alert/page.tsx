"use client"

import { Alert, AlertDescription, AlertTitle, AlertActions, AlertLink } from "@/components/ui/alert"
import { ComponentPageLayout } from "@/components/component-page-layout"
import { ArrowRight } from "lucide-react"
import { registryMetadata } from "@/lib/registry-metadata"

export const meta = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "alert",
  type: "registry:ui",
  title: "Alert",
  description: "Displays a callout for user attention.",
  ...registryMetadata["alert"],
  dependencies: [
    "class-variance-authority",
    "lucide-react",
  ],
  files: [
    {
      path: "ui/alert.tsx",
      type: "registry:ui",
    },
  ],
}

function AlertExample() {
  return (
    <div className="space-y-4 max-w-xl">
      {/* Info Variant */}
      <Alert variant="info">
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>
          This is an informational callout. You can add components to your app using the cli.
        </AlertDescription>
      </Alert>

      {/* Success Variant */}
      <Alert variant="success">
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>
          Your changes have been saved successfully.
        </AlertDescription>
      </Alert>

      {/* Warning Variant */}
      <Alert variant="warning">
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>
          Your session is about to expire. Please save your work.
        </AlertDescription>
      </Alert>

      {/* Critical Variant */}
      <Alert variant="critical">
        <AlertTitle>Critical Error</AlertTitle>
        <AlertDescription>
          Your session has expired. Please log in again.
        </AlertDescription>
      </Alert>

      {/* With Dismiss Button */}
      <Alert variant="info" dismissible onDismiss={() => console.log("Dismissed!")}>
        <AlertTitle>Dismissible Alert</AlertTitle>
        <AlertDescription>
          Click the X button to dismiss this alert.
        </AlertDescription>
      </Alert>

      {/* With Actions using AlertLink */}
      <Alert variant="warning">
        <AlertTitle>Action Required</AlertTitle>
        <AlertDescription>
          Your subscription is expiring soon.
        </AlertDescription>
        <AlertActions>
          <AlertLink href="#">Renew now</AlertLink>
          <AlertLink href="#" icon={<ArrowRight />} trailingIcon>Learn more</AlertLink>
        </AlertActions>
      </Alert>

      {/* Without Icon */}
      <Alert variant="info" showIcon={false}>
        <AlertTitle>No Icon</AlertTitle>
        <AlertDescription>
          This alert has no icon displayed.
        </AlertDescription>
      </Alert>
    </div>
  )
}

export default function AlertPage() {
  return (
    <ComponentPageLayout meta={meta}>
      <AlertExample />
    </ComponentPageLayout>
  )
}
