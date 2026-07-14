import React from 'react';
import clsx from 'clsx';
import { ChevronRightIcon } from 'lucide-react';
import { Link } from '../Link/Link'; // Assuming Link component path
import styles from './Breadcrumbs.module.css';

export interface BreadcrumbItem {
  text: string;
  href?: string;
}

export interface BreadcrumbsProps extends React.ComponentPropsWithoutRef<'nav'> {
  /**
   * An array of breadcrumb items.
   * Each item is an object with `text` and optional `href`.
   * The last item is considered the current page.
   */
  items: BreadcrumbItem[];
  /**
   * Accessible label for the breadcrumbs navigation.
   * @default "Breadcrumb"
   */
  'aria-label'?: string;
  /**
   * Optional custom class name for the root element.
   */
  className?: string;
}

export const Breadcrumbs = React.forwardRef<React.ComponentRef<'nav'>, BreadcrumbsProps>(
  (
    {
      items,
      'aria-label': ariaLabel = 'Breadcrumb',
      className,
      ...rest
    },
    ref
  ) => {
    if (!items || items.length <= 1) {
      return null;
    }

    return (
      <nav
        aria-label={ariaLabel}
        className={clsx(styles.breadcrumbsNav, className)}
        ref={ref}
        {...rest}
      >
        <ol className={styles.breadcrumbsList}>
          {items.map((item, index) => {
            const isCurrentPage = index === items.length - 1;

            return (
              <li
                key={index}
                className={clsx(
                  styles.breadcrumbsItem,
                  isCurrentPage && styles.breadcrumbCurrentItemLi
                )}
                aria-current={isCurrentPage ? 'page' : undefined}
              >
                {isCurrentPage ? (
                  <span className={styles.breadcrumbCurrentItemText}>
                    {item.text}
                  </span>
                ) : (
                  <Link href={item.href || '#'} className={styles.breadcrumbLink}>
                    {item.text}
                  </Link>
                )}
                {!isCurrentPage && (
                  <ChevronRightIcon
                    className={styles.breadcrumbSeparator}
                    aria-hidden="true"
                  />
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }
);

Breadcrumbs.displayName = 'Breadcrumbs';