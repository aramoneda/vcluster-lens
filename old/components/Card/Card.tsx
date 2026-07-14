import React from 'react';
import { Primitive } from '@radix-ui/react-primitive';
import clsx from 'clsx';
import styles from './Card.module.css';

export type CardColor = 'Blue' | 'Gray' | 'Light' | 'Super Light';
export type CardSize = 'Small' | 'Medium' | 'Large';

export interface CardProps extends React.ComponentPropsWithoutRef<typeof Primitive.div> {
  /**
   * The color scheme of the card.
   * @default "Super Light"
   */
  color?: CardColor;
  /**
   * The size of the card.
   * @default "Small"
   */
  size?: CardSize;
  /**
   * Whether to show an icon in the top left corner.
   * @default false
   */
  topLeftIcon?: React.ReactNode;
  /**
   * Whether to show a CTA link at the bottom of the card.
   * @default false
   */
  bottomCTA?: React.ReactNode;
  /**
   * Whether to show an action icon at the top right.
   * @default true
   */
  topActionIcon?: React.ReactNode;
  /**
   * The label text displayed at the top of the card content.
   */
  label?: string;
  /**
   * The main value displayed in the card.
   */
  value?: string;
  /**
   * The content to display within the card.
   */
  children?: React.ReactNode;
}

const Card = React.forwardRef<React.ComponentRef<typeof Primitive.div>, CardProps>(
  (
    {
      color = 'Super Light',
      size = 'Small',
      topLeftIcon,
      bottomCTA,
      topActionIcon,
      label,
      value,
      children,
      className,
      ...rest
    },
    forwardedRef
  ) => {
    // Map color to CSS class names
    const colorClass = color.toLowerCase().replace(' ', '-');
    const sizeClass = size.toLowerCase();

    return (
      <Primitive.div
        ref={forwardedRef}
        className={clsx(
          styles.card,
          styles[colorClass],
          styles[sizeClass],
          className
        )}
        {...rest}
      >
        {/* Top row with optional icons */}
        {(topLeftIcon || topActionIcon) && (
          <div className={styles.topRow}>
            {topLeftIcon && (
              <span className={styles.topLeftIcon}>{topLeftIcon}</span>
            )}
            {topActionIcon && (
              <span className={styles.topActionIcon}>{topActionIcon}</span>
            )}
          </div>
        )}

        {/* Main content area */}
        <div className={styles.content}>
          {label && (
            <span className={clsx(styles.label, styles[`label-${sizeClass}`])}>
              {label}
            </span>
          )}
          {value && (
            <span className={clsx(styles.value, styles[`value-${sizeClass}`])}>
              {value}
            </span>
          )}
          {children}
        </div>

        {/* Bottom CTA */}
        {bottomCTA && (
          <div className={styles.bottomCTA}>{bottomCTA}</div>
        )}
      </Primitive.div>
    );
  }
);

Card.displayName = 'Card';

export default Card;

