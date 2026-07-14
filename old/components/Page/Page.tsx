import React from 'react';
import clsx from 'clsx';
import { Primitive } from '@radix-ui/react-primitive';
import { RefreshCw } from 'lucide-react';
import { Breadcrumbs, BreadcrumbItem } from '../Breadcrumbs/Breadcrumbs';
import IconButton from '../IconButton/IconButton';
import styles from './Page.module.css';

export interface PageProps extends React.ComponentPropsWithoutRef<typeof Primitive.div> {
  /**
   * Page title displayed in the header (H3 style)
   */
  title: string;
  /**
   * Timestamp text to display next to the title
   */
  timestamp?: string;
  /**
   * Callback when refresh button is clicked
   */
  onRefresh?: () => void;
  /**
   * Whether the refresh action is currently loading
   */
  isRefreshing?: boolean;
  /**
   * Optional breadcrumb items to display above the header
   */
  breadcrumbs?: BreadcrumbItem[];
  /**
   * Optional content to render on the right side of the page header
   */
  headerSlot?: React.ReactNode;
  /**
   * Page content - will be placed in the grid container
   */
  children?: React.ReactNode;
  /**
   * Additional class name for the page container
   */
  className?: string;
}

/**
 * Page component - A layout component that provides:
 * - Optional breadcrumbs navigation
 * - Page header with title, timestamp with refresh, and a slot for custom content
 * - Responsive grid layout based on breakpoint specifications
 * 
 * Breakpoints:
 * - 2XL (1920+): 12 columns, 48px margin, 24px gutter
 * - XL (1600-1919): 12 columns, 48px margin, 24px gutter
 * - L (1280-1599): 6 columns, 48px margin, 24px gutter
 * - M (768-1279): 6 columns, 24px margin, 24px gutter
 * - S (350-767): 3 columns, 24px margin, 24px gutter
 */
const Page = React.forwardRef<React.ComponentRef<typeof Primitive.div>, PageProps>(
  (
    {
      title,
      timestamp,
      onRefresh,
      isRefreshing = false,
      breadcrumbs,
      headerSlot,
      children,
      className,
      ...rest
    },
    forwardedRef
  ) => {
    return (
      <Primitive.div
        ref={forwardedRef}
        className={clsx(styles.page, className)}
        {...rest}
      >
        {/* Breadcrumbs - Optional */}
        {breadcrumbs && breadcrumbs.length > 1 && (
          <div className={styles.breadcrumbsContainer}>
            <Breadcrumbs items={breadcrumbs} />
          </div>
        )}

        {/* Page Header */}
        <header className={styles.pageHeader}>
          <div className={styles.headerLeft}>
            <h3 className={styles.pageTitle}>{title}</h3>
            {timestamp && (
              <div className={styles.timestampContainer}>
                <span className={styles.timestamp}>{timestamp}</span>
                {onRefresh && (
                  <IconButton
                    ariaLabel="Refresh"
                    size="S"
                    color="Blue"
                    onClick={onRefresh}
                    disabled={isRefreshing}
                    className={clsx(styles.refreshButton, isRefreshing && styles.refreshing)}
                  >
                    <RefreshCw size={16} />
                  </IconButton>
                )}
              </div>
            )}
          </div>
          {headerSlot && (
            <div className={styles.headerSlot}>
              {headerSlot}
            </div>
          )}
        </header>

        {/* Grid Container for Page Content */}
        <div className={styles.gridContainer}>
          {children}
        </div>
      </Primitive.div>
    );
  }
);

Page.displayName = 'Page';

export default Page;

