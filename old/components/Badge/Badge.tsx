import React from 'react';
import { Primitive } from '@radix-ui/react-primitive';
import clsx from 'clsx';
import styles from './Badge.module.css';

export type BadgeType = 'Filled' | 'Outline';
export type BadgeColor =
  | 'Bored'
  | 'Default'
  | 'Grass'
  | 'Negative'
  | 'Sky'
  | 'Neuteral'
  | 'Dark';
export type BadgeSize = 'Default' | 'Small' | 'Large';

export interface BadgeProps extends React.ComponentPropsWithoutRef<typeof Primitive.span> {
  /**
   * The visual style of the badge.
   * @default "Filled"
   */
  badgeType?: BadgeType;
  /**
   * The color scheme of the badge.
   * @default "Default"
   */
  color?: BadgeColor;
  /**
   * The size of the badge.
   * @default "Large"
   */
  size?: BadgeSize;
  /**
   * The content to display within the badge.
   */
  children?: React.ReactNode;
  /**
   * Whether to render the component as a child of its parent.
   * @default false
   */
  // asChild?: boolean; // Removed as per review
}

const Badge = React.forwardRef<React.ComponentRef<typeof Primitive.span>, BadgeProps>(
  (
    {
      badgeType = 'Filled',
      color = 'Default',
      size = 'Large',
      children,
      className,
      // asChild, // Removed as per review
      ...rest
    },
    forwardedRef
  ) => {
    const Comp = Primitive.span; // Always use Primitive.span as asChild is removed

    return (
      <Comp
        ref={forwardedRef}
        className={clsx(
          styles.badge,
          styles[badgeType.toLowerCase()],
          styles[color.toLowerCase()],
          styles[size.toLowerCase()],
          className
        )}
        {...rest}
      >
        {children}
      </Comp>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;