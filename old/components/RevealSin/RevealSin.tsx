import * as React from 'react';
import { Primitive } from '@radix-ui/react-primitive';
import { Slot } from '@radix-ui/react-slot';
import { Eye, EyeOff } from 'lucide-react';
import clsx from 'clsx';
import IconButton from '../IconButton/IconButton';
import styles from './RevealSin.module.css';

export type RevealSinState = 'Default' | 'Revealed';

export interface RevealSinProps extends React.ComponentPropsWithoutRef<typeof Primitive.div> {
  /**
   * The state of the component - whether the SIN is revealed or masked.
   * @default 'Default'
   */
  state?: RevealSinState;
  /**
   * The actual SIN value to display when revealed.
   * When not revealed, it will show masked characters.
   */
  value: string;
  /**
   * Callback function called when the reveal/hide button is clicked.
   */
  onToggle?: () => void;
  /**
   * If true, renders the component as a child of the provided element.
   * @default false
   */
  asChild?: boolean;
}

/**
 * RevealSin component for displaying a Social Insurance Number (SIN) that can be revealed or hidden.
 * Based on Figma JSON specification: figma-jsons/sin.json
 * 
 * Features:
 * - Two states: Default (masked) and Revealed (actual value)
 * - Toggle button with appropriate icons
 * - Proper accessibility with ARIA attributes
 * - Follows design system tokens for consistent styling
 */
const RevealSin = React.forwardRef<React.ComponentRef<typeof Primitive.div>, RevealSinProps>(
  (
    {
      state = 'Default', // Default from Figma JSON
      value,
      onToggle,
      asChild = false,
      className,
      ...rest
    },
    ref
  ) => {
    const Component = asChild ? Slot : Primitive.div;
    
    // Determine if the SIN is currently revealed
    const isRevealed = state === 'Revealed';
    
    // Generate masked value (same length as actual value but with asterisks and dashes)
    const maskedValue = value.replace(/\d/g, '*');
    
    // Display value based on state
    const displayValue = isRevealed ? value : maskedValue;
    
    // Icon based on state
    const icon = isRevealed ? <EyeOff size={20} /> : <Eye size={20} />;
    
    // ARIA label for the toggle button
    const toggleAriaLabel = isRevealed ? 'Hide SIN' : 'Reveal SIN';
    
    const componentClasses = clsx(
      styles.revealSin,
      {
        [styles.stateDefault]: state === 'Default',
        [styles.stateRevealed]: state === 'Revealed',
      },
      className
    );

    return (
      <Component
        ref={ref}
        className={componentClasses}
        role="group"
        aria-label="Social Insurance Number"
        {...rest}
      >
        <IconButton
          ariaLabel={toggleAriaLabel}
          onClick={onToggle}
          size="M"
          color="Blue"
        >
          {icon}
        </IconButton>
        <span className={styles.sinText} aria-live="polite">
          {displayValue}
        </span>
      </Component>
    );
  }
);

RevealSin.displayName = 'RevealSin';

export default RevealSin;
