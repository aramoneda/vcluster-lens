import React from 'react';
import { Primitive } from '@radix-ui/react-primitive';
import clsx from 'clsx';
import styles from './ProgressCircle.module.css';

export type ProgressCircleSize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg';
export type ProgressCircleShape = 'circle' | 'halfcircle';

export interface ProgressCircleProps extends React.ComponentPropsWithoutRef<typeof Primitive.div> {
  /**
   * The size of the progress circle.
   * @default "xxs"
   */
  size?: ProgressCircleSize;
  /**
   * The shape of the progress circle.
   * @default "circle"
   */
  shape?: ProgressCircleShape;
  /**
   * Whether to show the label below the progress circle.
   * @default false
   */
  label?: boolean;
  /**
   * The percentage value to display.
   * @default "40%"
   */
  percentage?: string;
  /**
   * The label text to display when label is true.
   * @default "Users"
   */
  labelText?: string;
  /**
   * The progress value as a number between 0 and 100.
   * @default 40
   */
  value?: number;
}

const ProgressCircle = React.forwardRef<React.ComponentRef<typeof Primitive.div>, ProgressCircleProps>(
  (
    {
      size = 'xxs',
      shape = 'circle',
      label = false,
      percentage = '40%',
      labelText = 'Users',
      value = 40,
      className,
      ...rest
    },
    forwardedRef
  ) => {
    // Calculate stroke dash array and offset for progress
    const radius = 45; // Base radius for calculations
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = shape === 'halfcircle' ? circumference / 2 : circumference;
    const strokeDashoffset = strokeDasharray - (value / 100) * strokeDasharray;

    // Get the appropriate viewBox and path based on shape
    const viewBox = shape === 'halfcircle' ? '0 0 120 60' : '0 0 120 120';
    const pathD = shape === 'halfcircle' 
      ? 'M 15 45 A 45 45 0 0 1 105 45'
      : 'M 60 15 A 45 45 0 1 1 59.99 15';

    return (
      <Primitive.div
        ref={forwardedRef}
        className={clsx(
          styles.progressCircle,
          styles[size],
          styles[shape],
          label && styles.withLabel,
          className
        )}
        {...rest}
      >
        <div className={styles.svgContainer}>
          <svg
            className={styles.svg}
            viewBox={viewBox}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background ring */}
            <path
              d={pathD}
              className={styles.backgroundRing}
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />
            {/* Progress ring */}
            <path
              d={pathD}
              className={styles.progressRing}
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              style={{
                transition: 'stroke-dashoffset 0.3s ease-in-out',
              }}
            />
          </svg>
          
          {/* Center content */}
          <div className={styles.centerContent}>
            {size === 'xxs' ? (
              <span className={styles.text}>{percentage}</span>
            ) : (
              <span className={styles.number}>{percentage}</span>
            )}
          </div>
        </div>

        {/* Label */}
        {label && (
          <div className={styles.labelContainer}>
            <span className={styles.labelText}>{labelText}</span>
          </div>
        )}
      </Primitive.div>
    );
  }
);

ProgressCircle.displayName = 'ProgressCircle';

export default ProgressCircle;
