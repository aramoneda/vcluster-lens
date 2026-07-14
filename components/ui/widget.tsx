'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Info, ZoomIn, RefreshCw, MoreVertical } from 'lucide-react'

import { cn } from '@/lib/utils'
import { IconButton } from '@/components/ui/icon-button'
import { LiveTimestamp } from '@/components/ui/live-timestamp'
import type { TimestampValue } from '@/lib/format-timestamp'
import { Link } from '@/components/ui/link'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Widget size types
export type WidgetSize = 'S' | 'M' | 'L'

// Widget menu item interface
export interface WidgetMenuItem {
  label: string
  onClick?: () => void
  disabled?: boolean
}

// Widget link interface
export interface WidgetLink {
  label: string
  href: string
}

export const WIDGET_SIZE_CONSTRAINTS = {
  S: { minWidth: 290, maxWidth: 456, height: 315 },
  M: { minWidth: 580, maxWidth: 912, height: 654 },
  L: { minWidth: 872, maxWidth: 1368, height: 654 },
} as const

// Resize cycle order. Stepping right grows, stepping left shrinks.
const SIZE_ORDER: WidgetSize[] = ['S', 'M', 'L']

function nextSize(current: WidgetSize, direction: 1 | -1): WidgetSize {
  const idx = SIZE_ORDER.indexOf(current)
  const nextIdx = Math.min(SIZE_ORDER.length - 1, Math.max(0, idx + direction))
  return SIZE_ORDER[nextIdx]
}

const widgetVariants = cva(
  [
    'relative flex flex-col',
    'bg-[var(--color-surface-widget)]',
    'rounded-[var(--radius-s)]',
    'overflow-hidden',
    'box-border',
    'gap-[var(--spacing-sp-24)]',
    'p-[var(--spacing-sp-24)]',
  ],
  {
    variants: {
      size: {
        S: '',
        M: '',
        L: '',
      },
    },
    defaultVariants: {
      size: 'M',
    },
  }
)

export interface WidgetProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>,
    VariantProps<typeof widgetVariants> {
  /** Widget size variant. Acts as the initial size when uncontrolled. */
  size?: WidgetSize
  /** Controlled size change handler. When provided, `size` is treated as controlled. */
  onSizeChange?: (size: WidgetSize) => void
  /** Whether the widget can be resized via the corner handle. Defaults to true. */
  resizable?: boolean
  /**
   * Fluid mode: the widget fills its container's width (100%) instead of using
   * the fixed per-size pixel width. Use this when placing the widget inside a
   * DashboardGrid cell so it resizes with the column span / viewport. The
   * fixed per-size height is preserved. Defaults to false.
   */
  fluid?: boolean
  /** Widget title displayed in the header */
  title: string
  /**
   * Last-updated time as a real timestamp (`Date` or epoch ms, required).
   * Rendered as a live, self-refreshing "Updated … ago" label — never a
   * pre-formatted string.
   */
  timestamp: TimestampValue
  /** Callback when refresh is clicked */
  onRefresh?: () => void
  /** Callback when info icon is clicked (optional - shows info button if provided) */
  onInfoClick?: () => void
  /** Menu items for the dropdown menu (optional) */
  menuItems?: WidgetMenuItem[]
  /** Source link displayed in the footer left (optional) */
  sourceLink?: WidgetLink
  /** View more link displayed in the footer right (optional) */
  viewMoreLink?: WidgetLink
  /**
   * Content for the Small (mobile) representation. Falls back to `renderM`
   * then `children` when omitted.
   */
  renderS?: React.ReactNode
  /**
   * Content for the Medium (default) representation. This is also what the
   * Zoom dialog repeats. Falls back to `children` when omitted.
   */
  renderM?: React.ReactNode
  /**
   * Content for the Large (expanded) representation. Falls back to `renderM`
   * then `children` when omitted.
   */
  renderL?: React.ReactNode
  /** Fallback content used when a size-specific slot is not provided. */
  children?: React.ReactNode
}

const Widget = React.forwardRef<HTMLDivElement, WidgetProps>(
  (
    {
      size = 'M',
      onSizeChange,
      resizable = true,
      fluid = false,
      title,
      timestamp,
      onRefresh,
      onInfoClick,
      menuItems,
      sourceLink,
      viewMoreLink,
      renderS,
      renderM,
      renderL,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const [zoomOpen, setZoomOpen] = React.useState(false)

    // Size is controlled when onSizeChange is provided, otherwise internal.
    const isControlled = onSizeChange !== undefined
    const [internalSize, setInternalSize] = React.useState<WidgetSize>(size)
    const currentSize = isControlled ? size : internalSize

    // Keep internal state in sync if the prop changes while uncontrolled.
    React.useEffect(() => {
      if (!isControlled) setInternalSize(size)
    }, [size, isControlled])

    const setSize = React.useCallback(
      (next: WidgetSize) => {
        if (next === currentSize) return
        if (isControlled) {
          onSizeChange?.(next)
        } else {
          setInternalSize(next)
        }
      },
      [currentSize, isControlled, onSizeChange]
    )

    const step = React.useCallback(
      (direction: 1 | -1) => setSize(nextSize(currentSize, direction)),
      [currentSize, setSize]
    )

    // Pointer-driven resize: translate horizontal drag into discrete size steps.
    const dragState = React.useRef<{ startX: number; size: WidgetSize } | null>(
      null
    )

    const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
      if (!resizable) return
      e.preventDefault()
      e.currentTarget.setPointerCapture(e.pointerId)
      dragState.current = { startX: e.clientX, size: currentSize }
    }

    const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
      if (!dragState.current) return
      const deltaX = e.clientX - dragState.current.startX
      const THRESHOLD = 80 // px of drag per size step
      const steps = Math.trunc(deltaX / THRESHOLD)
      if (steps === 0) return
      const startIdx = SIZE_ORDER.indexOf(dragState.current.size)
      const targetIdx = Math.min(
        SIZE_ORDER.length - 1,
        Math.max(0, startIdx + steps)
      )
      setSize(SIZE_ORDER[targetIdx])
    }

    const endDrag = (e: React.PointerEvent<HTMLButtonElement>) => {
      if (dragState.current) {
        try {
          e.currentTarget.releasePointerCapture(e.pointerId)
        } catch {
          /* no-op */
        }
        dragState.current = null
      }
    }

    const handleResizeKeyDown = (
      e: React.KeyboardEvent<HTMLButtonElement>
    ) => {
      if (!resizable) return
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault()
        step(1)
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault()
        step(-1)
      }
    }

    const { style, ...rest } = props
    const safeStyle = style ? { ...style } : undefined
    if (safeStyle) {
      delete safeStyle.width
      delete safeStyle.height
      delete safeStyle.minWidth
      delete safeStyle.maxWidth
      delete safeStyle.minHeight
      delete safeStyle.maxHeight
    }
    const constraints = WIDGET_SIZE_CONSTRAINTS[currentSize]
    const widgetStyle: React.CSSProperties = {
      // Fluid mode (e.g. inside a DashboardGrid cell): fill the container width
      // so the widget resizes with its column span / the viewport. Otherwise
      // use a definite pixel width so the size is honored inside a flex parent;
      // `maxInlineSize: 100%` caps it to its container on narrow areas without
      // making the width percentage-based (which collapses in a content-sized
      // flex item).
      inlineSize: fluid ? '100%' : `${constraints.maxWidth}px`,
      minInlineSize: fluid ? '0' : `${constraints.minWidth}px`,
      maxInlineSize: '100%',
      blockSize: `${constraints.height}px`,
      minBlockSize: `${constraints.height}px`,
      maxBlockSize: `${constraints.height}px`,
      ...safeStyle,
    }

    // Resolve the content for a given size with documented fallbacks.
    const contentForSize = (s: WidgetSize): React.ReactNode => {
      if (s === 'S') return renderS ?? renderM ?? children
      if (s === 'L') return renderL ?? renderM ?? children
      return renderM ?? children
    }
    const activeContent = contentForSize(currentSize)
    // Zoom always repeats the Medium content.
    const zoomContent = renderM ?? children

    const hasFooter = sourceLink || viewMoreLink

    // Render footer content (reused in widget and dialog)
    const renderFooter = () => {
      if (!hasFooter) return null
      return (
        <div
          data-slot="widget-footer"
          className="flex w-full items-center justify-between gap-[var(--spacing-sp-24)] shrink-0"
        >
          {sourceLink ? (
            <Link href={sourceLink.href}>{sourceLink.label}</Link>
          ) : (
            <div aria-hidden="true" />
          )}
          {viewMoreLink && <Link href={viewMoreLink.href}>{viewMoreLink.label}</Link>}
        </div>
      )
    }

    return (
      <>
        <div
          ref={ref}
          className={cn(className, widgetVariants({ size: currentSize }))}
          data-size={currentSize}
          data-slot="widget"
          style={widgetStyle}
          {...rest}
        >
          <div
            data-slot="widget-header"
            className="flex w-full items-start justify-between gap-[var(--spacing-sp-24)] shrink-0"
          >
            <div
              data-slot="widget-header-meta"
              className="flex min-w-0 flex-1 flex-col gap-[var(--spacing-sp-8)]"
            >
              <div
                data-slot="widget-title-row"
                className="flex min-w-0 items-center gap-[var(--spacing-sp-4)]"
              >
                <h4
                  data-slot="widget-title"
                  className="m-0 min-w-0 truncate text-[var(--color-text-primary)] [font:var(--font-headline-h4)]"
                >
                  {title}
                </h4>
                {onInfoClick && (
                  <IconButton
                    ariaLabel="Widget info"
                    size="S"
                    color="Black"
                    onClick={onInfoClick}
                  >
                    <Info size={16} />
                  </IconButton>
                )}
              </div>
              <div
                data-slot="widget-timestamp-row"
                className="flex min-w-0 flex-wrap items-center gap-[var(--spacing-sp-8)]"
              >
                <LiveTimestamp
                  value={timestamp}
                  data-slot="widget-timestamp"
                  className="text-[var(--color-text-secondary)] [font:var(--font-body-medium)]"
                />
                {onRefresh &&
                  (currentSize === 'S' ? (
                    <IconButton
                      ariaLabel="Refresh"
                      size="XS"
                      color="Blue"
                      onClick={onRefresh}
                    >
                      <RefreshCw size={14} />
                    </IconButton>
                  ) : (
                    <Link
                      href="#"
                      icon={<RefreshCw size={14} />}
                      onClick={(e) => {
                        e.preventDefault()
                        onRefresh()
                      }}
                    >
                      Refresh
                    </Link>
                  ))}
              </div>
            </div>

            <div
              data-slot="widget-actions"
              className="flex shrink-0 items-center gap-[var(--spacing-sp-4)]"
            >
              {currentSize !== 'L' && (
                <IconButton
                  ariaLabel="Expand widget"
                  size="S"
                  color="Blue"
                  onClick={() => setZoomOpen(true)}
                >
                  <ZoomIn size={16} />
                </IconButton>
              )}

              {menuItems && menuItems.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <IconButton ariaLabel="Widget menu" size="S" color="Black">
                      <MoreVertical size={16} />
                    </IconButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {menuItems.map((item, index) => (
                      <DropdownMenuItem
                        key={index}
                        onClick={item.onClick}
                        disabled={item.disabled}
                      >
                        {item.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          <div
            data-slot="widget-content"
            className="flex min-h-0 w-full flex-1 flex-col overflow-auto"
          >
            {activeContent}
          </div>

          {renderFooter()}

          {resizable && (
            <button
              type="button"
              data-slot="widget-resize-handle"
              aria-label={`Resize widget (current size ${currentSize})`}
              title="Drag to resize"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onKeyDown={handleResizeKeyDown}
              className={cn(
                'absolute bottom-0 right-0 z-10 grid h-4 w-4 cursor-nwse-resize place-items-center',
                'rounded-tl-[var(--radius-xs)] text-[var(--color-icon-default)]',
                'outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-stroke-brand)]',
                'hover:text-[var(--color-icon-brand)]'
              )}
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M9 1L1 9M9 5L5 9"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
        </div>

        <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
          <DialogContent
            size="fluid"
            titleText={title}
            hideFooter={!hasFooter}
            footerContent={hasFooter ? renderFooter() : undefined}
            className="w-[calc(100vw-48px)] max-w-[1368px] max-h-[calc(100dvh-48px)] md:w-[calc(100vw-96px)] md:max-h-[calc(100dvh-96px)]"
          >
            <div
              data-slot="widget-zoom-body"
              className="flex min-h-0 flex-1 flex-col overflow-auto"
            >
              {zoomContent}
            </div>
          </DialogContent>
        </Dialog>
      </>
    )
  }
)

Widget.displayName = 'Widget'

export { Widget, widgetVariants }
