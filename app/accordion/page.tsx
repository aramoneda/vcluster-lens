import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ComponentPageLayout } from "@/components/component-page-layout"
import { registryMetadata } from "@/lib/registry-metadata"

// Added dynamic export for force-dynamic rendering
export const dynamic = "force-dynamic"

export const meta = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "accordion",
  type: "registry:ui",
  title: "Accordion",
  description: "A vertically stacked set of interactive headings that each reveal a section of content.",
  ...registryMetadata["accordion"],
  files: [
    {
      path: "ui/accordion.tsx",
      type: "registry:ui",
    },
  ],
  dependencies: [
    "@radix-ui/react-accordion",
    "lucide-react",
  ],
}

function AccordionExample() {
  return (
    <Accordion type="single" collapsible className="w-full max-w-md">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that matches the other components&apos; aesthetic.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>Yes. It&apos;s animated by default, but you can disable it if you prefer.</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default function AccordionPage() {
  return (
    <ComponentPageLayout meta={meta}>
      <AccordionExample />
    </ComponentPageLayout>
  )
}
