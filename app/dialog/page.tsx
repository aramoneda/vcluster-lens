"use client"

import { ComponentPageLayout } from "@/components/component-page-layout"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { registryMetadata } from "@/lib/registry-metadata"

export const dynamic = "force-dynamic"

export const meta = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "dialog",
  type: "registry:ui",
  title: "Dialog",
  description: "Modal dialog with sizes xs/sm/md/lg/fluid, built-in header/footer, and action buttons. Based on old Modal component.",
  ...registryMetadata["dialog"],
  files: [
    {
      path: "ui/dialog.tsx",
      type: "registry:ui",
    },
  ],
  dependencies: [
    "@radix-ui/react-dialog",
    "class-variance-authority",
    "lucide-react",
  ],
}

export default function DialogPage() {
  return (
    <ComponentPageLayout meta={meta} title="Dialog" description="Based on old Modal with sizes xs/sm/md/lg/fluid, built-in header with title/close, body, and footer with action buttons.">
      <div className="space-y-12">
        {/* Size XS (Default) */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Size XS (500px) - Default</h3>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open XS Dialog</Button>
            </DialogTrigger>
            <DialogContent
              size="xs"
              titleText="Extra Small Dialog"
              descriptionText="This is an extra small modal with a max width of 500px."
              onPrimaryAction={() => console.log("Primary clicked")}
              onSecondaryAction={() => console.log("Secondary clicked")}
            >
              <div className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name-xs" className="text-right">Name</Label>
                  <Input id="name-xs" defaultValue="John Doe" className="col-span-3" />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </section>

        {/* Size Fluid */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Size Fluid</h3>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open Fluid Dialog</Button>
            </DialogTrigger>
            <DialogContent
              size="fluid"
              className="w-[calc(100vw-48px)] max-w-[1200px] max-h-[calc(100dvh-48px)] md:w-[calc(100vw-96px)] md:max-h-[calc(100dvh-96px)]"
              titleText="Fluid Dialog"
              descriptionText="Use fluid when the caller should own responsive width and viewport gutters."
              hideFooter
            >
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fluid-company">Company</Label>
                    <Input id="fluid-company" defaultValue="Acme Corp" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="fluid-department">Department</Label>
                    <Input id="fluid-department" defaultValue="Engineering" className="mt-1" />
                  </div>
                </div>
                <div className="rounded-[var(--radius-xs)] border border-dashed border-[var(--color-stroke-default)] p-6 text-sm text-[var(--color-text-secondary)]">
                  Responsive content can fill the available dialog shell without relying on fixed `lg` sizing.
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </section>

        {/* Size SM */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Size SM (594px)</h3>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open SM Dialog</Button>
            </DialogTrigger>
            <DialogContent
              size="sm"
              titleText="Small Dialog"
              descriptionText="This is a small modal with a width of 594px."
              onPrimaryAction={() => console.log("Primary clicked")}
              onSecondaryAction={() => console.log("Secondary clicked")}
            >
              <div className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name-sm" className="text-right">Name</Label>
                  <Input id="name-sm" defaultValue="John Doe" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email-sm" className="text-right">Email</Label>
                  <Input id="email-sm" defaultValue="john@example.com" className="col-span-3" />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </section>

        {/* Size MD */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Size MD (882px)</h3>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open MD Dialog</Button>
            </DialogTrigger>
            <DialogContent
              size="md"
              titleText="Medium Dialog"
              descriptionText="This is a medium modal with a width of 882px, suitable for more complex forms."
              onPrimaryAction={() => console.log("Primary clicked")}
              onSecondaryAction={() => console.log("Secondary clicked")}
            >
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="first-name">First Name</Label>
                    <Input id="first-name" defaultValue="John" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="email-md">Email</Label>
                    <Input id="email-md" defaultValue="john@example.com" className="mt-1" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input id="last-name" defaultValue="Doe" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" defaultValue="+1 234 567 890" className="mt-1" />
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </section>

        {/* Size LG */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Size LG (1172px)</h3>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open LG Dialog</Button>
            </DialogTrigger>
            <DialogContent
              size="lg"
              titleText="Large Dialog"
              descriptionText="This is a large modal with a width of 1172px, ideal for complex workflows or data tables."
              onPrimaryAction={() => console.log("Primary clicked")}
              onSecondaryAction={() => console.log("Secondary clicked")}
            >
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" defaultValue="Acme Corp" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input id="department" defaultValue="Engineering" className="mt-1" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" defaultValue="Senior Developer" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="team">Team</Label>
                    <Input id="team" defaultValue="Platform" className="mt-1" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" defaultValue="San Francisco" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input id="start-date" defaultValue="2023-01-15" className="mt-1" />
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </section>

        {/* Custom Footer */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Custom Footer Content</h3>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open with Custom Footer</Button>
            </DialogTrigger>
            <DialogContent
              size="xs"
              titleText="Custom Footer"
              descriptionText="This dialog has a custom footer with different buttons."
              footerContent={
                <div className="flex gap-2 w-full justify-between">
                  <Button variant="destructive">Delete</Button>
                  <div className="flex gap-2">
                    <Button variant="secondary">Cancel</Button>
                    <Button>Save</Button>
                  </div>
                </div>
              }
            >
              <p className="text-sm text-muted-foreground">
                You can provide custom footer content using the footerContent prop.
              </p>
            </DialogContent>
          </Dialog>
        </section>

        {/* No Footer */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Hidden Footer</h3>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open without Footer</Button>
            </DialogTrigger>
            <DialogContent
              size="xs"
              titleText="No Footer"
              descriptionText="This dialog hides the footer section entirely."
              hideFooter
            >
              <p className="text-sm text-muted-foreground">
                Use hideFooter=true when you don't need action buttons.
              </p>
            </DialogContent>
          </Dialog>
        </section>

        {/* No Close Button */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Hidden Close Button</h3>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open without Close Button</Button>
            </DialogTrigger>
            <DialogContent
              size="xs"
              titleText="No Close Button"
              descriptionText="This dialog hides the X close button. User must use footer actions."
              hideCloseButton
              onPrimaryAction={() => console.log("Primary clicked")}
              onSecondaryAction={() => console.log("Secondary clicked")}
            >
              <p className="text-sm text-muted-foreground">
                Use hideCloseButton=true to force users to make a choice.
              </p>
            </DialogContent>
          </Dialog>
        </section>
      </div>
    </ComponentPageLayout>
  )
}
