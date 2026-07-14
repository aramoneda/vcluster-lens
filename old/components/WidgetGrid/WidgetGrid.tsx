import * as React from 'react';
import { Primitive } from '@radix-ui/react-primitive';
import clsx from 'clsx';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styles from './WidgetGrid.module.css';

export interface WidgetGridProps extends React.ComponentPropsWithoutRef<typeof Primitive.div> {
  /**
   * Show column grid overlay for development/debugging
   * @default false
   */
  showGridOverlay?: boolean;
  /**
   * Maximum width of the grid container
   * @default '1920px'
   */
  maxWidth?: string;
  /**
   * Remove internal padding (useful when WidgetGrid is inside Page component)
   * @default false
   */
  noPadding?: boolean;
  /**
   * Enable drag and drop reordering of widgets
   * @default false
   */
  sortable?: boolean;
  /**
   * Array of widget IDs in their current order (required when sortable=true)
   */
  widgetOrder?: string[];
  /**
   * Callback when widgets are reordered via drag and drop
   */
  onReorder?: (newOrder: string[]) => void;
  /**
   * Widget elements to be laid out in the grid
   */
  children?: React.ReactNode;
  /**
   * Additional class name
   */
  className?: string;
}

/** Sortable wrapper for individual widgets */
interface SortableWidgetProps {
  id: string;
  /** Widget size - passed through to data-size attribute for grid column spanning */
  size?: 'S' | 'M' | 'L';
  children: React.ReactNode;
}

const SortableWidget: React.FC<SortableWidgetProps> = ({ id, size, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 'auto',
  };

  return (
    <div ref={setNodeRef} style={style} data-size={size} {...attributes} {...listeners}>
      {children}
    </div>
  );
};

/**
 * WidgetGrid component - A responsive grid container for Widget components.
 * Uses CSS Grid with breakpoint-based column layouts:
 * - S (350-767px): 3 columns
 * - M (768-967px): 6 columns
 * - M+ (968-1279px): 6 columns
 * - L (1280-1599px): 6 columns
 * - XL (1600-1919px): 12 columns
 * - 2XL (1920px+): 12 columns
 *
 * Supports drag-and-drop reordering when sortable=true
 */
const WidgetGrid = React.forwardRef<React.ComponentRef<typeof Primitive.div>, WidgetGridProps>(
  (
    {
      showGridOverlay = false,
      maxWidth = '1920px',
      noPadding = false,
      sortable = false,
      widgetOrder,
      onReorder,
      children,
      className,
      style,
      ...rest
    },
    forwardedRef
  ) => {
    // Get current column count from CSS variable for grid overlay
    const [columns, setColumns] = React.useState(12);

    // Set up drag and drop sensors
    // Use larger distance to avoid conflicts with interactive elements like AG Grid column resizers
    const sensors = useSensors(
      useSensor(PointerSensor, {
        activationConstraint: {
          distance: 15, // Larger distance to avoid triggering on column resize
        },
      }),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      })
    );

    React.useEffect(() => {
      const updateColumns = () => {
        const width = window.innerWidth;
        if (width < 768) {
          setColumns(3);
        } else if (width < 1600) {
          setColumns(6);
        } else {
          setColumns(12);
        }
      };

      updateColumns();
      window.addEventListener('resize', updateColumns);
      return () => window.removeEventListener('resize', updateColumns);
    }, []);

    const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id && widgetOrder && onReorder) {
        const oldIndex = widgetOrder.indexOf(active.id as string);
        const newIndex = widgetOrder.indexOf(over.id as string);

        const newOrder = [...widgetOrder];
        newOrder.splice(oldIndex, 1);
        newOrder.splice(newIndex, 0, active.id as string);

        onReorder(newOrder);
      }
    };

    // Render children with sortable wrappers if sortable mode is enabled
    const renderChildren = () => {
      if (!sortable || !widgetOrder) {
        return children;
      }

      // Wrap each child in a SortableWidget using widgetOrder for IDs
      const childrenArray = React.Children.toArray(children);

      return childrenArray.map((child, index) => {
        if (!React.isValidElement(child)) return child;

        // Use the ID from widgetOrder based on index position
        const id = widgetOrder[index];
        if (!id) return child;

        // Extract size prop from the child widget to pass to wrapper for grid spanning
        const childSize = (child.props as { size?: 'S' | 'M' | 'L' }).size;

        return (
          <SortableWidget key={id} id={id} size={childSize}>
            {child}
          </SortableWidget>
        );
      });
    };

    const gridContent = (
      <Primitive.div
        ref={forwardedRef}
        className={clsx(styles.widgetGridContainer, className)}
        style={{ ...style, '--max-width': maxWidth } as React.CSSProperties}
        {...rest}
      >
        {/* Grid overlay for development */}
        {showGridOverlay && (
          <div className={styles.gridOverlay}>
            {Array.from({ length: columns }).map((_, i) => (
              <div key={i} className={styles.gridColumn} />
            ))}
          </div>
        )}

        {/* Actual widget grid */}
        <div className={clsx(styles.widgetGrid, noPadding && styles.noPadding)}>
          {renderChildren()}
        </div>
      </Primitive.div>
    );

    // Wrap with DndContext if sortable
    if (sortable && widgetOrder) {
      return (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={widgetOrder} strategy={rectSortingStrategy}>
            {gridContent}
          </SortableContext>
        </DndContext>
      );
    }

    return gridContent;
  }
);

WidgetGrid.displayName = 'WidgetGrid';

export { WidgetGrid, SortableWidget };
export default WidgetGrid;

