"use client"

import * as React from "react"
import { ChevronDown, ChevronRight } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export type TopNavigationItem = {
  id: string
  label: string
  children?: TopNavigationItem[]
}

export interface TopNavigationProps extends React.HTMLAttributes<HTMLDivElement> {
  items: TopNavigationItem[]
  activeId?: string
  onItemSelect?: (item: TopNavigationItem) => void
  /** Width of left navigation rail to offset the top nav content */
  leftRailWidth?: string
}

const NavMenu = ({
  items,
  activeId,
  onItemSelect,
}: {
  items: TopNavigationItem[]
  activeId?: string
  onItemSelect?: (item: TopNavigationItem) => void
}) => {
  return (
    <>
      {items.map((item) => {
        if (item.children && item.children.length > 0) {
          return (
            <DropdownMenuSub key={item.id}>
              <DropdownMenuSubTrigger
                className={cn(
                  "data-[state=open]:bg-[var(--color-surface-hover)]",
                  activeId === item.id &&
                    "bg-[var(--color-surface-selected)] text-[var(--color-text-selected)]"
                )}
                onClick={(event) => {
                  event.preventDefault()
                  onItemSelect?.(item)
                }}
              >
                <span>{item.label}</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="min-w-[200px]">
                <NavMenu
                  items={item.children}
                  activeId={activeId}
                  onItemSelect={onItemSelect}
                />
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          )
        }

        return (
          <DropdownMenuItem
            key={item.id}
            isActive={item.id === activeId}
            onSelect={() => onItemSelect?.(item)}
          >
            {item.label}
          </DropdownMenuItem>
        )
      })}
    </>
  )
}

const TopNavigation = React.forwardRef<HTMLDivElement, TopNavigationProps>(
  ({ items, activeId, onItemSelect, leftRailWidth, className, ...props }, ref) => {
    const [openId, setOpenId] = React.useState<string | null>(null)
    const [visibleCount, setVisibleCount] = React.useState(items.length)
    const containerRef = React.useRef<HTMLDivElement | null>(null)
    const moreRef = React.useRef<HTMLButtonElement | null>(null)
    const itemRefs = React.useRef(new Map<string, HTMLButtonElement | null>())

    const setItemRef = React.useCallback((id: string) => {
      return (node: HTMLButtonElement | null) => {
        itemRefs.current.set(id, node)
      }
    }, [])

    const calculateVisibleCount = React.useCallback(() => {
      const container = containerRef.current
      if (!container) return

      const containerWidth = container.clientWidth
      const gapValue = Number.parseFloat(getComputedStyle(container).columnGap || "0")
      const gap = Number.isNaN(gapValue) ? 0 : gapValue
      const moreWidth = moreRef.current?.offsetWidth ?? 0

      let usedWidth = 0
      let count = 0

      for (let index = 0; index < items.length; index += 1) {
        const item = items[index]
        const buttonWidth = itemRefs.current.get(item.id)?.offsetWidth ?? 0
        const remaining = items.length - index - 1
        const nextWidth =
          usedWidth +
          (count > 0 ? gap : 0) +
          buttonWidth +
          (remaining > 0 ? gap + moreWidth : 0)

        if (nextWidth <= containerWidth) {
          usedWidth += (count > 0 ? gap : 0) + buttonWidth
          count += 1
        } else {
          break
        }
      }

      setVisibleCount(count)
    }, [items])

    React.useLayoutEffect(() => {
      calculateVisibleCount()
    }, [calculateVisibleCount, items])

    React.useEffect(() => {
      const container = containerRef.current
      if (!container) return

      const observer = new ResizeObserver(() => calculateVisibleCount())
      observer.observe(container)

      return () => observer.disconnect()
    }, [calculateVisibleCount])

    const visibleItems = items.slice(0, visibleCount)
    const overflowItems = items.slice(visibleCount)

    return (
      <nav
        ref={ref}
        className={cn(
          "sticky z-30 flex items-center gap-1",
          "bg-[var(--color-surface-foreground)] pr-4",
          className
        )}
        style={{ 
          top: "var(--shell-header-height, 56px)", 
          paddingLeft: leftRailWidth ? `calc(${leftRailWidth} + 16px)` : "16px",
          ...(props.style ?? {}) 
        }}
        {...props}
      >
        <div
          ref={containerRef}
          className="flex w-full items-center gap-1"
        >
          <button
            ref={moreRef}
            type="button"
            className={cn(
              "absolute -top-10 left-0 opacity-0 pointer-events-none",
              "inline-flex items-center gap-1 px-3 py-2 text-sm font-semibold",
              "whitespace-nowrap border-b-2 border-transparent"
            )}
            aria-hidden="true"
            tabIndex={-1}
          >
            <span>More</span>
            <ChevronDown className="size-4" />
          </button>

        {visibleItems.map((item) => {
          const isActive = item.id === activeId
          const isOpen = openId === item.id
          const hasChildren = item.children && item.children.length > 0

          return (
            <DropdownMenu
              key={item.id}
              open={isOpen}
              onOpenChange={(open) => setOpenId(open ? item.id : null)}
            >
              <DropdownMenuTrigger asChild>
                <button
                  ref={setItemRef(item.id)}
                  type="button"
                  className={cn(
                    "group inline-flex h-10 items-center gap-1 px-3 text-sm font-semibold",
                    "whitespace-nowrap",
                    "text-[var(--color-text-primary)]",
                    "border-b-2 border-transparent",
                    "hover:border-[var(--color-stroke-default)] hover:bg-[var(--color-surface-hover)]",
                    isActive && "border-[var(--color-stroke-brand)]"
                  )}
                  onMouseEnter={() => hasChildren && setOpenId(item.id)}
                  onMouseLeave={() => hasChildren && setOpenId(null)}
                  onClick={() => onItemSelect?.(item)}
                >
                  <span>{item.label}</span>
                  {hasChildren && (
                    <ChevronDown className="size-4 text-[var(--color-icon-brand)]" />
                  )}
                </button>
              </DropdownMenuTrigger>
              {hasChildren && (
                <DropdownMenuContent
                  className="min-w-[220px]"
                  position="bottom-left"
                  onMouseEnter={() => setOpenId(item.id)}
                  onMouseLeave={() => setOpenId(null)}
                >
                  <NavMenu
                    items={item.children ?? []}
                    activeId={activeId}
                    onItemSelect={onItemSelect}
                  />
                </DropdownMenuContent>
              )}
            </DropdownMenu>
          )
        })}

          {overflowItems.length > 0 && (
            <DropdownMenu
              open={openId === "more"}
              onOpenChange={(open) => setOpenId(open ? "more" : null)}
            >
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "group inline-flex h-10 items-center gap-1 px-3 text-sm font-semibold",
                    "whitespace-nowrap",
                    "text-[var(--color-text-primary)]",
                    "border-b-2 border-transparent",
                    "hover:border-[var(--color-stroke-default)] hover:bg-[var(--color-surface-hover)]"
                  )}
                  onMouseEnter={() => setOpenId("more")}
                  onMouseLeave={() => setOpenId(null)}
                >
                  <span>More</span>
                  <ChevronDown className="size-4 text-[var(--color-icon-brand)]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="min-w-[220px]"
                position="bottom-left"
                onMouseEnter={() => setOpenId("more")}
                onMouseLeave={() => setOpenId(null)}
              >
                <NavMenu
                  items={overflowItems}
                  activeId={activeId}
                  onItemSelect={onItemSelect}
                />
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </nav>
    )
  }
)

TopNavigation.displayName = "TopNavigation"

export { TopNavigation }
