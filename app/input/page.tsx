"use client"

import { Input, InputField } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ComponentPageLayout } from "@/components/component-page-layout"
import { Search, Eye, Mail, Lock } from "lucide-react"
import { registryMetadata } from "@/lib/registry-metadata"

export const dynamic = "force-dynamic"

export const meta = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "input",
  type: "registry:ui",
  title: "Input",
  description: "A form input field. Simple Input for basic use, InputField for forms with label/icons/feedback.",
  ...registryMetadata["input"],
  dependencies: [
    "class-variance-authority",
    "lucide-react",
  ],
  files: [
    {
      path: "ui/input.tsx",
      type: "registry:ui",
    },
  ],
  registryDependencies: ["label"],
}

export default function InputPage() {
  return (
    <ComponentPageLayout meta={meta} title="Input" description="A form input field. Simple Input for basic use, InputField for forms with label/icons/feedback.">
      <div className="space-y-12 max-w-md">
        {/* Simple Input */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Simple Input</h3>
          <p className="text-sm text-[var(--color-text-secondary)] mb-4">
            Basic input element with default styling. Use with external Label.
          </p>
          <div className="space-y-4">
            <div>
              <Label htmlFor="simple-email">Email</Label>
              <Input id="simple-email" type="email" placeholder="Enter your email" />
            </div>
            <div>
              <Label htmlFor="simple-password">Password</Label>
              <Input id="simple-password" type="password" placeholder="Enter password" />
            </div>
            <Input placeholder="Disabled" disabled />
          </div>
        </section>

        {/* Sizes */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Sizes</h3>
          <p className="text-sm text-[var(--color-text-secondary)] mb-4">
            {"Default is 36px tall. The xs variant is 24px tall for dense layouts."}
          </p>
          <div className="space-y-4">
            <InputField label="Default (36px)" placeholder="Default size" />
            <InputField label="Extra small (24px)" placeholder="xs size" inputSize="xs" />
            <InputField label="xs with icon" placeholder="Search..." leftIcon={Search} inputSize="xs" />
            <Input placeholder="Bare input xs" inputSize="xs" />
          </div>
        </section>

        {/* InputField - Basic */}
        <section>
          <h3 className="text-lg font-semibold mb-4">InputField (with built-in label)</h3>
          <p className="text-sm text-[var(--color-text-secondary)] mb-4">
            Enhanced input with built-in label, icons, and feedback support.
          </p>
          <div className="space-y-4">
            <InputField label="Email" type="email" placeholder="Enter your email" />
            <InputField label="Password" type="password" placeholder="Enter password" />
          </div>
        </section>

        {/* Required */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Required Field</h3>
          <InputField label="Username" placeholder="Enter username" required />
        </section>

        {/* With Icons */}
        <section>
          <h3 className="text-lg font-semibold mb-4">With Icons</h3>
          <div className="space-y-4">
            <InputField
              label="Search"
              placeholder="Search..."
              leftIcon={Search}
            />
            <InputField
              label="Password"
              type="password"
              placeholder="Enter password"
              leftIcon={Lock}
              icon={Eye}
              onIconClick={() => alert('Toggle password visibility')}
            />
            <InputField
              label="Email"
              type="email"
              placeholder="Enter email"
              icon={Mail}
            />
          </div>
        </section>

        {/* Feedback Types */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Feedback Types</h3>
          <div className="space-y-4">
            <InputField
              label="Error State"
              placeholder="Invalid input"
              isInvalid
              errorMessage="This field is required"
            />
            <InputField
              label="Success"
              placeholder="Valid input"
              defaultValue="john@example.com"
              feedback={{ message: "Email is available", type: "success" }}
            />
            <InputField
              label="Warning"
              placeholder="Careful input"
              defaultValue="weak"
              feedback={{ message: "Password is too weak", type: "warning" }}
            />
            <InputField
              label="Info"
              placeholder="Informational"
              feedback={{ message: "Username must be 3-20 characters", type: "info" }}
            />
          </div>
        </section>

        {/* Variants */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Variants</h3>
          <div className="space-y-4">
            <InputField
              label="Primary (default)"
              placeholder="Primary variant"
              variant="primary"
            />
            <InputField
              label="Secondary"
              placeholder="Secondary variant"
              variant="secondary"
            />
          </div>
        </section>

        {/* States */}
        <section>
          <h3 className="text-lg font-semibold mb-4">States</h3>
          <div className="space-y-4">
            <InputField
              label="Disabled"
              placeholder="Disabled input"
              disabled
            />
            <InputField
              label="Read Only"
              defaultValue="Read only value"
              readOnly
            />
          </div>
        </section>

        {/* Label Position */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Label Position</h3>
          <div className="space-y-4">
            <InputField
              label="Top Label (default)"
              placeholder="Label above"
              labelPosition="top"
            />
            <InputField
              label="Left Label"
              placeholder="Label to the left"
              labelPosition="left"
            />
          </div>
        </section>

        {/* With Label Info */}
        <section>
          <h3 className="text-lg font-semibold mb-4">With Label Info</h3>
          <InputField
            label="API Key"
            placeholder="Enter API key"
            labelInfo="This is your secret API key"
            required
          />
        </section>

        {/* Input Types */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Input Types</h3>
          <div className="space-y-4">
            <InputField label="Text" type="text" placeholder="Text input" />
            <InputField label="Number" type="number" placeholder="0" min={0} max={100} />
            <InputField label="Date" type="date" />
            <InputField label="Time" type="time" />
          </div>
        </section>
      </div>
    </ComponentPageLayout>
  )
}
