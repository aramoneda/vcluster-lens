"use client"

import { useState } from "react"
import { ComponentPageLayout } from "@/components/component-page-layout"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { registryMetadata } from "@/lib/registry-metadata"
import { User, Settings, CreditCard, LogOut, Mail, MessageSquare, PlusCircle, UserPlus, Cloud, LifeBuoy, Trash2 } from "lucide-react"

export const dynamic = "force-dynamic"

export const meta = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "dropdown-menu",
  type: "registry:ui",
  title: "Dropdown Menu",
  description: "A menu with items, checkboxes, radio groups, and submenus. Matches old DropdownMenu styling.",
  ...registryMetadata["dropdown-menu"],
  files: [
    {
      path: "ui/dropdown-menu.tsx",
      type: "registry:ui",
    },
  ],
  dependencies: [
    "@radix-ui/react-dropdown-menu",
    "lucide-react",
  ],
  registryDependencies: ["checkbox"],
}

export default function DropdownMenuPage() {
  const [showStatusBar, setShowStatusBar] = useState(true)
  const [showActivityBar, setShowActivityBar] = useState(false)
  const [showPanel, setShowPanel] = useState(false)
  const [position, setPosition] = useState("bottom")

  return (
    <ComponentPageLayout meta={meta} title="Dropdown Menu" description="A menu with items, checkboxes, radio groups, and submenus. Matches old DropdownMenu styling.">
      <div className="space-y-12">
        {/* Basic Menu */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Basic Menu</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Open Menu</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem leadingIcon={<User className="size-4" />}>
                Profile
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem leadingIcon={<CreditCard className="size-4" />}>
                Billing
                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem leadingIcon={<Settings className="size-4" />}>
                Settings
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem leadingIcon={<LogOut className="size-4" />}>
                Log out
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </section>

        {/* With Active State */}
        <section>
          <h3 className="text-lg font-semibold mb-4">With Active State</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Select View</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem isActive>Dashboard</DropdownMenuItem>
              <DropdownMenuItem>Analytics</DropdownMenuItem>
              <DropdownMenuItem>Reports</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </section>

        {/* Checkbox Items */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Checkbox Items</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">View Options</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Appearance</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={showStatusBar}
                onCheckedChange={setShowStatusBar}
              >
                Status Bar
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={showActivityBar}
                onCheckedChange={setShowActivityBar}
              >
                Activity Bar
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={showPanel}
                onCheckedChange={setShowPanel}
              >
                Panel
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </section>

        {/* Radio Group */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Radio Group</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Panel Position</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
                <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </section>

        {/* With Submenus */}
        <section>
          <h3 className="text-lg font-semibold mb-4">With Submenus</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">More Options</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem leadingIcon={<User className="size-4" />}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem leadingIcon={<Settings className="size-4" />}>
                  Settings
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <UserPlus className="size-4 mr-2" />
                    Invite users
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem leadingIcon={<Mail className="size-4" />}>
                      Email
                    </DropdownMenuItem>
                    <DropdownMenuItem leadingIcon={<MessageSquare className="size-4" />}>
                      Message
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem leadingIcon={<PlusCircle className="size-4" />}>
                      More...
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem leadingIcon={<LifeBuoy className="size-4" />}>
                Support
              </DropdownMenuItem>
              <DropdownMenuItem leadingIcon={<Cloud className="size-4" />} disabled>
                API (disabled)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </section>

        {/* Destructive Items */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Destructive Items</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" leadingIcon={<Trash2 className="size-4" />}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </section>

        {/* Position Variants */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Position Variants</h3>
          <div className="flex gap-4 flex-wrap">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Bottom Left</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent position="bottom-left">
                <DropdownMenuItem>Item 1</DropdownMenuItem>
                <DropdownMenuItem>Item 2</DropdownMenuItem>
                <DropdownMenuItem>Item 3</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Bottom Right</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent position="bottom-right">
                <DropdownMenuItem>Item 1</DropdownMenuItem>
                <DropdownMenuItem>Item 2</DropdownMenuItem>
                <DropdownMenuItem>Item 3</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Top Left</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent position="top-left">
                <DropdownMenuItem>Item 1</DropdownMenuItem>
                <DropdownMenuItem>Item 2</DropdownMenuItem>
                <DropdownMenuItem>Item 3</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </section>
      </div>
    </ComponentPageLayout>
  )
}
