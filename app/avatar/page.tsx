import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ComponentPageLayout } from "@/components/component-page-layout"
import { registryMetadata } from "@/lib/registry-metadata"

// Added dynamic export for force-dynamic rendering
export const dynamic = "force-dynamic"

export const meta = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "avatar",
  type: "registry:ui",
  title: "Avatar",
  description: "An image element with a fallback for representing the user.",
  ...registryMetadata["avatar"],
  files: [
    {
      path: "ui/avatar.tsx",
      type: "registry:ui",
    },
  ],
  dependencies: ["@radix-ui/react-avatar"],
}

function AvatarExample() {
  return (
    <div className="flex gap-4">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
    </div>
  )
}

export default function AvatarPage() {
  return (
    <ComponentPageLayout meta={meta}>
      <AvatarExample />
    </ComponentPageLayout>
  )
}
