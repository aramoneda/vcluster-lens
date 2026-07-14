import { ComponentPageLayout } from "@/components/component-page-layout"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, SimpleTooltip } from "@/components/ui/tooltip"
import { HelpCircle, Info, Settings, Plus, Download } from "lucide-react"
import { registryMetadata } from "@/lib/registry-metadata"

// Added dynamic export for force-dynamic rendering
export const dynamic = "force-dynamic"

// Added meta export for tooltip component
export const meta = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "tooltip",
  type: "registry:ui",
  title: "Tooltip",
  description: "A small contextual hint displayed on hover or focus.",
  ...registryMetadata["tooltip"],
  dependencies: ["@radix-ui/react-tooltip"],
  files: [
    {
      path: "ui/tooltip.tsx",
      type: "registry:ui",
    },
  ],
}

export default function TooltipPage() {
  return (
    <ComponentPageLayout
      meta={meta}
      title="Tooltip"
      description="A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it."
    >
      <div className="space-y-12">
        {/* Basic Example */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Basic Tooltip</h3>
          <div className="flex gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Hover me</Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add to library</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </section>

        {/* Positions */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Positions</h3>
          <div className="flex flex-wrap gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Top</Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Tooltip on top</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Bottom</Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Tooltip on bottom</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Left</Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Tooltip on left</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Right</Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Tooltip on right</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </section>

        {/* Long Content */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Long Content (max-width: 250px)</h3>
          <div className="flex gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Long text</Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>This is a longer tooltip that will wrap to multiple lines when it exceeds the maximum width of 250 pixels.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </section>

        {/* With Icons */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Icon Buttons with Tooltips</h3>
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <HelpCircle className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Help</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Info className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>More information</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Settings className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Settings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Plus className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add new item</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Download className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </section>

        {/* SimpleTooltip (Old API) */}
        <section>
          <h3 className="text-lg font-semibold mb-4">SimpleTooltip (Old API)</h3>
          <p className="text-sm text-muted-foreground mb-4">
            A composite component that wraps trigger and content for simpler usage.
          </p>
          <div className="flex flex-wrap gap-4">
            <SimpleTooltip content="This is a simple tooltip">
              <Button variant="outline">Simple Tooltip</Button>
            </SimpleTooltip>

            <SimpleTooltip content="Positioned on the right side" side="right">
              <Button variant="outline">Right Position</Button>
            </SimpleTooltip>

            <SimpleTooltip
              content="This tooltip appears after a delay"
              delayDuration={500}
            >
              <Button variant="outline">With Delay (500ms)</Button>
            </SimpleTooltip>
          </div>
        </section>

        {/* Delay Duration */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Delay Duration</h3>
          <div className="flex flex-wrap gap-4">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">No delay</Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Instant (0ms)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">300ms delay</Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delayed (300ms)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider delayDuration={700}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">700ms delay</Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Slow (700ms)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </section>
      </div>
    </ComponentPageLayout>
  )
}
