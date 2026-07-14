import { Switch } from "@/components/ui/switch"
import { ComponentPageLayout } from "@/components/component-page-layout"
import { registryMetadata } from "@/lib/registry-metadata"

// Added dynamic export for force-dynamic rendering
export const dynamic = "force-dynamic"

export const meta = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "switch",
  type: "registry:ui",
  title: "Switch",
  description: "A control that allows the user to toggle between checked and not checked. Based on old Switch component.",
  ...registryMetadata["switch"],
  dependencies: [
    "@radix-ui/react-switch",
    "class-variance-authority",
  ],
  files: [
    {
      path: "ui/switch.tsx",
      type: "registry:ui",
    },
  ],
}

export default function SwitchPage() {
  return (
    <ComponentPageLayout meta={meta} title="Switch" description="Based on old Switch component with sizes and built-in label support.">
      <div className="space-y-12">
        {/* Default Size */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Default Size (40x24px)</h3>
          <div className="space-y-4">
            <Switch label="Airplane Mode" />
            <Switch label="Notifications" defaultChecked />
            <Switch label="Disabled unchecked" disabled />
            <Switch label="Disabled checked" disabled defaultChecked />
          </div>
        </section>

        {/* Small Size */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Small Size (28x16px)</h3>
          <div className="space-y-4">
            <Switch size="small" label="Compact mode" />
            <Switch size="small" label="Auto-save" defaultChecked />
            <Switch size="small" label="Disabled" disabled />
          </div>
        </section>

        {/* Label Position */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Label Position</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Label on right (default)</p>
              <Switch label="Dark Mode" labelPosition="right" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Label on left</p>
              <Switch label="Dark Mode" labelPosition="left" />
            </div>
          </div>
        </section>

        {/* Without Label */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Without Label</h3>
          <div className="flex gap-4 items-center">
            <Switch />
            <Switch defaultChecked />
            <Switch size="small" />
            <Switch size="small" defaultChecked />
          </div>
        </section>

        {/* States */}
        <section>
          <h3 className="text-lg font-semibold mb-4">All States</h3>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-sm font-medium">Default Size</p>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <Switch />
                  <span className="text-sm text-muted-foreground">Unchecked</span>
                </div>
                <div className="flex items-center gap-4">
                  <Switch defaultChecked />
                  <span className="text-sm text-muted-foreground">Checked</span>
                </div>
                <div className="flex items-center gap-4">
                  <Switch disabled />
                  <span className="text-sm text-muted-foreground">Disabled Unchecked</span>
                </div>
                <div className="flex items-center gap-4">
                  <Switch disabled defaultChecked />
                  <span className="text-sm text-muted-foreground">Disabled Checked</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-sm font-medium">Small Size</p>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <Switch size="small" />
                  <span className="text-sm text-muted-foreground">Unchecked</span>
                </div>
                <div className="flex items-center gap-4">
                  <Switch size="small" defaultChecked />
                  <span className="text-sm text-muted-foreground">Checked</span>
                </div>
                <div className="flex items-center gap-4">
                  <Switch size="small" disabled />
                  <span className="text-sm text-muted-foreground">Disabled Unchecked</span>
                </div>
                <div className="flex items-center gap-4">
                  <Switch size="small" disabled defaultChecked />
                  <span className="text-sm text-muted-foreground">Disabled Checked</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Size Comparison */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Size Comparison</h3>
          <div className="flex items-center gap-8">
            <div className="text-center">
              <Switch defaultChecked />
              <p className="text-xs text-muted-foreground mt-2">Default (40x24)</p>
            </div>
            <div className="text-center">
              <Switch size="small" defaultChecked />
              <p className="text-xs text-muted-foreground mt-2">Small (28x16)</p>
            </div>
          </div>
        </section>
      </div>
    </ComponentPageLayout>
  )
}
