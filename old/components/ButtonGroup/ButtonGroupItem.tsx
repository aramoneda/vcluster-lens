import React from 'react';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import clsx from 'clsx';
import styles from './ButtonGroupItem.module.css';
// ButtonGroupContext is no longer needed as Radix handles state.
// ButtonGroupContextSize might be passed via props or CSS data attributes from parent.

export interface ButtonGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> {
  asChild?: boolean;
  // value is already part of ToggleGroupPrimitive.Item props (string)
  // children is already part of React.ComponentPropsWithoutRef
  icon?: React.ReactNode;
  iconOnly?: boolean;
  className?: string;
  // itemSize prop can be added if direct styling per item size is needed,
  // but usually, this is controlled by the parent ButtonGroup's size prop via CSS.
  // itemSize?: 'S' | 'M' | 'L';
}

const ButtonGroupItem = React.forwardRef<
  React.ComponentRef<typeof ToggleGroupPrimitive.Item>,
  ButtonGroupItemProps
>(({ className, children, icon, iconOnly = false, value, asChild, ...props }, ref) => {
  // Context is no longer needed. Radix ToggleGroup.Item communicates with ToggleGroup.Root.

  const effectiveIconOnly = iconOnly && !!icon;

  // isActive state and handleClick are managed by Radix ToggleGroup.Item.
  // It will automatically receive `data-state="on"` or `data-state="off"`.
  // It will also handle `aria-pressed`.

  let content = children;
  if (effectiveIconOnly) {
    content = <span className={styles.iconWrapper}>{icon}</span>;
  } else if (icon && children) {
    content = (
      <>
        <span className={styles.iconWrapper}>{icon}</span>
        <span className={styles.labelWrapper}>{children}</span>
      </>
    );
  } else if (icon) {
    content = <span className={styles.iconWrapper}>{icon}</span>;
  } else if (children) {
    content = <span className={styles.labelWrapper}>{children}</span>;
  }

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      value={value} // Ensure value is always passed
      className={clsx(
        styles.buttonGroupItem,
        // styles[`itemSize-${itemSize}`], // Size styling will be handled by parent's data-size or specific item classes if needed
        effectiveIconOnly && styles.iconOnly,
        className
      )}
      // data-state is automatically handled by Radix (e.g., "on", "off")
      // onClick is handled by Radix, but user-provided onClick will also be called
      // aria-pressed is automatically handled by Radix
      {...props} // Spread disabled, etc.
      asChild={asChild}
    >
      {content}
    </ToggleGroupPrimitive.Item>
  );
});

ButtonGroupItem.displayName = 'ButtonGroupItem';
export { ButtonGroupItem };