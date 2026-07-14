'use client'

import * as React from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'

import { cn } from '@/lib/utils'
import { WIDGET_SIZE_CONSTRAINTS, type WidgetSize } from '@/components/ui/widget'

/**
 * DashboardGrid — a responsive, drag-reorderable, gap-filling dashboard grid
 * for Widget components. This is the canonical grid for building dashboards
 * across BRD shells.
 *
 * Key behaviors:
 * - **Container-measured breakpoints.** Columns + the S/M/L column-span mapping
 *   are chosen from the grid container's OWN width (via ResizeObserver), not the
 *   viewport. This means it adapts correctly when the LeftNavigation or
 *   SideToolBar opens/closes and narrows the content area, and it works inside
 *   any shell on any consumer app.
 * - **2D dense packing.** Each widget occupies a deterministic column span (from
 *   its size + breakpoint) and a row span (derived from its fixed per-size
 *   height). `grid-auto-flow: dense` backfills both horizontal and vertical gaps.
 * - **Drag to reorder.** dnd-kit sortable; dragging starts from an explicit grip
 *   handle so it never conflicts with the widget's corner resize handle or
 *   interactive charts/grids.
 * - **Fluid widgets.** Children are cloned with `fluid` so each widget fills its
 *   cell width and shrinks with the viewport. The grid injects the controlled
 *   `size`/`onSizeChange` so resizing a widget re-spans and re-densifies.
 */

export interface DashboardBreakpoint {
  /** Minimum container width (px, inclusive) this breakpoint applies at. */
  min: number
  /** Base column count of the grid at this breakpoint. */
  cols: number
  /** Column span for each widget size at this breakpoint. */
  span: Record<WidgetSize, number>
  /**
   * When set, every widget is forced to this size (used on mobile, where only
   * the S representation is shown and resizing is disabled).
   */
  forceSize?: WidgetSize
}

/**
 * Default breakpoint config. Ordered largest → smallest; the first whose `min`
 * is ≤ the container width wins. Override per shell via the `breakpoints` prop.
 *
 * | Container width | Cols | S | M | L |
 * |-----------------|------|---|---|---|
 * | ≥ 1600          | 12   | 3 | 6 | 9 |
 * | 1094–1599       | 6    | 2 | 4 | 6 |
 * | 768–1093        | 6    | 3 | 6 | 6 |
 * | 500–767         | 6    | 3 | 6 | 6 |
 * | < 500 (mobile)  | 3    | 3 | 3 | 3 | (all forced to S, full width)
 */
export const DASHBOARD_BREAKPOINTS: DashboardBreakpoint[] = [
  { min: 1600, cols: 12, span: { S: 3, M: 6, L: 9 } },
  { min: 1094, cols: 6, span: { S: 2, M: 4, L: 6 } },
  { min: 768, cols: 6, span: { S: 3, M: 6, L: 6 } },
  { min: 500, cols: 6, span: { S: 3, M: 6, L: 6 } },
  { min: 0, cols: 3, span: { S: 3, M: 3, L: 3 }, forceSize: 'S' },
]

// Row-track math for vertical gap filling. A small auto-row unit lets a widget
// span the right number of rows to match its fixed height, so dense flow can
// backfill vertical gaps with shorter widgets.
const ROW_UNIT = 8 // px per implicit grid row
const GRID_GAP = 16 // px, --spacing-sp-16, used for BOTH row and column gaps

function resolveBreakpoint(
  width: number,
  breakpoints: DashboardBreakpoint[]
): DashboardBreakpoint {
  // breakpoints are ordered largest-min first; pick the first that fits.
  for (const bp of breakpoints) {
    if (width >= bp.min) return bp
  }
  return breakpoints[breakpoints.length - 1]
}

function rowSpanForHeight(height: number): number {
  return Math.ceil((height + GRID_GAP) / (ROW_UNIT + GRID_GAP))
}

interface DashboardGridContextValue {
  breakpoint: DashboardBreakpoint
  getSize: (id: string, fallback: WidgetSize) => WidgetSize
  setSize: (id: string, size: WidgetSize) => void
  sortable: boolean
}

const DashboardGridContext =
  React.createContext<DashboardGridContextValue | null>(null)

function useDashboardGrid() {
  const ctx = React.useContext(DashboardGridContext)
  if (!ctx) {
    throw new Error('DashboardGridItem must be used within a DashboardGrid')
  }
  return ctx
}

export interface DashboardGridProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Enable drag-and-drop reordering. Defaults to true. */
  sortable?: boolean
  /** Controlled order of item ids. When provided, `onReorder` should update it. */
  order?: string[]
  /** Called with the new id order after a drag. */
  onReorder?: (order: string[]) => void
  /** Override the responsive breakpoint config (ordered largest-min first). */
  breakpoints?: DashboardBreakpoint[]
  /** DashboardGridItem children. */
  children?: React.ReactNode
}

function getChildIds(children: React.ReactNode): string[] {
  const ids: string[] = []
  React.Children.forEach(children, (child) => {
    if (React.isValidElement<DashboardGridItemProps>(child) && child.props.id) {
      ids.push(child.props.id)
    }
  })
  return ids
}

const DashboardGrid = React.forwardRef<HTMLDivElement, DashboardGridProps>(
  (
    {
      sortable = true,
      order,
      onReorder,
      breakpoints = DASHBOARD_BREAKPOINTS,
      children,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const childIds = React.useMemo(() => getChildIds(children), [children])

    // --- Order state (controlled or uncontrolled) ---
    const isControlled = order !== undefined
    const [internalOrder, setInternalOrder] = React.useState<string[]>(childIds)
    React.useEffect(() => {
      if (isControlled) return
      setInternalOrder((prev) => {
        const kept = prev.filter((id) => childIds.includes(id))
        const added = childIds.filter((id) => !kept.includes(id))
        const next = [...kept, ...added]
        const same =
          next.length === prev.length && next.every((id, i) => id === prev[i])
        return same ? prev : next
      })
    }, [childIds, isControlled])
    const activeOrder = isControlled ? order : internalOrder

    // --- Per-widget size state (so the grid can compute spans) ---
    const [sizes, setSizes] = React.useState<Record<string, WidgetSize>>({})
    const getSize = React.useCallback(
      (id: string, fallback: WidgetSize) => sizes[id] ?? fallback,
      [sizes]
    )
    const setSize = React.useCallback((id: string, size: WidgetSize) => {
      setSizes((prev) => (prev[id] === size ? prev : { ...prev, [id]: size }))
    }, [])

    // --- Container-measured breakpoint ---
    const innerRef = React.useRef<HTMLDivElement | null>(null)
    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        innerRef.current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) ref.current = node
      },
      [ref]
    )
    const [containerWidth, setContainerWidth] = React.useState<number>(() =>
      // Default to the largest breakpoint until measured (avoids mobile flash on SSR).
      Math.max(...breakpoints.map((b) => b.min)) + 1
    )
    React.useEffect(() => {
      const node = innerRef.current
      if (!node) return
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setContainerWidth(entry.contentRect.width)
        }
      })
      observer.observe(node)
      return () => observer.disconnect()
    }, [])
    const breakpoint = React.useMemo(
      () => resolveBreakpoint(containerWidth, breakpoints),
      [containerWidth, breakpoints]
    )

    // --- Drag sensors ---
    const sensors = useSensors(
      useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      })
    )

    const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event
      if (!over || active.id === over.id) return
      const oldIndex = activeOrder.indexOf(active.id as string)
      const newIndex = activeOrder.indexOf(over.id as string)
      if (oldIndex === -1 || newIndex === -1) return
      const next = arrayMove(activeOrder, oldIndex, newIndex)
      if (!isControlled) setInternalOrder(next)
      onReorder?.(next)
    }

    // --- Order children ---
    const childMap = new Map<string, React.ReactElement>()
    React.Children.forEach(children, (child) => {
      if (
        React.isValidElement<DashboardGridItemProps>(child) &&
        child.props.id
      ) {
        childMap.set(child.props.id, child)
      }
    })
    const orderedChildren = activeOrder
      .map((id) => childMap.get(id))
      .filter((c): c is React.ReactElement => Boolean(c))

    const ctxValue: DashboardGridContextValue = {
      breakpoint,
      getSize,
      setSize,
      sortable,
    }

    const grid = (
      <div
        ref={setRefs}
        data-slot="dashboard-grid"
        data-cols={breakpoint.cols}
        className={cn('grid w-full items-start', className)}
        style={{
          gridTemplateColumns: `repeat(${breakpoint.cols}, minmax(0, 1fr))`,
          gridAutoRows: `${ROW_UNIT}px`,
          gridAutoFlow: 'row dense',
          gap: `${GRID_GAP}px`,
          ...style,
        }}
        {...props}
      >
        {orderedChildren}
      </div>
    )

    const content = !sortable ? (
      grid
    ) : (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={activeOrder} strategy={rectSortingStrategy}>
          {grid}
        </SortableContext>
      </DndContext>
    )

    return (
      <DashboardGridContext.Provider value={ctxValue}>
        {content}
      </DashboardGridContext.Provider>
    )
  }
)

DashboardGrid.displayName = 'DashboardGrid'

export interface DashboardGridItemProps {
  /** Stable unique id used for ordering + size tracking. */
  id: string
  /** Initial widget size. The grid tracks the live size after resizes. */
  defaultSize?: WidgetSize
  /**
   * A single Widget. The grid clones it to inject `fluid`, the controlled
   * `size`/`onSizeChange`, and (on mobile) `resizable={false}`.
   */
  children: React.ReactElement
}

const DashboardGridItem = ({
  id,
  defaultSize = 'M',
  children,
}: DashboardGridItemProps) => {
  const { breakpoint, getSize, setSize, sortable } = useDashboardGrid()

  const storedSize = getSize(id, defaultSize)
  // On a forced-size breakpoint (mobile) every widget renders as that size.
  const effectiveSize = breakpoint.forceSize ?? storedSize
  const isForced = breakpoint.forceSize !== undefined

  const colSpan = Math.min(
    breakpoint.cols,
    breakpoint.span[effectiveSize]
  )
  const rowSpan = rowSpanForHeight(WIDGET_SIZE_CONSTRAINTS[effectiveSize].height)

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: !sortable })

  const style: React.CSSProperties = {
    gridColumn: `span ${colSpan}`,
    gridRow: `span ${rowSpan}`,
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
  }

  // Clone the child Widget to inject fluid mode + controlled size.
  const child = React.cloneElement(
    children as React.ReactElement<Record<string, unknown>>,
    {
      fluid: true,
      size: effectiveSize,
      onSizeChange: (s: WidgetSize) => setSize(id, s),
      // Disable corner resize on mobile (single representation only).
      resizable: isForced
        ? false
        : (children.props as { resizable?: boolean }).resizable,
    }
  )

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-slot="dashboard-grid-item"
      data-size={effectiveSize}
      data-dragging={isDragging || undefined}
      className="group/grid-item relative min-w-0"
    >
      {sortable && (
        <button
          type="button"
          ref={setActivatorNodeRef}
          aria-label="Drag to reorder widget"
          title="Drag to reorder"
          className={cn(
            'absolute left-1 top-1 z-20 grid h-6 w-6 cursor-grab place-items-center',
            'rounded-[var(--radius-xs)] text-[var(--color-icon-default)]',
            'opacity-0 transition-opacity group-hover/grid-item:opacity-100',
            'focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-stroke-brand)]',
            'hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-icon-brand)]',
            'active:cursor-grabbing'
          )}
          {...attributes}
          {...listeners}
        >
          <GripVertical size={16} aria-hidden="true" />
        </button>
      )}
      {child}
    </div>
  )
}

DashboardGridItem.displayName = 'DashboardGridItem'

export { DashboardGrid, DashboardGridItem }
