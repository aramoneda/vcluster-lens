import * as React from 'react';
import { Primitive } from '@radix-ui/react-primitive';
import { clsx } from 'clsx';
import { IntercomOverlay, IntercomOverlayProps } from '../IntercomOverlay/IntercomOverlay';
import styles from './IntercomGroup.module.css';

// Type definitions based on Figma JSON properties
export type IntercomGroupInstance = 'Collapse' | 'Expand';

export interface IntercomNotification extends Omit<IntercomOverlayProps, 'children'> {
  /**
   * Unique identifier for the notification
   */
  id: string;
  /**
   * The notification message content
   */
  message: React.ReactNode;
}

export interface IntercomGroupProps extends React.ComponentPropsWithoutRef<typeof Primitive.div> {
  /**
   * The instance/variant of the intercom group.
   * Corresponds to 'Collapse', 'Expand' from Figma JSON.
   * @default 'Collapse'
   */
  instance?: IntercomGroupInstance;
  /**
   * Array of notifications to display.
   * In collapse mode, shows a summary notification.
   * In expand mode, all individual notifications are shown.
   */
  notifications: IntercomNotification[];
  /**
   * Callback when a notification is dismissed.
   */
  onNotificationDismiss?: (id: string) => void;
  /**
   * Callback when the group expand is clicked (collapse mode).
   */
  onGroupExpand?: () => void;
  /**
   * Callback when the group collapse is clicked (expand mode).
   */
  onGroupCollapse?: () => void;
  /**
   * Callback when a notification expand is clicked.
   */
  onNotificationExpand?: (id: string) => void;
  /**
   * Callback when a notification collapse is clicked.
   */
  onNotificationCollapse?: (id: string) => void;
  /**
   * Link content for the summary notification in collapse mode.
   * @default "View Details"
   */
  summaryLinkContent?: React.ReactNode;
  /**
   * Link href for the summary notification in collapse mode.
   */
  summaryLinkHref?: string;
  /**
   * Additional CSS class names to apply.
   */
  className?: string;
}

/**
 * IntercomGroup component for displaying a collection of notification overlays.
 * Based on Figma JSON specification: figma-jsons/intercom-grouping.json
 * 
 * Features:
 * - Instance variants: Collapse (shows limited notifications), Expand (shows all notifications)
 * - Vertical layout with consistent spacing
 * - Manages multiple IntercomOverlay components
 * - Proper accessibility with ARIA attributes
 */
const IntercomGroup = React.forwardRef<React.ComponentRef<typeof Primitive.div>, IntercomGroupProps>(
  (
    {
      instance = 'Collapse', // Default from Figma JSON
      notifications,
      onNotificationDismiss,
      onGroupExpand,
      onGroupCollapse,
      onNotificationExpand,
      onNotificationCollapse,
      summaryLinkContent = 'View Details',
      summaryLinkHref,
      className,
      ...rest
    },
    ref
  ) => {
    const groupClasses = clsx(
      styles.intercomGroup,
      styles[`instance${instance}`], // e.g., styles.instanceCollapse
      className
    );

    // Handle notification dismiss
    const handleNotificationDismiss = (id: string) => {
      onNotificationDismiss?.(id);
    };

    // Handle notification expand
    const handleNotificationExpand = (id: string) => {
      onNotificationExpand?.(id);
    };

    // Handle notification collapse
    const handleNotificationCollapse = (id: string) => {
      onNotificationCollapse?.(id);
    };

    // Determine the most common notification type for summary (or use 'Info' as default)
    const summaryType = React.useMemo(() => {
      if (notifications.length === 0) return 'Info';

      // Count notification types
      const typeCounts = notifications.reduce((acc, notification) => {
        const type = notification.type || 'Info';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Return the most common type
      return Object.entries(typeCounts).reduce((a, b) =>
        typeCounts[a[0]] > typeCounts[b[0]] ? a : b
      )[0] as IntercomNotification['type'];
    }, [notifications]);

    return (
      <Primitive.div
        ref={ref}
        className={groupClasses}
        role="region"
        aria-label="Notification group"
        {...rest}
      >
        {instance === 'Collapse' ? (
          // Collapse mode: Show summary notification with stacking effect
          <div className={styles.stackedContainer}>
            {/* Stacked mock intercoms for visual effect - only show 2 regardless of count */}
            {notifications.length > 1 && (
              <div className={styles.stackedMocks}>
                <div className={clsx(styles.mockIntercom, styles.mockIntercom2, styles[`type${summaryType}`])} />
                <div className={clsx(styles.mockIntercom, styles.mockIntercom1, styles[`type${summaryType}`])} />
              </div>
            )}

            {/* Main summary notification */}
            <IntercomOverlay
              type={summaryType}
              expand={true}
              link={true}
              linkContent={summaryLinkContent}
              linkHref={summaryLinkHref}
              onExpand={onGroupExpand}
              className={styles.summaryNotification}
            >
              You have {notifications.length} notification{notifications.length !== 1 ? 's' : ''}.
            </IntercomOverlay>
          </div>
        ) : (
          // Expand mode: Show collapse control first, then individual notifications
          <>
            {/* Show collapse control at the top in expand mode */}
            {notifications.length > 1 && (
              <IntercomOverlay
                type="Info"
                collapse={true}
                onCollapse={onGroupCollapse}
                className={styles.collapseControl}
              >
                Collapse notifications
              </IntercomOverlay>
            )}

            {/* Individual notifications */}
            {notifications.map((notification) => {
              const {
                id,
                message,
                type,
                expand,
                collapse,
                link,
                linkContent,
                linkHref,
                onExpand,
                onCollapse,
                onDismiss,
                ...notificationRest
              } = notification;

              return (
                <IntercomOverlay
                  key={id}
                  type={type}
                  expand={expand}
                  collapse={collapse}
                  link={link}
                  linkContent={linkContent}
                  linkHref={linkHref}
                  onExpand={() => {
                    onExpand?.();
                    handleNotificationExpand(id);
                  }}
                  onCollapse={() => {
                    onCollapse?.();
                    handleNotificationCollapse(id);
                  }}
                  onDismiss={() => {
                    onDismiss?.();
                    handleNotificationDismiss(id);
                  }}
                  className={styles.notification}
                  {...notificationRest}
                >
                  {message}
                </IntercomOverlay>
              );
            })}
          </>
        )}
      </Primitive.div>
    );
  }
);

IntercomGroup.displayName = 'IntercomGroup';

export { IntercomGroup };
