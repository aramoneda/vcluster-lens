import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ComponentPageLayout } from "@/components/component-page-layout"
import { registryMetadata } from "@/lib/registry-metadata"

// Added dynamic export for force-dynamic rendering
export const dynamic = "force-dynamic"

export const meta = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "radio-group",
  type: "registry:ui",
  title: "Radio Group",
  description: "A set of checkable buttons—known as radio buttons—where no more than one can be checked at a time. Based on old Radio component.",
  ...registryMetadata["radio-group"],
  dependencies: [
    "@radix-ui/react-radio-group",
    "class-variance-authority",
  ],
  files: [
    {
      path: "ui/radio-group.tsx",
      type: "registry:ui",
    },
  ],
}

export default function RadioGroupPage() {
  return (
    <ComponentPageLayout meta={meta} title="Radio Group" description="Based on old Radio component with sizes, labels, and supporting text.">
      <div className="space-y-12">
        {/* Default Size with Labels */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Default Size (24px)</h3>
          <RadioGroup defaultValue="option1" size="default">
            <RadioGroupItem value="option1" label="Option 1" />
            <RadioGroupItem value="option2" label="Option 2" />
            <RadioGroupItem value="option3" label="Option 3" />
          </RadioGroup>
        </section>

        {/* Small Size with Labels */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Small Size (18px)</h3>
          <RadioGroup defaultValue="small1" size="sm">
            <RadioGroupItem value="small1" label="Small Option 1" />
            <RadioGroupItem value="small2" label="Small Option 2" />
            <RadioGroupItem value="small3" label="Small Option 3" />
          </RadioGroup>
        </section>

        {/* With Supporting Text */}
        <section>
          <h3 className="text-lg font-semibold mb-4">With Supporting Text</h3>
          <RadioGroup defaultValue="plan1" size="default">
            <RadioGroupItem
              value="plan1"
              label="Basic Plan"
              supportingText="Perfect for individuals getting started"
            />
            <RadioGroupItem
              value="plan2"
              label="Pro Plan"
              supportingText="Best for growing teams and businesses"
            />
            <RadioGroupItem
              value="plan3"
              label="Enterprise"
              supportingText="Advanced features for large organizations"
            />
          </RadioGroup>
        </section>

        {/* Horizontal Orientation */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Horizontal Orientation</h3>
          <RadioGroup defaultValue="h1" orientation="horizontal">
            <RadioGroupItem value="h1" label="Left" />
            <RadioGroupItem value="h2" label="Center" />
            <RadioGroupItem value="h3" label="Right" />
          </RadioGroup>
        </section>

        {/* With Disabled Items */}
        <section>
          <h3 className="text-lg font-semibold mb-4">With Disabled Items</h3>
          <RadioGroup defaultValue="d1">
            <RadioGroupItem value="d1" label="Available option" />
            <RadioGroupItem value="d2" label="Disabled option" disabled />
            <RadioGroupItem value="d3" label="Another available option" />
          </RadioGroup>
        </section>

        {/* Without Labels */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Without Labels</h3>
          <div className="flex gap-8">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Default (24px)</p>
              <RadioGroup defaultValue="nl1" orientation="horizontal" className="gap-4">
                <RadioGroupItem value="nl1" />
                <RadioGroupItem value="nl2" />
                <RadioGroupItem value="nl3" />
              </RadioGroup>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Small (18px)</p>
              <RadioGroup defaultValue="nls1" orientation="horizontal" size="sm" className="gap-4">
                <RadioGroupItem value="nls1" />
                <RadioGroupItem value="nls2" />
                <RadioGroupItem value="nls3" />
              </RadioGroup>
            </div>
          </div>
        </section>

        {/* All States */}
        <section>
          <h3 className="text-lg font-semibold mb-4">All States</h3>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-sm font-medium">Default Size (24px)</p>
              <RadioGroup defaultValue="checked">
                <RadioGroupItem value="unchecked" label="Unchecked" />
                <RadioGroupItem value="checked" label="Checked" />
                <RadioGroupItem value="disabled-unchecked" label="Disabled Unchecked" disabled />
              </RadioGroup>
              <RadioGroup defaultValue="disabled-checked">
                <RadioGroupItem value="disabled-checked" label="Disabled Checked" disabled />
              </RadioGroup>
            </div>
            <div className="space-y-4">
              <p className="text-sm font-medium">Small Size (18px)</p>
              <RadioGroup defaultValue="checked-sm" size="sm">
                <RadioGroupItem value="unchecked-sm" label="Unchecked" />
                <RadioGroupItem value="checked-sm" label="Checked" />
                <RadioGroupItem value="disabled-unchecked-sm" label="Disabled Unchecked" disabled />
              </RadioGroup>
              <RadioGroup defaultValue="disabled-checked-sm" size="sm">
                <RadioGroupItem value="disabled-checked-sm" label="Disabled Checked" disabled />
              </RadioGroup>
            </div>
          </div>
        </section>

        {/* Size Comparison */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Size Comparison</h3>
          <div className="flex items-start gap-12">
            <div>
              <RadioGroup defaultValue="size-default" size="default">
                <RadioGroupItem value="size-default" label="Default (24px)" supportingText="Larger touch target" />
              </RadioGroup>
            </div>
            <div>
              <RadioGroup defaultValue="size-sm" size="sm">
                <RadioGroupItem value="size-sm" label="Small (18px)" supportingText="Compact layout" />
              </RadioGroup>
            </div>
          </div>
        </section>
      </div>
    </ComponentPageLayout>
  )
}
