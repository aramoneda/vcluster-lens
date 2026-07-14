import React from 'react';
import { Primitive } from '@radix-ui/react-primitive';
import clsx from 'clsx';
import styles from './Skeleton.module.css';

export type SkeletonState = '1' | '2';

export interface SkeletonProps extends React.ComponentPropsWithoutRef<typeof Primitive.div> {
  /**
   * The state of the skeleton, influencing its appearance.
   * Corresponds to variants in Figma.
   * @default "1"
   */
  state?: SkeletonState;
  /**
   * If true, the skeleton will have a shimmer animation.
   * @default false
   */
  animated?: boolean;
  /**
   * Optional width for the skeleton. Can be a number (pixels) or a string.
   */
  width?: string | number;
  /**
   * Optional height for the skeleton. Can be a number (pixels) or a string.
   */
  height?: string | number;
  /**
   * Additional CSS classes to apply to the skeleton.
   */
  className?: string;
  /**
   * Inline styles to apply to the skeleton.
   * If `width` or `height` are also provided via direct props,
   * the values in this `style` prop will take precedence for those dimensions.
   */
  style?: React.CSSProperties;
}

const Skeleton = React.forwardRef<React.ComponentRef<typeof Primitive.div>, SkeletonProps>(
  ({ className, state = '1', animated = false, style: propStyle, width, height, ...otherProps }, forwardedRef) => {
    const dynamicStyles: React.CSSProperties = {};
    if (width !== undefined) {
      dynamicStyles.width = typeof width === 'number' ? `${width}px` : width;
    }
    if (height !== undefined) {
      dynamicStyles.height = typeof height === 'number' ? `${height}px` : height;
    }

    const mergedStyles = { ...dynamicStyles, ...propStyle };

    return (
      <Primitive.div
        ref={forwardedRef}
        className={clsx(
          styles.skeleton,
          {
            [styles.state1]: state === '1',
            [styles.state2]: state === '2',
            [styles.animated]: animated,
          },
          className
        )}
        style={mergedStyles}
        aria-hidden="true"
        {...otherProps}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

export { Skeleton };