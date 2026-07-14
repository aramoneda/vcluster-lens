import * as React from 'react';
import * as RadixDropdownMenu from '@radix-ui/react-dropdown-menu';
import { Slot } from '@radix-ui/react-slot';
import clsx from 'clsx';
import { ChevronRight, Check } from 'lucide-react';
import styles from './DropdownMenu.module.css';
import CheckboxComponent from '../Checkbox/Checkbox'; // Renamed to avoid conflict
// Removed import for CustomRadioGroup as it caused issues with Radix hierarchy

// --- Prop Types ---

export type DropdownMenuPosition =
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'left'
  | 'right';

export interface DropdownMenuContentProps
  extends React.ComponentPropsWithoutRef<typeof RadixDropdownMenu.Content> {
  asChild?: boolean;
  position?: DropdownMenuPosition;
}

export interface DropdownMenuItemProps
  extends React.ComponentPropsWithoutRef<typeof RadixDropdownMenu.Item> {
  asChild?: boolean;
  inset?: boolean; // For items that might have icons/checkboxes and need text alignment
  isActive?: boolean; // New prop for active state
  leadingIcon?: React.ReactNode; // Explicit leading icon
  leadingVisual?: React.ReactNode; // Explicit leading visual (takes precedence over leadingIcon)
}

export interface DropdownMenuCheckboxItemProps
  extends React.ComponentPropsWithoutRef<typeof RadixDropdownMenu.CheckboxItem> {
  asChild?: boolean;
}

export interface DropdownMenuRadioItemProps
  extends React.ComponentPropsWithoutRef<typeof RadixDropdownMenu.RadioItem> {
  asChild?: boolean;
}

export interface DropdownMenuLabelProps
  extends React.ComponentPropsWithoutRef<typeof RadixDropdownMenu.Label> {
  asChild?: boolean;
  inset?: boolean;
}

export interface DropdownMenuSeparatorProps
  extends React.ComponentPropsWithoutRef<typeof RadixDropdownMenu.Separator> {
  asChild?: boolean;
}

export interface DropdownMenuSubContentProps
  extends React.ComponentPropsWithoutRef<typeof RadixDropdownMenu.SubContent> {
  asChild?: boolean;
}

export interface DropdownMenuSubTriggerProps
  extends React.ComponentPropsWithoutRef<typeof RadixDropdownMenu.SubTrigger> {
  asChild?: boolean;
  inset?: boolean;
}

// --- Styled Components ---

const DropdownMenuContent = React.forwardRef<
  React.ComponentRef<typeof RadixDropdownMenu.Content>,
  DropdownMenuContentProps
>(
  (
    {
      className,
      asChild,
      sideOffset = 4,
      position = 'bottom-left',
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : RadixDropdownMenu.Content;

    const positionProps = {
      'bottom-left': { side: 'bottom', align: 'start' },
      'bottom-center': { side: 'bottom', align: 'center' },
      'bottom-right': { side: 'bottom', align: 'end' },
      'top-left': { side: 'top', align: 'start' },
      'top-center': { side: 'top', align: 'center' },
      'top-right': { side: 'top', align: 'end' },
      left: { side: 'left', align: 'center' },
      right: { side: 'right', align: 'center' },
    }[position] as {
      side: 'bottom' | 'top' | 'left' | 'right';
      align: 'start' | 'center' | 'end';
    };

    return (
      <RadixDropdownMenu.Portal>
        <Comp
          ref={ref}
          sideOffset={sideOffset}
          className={clsx(styles.content, className)}
          {...positionProps}
          {...props}
          style={props.style}
        />
      </RadixDropdownMenu.Portal>
    );
  }
);
DropdownMenuContent.displayName = RadixDropdownMenu.Content.displayName;

const DropdownMenuItem = React.forwardRef<
  React.ComponentRef<typeof RadixDropdownMenu.Item>,
  DropdownMenuItemProps
>
(({
  className,
  asChild,
  inset,
  isActive,
  children,
  leadingIcon,
  leadingVisual,
  ...props
}, ref) => {
  const Comp = asChild ? Slot : RadixDropdownMenu.Item;

  let actualLeadingContent: React.ReactNode = null;
  if (leadingVisual) {
    actualLeadingContent = leadingVisual;
  } else if (leadingIcon) {
    actualLeadingContent = leadingIcon;
  }

  return (
    // @ts-expect-error Radix onSelect event type vs Slot's expected HTML event type
    <Comp
      ref={ref}
      className={clsx(
        styles.item,
        inset && styles.itemInset,
        className
      )}
      data-active={isActive ? '' : undefined}
      {...props}
    >
      {actualLeadingContent}
      {children}
    </Comp>
  );
});
DropdownMenuItem.displayName = RadixDropdownMenu.Item.displayName;

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ComponentRef<typeof RadixDropdownMenu.CheckboxItem>,
  DropdownMenuCheckboxItemProps
>(({ className, asChild, children, checked, onCheckedChange, disabled, ...props }, ref) => {
  const Comp = asChild ? Slot : RadixDropdownMenu.CheckboxItem;
  return (
    // @ts-expect-error Radix onSelect event type vs Slot's expected HTML event type
    <Comp
      ref={ref}
      className={clsx(styles.checkboxItem, className)}
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      {...props}
    >
      <CheckboxComponent
        size="18px" // As per Figma for dropdown items
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        aria-hidden // The parent item handles accessibility
        // The CheckboxComponent itself doesn't take children in this context
        // The label is the `children` prop of DropdownMenuCheckboxItem
      />
      {children}
    </Comp>
  );
});
DropdownMenuCheckboxItem.displayName = RadixDropdownMenu.CheckboxItem.displayName;

const DropdownMenuRadioItem = React.forwardRef<
  React.ComponentRef<typeof RadixDropdownMenu.RadioItem>,
  DropdownMenuRadioItemProps
>(({ className, asChild, children, ...props }, ref) => {
  const Comp = asChild ? Slot : RadixDropdownMenu.RadioItem;
  return (
    // @ts-expect-error Radix onSelect event type vs Slot's expected HTML event type
    <Comp
      ref={ref}
      className={clsx(styles.radioItem, className)}
      {...props}
    >
      {/* Reverted to using RadixDropdownMenu.ItemIndicator. Styling will be handled in CSS. */}
      <span className={styles.itemIndicatorContainer}> {/* This class might need to be added/reused in CSS */}
        <RadixDropdownMenu.ItemIndicator className={styles.itemIndicator}>
          {/* Radio icon (dot) will be styled via CSS */}
        </RadixDropdownMenu.ItemIndicator>
      </span>
      {children}
    </Comp>
  );
});
DropdownMenuRadioItem.displayName = RadixDropdownMenu.RadioItem.displayName;

const DropdownMenuLabel = React.forwardRef<
  React.ComponentRef<typeof RadixDropdownMenu.Label>,
  DropdownMenuLabelProps
>(({ className, asChild, inset, ...props }, ref) => {
  const Comp = asChild ? Slot : RadixDropdownMenu.Label;
  return (
    <Comp
      ref={ref}
      className={clsx(styles.label, inset && styles.labelInset, className)}
      {...props}
    />
  );
});
DropdownMenuLabel.displayName = RadixDropdownMenu.Label.displayName;

const DropdownMenuSeparator = React.forwardRef<
  React.ComponentRef<typeof RadixDropdownMenu.Separator>,
  DropdownMenuSeparatorProps
>(({ className, asChild, ...props }, ref) => {
  const Comp = asChild ? Slot : RadixDropdownMenu.Separator;
  return (
    <Comp
      ref={ref}
      className={clsx(styles.separator, className)}
      {...props}
    />
  );
});
DropdownMenuSeparator.displayName = RadixDropdownMenu.Separator.displayName;

const DropdownMenuSubContent = React.forwardRef<
  React.ComponentRef<typeof RadixDropdownMenu.SubContent>,
  DropdownMenuSubContentProps
>(({ className, asChild, ...props }, ref) => {
  const Comp = asChild ? Slot : RadixDropdownMenu.SubContent;
  return (
    <Comp
      ref={ref}
      className={clsx(styles.subContent, className)}
      {...props}
    />
  );
});
DropdownMenuSubContent.displayName = RadixDropdownMenu.SubContent.displayName;

const DropdownMenuSubTrigger = React.forwardRef<
  React.ComponentRef<typeof RadixDropdownMenu.SubTrigger>,
  DropdownMenuSubTriggerProps
>(({ className, asChild, inset, children, ...props }, ref) => {
  const Comp = asChild ? Slot : RadixDropdownMenu.SubTrigger;
  return (
    <Comp
      ref={ref}
      className={clsx(styles.subTrigger, inset && styles.itemInset, className)}
      {...props}
    >
      {children}
      <ChevronRight className={styles.subTriggerIcon} size={16} aria-hidden="true" />
    </Comp>
  );
});
DropdownMenuSubTrigger.displayName = RadixDropdownMenu.SubTrigger.displayName;

// --- Main Export ---
export const DropdownMenu = {
  Root: RadixDropdownMenu.Root,
  Trigger: RadixDropdownMenu.Trigger,
  Content: DropdownMenuContent,
  Item: DropdownMenuItem,
  CheckboxItem: DropdownMenuCheckboxItem,
  RadioGroup: RadixDropdownMenu.RadioGroup,
  RadioItem: DropdownMenuRadioItem,
  Label: DropdownMenuLabel,
  Separator: DropdownMenuSeparator,
  Portal: RadixDropdownMenu.Portal,
  Sub: RadixDropdownMenu.Sub,
  SubContent: DropdownMenuSubContent,
  SubTrigger: DropdownMenuSubTrigger,
  Group: RadixDropdownMenu.Group,
  ItemIndicator: RadixDropdownMenu.ItemIndicator, // Re-exporting for direct use if needed
};