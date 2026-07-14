import { ComponentPageLayout } from "@/components/component-page-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { registryMetadata } from "@/lib/registry-metadata"

// Added dynamic export for force-dynamic rendering
export const dynamic = "force-dynamic"

// Added meta object to match the expected ComponentMeta interface
export const meta = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "sheet",
  type: "registry:ui",
  title: "Sheet",
  description: "Extends the Dialog component to display content that complements the main content of the screen.",
  ...registryMetadata["sheet"],
  files: [
    {
      path: "ui/sheet.tsx",
      type: "registry:ui",
    },
  ],
  dependencies: [
    "@radix-ui/react-dialog",
    "lucide-react",
  ],
}

// Extracted the sheet example into a separate component
function SheetExample() {
  return (
    <div className="space-y-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Open</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit profile</SheetTitle>
            <SheetDescription>Make changes to your profile here. Click save when you're done.</SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" defaultValue="Pedro Duarte" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input id="username" defaultValue="@peduarte" className="col-span-3" />
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit">Save changes</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default function SheetPage() {
  return (
    // Fixed: Now passing meta prop instead of title and description
    <ComponentPageLayout meta={meta}>
      <SheetExample />
    </ComponentPageLayout>
  )
}
