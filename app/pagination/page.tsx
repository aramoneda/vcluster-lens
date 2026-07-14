import { ComponentPageLayout } from "@/components/component-page-layout"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { registryMetadata } from "@/lib/registry-metadata"

// Added dynamic export for force-dynamic rendering
export const dynamic = "force-dynamic"

// Added meta export for registry
export const meta = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "pagination",
  type: "registry:ui",
  title: "Pagination",
  description: "Pagination with page navigation, built using Radix UI's navigation components.",
  ...registryMetadata["pagination"],
  dependencies: ["lucide-react"],
  files: [
    {
      path: "ui/pagination.tsx",
      type: "registry:ui",
    },
  ],
  registryDependencies: ["button"],
}

function PaginationExample() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default function PaginationPage() {
  return (
    <ComponentPageLayout meta={meta}>
      <PaginationExample />
    </ComponentPageLayout>
  )
}
