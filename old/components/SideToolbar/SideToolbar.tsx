import React from 'react';
import clsx from 'clsx';
import IconButton from '../IconButton/IconButton';
import styles from './SideToolbar.module.css';

export interface SideToolbarItem {
  /** Unique identifier for the item */
  id: string;
  /** Icon to display (Lucide icon component) */
  icon: React.ReactNode;
  /** Accessible label for the button (also shown in tooltip) */
  ariaLabel: string;
  /** Whether the item is currently active/selected */
  isActive?: boolean;
  /** Whether the item is disabled */
  disabled?: boolean;
  /** Callback when item is clicked */
  onClick?: () => void;
}

export interface SideToolbarProps extends Omit<React.ComponentPropsWithoutRef<'aside'>, 'children'> {
  /** Items to display in the top group */
  topItems?: SideToolbarItem[];
  /** Items to display in the bottom group */
  bottomItems?: SideToolbarItem[];
  /** Additional class name */
  className?: string;
}

/**
 * SideToolbar component - A vertical toolbar with icon buttons organized
 * into top and bottom groups, separated by flexible space.
 *
 * Based on Figma JSON specification: figma-jsons/sidetoolbar.json
 */
const SideToolbar = React.forwardRef<HTMLElement, SideToolbarProps>(
  (
    {
      topItems = [],
      bottomItems = [],
      className,
      ...rest
    },
    forwardedRef
  ) => {
    return (
      <aside
        ref={forwardedRef}
        className={clsx(styles.sideToolbar, className)}
        {...rest}
      >
        {/* Top Group */}
        {topItems.length > 0 && (
          <div className={styles.topGroup}>
            {topItems.map((item) => (
              <IconButton
                key={item.id}
                ariaLabel={item.ariaLabel}
                size="M"
                color="Blue"
                isActive={item.isActive}
                disabled={item.disabled}
                onClick={item.onClick}
                tooltipSide="left"
              >
                {item.icon}
              </IconButton>
            ))}
          </div>
        )}

        {/* Bottom Group */}
        {bottomItems.length > 0 && (
          <div className={styles.bottomGroup}>
            {bottomItems.map((item, index) => (
              <React.Fragment key={item.id}>
                {/* Add divider before the last item */}
                {index === bottomItems.length - 1 && bottomItems.length > 1 && (
                  <div className={styles.divider} />
                )}
                <IconButton
                  ariaLabel={item.ariaLabel}
                  size="M"
                  color="Blue"
                  isActive={item.isActive}
                  disabled={item.disabled}
                  onClick={item.onClick}
                  tooltipSide="left"
                >
                  {item.icon}
                </IconButton>
              </React.Fragment>
            ))}
          </div>
        )}
      </aside>
    );
  }
);

SideToolbar.displayName = 'SideToolbar';

export default SideToolbar;

