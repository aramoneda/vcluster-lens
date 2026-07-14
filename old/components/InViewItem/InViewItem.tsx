import React from 'react';
import { Primitive } from '@radix-ui/react-primitive';
import clsx from 'clsx';
import Checkbox from '../Checkbox/Checkbox';
import Badge, { BadgeColor } from '../Badge/Badge';
import styles from './InViewItem.module.css';

export interface InViewItemBadge {
  /** Badge text content */
  text: string;
  /** Badge color */
  color?: BadgeColor;
}

export interface InViewItemDataEntry {
  /** Label for the data entry */
  label: string;
  /** Value to display */
  value: string;
  /** Optional badge to show alongside the value */
  badge?: {
    text: string;
    color?: BadgeColor;
  };
}

export interface InViewItemProps extends Omit<React.ComponentPropsWithoutRef<typeof Primitive.div>, 'children'> {
  /** Whether the item is selected */
  selected?: boolean;
  /** Callback when checkbox state changes */
  onCheckedChange?: (checked: boolean) => void;
  /** Owner label text (e.g., "Owner: John Ford") */
  ownerLabel?: string;
  /** Main label/name text (e.g., "Claudia Francis (8364)") */
  label: string;
  /** Array of badges to display (e.g., currency badge, type badge) */
  badges?: InViewItemBadge[];
  /** Array of data entries to display on the right side */
  dataEntries?: InViewItemDataEntry[];
  /** Whether the checkbox is disabled */
  disabled?: boolean;
  /** Additional class name */
  className?: string;
}

/**
 * InViewItem component for displaying selectable list items with data.
 * Features a checkbox, labels, badges, and data entries.
 * 
 * Based on Figma JSON specification: figma-jsons/inviewitem.json
 */
const InViewItem = React.forwardRef<React.ComponentRef<typeof Primitive.div>, InViewItemProps>(
  (
    {
      selected = false,
      onCheckedChange,
      ownerLabel,
      label,
      badges = [],
      dataEntries = [],
      disabled = false,
      className,
      ...rest
    },
    forwardedRef
  ) => {
    return (
      <Primitive.div
        ref={forwardedRef}
        className={clsx(
          styles.inViewItem,
          {
            [styles.selected]: selected,
            [styles.disabled]: disabled,
          },
          className
        )}
        data-state={selected ? 'selected' : 'default'}
        data-disabled={disabled ? '' : undefined}
        {...rest}
      >
        {/* Left Container */}
        <div className={styles.leftContainer}>
          {/* Checkbox Wrapper */}
          <div className={styles.checkboxWrapper}>
            <Checkbox
              checked={selected}
              onCheckedChange={(checked) => onCheckedChange?.(checked === true)}
              disabled={disabled}
              size="18px"
            />
          </div>

          {/* Content Wrapper */}
          <div className={styles.contentWrapper}>
            {/* Top Container - Labels */}
            <div className={styles.topContainer}>
              {ownerLabel && (
                <span className={styles.ownerLabel}>{ownerLabel}</span>
              )}
              <span className={clsx(styles.label, { [styles.labelSelected]: selected })}>
                {label}
              </span>
            </div>

            {/* Badges Container */}
            {badges.length > 0 && (
              <div className={styles.badgesContainer}>
                {badges.map((badge, index) => (
                  <Badge
                    key={index}
                    color={badge.color || 'Default'}
                    badgeType="Filled"
                    size="Default"
                  >
                    {badge.text}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Container - Data Entries */}
        {dataEntries.length > 0 && (
          <div className={styles.rightContainer}>
            {dataEntries.map((entry, index) => (
              <div key={index} className={styles.dataEntry}>
                <span className={styles.dataEntryLabel}>{entry.label}</span>
                <div className={styles.dataEntryValue}>
                  {entry.badge ? (
                    <Badge
                      color={entry.badge.color || 'Grass'}
                      badgeType="Filled"
                      size="Default"
                    >
                      {entry.badge.text}
                    </Badge>
                  ) : (
                    <span className={styles.dataEntryValueText}>{entry.value}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Primitive.div>
    );
  }
);

InViewItem.displayName = 'InViewItem';

export default InViewItem;

