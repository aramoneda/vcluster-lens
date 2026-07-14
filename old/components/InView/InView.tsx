import React from 'react';
import * as RadixPopover from '@radix-ui/react-popover';
import { Primitive } from '@radix-ui/react-primitive';
import clsx from 'clsx';
import { User, ChevronDown, ChevronUp } from 'lucide-react';
import { ButtonGroup } from '../ButtonGroup/ButtonGroup';
import { ButtonGroupItem } from '../ButtonGroup/ButtonGroupItem';
import { Button } from '../Button/Button';
import Checkbox from '../Checkbox/Checkbox';
import Badge, { BadgeColor } from '../Badge/Badge';
import BadgeIcon from '../BadgeIcon/BadgeIcon';
import IconButton from '../IconButton/IconButton';
import InViewItem, { InViewItemProps } from '../InViewItem/InViewItem';
import styles from './InView.module.css';

export interface InViewTab {
  /** Unique value for the tab */
  value: string;
  /** Tab label text */
  label: string;
}

export interface InViewItemData extends Omit<InViewItemProps, 'selected' | 'onCheckedChange'> {
  /** Unique identifier for the item */
  id: string;
}

export interface InViewProps extends Omit<React.ComponentPropsWithoutRef<typeof Primitive.div>, 'children'> {
  /** Text label displayed in the trigger */
  label: string;
  /** Value badge text displayed in the trigger */
  valueBadge?: string;
  /** Color of the value badge */
  valueBadgeColor?: BadgeColor;
  /** Type of the value badge (Filled or Outline) */
  valueBadgeType?: 'Filled' | 'Outline';
  /** Available tabs for filtering */
  tabs?: InViewTab[];
  /** Currently selected tab value */
  selectedTab?: string;
  /** Callback when tab selection changes */
  onTabChange?: (tabValue: string) => void;
  /** Section title displayed above the items list */
  sectionTitle?: string;
  /** Items to display in the selector */
  items?: InViewItemData[];
  /** Currently selected item IDs */
  selectedItems?: string[];
  /** Callback when item selection changes */
  onSelectedItemsChange?: (selectedIds: string[]) => void;
  /** Callback when Apply button is clicked */
  onApply?: () => void;
  /** Callback when Clear All button is clicked */
  onClearAll?: () => void;
  /** Whether the popover is open (controlled) */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Whether the component is disabled */
  disabled?: boolean;
  /** Whether to hide the value badge */
  hideBadge?: boolean;
  /** Additional class name */
  className?: string;
}

/**
 * InView component - A selector with trigger and dropdown panel containing
 * tabs, a list of selectable items, and action buttons.
 * 
 * Based on Figma JSON specification: figma-jsons/inview.json
 */
const InView = React.forwardRef<React.ComponentRef<typeof Primitive.div>, InViewProps>(
  (
    {
      label,
      valueBadge,
      valueBadgeColor = 'Grass',
      valueBadgeType = 'Outline',
      tabs = [],
      selectedTab,
      onTabChange,
      sectionTitle = 'All Related Accounts',
      items = [],
      selectedItems = [],
      onSelectedItemsChange,
      onApply,
      onClearAll,
      open,
      onOpenChange,
      disabled = false,
      hideBadge = false,
      className,
      ...rest
    },
    forwardedRef
  ) => {
    const [internalOpen, setInternalOpen] = React.useState(false);
    const isControlled = open !== undefined;
    const isOpen = isControlled ? open : internalOpen;

    const handleOpenChange = (newOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    };

    const allSelected = items.length > 0 && selectedItems.length === items.length;
    const someSelected = selectedItems.length > 0 && selectedItems.length < items.length;

    const handleSelectAll = (checked: boolean | 'indeterminate') => {
      if (checked === true) {
        onSelectedItemsChange?.(items.map((item) => item.id));
      } else {
        onSelectedItemsChange?.([]);
      }
    };

    const handleItemCheckedChange = (itemId: string, checked: boolean) => {
      if (checked) {
        onSelectedItemsChange?.([...selectedItems, itemId]);
      } else {
        onSelectedItemsChange?.(selectedItems.filter((id) => id !== itemId));
      }
    };

    return (
      <Primitive.div ref={forwardedRef} className={clsx(styles.inViewRoot, className)} {...rest}>
        <RadixPopover.Root open={isOpen} onOpenChange={handleOpenChange}>
          <RadixPopover.Trigger asChild disabled={disabled}>
            <div
              className={clsx(styles.trigger, {
                [styles.triggerActive]: isOpen,
                [styles.triggerDisabled]: disabled,
              })}
              data-state={isOpen ? 'open' : 'closed'}
              data-disabled={disabled ? '' : undefined}
            >
              <div className={styles.triggerInfoContainer}>
                <BadgeIcon icon={User} color="Sky" size="Small" />
                <span className={styles.triggerLabel}>{label}</span>
                {valueBadge && !hideBadge && (
                  <Badge color={valueBadgeColor} badgeType={valueBadgeType} size="Default">
                    {valueBadge}
                  </Badge>
                )}
              </div>
              <IconButton
                ariaLabel={isOpen ? 'Collapse selector' : 'Expand selector'}
                size="S"
                color="Black"
              >
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </IconButton>
            </div>
          </RadixPopover.Trigger>

          <RadixPopover.Portal>
            <RadixPopover.Content
              className={styles.content}
              sideOffset={8}
              align="start"
            >
              {/* Tabs Section */}
              {tabs.length > 0 && (
                <ButtonGroup
                  type="single"
                  value={selectedTab}
                  onValueChange={(value) => value && onTabChange?.(value)}
                  size="M"
                  className={styles.tabGroup}
                >
                  {tabs.map((tab) => (
                    <ButtonGroupItem key={tab.value} value={tab.value}>
                      {tab.label}
                    </ButtonGroupItem>
                  ))}
                </ButtonGroup>
              )}

              {/* Section Title */}
              {sectionTitle && (
                <h5 className={styles.sectionTitle}>{sectionTitle}</h5>
              )}

              {/* Select All Checkbox */}
              <div className={styles.selectAllWrapper}>
                <Checkbox
                  checked={allSelected ? true : someSelected ? 'indeterminate' : false}
                  onCheckedChange={handleSelectAll}
                  label="Select All"
                  size="18px"
                />
              </div>

              {/* Items List */}
              <div className={styles.itemsList}>
                {items.map((item) => (
                  <InViewItem
                    key={item.id}
                    selected={selectedItems.includes(item.id)}
                    onCheckedChange={(checked) => handleItemCheckedChange(item.id, checked)}
                    ownerLabel={item.ownerLabel}
                    label={item.label}
                    badges={item.badges}
                    dataEntries={item.dataEntries}
                    disabled={item.disabled}
                  />
                ))}
              </div>

              {/* Bottom Action Buttons */}
              <div className={styles.bottomContainer}>
                <div className={styles.buttonWrapper}>
                  <Button buttonStyle="secondary" onClick={onClearAll}>
                    Clear All
                  </Button>
                  <Button buttonStyle="primary" onClick={onApply}>
                    Apply
                  </Button>
                </div>
              </div>
            </RadixPopover.Content>
          </RadixPopover.Portal>
        </RadixPopover.Root>
      </Primitive.div>
    );
  }
);

InView.displayName = 'InView';

export default InView;

