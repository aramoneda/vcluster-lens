import React from 'react';
import { Primitive } from '@radix-ui/react-primitive';
import clsx from 'clsx';
import styles from './Spinner.module.css';

export type SpinnerSize = 'large' | 'medium' | 'small';

export interface SpinnerProps extends React.ComponentPropsWithoutRef<typeof Primitive.div> {
  /**
   * The size of the spinner.
   * Corresponds to "Large", "Default", and "Small" from Figma.
   * @default 'large'
   */
  size?: SpinnerSize;
  /**
   * Accessible label for the spinner.
   * @default 'Loading...'
   */
  label?: string;
  /**
   * Optional additional CSS class names.
   */
  className?: string;
  /**
   * Whether to render the spinner as a child of its parent.
   * @default false
   */
  // asChild?: boolean; // Removed as per review
}

const Spinner = React.forwardRef<
  React.ComponentRef<typeof Primitive.div>,
  SpinnerProps
>((props, forwardedRef) => {
  const {
    size = 'large', // Default from Figma JSON is "Large"
    label = 'Loading...',
    className,
    // asChild, // Removed as per review
    ...rest
  } = props;

  return (
    <Primitive.div
      ref={forwardedRef}
      role="status"
      aria-label={label}
      className={clsx(
        styles.spinner,
        styles[`size-${size}`],
        className
      )}
      // asChild={asChild} // Removed as per review
      {...rest}
    />
  );
});

Spinner.displayName = 'Spinner';

export { Spinner };