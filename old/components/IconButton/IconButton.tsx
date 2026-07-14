import * as React from 'react';
import { Primitive } from '@radix-ui/react-primitive';
import { Slot } from '@radix-ui/react-slot';
import clsx from 'clsx';
import { Tooltip, TooltipProps as BaseTooltipProps } from '../Tooltip/Tooltip';
import styles from './IconButton.module.css';

export type IconButtonSize = 'M' | 'S' | 'XS';
export type IconButtonColor = 'Blue' | 'Black';

export interface IconButtonProps extends React.ComponentPropsWithoutRef<typeof Primitive.button> {
  /**
   * Accessible label for the icon button.
   * This is required for accessibility and will be shown in the tooltip.
   */
  ariaLabel: string;
  /**
   * The icon element to be rendered inside the button.
   */
  children: React.ReactNode;
  /**
   * The size of the icon button.
   * @default 'M'
   */
  size?: IconButtonSize;
  /**
   * The color scheme of the icon button.
   * @default 'Blue'
   */
  color?: IconButtonColor;
  /**
   * If `true`, the button will be in an active state (e.g., selected).
   * Corresponds to Figma's "Active" state.
   * @default false
   */
  isActive?: boolean;
  // Removed tooltipContent and showTooltip props. Tooltip now always shows ariaLabel.
  /**
   * The preferred side of the trigger to render the tooltip.
   */
  tooltipSide?: BaseTooltipProps['side'];
  /**
   * The offset of the tooltip from the trigger.
   * @default 5
   */
  tooltipSideOffset?: number;
  /**
   * The delay duration for the tooltip to open, in milliseconds.
   * Radix default is 700ms.
   */
  tooltipDelayDuration?: number;
  /**
   * Allows the component to be rendered as a child of another component,
   * merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
}

/**
 * IconButton component for displaying an icon that can be interacted with.
 * It integrates with a Tooltip component for hover/focus information.
 */
const IconButton = React.forwardRef<React.ComponentRef<typeof Primitive.button>, IconButtonProps>(
  (
    {
      ariaLabel,
      children,
      size = 'M', // Default from Figma JSON
      color = 'Blue', // Default from Figma JSON
      isActive = false,
      disabled = false,
      className: propClassName, // Destructure className explicitly
      style: propStyle,         // Destructure style explicitly
      // tooltipContent and showTooltip removed
      tooltipSide,
      tooltipSideOffset = 5, // Default from Tooltip.tsx, matches common practice
      tooltipDelayDuration, // Radix Tooltip.Provider default is 700ms
      asChild = false,
      ...otherRest // Collect remaining props
    },
    ref
  ) => {
    const buttonClasses = clsx(
      styles.iconButton,
      styles[`size${size.toUpperCase() as 'M' | 'S' | 'XS'}`], // e.g., styles.sizeM
      styles[`variant${color}`], // e.g., styles.variantBlue - Updated to match new CSS
      {
        [styles.isActive]: isActive && !disabled, // Updated to isActive to match CSS
      },
      propClassName // Use the destructured className
    );

    // CSS module now fully controls background color, remove explicit transparent here.
    const buttonElement = asChild ? (
      <Slot
        ref={ref}
        className={buttonClasses}
        style={propStyle}
        aria-disabled={disabled}
        aria-label={ariaLabel}
        data-disabled={disabled ? '' : undefined}
        {...otherRest}
      >
        {children}
      </Slot>
    ) : (
      <Primitive.button
        ref={ref}
        className={buttonClasses}
        style={propStyle}
        disabled={disabled}
        aria-disabled={disabled}
        aria-label={ariaLabel}
        data-disabled={disabled ? '' : undefined}
        {...otherRest}
      >
        {children}
      </Primitive.button>
    );

    // Render the button directly if asChild is true or if it's disabled.
    // Tooltip should only wrap the actual button component when it's enabled.
    if (asChild || disabled) {
      return buttonElement;
    }

    // Always wrap the enabled button with a Tooltip displaying the ariaLabel
    return (
      <Tooltip
        content={ariaLabel}
        side={tooltipSide}
        sideOffset={tooltipSideOffset}
        delayDuration={tooltipDelayDuration} // Pass delay duration
      >
        {/* Tooltip now implicitly handles the trigger via its children */}
        {buttonElement}
      </Tooltip>
    );
  }
);

IconButton.displayName = 'IconButton';

export default IconButton;