import { ComponentPageLayout } from "@/components/component-page-layout"
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage as BreadcrumbPageItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@/components/ui/breadcrumb"
import { registryMetadata } from "@/lib/registry-metadata"

export const meta = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "breadcrumb",
  type: "registry:ui",
  title: "Breadcrumb",
  description: "Displays the path to the current resource using a hierarchy of links.",
  ...registryMetadata["breadcrumb"],
  dependencies: [
    "@radix-ui/react-slot",
    "lucide-react",
  ],
  files: [
    {
      path: "ui/breadcrumb.tsx",
      type: "registry:ui",
    },
  ],
}

export default function BreadcrumbPage() {
  return (
    <ComponentPageLayout meta={meta}>
      <div className="space-y-8">
        {/* Composite API (Old Style) */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Composite Breadcrumbs (items prop)</h3>
          <Breadcrumbs
            items={[
              { text: "Home", href: "/" },
              { text: "Components", href: "/components" },
              { text: "Breadcrumb" },
            ]}
          />
        </div>

        {/* Composite API - longer path */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Longer Path</h3>
          <Breadcrumbs
            items={[
              { text: "Home", href: "/" },
              { text: "Dashboard", href: "/dashboard" },
              { text: "Settings", href: "/dashboard/settings" },
              { text: "Profile", href: "/dashboard/settings/profile" },
              { text: "Edit" },
            ]}
          />
        </div>

        {/* Individual Components API (shadcn Style) */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Individual Components API</h3>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/components">Components</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPageItem>Breadcrumb</BreadcrumbPageItem>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* With Ellipsis */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">With Ellipsis</h3>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbEllipsis />
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/docs/components">Components</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPageItem>Breadcrumb</BreadcrumbPageItem>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
    </ComponentPageLayout>
  )
}
