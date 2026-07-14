import { ComponentPageLayout } from "@/components/component-page-layout"
import { IconButton } from "@/components/ui/icon-button"
import { Settings, Search, Plus, Trash2, Edit, Heart, Star, Bell, X, Menu, ChevronLeft, ChevronRight } from "lucide-react"
import { registryMetadata } from "@/lib/registry-metadata"

export const dynamic = "force-dynamic"

export const meta = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "icon-button",
  type: "registry:ui",
  title: "IconButton",
  description: "Icon-only button with built-in tooltip showing the ariaLabel.",
  ...registryMetadata["icon-button"],
  files: [
    {
      path: "ui/icon-button.tsx",
      type: "registry:ui",
    },
  ],
  dependencies: [
    "@radix-ui/react-slot",
    "class-variance-authority",
  ],
}

export default function IconButtonPage() {
  return (
    <ComponentPageLayout meta={meta} title="IconButton" description="Based on old IconButton with built-in Tooltip, sizes M/S/XS, and Blue/Black color variants.">
      <div className="space-y-12">
        {/* Size M (Default) */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Size M (32px) - Default</h3>
          <div className="flex items-center gap-4">
            <IconButton ariaLabel="Settings" size="M" color="Blue">
              <Settings className="w-5 h-5" />
            </IconButton>
            <IconButton ariaLabel="Search" size="M" color="Blue">
              <Search className="w-5 h-5" />
            </IconButton>
            <IconButton ariaLabel="Add item" size="M" color="Blue">
              <Plus className="w-5 h-5" />
            </IconButton>
            <IconButton ariaLabel="Delete" size="M" color="Blue">
              <Trash2 className="w-5 h-5" />
            </IconButton>
          </div>
        </section>

        {/* Size S */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Size S (24px)</h3>
          <div className="flex items-center gap-4">
            <IconButton ariaLabel="Settings" size="S" color="Blue">
              <Settings className="w-4 h-4" />
            </IconButton>
            <IconButton ariaLabel="Search" size="S" color="Blue">
              <Search className="w-4 h-4" />
            </IconButton>
            <IconButton ariaLabel="Add item" size="S" color="Blue">
              <Plus className="w-4 h-4" />
            </IconButton>
            <IconButton ariaLabel="Delete" size="S" color="Blue">
              <Trash2 className="w-4 h-4" />
            </IconButton>
          </div>
        </section>

        {/* Size XS */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Size XS (16px)</h3>
          <div className="flex items-center gap-4">
            <IconButton ariaLabel="Close" size="XS" color="Blue">
              <X className="w-3 h-3" />
            </IconButton>
            <IconButton ariaLabel="Previous" size="XS" color="Blue">
              <ChevronLeft className="w-3 h-3" />
            </IconButton>
            <IconButton ariaLabel="Next" size="XS" color="Blue">
              <ChevronRight className="w-3 h-3" />
            </IconButton>
          </div>
        </section>

        {/* Color Variants */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Color Variants</h3>
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-center gap-2">
              <span className="text-sm text-muted-foreground">Blue</span>
              <IconButton ariaLabel="Edit (Blue)" color="Blue">
                <Edit className="w-5 h-5" />
              </IconButton>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-sm text-muted-foreground">Black</span>
              <IconButton ariaLabel="Edit (Black)" color="Black">
                <Edit className="w-5 h-5" />
              </IconButton>
            </div>
          </div>
        </section>

        {/* Active State */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Active (Selected) State</h3>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center gap-2">
              <span className="text-sm text-muted-foreground">Default</span>
              <IconButton ariaLabel="Favorite">
                <Heart className="w-5 h-5" />
              </IconButton>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-sm text-muted-foreground">Active</span>
              <IconButton ariaLabel="Favorited" isActive>
                <Heart className="w-5 h-5" />
              </IconButton>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-sm text-muted-foreground">Default</span>
              <IconButton ariaLabel="Star">
                <Star className="w-5 h-5" />
              </IconButton>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-sm text-muted-foreground">Active</span>
              <IconButton ariaLabel="Starred" isActive>
                <Star className="w-5 h-5" />
              </IconButton>
            </div>
          </div>
        </section>

        {/* Disabled State */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Disabled State</h3>
          <div className="flex items-center gap-4">
            <IconButton ariaLabel="Notifications (disabled)" disabled>
              <Bell className="w-5 h-5" />
            </IconButton>
            <IconButton ariaLabel="Menu (disabled)" disabled color="Black">
              <Menu className="w-5 h-5" />
            </IconButton>
          </div>
        </section>

        {/* Size Comparison */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Size Comparison</h3>
          <div className="flex items-end gap-4">
            <div className="flex flex-col items-center gap-2">
              <IconButton ariaLabel="Settings M" size="M">
                <Settings className="w-5 h-5" />
              </IconButton>
              <span className="text-xs text-muted-foreground">M (32px)</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <IconButton ariaLabel="Settings S" size="S">
                <Settings className="w-4 h-4" />
              </IconButton>
              <span className="text-xs text-muted-foreground">S (24px)</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <IconButton ariaLabel="Settings XS" size="XS">
                <Settings className="w-3 h-3" />
              </IconButton>
              <span className="text-xs text-muted-foreground">XS (16px)</span>
            </div>
          </div>
        </section>
      </div>
    </ComponentPageLayout>
  )
}

