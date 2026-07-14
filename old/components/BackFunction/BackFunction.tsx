import React from 'react';
import { Primitive } from '@radix-ui/react-primitive';
import { Slot } from '@radix-ui/react-slot';
import { ArrowLeft } from 'lucide-react';
import clsx from 'clsx';
import styles from './BackFunction.module.css';

export interface BackFunctionProps extends React.ComponentPropsWithoutRef<typeof Primitive.a> {
  /**
   * The content to display as the label for the back function.
   */
  children: React.ReactNode;
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
}

const BackFunction = React.forwardRef<React.ComponentRef<typeof Primitive.a>, BackFunctionProps>(
  (
    {
      children,
      className,
      asChild = false,
      href,
      ...rest
    },
    ref
  ) => {
    const content = (
      <>
        <ArrowLeft className={styles.icon} aria-hidden="true" />
        <span className={styles.label}>{children}</span>
      </>
    );

    if (asChild) {
      return (
        <Slot
          ref={ref}
          className={clsx(styles.backFunction, className)}
          {...rest}
        >
          {children}
        </Slot>
      );
    }

    return (
      <Primitive.a
        ref={ref}
        className={clsx(styles.backFunction, className)}
        href={href}
        {...rest}
      >
        {content}
      </Primitive.a>
    );
  }
);

BackFunction.displayName = 'BackFunction';

export default BackFunction;