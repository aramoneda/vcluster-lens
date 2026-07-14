import { ComponentPageLayout } from "@/components/component-page-layout"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { registryMetadata } from "@/lib/registry-metadata"

// Added dynamic export for force-dynamic rendering
export const dynamic = "force-dynamic"

// Added meta export for registry
export const meta = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "carousel",
  type: "registry:ui",
  title: "Carousel",
  description: "A carousel with motion and swipe built using Embla.",
  ...registryMetadata["carousel"],
  files: [
    {
      path: "ui/carousel.tsx",
      type: "registry:ui",
    },
  ],
  dependencies: [
    "embla-carousel-react",
    "lucide-react",
  ],
  registryDependencies: ["button"],
}

function CarouselExample() {
  return (
    <Carousel className="w-full max-w-xs">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

export default function CarouselPage() {
  return (
    <ComponentPageLayout meta={meta}>
      <CarouselExample />
    </ComponentPageLayout>
  )
}
