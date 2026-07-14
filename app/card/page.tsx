import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ComponentPageLayout } from "@/components/component-page-layout"
import { registryMetadata } from "@/lib/registry-metadata"

// Added dynamic export for force-dynamic rendering
export const dynamic = "force-dynamic"

export const meta = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "card",
  type: "registry:ui",
  title: "Card",
  description: "Displays a card with header, content, and footer.",
  ...registryMetadata["card"],
  files: [
    {
      path: "ui/card.tsx",
      type: "registry:ui",
    },
  ],
}

function CardExample() {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content goes here. This is where you would put the main information or form elements.</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  )
}

export default function CardPage() {
  return (
    <ComponentPageLayout meta={meta}>
      <CardExample />
    </ComponentPageLayout>
  )
}
