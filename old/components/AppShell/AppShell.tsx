import React from 'react';
import clsx from 'clsx';
import { Primitive } from '@radix-ui/react-primitive';
import Header, { HeaderProps } from '../Header/Header';
import LeftNavigation, { LeftNavItem } from '../LeftNavigation/LeftNavigation';
import SideToolbar, { SideToolbarProps } from '../SideToolbar/SideToolbar';
import { Footer, FooterProps } from '../Footer/Footer';
import Page, { PageProps } from '../Page/Page';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import styles from './AppShell.module.css';

export interface AppShellProps extends React.ComponentPropsWithoutRef<typeof Primitive.div> {
  /**
   * Props for the Header component
   */
  headerProps: HeaderProps;
  /**
   * Navigation items for LeftNavigation
   * The component automatically switches between Full (2050+) and Minimised (<2050) based on viewport
   */
  navItems: LeftNavItem[];
  /**
   * Props for the SideToolbar component
   */
  sideToolbarProps?: SideToolbarProps;
  /**
   * Whether to show the Footer component
   * @default false
   */
  showFooter?: boolean;
  /**
   * Props for the Footer component (rendered inside Page)
   * Only used when showFooter is true
   */
  footerProps?: FooterProps;
  /**
   * Props for the Page component (excluding children)
   */
  pageProps: Omit<PageProps, 'children'>;
  /**
   * Page content to render inside the grid
   */
  children?: React.ReactNode;
  /**
   * Slot for notification overlays (IntercomGroup, IntercomOverlay)
   * Positioned at bottom-right of the viewport
   */
  notificationsSlot?: React.ReactNode;
  /**
   * Additional class name for the shell container
   */
  className?: string;
}

/**
 * AppShell component - A complete application layout template that combines:
 * - Header: Fixed at top, above everything
 * - LeftNavigation: Fixed to left edge, not scrollable
 * - SideToolbar: Fixed to right edge, vertically centered
 * - Page: Main scrollable content area with responsive grid
 * - Footer: Inside Page, scrolls with content
 *
 * Layout structure:
 * ┌─────────────────────────────────────────────────────┐
 * │                      Header                         │
 * ├─────────┬────────────────────────────────────┬──────┤
 * │         │                                    │      │
 * │  Left   │              Page                  │ Side │
 * │   Nav   │         (scrollable)               │ Tool │
 * │         │                                    │  bar │
 * │ (fixed) │         ┌──────────────┐           │      │
 * │         │         │   Footer     │           │(fixed│
 * │         │         └──────────────┘           │center│
 * └─────────┴────────────────────────────────────┴──────┘
 */
const AppShell = React.forwardRef<React.ComponentRef<typeof Primitive.div>, AppShellProps>(
  (
    {
      headerProps,
      navItems,
      sideToolbarProps,
      showFooter = false,
      footerProps,
      pageProps,
      children,
      notificationsSlot,
      className,
      ...rest
    },
    forwardedRef
  ) => {
    // Use breakpoint hook to determine which LeftNav variant to render
    const { isAbove } = useBreakpoint();
    const showFullNav = isAbove('wide'); // 2050px+

    return (
      <Primitive.div
        ref={forwardedRef}
        className={clsx(
          styles.appShell,
          showFullNav ? styles.navFull : styles.navMinimised,
          className
        )}
        {...rest}
      >
        {/* Header - Fixed at top */}
        <Header {...headerProps} className={clsx(styles.header, headerProps.className)} />

        {/* Main Layout Container */}
        <div className={styles.mainContainer}>
          {/* Left Navigation - Render only the appropriate variant */}
          <LeftNavigation
            items={navItems}
            type={showFullNav ? 'Full' : 'Minimised'}
            className={styles.leftNav}
          />

          {/* Page Content - Scrollable */}
          <div className={styles.contentArea}>
            <Page {...pageProps} className={clsx(styles.page, pageProps.className)}>
              {children}
              {/* Footer - Inside Page, scrolls with content. Hidden by default. */}
              {showFooter && footerProps && (
                <div className={styles.footerWrapper}>
                  <Footer {...footerProps} />
                </div>
              )}
            </Page>
          </div>

          {/* Side Toolbar - Fixed to right, centered */}
          {sideToolbarProps && (
            <SideToolbar
              {...sideToolbarProps}
              className={clsx(styles.sideToolbar, sideToolbarProps.className)}
            />
          )}
        </div>

        {/* Notifications Slot - Fixed position for IntercomGroup/IntercomOverlay */}
        {notificationsSlot && (
          <div className={styles.notificationsSlot}>
            {notificationsSlot}
          </div>
        )}
      </Primitive.div>
    );
  }
);

AppShell.displayName = 'AppShell';

export default AppShell;

