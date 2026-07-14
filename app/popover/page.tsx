import { ComponentPageLayout } from "@/components/component-page-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger, PopoverClose } from "@/components/ui/popover"
import { X } from "lucide-react"
import { registryMetadata } from "@/lib/registry-metadata"

// Added dynamic export for force-dynamic rendering
export const dynamic = "force-dynamic"

// Added meta export for registry
export const meta = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "popover",
  type: "registry:ui",
  title: "Popover",
  description: "Displays rich content in a portal, triggered by a button. Based on old Popover component.",
  ...registryMetadata["popover"],
  files: [
    {
      path: "ui/popover.tsx",
      type: "registry:ui",
    },
  ],
  dependencies: [
    "@radix-ui/react-popover",
    "class-variance-authority",
  ],
}

export default function PopoverPage() {
  return (
    <ComponentPageLayout meta={meta} title="Popover" description="Based on old Popover component with M, S, and XS size variants.">
      <div className="space-y-12">
        {/* Size M (Default) */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Size M (Default - 24px padding)</h3>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Open Size M</Button>
            </PopoverTrigger>
            <PopoverContent size="M" className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Dimensions</h4>
                  <p className="text-sm text-muted-foreground">Set the dimensions for the layer.</p>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="width-m">Width</Label>
                    <Input id="width-m" defaultValue="100%" className="col-span-2 h-8" />
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="height-m">Height</Label>
                    <Input id="height-m" defaultValue="25px" className="col-span-2 h-8" />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </section>

        {/* Size S */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Size S (16px padding)</h3>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Open Size S</Button>
            </PopoverTrigger>
            <PopoverContent size="S" className="w-72">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Settings</h4>
                <p className="text-sm text-muted-foreground">
                  Adjust your preferences here. The smaller size is great for compact content.
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </section>

        {/* Size XS */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Size XS (12px padding)</h3>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Open Size XS</Button>
            </PopoverTrigger>
            <PopoverContent size="XS" className="w-64">
              <p className="text-sm">
                Extra small popover for quick info or tooltips.
              </p>
            </PopoverContent>
          </Popover>
        </section>

        {/* With Close Button */}
        <section>
          <h3 className="text-lg font-semibold mb-4">With Close Button</h3>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Open with Close</Button>
            </PopoverTrigger>
            <PopoverContent size="M" className="w-80 relative">
              <PopoverClose className="absolute top-3 right-3 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </PopoverClose>
              <div className="space-y-2 pr-6">
                <h4 className="font-medium leading-none">Notification</h4>
                <p className="text-sm text-muted-foreground">
                  You have a new message. Click the X to dismiss this popover.
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </section>

        {/* Positioning */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Positioning</h3>
          <div className="flex flex-wrap gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="secondary">Top</Button>
              </PopoverTrigger>
              <PopoverContent side="top" size="XS">
                <p className="text-sm">Positioned on top</p>
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="secondary">Bottom</Button>
              </PopoverTrigger>
              <PopoverContent side="bottom" size="XS">
                <p className="text-sm">Positioned on bottom</p>
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="secondary">Left</Button>
              </PopoverTrigger>
              <PopoverContent side="left" size="XS">
                <p className="text-sm">Positioned on left</p>
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="secondary">Right</Button>
              </PopoverTrigger>
              <PopoverContent side="right" size="XS">
                <p className="text-sm">Positioned on right</p>
              </PopoverContent>
            </Popover>
          </div>
        </section>

        {/* Alignment */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Alignment</h3>
          <div className="flex flex-wrap gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="secondary">Align Start</Button>
              </PopoverTrigger>
              <PopoverContent align="start" size="S">
                <p className="text-sm">Aligned to start</p>
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="secondary">Align Center</Button>
              </PopoverTrigger>
              <PopoverContent align="center" size="S">
                <p className="text-sm">Aligned to center (default)</p>
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="secondary">Align End</Button>
              </PopoverTrigger>
              <PopoverContent align="end" size="S">
                <p className="text-sm">Aligned to end</p>
              </PopoverContent>
            </Popover>
          </div>
        </section>

        {/* Size Comparison */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Size Comparison</h3>
          <div className="flex gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">M (24px)</Button>
              </PopoverTrigger>
              <PopoverContent size="M">
                <p className="text-sm">Size M with 24px padding</p>
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">S (16px)</Button>
              </PopoverTrigger>
              <PopoverContent size="S">
                <p className="text-sm">Size S with 16px padding</p>
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">XS (12px)</Button>
              </PopoverTrigger>
              <PopoverContent size="XS">
                <p className="text-sm">Size XS with 12px padding</p>
              </PopoverContent>
            </Popover>
          </div>
        </section>
      </div>
    </ComponentPageLayout>
  )
}
