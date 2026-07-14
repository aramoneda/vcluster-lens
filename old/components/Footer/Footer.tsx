import React, { forwardRef } from 'react';
import { Primitive } from '@radix-ui/react-primitive';
import clsx from 'clsx';
import styles from './Footer.module.css';

export interface FooterProps extends React.ComponentPropsWithoutRef<'footer'> {
  /**
   * Copyright text, defaults to a standard Broadridge copyright.
   */
  copyrightText?: string;
}

const Footer = forwardRef<React.ComponentRef<'footer'>, FooterProps>((props, ref) => {
  const {
    copyrightText,
    className,
    ...rest
  } = props;

  const currentYear = new Date().getFullYear();
  const defaultCopyright = `© ${currentYear} Broadridge Financial Solutions, Inc. All Rights Reserved.`;
  const actualCopyrightText = copyrightText || defaultCopyright;

  const RadixFooterComponent = Primitive.div as any;

  return (
    <RadixFooterComponent
      ref={ref}
      as="footer"
      className={clsx(styles.root, className)}
      {...rest}
    >
      <div className={styles.container}>
        <div className={styles.layout}>
          <div className={styles.logoWrapper}>
            LOGO
          </div>
          <p className={styles.copyrightText}>{actualCopyrightText}</p>
        </div>
      </div>
    </RadixFooterComponent>
  );
});

Footer.displayName = 'Footer';

export { Footer };