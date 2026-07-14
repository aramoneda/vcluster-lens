import React, { useState, useLayoutEffect, useRef } from 'react';
import { Primitive } from '@radix-ui/react-primitive';
import { Slot } from '@radix-ui/react-slot';
import clsx from 'clsx';
import styles from './Button.module.css';
export type ButtonStyle = 'primary' | 'secondary' | 'tertiary' | 'error';
export type ButtonSize = 'default' | 'small';
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The visual style of the button.
   * @default 'primary'
   */
  buttonStyle?: ButtonStyle;
  /**
   * The size of the button.
   * @default 'default'
   */
  size?: ButtonSize;
  /**
   * The label content of the button.
   * @default 'Action'
   */
  children?: React.ReactNode;
  /**
   * If true, the button will be in a loading state, showing a spinner.
   * @default false
   */
  isLoading?: boolean;
  /**
   * Icon to be displayed in the button.
   */
  icon?: React.ReactNode;
  /**
   * If true, the button will render its child directly.
   * @default false
   */
  asChild?: boolean;
}

export const Button = React.forwardRef<React.ComponentRef<typeof Primitive.button>, ButtonProps>(
  (
    {
      buttonStyle = 'primary',
      size = 'default',
      children = 'Action', // Default label from Figma JSON
      isLoading = false,
      icon,
      asChild = false,
      className,
      disabled,
      style,
      ...rest
    },
    forwardedRef
  ) => {
    const [width, setWidth] = useState<number | undefined>(undefined);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Combine forwarded ref and internal ref
    React.useImperativeHandle(forwardedRef, () => buttonRef.current!);

    useLayoutEffect(() => {
      if (isLoading) {
        if (buttonRef.current) {
          setWidth(buttonRef.current.offsetWidth);
        }
      } else {
        // Reset width when not loading
        setWidth(undefined);
      }
    }, [isLoading]);

    const showIcon = !!icon;
    const actualChildren = asChild ? children : (children || 'Action'); // Use default if not asChild and no children

    const commonProps = {
      ref: buttonRef,
      style: {
        ...style,
        width: width ? `${width}px` : undefined,
      },
      className: clsx(
        styles.button,
        styles[buttonStyle],
        size === 'default' ? styles.defaultSize : styles.smallSize,
        {
          [styles.loading]: isLoading,
        },
        className
      ),
      disabled: disabled || isLoading,
      'data-disabled': disabled || isLoading ? '' : undefined,
      'aria-disabled': disabled || isLoading,
      ...rest,
    };

    if (asChild) {
      // When asChild is true, Slot clones the child and passes props.
      // The Button's own visual content (icon, label, spinner) is NOT rendered.
      // The `children` prop of Button becomes the child of Slot.
      return <Slot {...commonProps}>{actualChildren}</Slot>;
    }

    return (
      <Primitive.button {...commonProps}>
        {isLoading && (
          <div className={styles.loadingDots}>
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
          </div>
        )}
        {!isLoading && (
          <span className={styles.contentWrapper}>
            {showIcon && (
              <span className={styles.iconWrapper}>{icon}</span>
            )}
            {<span className={styles.labelContainer}>{actualChildren}</span>}
          </span>
        )}
      </Primitive.button>
    );
  }
);

Button.displayName = 'Button';