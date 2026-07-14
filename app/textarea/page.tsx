import { Textarea, TextareaField } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ComponentPageLayout } from "@/components/component-page-layout"
import { MessageSquare } from "lucide-react"
import { registryMetadata } from "@/lib/registry-metadata"

export const dynamic = "force-dynamic"

export const meta = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "textarea",
  type: "registry:ui",
  title: "Textarea",
  description: "A multi-line text input. Simple Textarea for basic use, TextareaField for forms with label/icons/feedback.",
  ...registryMetadata["textarea"],
  dependencies: ["lucide-react"],
  files: [
    {
      path: "ui/textarea.tsx",
      type: "registry:ui",
    },
  ],
  registryDependencies: ["input", "label"],
}

export default function TextareaPage() {
  return (
    <ComponentPageLayout meta={meta} title="Textarea" description="A multi-line text input. Simple Textarea for basic use, TextareaField for forms with label/icons/feedback.">
      <div className="space-y-12 max-w-md">
        {/* Simple Textarea */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Simple Textarea</h3>
          <p className="text-sm text-[var(--color-text-secondary)] mb-4">
            Basic textarea element with default styling. Use with external Label.
          </p>
          <div className="space-y-4">
            <div>
              <Label htmlFor="simple-message">Your message</Label>
              <Textarea id="simple-message" placeholder="Type your message here..." />
            </div>
            <Textarea placeholder="Disabled" disabled />
          </div>
        </section>

        {/* TextareaField - Basic */}
        <section>
          <h3 className="text-lg font-semibold mb-4">TextareaField (with built-in label)</h3>
          <p className="text-sm text-[var(--color-text-secondary)] mb-4">
            Enhanced textarea with built-in label, icons, and feedback support.
          </p>
          <TextareaField label="Message" placeholder="Type your message here..." />
        </section>

        {/* Required */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Required Field</h3>
          <TextareaField label="Description" placeholder="Enter description" required />
        </section>

        {/* With Icon */}
        <section>
          <h3 className="text-lg font-semibold mb-4">With Icon</h3>
          <TextareaField
            label="Comment"
            placeholder="Leave a comment..."
            leftIcon={MessageSquare}
          />
        </section>

        {/* Feedback Types */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Feedback Types</h3>
          <div className="space-y-4">
            <TextareaField
              label="Error State"
              placeholder="Invalid input"
              isInvalid
              errorMessage="Description is required"
            />
            <TextareaField
              label="Success"
              defaultValue="This is a valid description that meets all requirements."
              feedback={{ message: "Description looks good!", type: "success" }}
            />
            <TextareaField
              label="Warning"
              defaultValue="Short"
              feedback={{ message: "Description is too short", type: "warning" }}
            />
            <TextareaField
              label="Info"
              placeholder="Enter notes..."
              feedback={{ message: "Maximum 500 characters", type: "info" }}
            />
          </div>
        </section>

        {/* Variants */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Variants</h3>
          <div className="space-y-4">
            <TextareaField
              label="Primary (default)"
              placeholder="Primary variant"
              variant="primary"
            />
            <TextareaField
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
            <TextareaField
              label="Disabled"
              placeholder="Disabled textarea"
              disabled
            />
            <TextareaField
              label="Read Only"
              defaultValue="This content cannot be edited."
              readOnly
            />
          </div>
        </section>

        {/* Different Row Counts */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Row Counts</h3>
          <div className="space-y-4">
            <TextareaField
              label="2 Rows"
              placeholder="Smaller textarea"
              rows={2}
            />
            <TextareaField
              label="5 Rows"
              placeholder="Larger textarea"
              rows={5}
            />
          </div>
        </section>

        {/* Label Position */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Label Position</h3>
          <div className="space-y-4">
            <TextareaField
              label="Top Label"
              placeholder="Label above"
              labelPosition="top"
            />
            <TextareaField
              label="Left Label"
              placeholder="Label to the left"
              labelPosition="left"
            />
          </div>
        </section>
      </div>
    </ComponentPageLayout>
  )
}
