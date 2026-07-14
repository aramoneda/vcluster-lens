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

/**
 * WidgetGrid — a simple flex, drag-to-reorder container for Widget components.
 *
 * Widgets size themselves (S/M/L) via their own corner handle; the grid only
 * owns positioning. Each child must be a `WidgetGridItem` with a stable `id`.
 * Dragging is initiated from an explicit grip handle so it never conflicts
 * with the widget's resize handle, charts, or data grids.
 *
 * @deprecated Prefer {@link DashboardGrid} from
 * `@/components/ui/dashboard-grid` for new dashboards. DashboardGrid is a true
 * responsive CSS-grid with container-measured breakpoints, S/M/L → column-span
 * mapping, and 2D dense gap-filling. WidgetGrid remains only as a lightweight
 * flex-wrap reorder row for simple cases and existing usages; it does not
 * reflow widget sizes responsively.
 */

interface WidgetGridContextValue {
  /** Whether drag-and-drop reordering is enabled. */
  sortable: boolean
}

const WidgetGridContext = React.createContext<WidgetGridContextValue>({
  sortable: true,
})

export interface WidgetGridProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Enable drag-and-drop reordering. Defaults to true. */
  sortable?: boolean
  /** Controlled order of item ids. When provided, `onReorder` should update it. */
  order?: string[]
  /** Called with the new id order after a drag. */
  onReorder?: (order: string[]) => void
  /** WidgetGridItem children. */
  children?: React.ReactNode
}

function getChildIds(children: React.ReactNode): string[] {
  const ids: string[] = []
  React.Children.forEach(children, (child) => {
    if (React.isValidElement<WidgetGridItemProps>(child) && child.props.id) {
      ids.push(child.props.id)
    }
  })
  return ids
}

const WidgetGrid = React.forwardRef<HTMLDivElement, WidgetGridProps>(
  (
    { sortable = true, order, onReorder, children, className, ...props },
    ref
  ) => {
    const childIds = React.useMemo(() => getChildIds(children), [children])

    // Order is controlled when `order` is provided, otherwise internal.
    const isControlled = order !== undefined
    const [internalOrder, setInternalOrder] = React.useState<string[]>(childIds)

    // Keep internal order in sync when children are added/removed.
    React.useEffect(() => {
      if (isControlled) return
      setInternalOrder((prev) => {
        const kept = prev.filter((id) => childIds.includes(id))
        const added = childIds.filter((id) => !kept.includes(id))
        const next = [...kept, ...added]
        const sameLength = next.length === prev.length
        const same = sameLength && next.every((id, i) => id === prev[i])
        return same ? prev : next
      })
    }, [childIds, isControlled])

    const activeOrder = isControlled ? order : internalOrder

    const sensors = useSensors(
      useSensor(PointerSensor, {
        // Larger distance avoids triggering drag on grid/column-resize interactions.
        activationConstraint: { distance: 8 },
      }),
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
      if (isControlled) {
        onReorder?.(next)
      } else {
        setInternalOrder(next)
        onReorder?.(next)
      }
    }

    // Render children in the active order.
    const childMap = new Map<string, React.ReactElement>()
    React.Children.forEach(children, (child) => {
      if (React.isValidElement<WidgetGridItemProps>(child) && child.props.id) {
        childMap.set(child.props.id, child)
      }
    })
    const orderedChildren = activeOrder
      .map((id) => childMap.get(id))
      .filter((c): c is React.ReactElement => Boolean(c))

    const grid = (
      <div
        ref={ref}
        data-slot="widget-grid"
        className={cn(
          'flex flex-wrap items-start gap-[var(--spacing-sp-24)]',
          className
        )}
        {...props}
      >
        {orderedChildren}
      </div>
    )

    if (!sortable) {
      return (
        <WidgetGridContext.Provider value={{ sortable: false }}>
          {grid}
        </WidgetGridContext.Provider>
      )
    }

    return (
      <WidgetGridContext.Provider value={{ sortable: true }}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={activeOrder} strategy={rectSortingStrategy}>
            {grid}
          </SortableContext>
        </DndContext>
      </WidgetGridContext.Provider>
    )
  }
)

WidgetGrid.displayName = 'WidgetGrid'

export interface WidgetGridItemProps {
  /** Stable unique id used for ordering. */
  id: string
  /** A single Widget (or any node) to position in the grid. */
  children: React.ReactNode
}

const WidgetGridItem = ({ id, children }: WidgetGridItemProps) => {
  const { sortable } = React.useContext(WidgetGridContext)
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
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
  }

  if (!sortable) {
    return (
      <div
        data-slot="widget-grid-item"
        className="min-w-0 max-w-full flex-none"
      >
        {children}
      </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-slot="widget-grid-item"
      data-dragging={isDragging || undefined}
      className="group/grid-item relative min-w-0 max-w-full flex-none"
    >
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
      {children}
    </div>
  )
}

WidgetGridItem.displayName = 'WidgetGridItem'

export { WidgetGrid, WidgetGridItem }
