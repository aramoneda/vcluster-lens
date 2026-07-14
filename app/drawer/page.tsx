"use client"

import { useState } from "react"
import { ComponentPageLayout } from "@/components/component-page-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { registryMetadata } from "@/lib/registry-metadata"

export const dynamic = "force-dynamic"

export const meta = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "drawer",
  type: "registry:ui",
  title: "Drawer",
  description: "A panel that slides in from the edge of the screen. Opens from right by default with built-in header and footer.",
  ...registryMetadata["drawer"],
  files: [
    {
      path: "ui/drawer.tsx",
      type: "registry:ui",
    },
  ],
  dependencies: [
    "lucide-react",
    "vaul",
  ],
  registryDependencies: ["icon-button"],
}

export default function DrawerPage() {
  const [step, setStep] = useState(1)

  return (
    <ComponentPageLayout meta={meta} title="Drawer" description="A panel that slides in from the edge of the screen. Opens from right by default with built-in header and footer.">
      <div className="space-y-12">
        {/* Basic Drawer */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Basic Drawer</h3>
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline">Open Drawer</Button>
            </DrawerTrigger>
            <DrawerContent headerTitle="Drawer Title">
              <p className="text-sm text-[var(--color-text-secondary)]">
                This is a basic drawer with a header title and close button.
              </p>
            </DrawerContent>
          </Drawer>
        </section>

        {/* Horizontal Drawer (slides from bottom) */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Horizontal (Bottom)</h3>
          <Drawer variant="horizontal">
            <DrawerTrigger asChild>
              <Button variant="outline">Open Bottom Drawer</Button>
            </DrawerTrigger>
            <DrawerContent
              headerTitle="Quick Filters"
              footerContent={
                <>
                  <DrawerClose asChild>
                    <Button variant="secondary">Reset</Button>
                  </DrawerClose>
                  <DrawerClose asChild>
                    <Button>Apply</Button>
                  </DrawerClose>
                </>
              }
            >
              <p className="text-sm text-[var(--color-text-secondary)]">
                This horizontal variant slides up from the bottom of the viewport
                and is capped at a 450px max height, with a subtle elevation shadow.
              </p>
            </DrawerContent>
          </Drawer>
        </section>

        {/* Drawer with Footer */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Drawer with Footer</h3>
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline">Open with Footer</Button>
            </DrawerTrigger>
            <DrawerContent
              headerTitle="Edit Profile"
              footerContent={
                <>
                  <DrawerClose asChild>
                    <Button variant="secondary">Cancel</Button>
                  </DrawerClose>
                  <Button>Save Changes</Button>
                </>
              }
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="john@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Input id="bio" defaultValue="Software developer" />
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </section>

        {/* Drawer with Back Button */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Drawer with Back Button (Multi-Step)</h3>
          <Drawer onOpenChange={(open) => !open && setStep(1)}>
            <DrawerTrigger asChild>
              <Button variant="outline">Open Multi-Step Drawer</Button>
            </DrawerTrigger>
            <DrawerContent
              headerTitle={step === 1 ? "Step 1: Account" : "Step 2: Preferences"}
              onBack={step > 1 ? () => setStep(step - 1) : undefined}
              footerContent={
                <>
                  <DrawerClose asChild>
                    <Button variant="secondary">Cancel</Button>
                  </DrawerClose>
                  {step === 1 ? (
                    <Button onClick={() => setStep(2)}>Next</Button>
                  ) : (
                    <Button>Finish</Button>
                  )}
                </>
              }
            >
              {step === 1 ? (
                <div className="space-y-4">
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Enter your account information.
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" placeholder="johndoe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" placeholder="••••••••" />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Configure your preferences.
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Input id="theme" placeholder="Light / Dark" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lang">Language</Label>
                    <Input id="lang" placeholder="English" />
                  </div>
                </div>
              )}
            </DrawerContent>
          </Drawer>
        </section>

        {/* Drawer without Close Button */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Hidden Close Button</h3>
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline">No Close Button</Button>
            </DrawerTrigger>
            <DrawerContent
              headerTitle="Custom Header"
              hideCloseButton
              footerContent={
                <DrawerClose asChild>
                  <Button>Close via Footer</Button>
                </DrawerClose>
              }
            >
              <p className="text-sm text-[var(--color-text-secondary)]">
                This drawer has no close button in the header. Use the footer button or click outside to close.
              </p>
            </DrawerContent>
          </Drawer>
        </section>

        {/* Drawer with Description */}
        <section>
          <h3 className="text-lg font-semibold mb-4">With Description</h3>
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline">Open with Description</Button>
            </DrawerTrigger>
            <DrawerContent headerTitle="Settings">
              <div className="space-y-4">
                <DrawerDescription>
                  Manage your account settings and preferences here.
                </DrawerDescription>
                <div className="space-y-2">
                  <Label htmlFor="notifications">Notifications</Label>
                  <Input id="notifications" placeholder="Email, Push, SMS" />
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </section>

        {/* Long Content (Scrollable) */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Scrollable Content</h3>
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline">Long Content</Button>
            </DrawerTrigger>
            <DrawerContent
              headerTitle="Terms of Service"
              footerContent={
                <>
                  <DrawerClose asChild>
                    <Button variant="secondary">Decline</Button>
                  </DrawerClose>
                  <Button>Accept</Button>
                </>
              }
            >
              <div className="space-y-4">
                {Array.from({ length: 20 }).map((_, i) => (
                  <p key={i} className="text-sm text-[var(--color-text-secondary)]">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                ))}
              </div>
            </DrawerContent>
          </Drawer>
        </section>
      </div>
    </ComponentPageLayout>
  )
}
