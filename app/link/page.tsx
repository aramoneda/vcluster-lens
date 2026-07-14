import { Link } from "@/components/ui/link"
import { ComponentPageLayout } from "@/components/component-page-layout"
import { ExternalLink, ArrowRight, Mail } from "lucide-react"
import { registryMetadata } from "@/lib/registry-metadata"

export const meta = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "link",
  type: "registry:ui",
  title: "Link",
  description: "A styled link component with icon support.",
  ...registryMetadata["link"],
  files: [
    {
      path: "ui/link.tsx",
      type: "registry:ui",
    },
  ],
  dependencies: [
    "@radix-ui/react-slot",
    "class-variance-authority",
  ],
}

function LinkExample() {
  return (
    <div className="space-y-8">
      {/* Basic Links */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Link</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="#">Default Link</Link>
        </div>
      </div>

      {/* Sizes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Sizes</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="#" size="sm">Small Link</Link>
          <Link href="#">Default Link</Link>
          <Link href="#" size="lg">Large Link</Link>
        </div>
      </div>

      {/* With Leading Icon */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">With Leading Icon</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="#" icon={<Mail />}>Email Us</Link>
          <Link href="#" icon={<ExternalLink />}>External Link</Link>
        </div>
      </div>

      {/* With Trailing Icon */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">With Trailing Icon</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="#" icon={<ArrowRight />} trailingIcon>Continue</Link>
          <Link href="#" icon={<ExternalLink />} trailingIcon>Open in new tab</Link>
        </div>
      </div>

      {/* Disabled State */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Disabled</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="#" disabled>Disabled Link</Link>
          <Link href="#" disabled icon={<ExternalLink />}>Disabled with Icon</Link>
        </div>
      </div>
    </div>
  )
}

export default function LinkPage() {
  return (
    <ComponentPageLayout meta={meta}>
      <LinkExample />
    </ComponentPageLayout>
  )
}

