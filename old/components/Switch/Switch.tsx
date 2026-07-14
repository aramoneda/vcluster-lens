import * as React from 'react';
import * as RadixSwitch from '@radix-ui/react-switch';
// import { Slot } from '@radix-ui/react-slot'; // Removed as asChild is removed
import clsx from 'clsx';
import styles from './Switch.module.css';

// --- Type Definitions ---

type SwitchSize = 'default' | 'small';
type LabelPosition = 'left' | 'right';

export interface AppSwitchProps
  extends React.ComponentPropsWithoutRef<typeof RadixSwitch.Root> {
  /**
   * The size of the switch.
   * @default 'default'
   */
  size?: SwitchSize;
  /**
   * Optional label text for the switch.
   */
  label?: React.ReactNode;
  /**
   * The position of the label relative to the switch.
   * @default 'right'
   */
  labelPosition?: LabelPosition;
  /**
   * Render as a child element, merging props and behavior.
   * @default false
   */
  // asChild?: boolean; // Removed as per review
}

// --- Component Implementation ---

export const Switch = React.forwardRef<
  React.ComponentRef<typeof RadixSwitch.Root>,
  AppSwitchProps
>(
  (
    {
      size = 'default', // Default from Figma JSON (mapped)
      label,
      labelPosition = 'right',
      className,
      disabled, // Explicitly handled for aria/data attributes
      // asChild = false, // Removed as per review
      ...rootProps // Includes checked, defaultChecked, onCheckedChange, etc.
    },
    forwardedRef
  ) => {
    const Comp = RadixSwitch.Root; // Always use RadixSwitch.Root as asChild is removed
    const labelId = React.useId();

    const rootClasses = clsx(
      styles.switchRoot, // Base styles
      styles[`size${size.charAt(0).toUpperCase() + size.slice(1)}`], // Size variant class e.g., styles.sizeDefault
      className
    );

    const thumbClasses = clsx(
      styles.switchThumb // Base thumb styles
      // Size-specific thumb styles are handled within the CSS module via root size class selectors
    );

    const containerClasses = clsx(styles.switchContainer, {
      [styles.labelLeft]: label && labelPosition === 'left',
      [styles.labelRight]: label && labelPosition === 'right',
      [styles.disabled]: disabled, // Apply disabled styling to the container if needed
    });

    const switchElement = (
      <Comp
        ref={forwardedRef}
        className={rootClasses}
        disabled={disabled}
        aria-disabled={disabled} // Ensure aria-disabled is set
        aria-labelledby={label ? labelId : undefined}
        {...rootProps} // Spread remaining Radix props
      >
        <RadixSwitch.Thumb className={thumbClasses} />
      </Comp>
    );

    return (
      <div className={containerClasses}>
        {label && labelPosition === 'left' && (
          <label className={styles.label} htmlFor={rootProps.id} id={labelId}>
            {label}
          </label>
        )}
        {switchElement}
        {label && labelPosition === 'right' && (
          <label className={styles.label} htmlFor={rootProps.id} id={labelId}>
            {label}
          </label>
        )}
      </div>
    );
  }
);

Switch.displayName = 'Switch'; // Set display name for DevTools