import { ComponentPageLayout } from "@/components/component-page-layout"
import { ButtonGroup, ButtonGroupItem } from "@/components/ui/button-group"
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  Grid,
  Rows,
  Settings,
  User,
  Bell
} from "lucide-react"
import { registryMetadata } from "@/lib/registry-metadata"

export const dynamic = "force-dynamic"

export const meta = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "button-group",
  type: "registry:ui",
  title: "Button Group",
  description: "A group of buttons that supports single or multiple selection.",
  ...registryMetadata["button-group"],
  dependencies: [
    "@radix-ui/react-toggle-group",
    "class-variance-authority",
  ],
  files: [
    {
      path: "ui/button-group.tsx",
      type: "registry:ui",
    },
  ],
}

export default function ButtonGroupPage() {
  return (
    <ComponentPageLayout
      meta={meta}
      title="Button Group"
      description="A set of grouped buttons that can support single or multiple selection. Based on the old ButtonGroup component."
    >
      <div className="space-y-12">
        <section>
          <h3 className="text-lg font-semibold mb-4">Size Variants</h3>
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Extra Small (xs) - 24px container / 20px items</p>
              <ButtonGroup type="single" size="xs" defaultValue="center">
                <ButtonGroupItem value="left" icon={<AlignLeft />} />
                <ButtonGroupItem value="center" icon={<AlignCenter />} />
                <ButtonGroupItem value="right" icon={<AlignRight />} />
                <ButtonGroupItem value="justify" icon={<AlignJustify />} />
              </ButtonGroup>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Small (sm)</p>
              <ButtonGroup type="single" size="sm" defaultValue="center">
                <ButtonGroupItem value="left" icon={<AlignLeft />} />
                <ButtonGroupItem value="center" icon={<AlignCenter />} />
                <ButtonGroupItem value="right" icon={<AlignRight />} />
                <ButtonGroupItem value="justify" icon={<AlignJustify />} />
              </ButtonGroup>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Default (M)</p>
              <ButtonGroup type="single" size="default" defaultValue="center">
                <ButtonGroupItem value="left" icon={<AlignLeft />} />
                <ButtonGroupItem value="center" icon={<AlignCenter />} />
                <ButtonGroupItem value="right" icon={<AlignRight />} />
                <ButtonGroupItem value="justify" icon={<AlignJustify />} />
              </ButtonGroup>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Large (lg) - Default</p>
              <ButtonGroup type="single" size="lg" defaultValue="center">
                <ButtonGroupItem value="left" icon={<AlignLeft />} />
                <ButtonGroupItem value="center" icon={<AlignCenter />} />
                <ButtonGroupItem value="right" icon={<AlignRight />} />
                <ButtonGroupItem value="justify" icon={<AlignJustify />} />
              </ButtonGroup>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-4">Single Selection</h3>
          <div className="flex flex-col gap-4">
            <ButtonGroup type="single" defaultValue="grid">
              <ButtonGroupItem value="list" icon={<List />}>List</ButtonGroupItem>
              <ButtonGroupItem value="grid" icon={<Grid />}>Grid</ButtonGroupItem>
              <ButtonGroupItem value="rows" icon={<Rows />}>Rows</ButtonGroupItem>
            </ButtonGroup>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-4">Multiple Selection</h3>
          <div className="flex flex-col gap-4">
            <ButtonGroup type="multiple" defaultValue={["bold"]}>
              <ButtonGroupItem value="bold" icon={<Bold />} aria-label="Toggle bold" />
              <ButtonGroupItem value="italic" icon={<Italic />} aria-label="Toggle italic" />
              <ButtonGroupItem value="underline" icon={<Underline />} aria-label="Toggle underline" />
            </ButtonGroup>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-4">Icon + Text</h3>
          <div className="flex flex-col gap-4">
            <ButtonGroup type="single" defaultValue="settings">
              <ButtonGroupItem value="settings" icon={<Settings />}>Settings</ButtonGroupItem>
              <ButtonGroupItem value="profile" icon={<User />}>Profile</ButtonGroupItem>
              <ButtonGroupItem value="notifications" icon={<Bell />}>Notifications</ButtonGroupItem>
            </ButtonGroup>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-4">Text Only</h3>
          <div className="flex flex-col gap-4">
            <ButtonGroup type="single" defaultValue="day">
              <ButtonGroupItem value="day">Day</ButtonGroupItem>
              <ButtonGroupItem value="week">Week</ButtonGroupItem>
              <ButtonGroupItem value="month">Month</ButtonGroupItem>
              <ButtonGroupItem value="year">Year</ButtonGroupItem>
            </ButtonGroup>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-4">Icon Only (All Sizes)</h3>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground w-20">Small:</span>
              <ButtonGroup type="multiple" size="sm" defaultValue={["bold", "italic"]}>
                <ButtonGroupItem value="bold" icon={<Bold />} iconOnly aria-label="Bold" />
                <ButtonGroupItem value="italic" icon={<Italic />} iconOnly aria-label="Italic" />
                <ButtonGroupItem value="underline" icon={<Underline />} iconOnly aria-label="Underline" />
              </ButtonGroup>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground w-20">Default:</span>
              <ButtonGroup type="multiple" size="default" defaultValue={["bold", "italic"]}>
                <ButtonGroupItem value="bold" icon={<Bold />} iconOnly aria-label="Bold" />
                <ButtonGroupItem value="italic" icon={<Italic />} iconOnly aria-label="Italic" />
                <ButtonGroupItem value="underline" icon={<Underline />} iconOnly aria-label="Underline" />
              </ButtonGroup>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground w-20">Large:</span>
              <ButtonGroup type="multiple" size="lg" defaultValue={["bold", "italic"]}>
                <ButtonGroupItem value="bold" icon={<Bold />} iconOnly aria-label="Bold" />
                <ButtonGroupItem value="italic" icon={<Italic />} iconOnly aria-label="Italic" />
                <ButtonGroupItem value="underline" icon={<Underline />} iconOnly aria-label="Underline" />
              </ButtonGroup>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-4">Disabled</h3>
          <div className="flex flex-col gap-4">
            <ButtonGroup type="single" disabled defaultValue="center">
              <ButtonGroupItem value="left" icon={<AlignLeft />} />
              <ButtonGroupItem value="center" icon={<AlignCenter />} />
              <ButtonGroupItem value="right" icon={<AlignRight />} />
            </ButtonGroup>
          </div>
        </section>
      </div>
    </ComponentPageLayout>
  )
}
