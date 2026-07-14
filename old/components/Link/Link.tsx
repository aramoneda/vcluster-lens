import * as React from 'react';
import { Primitive } from '@radix-ui/react-primitive'; // Changed from Slot
import { clsx } from 'clsx';
import styles from './Link.module.css';

export interface LinkProps extends React.ComponentPropsWithoutRef<typeof Primitive.a> {
  /**
   * The content of the link.
   */
  children: React.ReactNode;
  /**
   * Optional icon to display within the link.
   */
  icon?: React.ReactNode;
  /**
   * If true, the icon will be placed after the text.
   * @default false
   */
  trailingIcon?: boolean;
  /**
   * Whether the link is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * If true, the component will render its child and pass all props to it.
   * @default false
   */
  asChild?: boolean;
  /**
   * Additional CSS class names to apply.
   */
  className?: string;
}

const Link = React.forwardRef<React.ComponentRef<typeof Primitive.a>, LinkProps>(
  (
    {
      children,
      icon,
      trailingIcon = false,
      disabled = false,
      asChild = false, // This prop will be passed to Primitive.a
      className,
      href,
      ...rest
    },
    ref
  ) => {
    const linkClasses = clsx(
      styles.link,
      className
    );

    const iconSpan = icon && (
      <span className={styles.iconWrapper}>{icon}</span>
    );

    return (
      <Primitive.a // Use Primitive.a as the root component
        ref={ref}
        asChild={asChild} // Pass the asChild prop to Primitive.a
        className={linkClasses}
        href={disabled ? undefined : href}
        aria-disabled={disabled || undefined}
        data-disabled={disabled ? '' : undefined}
        {...(disabled && { tabIndex: -1 })}
        {...rest}
      >
        {asChild ? (
          children // If asChild is true, only render the children passed by the consumer
        ) : (
          <> {/* If asChild is false, render the internal structure including icons */}
            {!trailingIcon && iconSpan}
            {children}
            {trailingIcon && iconSpan}
          </>
        )}
      </Primitive.a>
    );
  }
);

Link.displayName = 'Link';

export { Link };