import { ComponentPageLayout } from "@/components/component-page-layout"
import { CalendarDays, Info, User, Settings } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { registryMetadata } from "@/lib/registry-metadata"

// Added dynamic export for force-dynamic rendering
export const dynamic = "force-dynamic"

// Added meta export for registry
export const meta = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "hover-card",
  type: "registry:ui",
  title: "Hover Card",
  description: "For sighted users to preview content available behind a link. Matches old Popover styling with M/S/XS sizes.",
  ...registryMetadata["hover-card"],
  files: [
    {
      path: "ui/hover-card.tsx",
      type: "registry:ui",
    },
  ],
  dependencies: [
    "@radix-ui/react-hover-card",
    "class-variance-authority",
  ],
}

export default function HoverCardPage() {
  return (
    <ComponentPageLayout meta={meta} title="Hover Card" description="For sighted users to preview content available behind a link. Matches old Popover styling.">
      <div className="space-y-12">
        {/* Size M (default) */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Size M (default - 24px padding)</h3>
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="tertiary">@nextjs</Button>
            </HoverCardTrigger>
            <HoverCardContent size="m" className="w-80">
              <div className="flex justify-between space-x-4">
                <Avatar>
                  <AvatarImage src="https://github.com/vercel.png" />
                  <AvatarFallback>VC</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">@nextjs</h4>
                  <p className="text-sm">The React Framework – created and maintained by @vercel.</p>
                  <div className="flex items-center pt-2">
                    <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
                    <span className="text-xs text-[var(--color-text-secondary)]">Joined December 2021</span>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </section>

        {/* Size S */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Size S (16px padding)</h3>
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="secondary">
                <User className="w-4 h-4 mr-2" />
                User Profile
              </Button>
            </HoverCardTrigger>
            <HoverCardContent size="s" className="w-64">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">John Doe</h4>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Senior Developer at Acme Inc.
                </p>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  john.doe@example.com
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>
        </section>

        {/* Size XS */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Size XS (12px padding)</h3>
          <HoverCard>
            <HoverCardTrigger asChild>
              <span className="inline-flex items-center gap-1 text-sm cursor-help">
                <Info className="w-4 h-4 text-[var(--color-icon-brand)]" />
                What is this?
              </span>
            </HoverCardTrigger>
            <HoverCardContent size="xs" className="w-48">
              <p className="text-sm">
                This is a compact tooltip-like hover card with minimal padding.
              </p>
            </HoverCardContent>
          </HoverCard>
        </section>

        {/* Different alignments */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Alignment Options</h3>
          <div className="flex gap-8">
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="secondary">Align Start</Button>
              </HoverCardTrigger>
              <HoverCardContent align="start" size="s" className="w-48">
                <p className="text-sm">Aligned to the start of the trigger.</p>
              </HoverCardContent>
            </HoverCard>

            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="secondary">Align Center</Button>
              </HoverCardTrigger>
              <HoverCardContent align="center" size="s" className="w-48">
                <p className="text-sm">Aligned to the center of the trigger.</p>
              </HoverCardContent>
            </HoverCard>

            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="secondary">Align End</Button>
              </HoverCardTrigger>
              <HoverCardContent align="end" size="s" className="w-48">
                <p className="text-sm">Aligned to the end of the trigger.</p>
              </HoverCardContent>
            </HoverCard>
          </div>
        </section>

        {/* Side options */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Side Options</h3>
          <div className="flex gap-8 flex-wrap">
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="secondary">Side Bottom</Button>
              </HoverCardTrigger>
              <HoverCardContent side="bottom" size="xs" className="w-40">
                <p className="text-sm">Appears below</p>
              </HoverCardContent>
            </HoverCard>

            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="secondary">Side Top</Button>
              </HoverCardTrigger>
              <HoverCardContent side="top" size="xs" className="w-40">
                <p className="text-sm">Appears above</p>
              </HoverCardContent>
            </HoverCard>

            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="secondary">Side Right</Button>
              </HoverCardTrigger>
              <HoverCardContent side="right" size="xs" className="w-40">
                <p className="text-sm">Appears right</p>
              </HoverCardContent>
            </HoverCard>

            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="secondary">Side Left</Button>
              </HoverCardTrigger>
              <HoverCardContent side="left" size="xs" className="w-40">
                <p className="text-sm">Appears left</p>
              </HoverCardContent>
            </HoverCard>
          </div>
        </section>

        {/* Rich content */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Rich Content</h3>
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="secondary">
                <Settings className="w-4 h-4 mr-2" />
                Settings Info
              </Button>
            </HoverCardTrigger>
            <HoverCardContent size="m" className="w-80">
              <div className="space-y-3">
                <h4 className="text-base font-semibold">Account Settings</h4>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Manage your account preferences, security settings, and notification options.
                </p>
                <div className="flex gap-2 pt-2">
                  <Button size="sm">Open Settings</Button>
                  <Button size="sm" variant="secondary">Learn More</Button>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </section>
      </div>
    </ComponentPageLayout>
  )
}
