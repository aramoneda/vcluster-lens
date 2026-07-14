import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { Link } from "@/components/ui/link"

/* ===========================================
   Individual Breadcrumb Components (shadcn API)
   =========================================== */

function Breadcrumb({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      aria-label="breadcrumb"
      data-slot="breadcrumb"
      className={cn("flex items-center", className)}
      {...props}
    />
  )
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        "flex flex-wrap items-center gap-0 text-sm break-words list-none p-0 m-0",
        className
      )}
      {...props}
    />
  )
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center", className)}
      {...props}
    />
  )
}

function BreadcrumbLink({
  asChild,
  className,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean
}) {
  const Comp = asChild ? Slot : Link

  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn(
        "text-sm font-semibold text-[var(--color-text-link-default)] underline hover:text-[var(--color-text-link-hover)] hover:no-underline",
        className
      )}
      {...props}
    />
  )
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn(
        "text-sm font-normal text-[var(--color-text-primary)] no-underline",
        className
      )}
      {...props}
    />
  )
}

function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn(
        "mx-1.5 flex items-center text-[var(--color-icon-brand)] [&>svg]:size-4",
        className
      )}
      {...props}
    >
      {children ?? <ChevronRight />}
    </li>
  )
}

function BreadcrumbEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">More</span>
    </span>
  )
}

/* ===========================================
   Composite Breadcrumbs Component (Old API)
   =========================================== */

export interface BreadcrumbItemData {
  text: string
  href?: string
}

export interface BreadcrumbsProps extends React.ComponentProps<"nav"> {
  /**
   * An array of breadcrumb items.
   * Each item is an object with `text` and optional `href`.
   * The last item is considered the current page.
   */
  items: BreadcrumbItemData[]
}

const Breadcrumbs = React.forwardRef<HTMLElement, BreadcrumbsProps>(
  ({ items, className, ...rest }, ref) => {
    if (!items || items.length <= 1) {
      return null
    }

    return (
      <Breadcrumb ref={ref} className={className} {...rest}>
        <BreadcrumbList>
          {items.map((item, index) => {
            const isCurrentPage = index === items.length - 1

            return (
              <React.Fragment key={index}>
                <BreadcrumbItem aria-current={isCurrentPage ? "page" : undefined}>
                  {isCurrentPage ? (
                    <BreadcrumbPage>{item.text}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={item.href || "#"}>
                      {item.text}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isCurrentPage && <BreadcrumbSeparator />}
              </React.Fragment>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
    )
  }
)

Breadcrumbs.displayName = "Breadcrumbs"

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
  Breadcrumbs,
}
