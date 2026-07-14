"use client"

import { ComponentPageLayout } from "@/components/component-page-layout"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { useState } from "react"
import { registryMetadata } from "@/lib/registry-metadata"

// Added dynamic export for force-dynamic rendering
export const dynamic = "force-dynamic"

// Added meta export for registry
export const meta = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "input-otp",
  type: "registry:ui",
  title: "Input OTP",
  description: "Accessible one-time password component with copy paste functionality.",
  ...registryMetadata["input-otp"],
  files: [
    {
      path: "ui/input-otp.tsx",
      type: "registry:ui",
    },
  ],
  dependencies: [
    "input-otp",
    "lucide-react",
  ],
}

function InputOTPExample() {
  const [value, setValue] = useState("")

  return (
    <div className="space-y-2">
      <InputOTP maxLength={6} value={value} onChange={(value) => setValue(value)}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <div className="text-center text-sm">
        {value === "" ? <>Enter your one-time password.</> : <>You entered: {value}</>}
      </div>
    </div>
  )
}

export default function InputOTPPage() {
  return (
    <ComponentPageLayout meta={meta}>
      <InputOTPExample />
    </ComponentPageLayout>
  )
}
