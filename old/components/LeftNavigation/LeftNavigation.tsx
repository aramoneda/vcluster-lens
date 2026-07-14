import React from 'react';
import clsx from 'clsx';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { Tooltip } from '../Tooltip/Tooltip';
import styles from './LeftNavigation.module.css';

export interface LeftNavItem {
  /** Unique identifier for the nav item */
  id: string;
  /** Icon to display (React node, e.g., Lucide icon) */
  icon: React.ReactNode;
  /** Label text for the nav item */
  label: string;
  /** Whether the item is currently active/selected */
  isActive?: boolean;
  /** Callback when item is clicked */
  onClick?: () => void;
  /** Optional href for anchor behavior */
  href?: string;
}

export type LeftNavigationType = 'Full' | 'Minimised';

export interface LeftNavigationProps extends Omit<React.ComponentPropsWithoutRef<'nav'>, 'children'> {
  /** Navigation items to display */
  items: LeftNavItem[];
  /** Type variant: 'Full' (317px) or 'Minimised' (104px) */
  type?: LeftNavigationType;
  /** Additional class name */
  className?: string;
}

/**
 * LeftNavigation component - A vertical navigation sidebar with Full and Minimised variants.
 * Full version is shown at 2050+ viewport width.
 *
 * Based on Figma JSON specification: figma-jsons/leftnav.json
 */
const LeftNavigation = React.forwardRef<HTMLElement, LeftNavigationProps>(
  (
    {
      items,
      type = 'Full',
      className,
      ...rest
    },
    forwardedRef
  ) => {
    const isMinimised = type === 'Minimised';

    const renderNavItem = (item: LeftNavItem) => {
      const itemContent = (
        <button
          key={item.id}
          className={clsx(
            styles.navItem,
            isMinimised && styles.navItemMinimised,
            item.isActive && styles.navItemActive
          )}
          onClick={item.onClick}
          aria-current={item.isActive ? 'page' : undefined}
        >
          <span className={styles.navItemIcon}>{item.icon}</span>
          <span className={styles.navItemLabel}>{item.label}</span>
        </button>
      );

      // In minimised mode, wrap with tooltip
      if (isMinimised) {
        return (
          <Tooltip key={item.id} content={item.label} side="right">
            {itemContent}
          </Tooltip>
        );
      }

      return itemContent;
    };

    return (
      <TooltipPrimitive.Provider delayDuration={300}>
        <nav
          ref={forwardedRef}
          className={clsx(
            styles.leftNavigation,
            isMinimised && styles.minimised,
            className
          )}
          aria-label="Main navigation"
          {...rest}
        >
          <div className={styles.itemContainer}>
            {items.map(renderNavItem)}
          </div>
        </nav>
      </TooltipPrimitive.Provider>
    );
  }
);

LeftNavigation.displayName = 'LeftNavigation';

export default LeftNavigation;

