import * as React from 'react';
import { Primitive } from '@radix-ui/react-primitive';
import clsx from 'clsx';
import { Info, ZoomIn, RefreshCw, GripHorizontal } from 'lucide-react';
import IconButton from '../IconButton/IconButton';
import MenuButton from '../MenuButton/MenuButton';
import { Link } from '../Link/Link';
import styles from './Widget.module.css';

// Types based on widget-temp.json
export type WidgetSize = 'S' | 'M' | 'L';

export interface WidgetMenuItem {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

export interface WidgetSourceInfo {
  label: string;
  href: string;
}

export interface WidgetProps extends React.ComponentPropsWithoutRef<typeof Primitive.div> {
  /**
   * Widget size variant
   * @default 'S'
   */
  size?: WidgetSize;
  /**
   * Widget title displayed in the header (H4)
   */
  title: string;
  /**
   * Optional callback when info icon button is clicked (shows info IconButton if provided)
   */
  onInfoClick?: () => void;
  /**
   * Last update timestamp text (uses medium-regular typography)
   */
  lastUpdate?: string;
  /**
   * Callback when refresh link is clicked
   */
  onRefresh?: () => void;
  /**
   * Callback when zoom/expand button is clicked (opens modal with L size view)
   */
  onZoom?: () => void;
  /**
   * Callback when widget is resized via the drag handle
   * Called with the new target size
   */
  onResize?: (newSize: WidgetSize) => void;
  /**
   * Menu items for the overflow menu button
   */
  menuItems?: WidgetMenuItem[];
  /**
   * Source link displayed in the footer (always rendered as a Link)
   */
  source?: WidgetSourceInfo;
  /**
   * View more link in the footer
   */
  viewMoreLink?: { label: string; href: string };
  /**
   * Widget content
   */
  children?: React.ReactNode;
  /**
   * Additional class name
   */
  className?: string;
}

/**
 * Widget component - A container for dashboard content with header and footer.
 * Based on widget-temp.json Figma specification.
 */
const Widget = React.forwardRef<React.ComponentRef<typeof Primitive.div>, WidgetProps>(
  (
    {
      size = 'S',
      title,
      onInfoClick,
      lastUpdate,
      onRefresh,
      onZoom,
      onResize,
      menuItems,
      source,
      viewMoreLink,
      children,
      className,
      ...rest
    },
    forwardedRef
  ) => {
    const [isDragging, setIsDragging] = React.useState(false);
    const dragStartRef = React.useRef<{ x: number; y: number; size: WidgetSize } | null>(null);

    // Size order for resize calculations
    const sizeOrder: WidgetSize[] = ['S', 'M', 'L'];
    const currentSizeIndex = sizeOrder.indexOf(size);

    const handleResizeStart = (e: React.MouseEvent | React.TouchEvent) => {
      if (!onResize) return;

      e.preventDefault();
      e.stopPropagation();

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      dragStartRef.current = { x: clientX, y: clientY, size };
      setIsDragging(true);

      const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
        if (!dragStartRef.current || !onResize) return;

        const moveX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
        const moveY = 'touches' in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY;

        const deltaX = moveX - dragStartRef.current.x;
        const deltaY = moveY - dragStartRef.current.y;

        // Use the larger of X or Y delta for resize determination
        const delta = Math.max(deltaX, deltaY);
        const threshold = 80; // pixels to trigger size change

        const startIndex = sizeOrder.indexOf(dragStartRef.current.size);
        let newIndex = startIndex;

        if (delta > threshold) {
          newIndex = Math.min(startIndex + 1, sizeOrder.length - 1);
        } else if (delta < -threshold) {
          newIndex = Math.max(startIndex - 1, 0);
        }

        if (newIndex !== currentSizeIndex) {
          onResize(sizeOrder[newIndex]);
        }
      };

      const handleEnd = () => {
        setIsDragging(false);
        dragStartRef.current = null;
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleEnd);
        document.removeEventListener('touchmove', handleMove);
        document.removeEventListener('touchend', handleEnd);
      };

      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleMove);
      document.addEventListener('touchend', handleEnd);
    };

    return (
      <Primitive.div
        ref={forwardedRef}
        className={clsx(styles.widget, styles[`size${size}`], className)}
        data-size={size}
        {...rest}
      >
        {/* Widget Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.titleRow}>
              <h4 className={styles.title}>{title}</h4>
              {onInfoClick && (
                <IconButton
                  ariaLabel="Widget info"
                  size="XS"
                  color="Black"
                  onClick={onInfoClick}
                >
                  <Info size={16} />
                </IconButton>
              )}
            </div>
            {lastUpdate && (
              <div className={styles.updateRow}>
                <span className={styles.lastUpdate}>{lastUpdate}</span>
                {onRefresh && (
                  <Link
                    href="#"
                    icon={<RefreshCw size={14} />}
                    onClick={(e) => {
                      e.preventDefault();
                      onRefresh();
                    }}
                  >
                    Refresh
                  </Link>
                )}
              </div>
            )}
          </div>
          <div className={styles.headerActions}>
            {onZoom && (
              <IconButton ariaLabel="Expand widget in modal" size="S" onClick={onZoom}>
                <ZoomIn size={16} />
              </IconButton>
            )}
            {menuItems && menuItems.length > 0 && (
              <MenuButton ariaLabel="Widget menu" size="S" />
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className={styles.content}>
          {children}
        </div>

        {/* Footer */}
        {(source || viewMoreLink) && (
          <div className={styles.footer}>
            {source && (
              <Link href={source.href}>{source.label}</Link>
            )}
            {viewMoreLink && (
              <Link href={viewMoreLink.href}>{viewMoreLink.label}</Link>
            )}
          </div>
        )}

        {/* Resize Handle - Bottom Right Corner */}
        {onResize && (
          <div
            className={clsx(styles.resizeHandle, isDragging && styles.resizeHandleActive)}
            onMouseDown={handleResizeStart}
            onTouchStart={handleResizeStart}
            role="slider"
            aria-label="Resize widget"
            aria-valuenow={currentSizeIndex}
            aria-valuemin={0}
            aria-valuemax={2}
            tabIndex={0}
          >
            <GripHorizontal size={16} />
          </div>
        )}
      </Primitive.div>
    );
  }
);

Widget.displayName = 'Widget';

export { Widget };
export default Widget;
