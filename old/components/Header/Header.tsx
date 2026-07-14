import React from 'react';
import clsx from 'clsx';
import { Search, Bell, ChevronDown, Menu } from 'lucide-react';
import IconButton from '../IconButton/IconButton';
import { Input, FormRoot } from '../Input/Input';
import Badge from '../Badge/Badge';
import { Button } from '../Button/Button';
import { DropdownMenu } from '../DropdownMenu/DropdownMenu';
import InView, { InViewProps, InViewItemData, InViewTab } from '../InView/InView';
import { ButtonGroup } from '../ButtonGroup/ButtonGroup';
import { ButtonGroupItem } from '../ButtonGroup/ButtonGroupItem';
import styles from './Header.module.css';

// Import the Logo SVG directly
import LogoSvg from '@/assets/Logo/wordmark.svg';

export interface HeaderUserInfo {
  /** User's full name */
  fullName: string;
  /** User's initials (e.g., "JS" for John Smith) */
  initials: string;
}

export interface HeaderInViewConfig {
  /** Text label displayed in the InView trigger */
  label: string;
  /** Value badge text displayed in the InView trigger */
  valueBadge?: string;
  /** Type of the value badge (Filled or Outline) */
  valueBadgeType?: 'Filled' | 'Outline';
  /** Whether to hide the value badge */
  hideBadge?: boolean;
  /** Available tabs for filtering */
  tabs?: InViewTab[];
  /** Currently selected tab value */
  selectedTab?: string;
  /** Callback when tab selection changes */
  onTabChange?: (tabValue: string) => void;
  /** Section title displayed above the items list */
  sectionTitle?: string;
  /** Items to display in the selector */
  items?: InViewItemData[];
  /** Currently selected item IDs */
  selectedItems?: string[];
  /** Callback when item selection changes */
  onSelectedItemsChange?: (selectedIds: string[]) => void;
  /** Callback when Apply button is clicked */
  onApply?: () => void;
  /** Callback when Clear All button is clicked */
  onClearAll?: () => void;
  /** Whether the popover is open (controlled) */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
}

export interface UserMenuItem {
  /** Unique identifier for the menu item */
  id: string;
  /** Label text for the menu item */
  label: string;
  /** Callback when item is selected */
  onSelect?: () => void;
}

export interface NavigationMenuItem {
  /** Unique identifier for the menu item */
  id: string;
  /** Label text for the menu item */
  label: string;
  /** Callback when item is selected */
  onSelect?: () => void;
}

export interface HeaderProps extends Omit<React.ComponentPropsWithoutRef<'header'>, 'children'> {
  /** User information for the user dropdown */
  user?: HeaderUserInfo;
  /** User menu items */
  userMenuItems?: UserMenuItem[];
  /** Navigation menu items (shown in hamburger menu on mobile) */
  navigationMenuItems?: NavigationMenuItem[];
  /** InView selector configuration */
  inView?: HeaderInViewConfig;
  /** Currently selected currency */
  currency?: string;
  /** Available currencies for the dropdown */
  currencies?: string[];
  /** Callback when currency changes */
  onCurrencyChange?: (currency: string) => void;
  /** Currently selected language */
  language?: string;
  /** Available languages */
  languages?: string[];
  /** Callback when language changes */
  onLanguageChange?: (language: string) => void;
  /** Search input value */
  searchValue?: string;
  /** Callback when search value changes */
  onSearchChange?: (value: string) => void;
  /** Callback when search icon is clicked (mobile) */
  onSearchClick?: () => void;
  /** Callback when notification bell is clicked */
  onNotificationClick?: () => void;
  /** Number of unread notifications */
  notificationCount?: number;
  /** Additional class name */
  className?: string;
}

/**
 * Header component - Responsive navigation header with logo, InView selector,
 * search, language/currency selectors, notifications, and user menu.
 *
 * Breakpoint mapping (CSS breakpoint → Figma variant):
 * - 320px+  → Figma 480 variant
 * - 480px+  → Figma 720 variant
 * - 720px+  → Figma 968 variant
 * - 968px+  → Figma 1280 variant
 * - 1280px+ → Figma 1920 variant
 */
const Header = React.forwardRef<HTMLElement, HeaderProps>(
  (
    {
      user = { fullName: 'John Smith', initials: 'JS' },
      userMenuItems = [],
      navigationMenuItems = [],
      inView,
      currency = 'USD',
      currencies = ['USD', 'CAD', 'EUR'],
      onCurrencyChange,
      language = 'ENG',
      languages = ['ENG', 'FRA', 'ESP'],
      onLanguageChange,
      searchValue = '',
      onSearchChange,
      onSearchClick,
      onNotificationClick,
      notificationCount = 0,
      className,
      ...rest
    },
    forwardedRef
  ) => {
    return (
      <header
        ref={forwardedRef}
        className={clsx(styles.header, className)}
        {...rest}
      >
        {/* Primary Row */}
        <div className={styles.primaryRow}>
          {/* Left Container */}
          <div className={styles.leftContainer}>
            {/* Logo */}
            <div className={styles.logoContainer}>
              <img src={LogoSvg} alt="Broadridge" className={styles.logo} />
            </div>

            {/* Divider - hidden on small screens */}
            <div className={styles.divider} />

          {/* InView Component - hidden on small screens */}
          {inView && (
            <div className={styles.inViewWrapper}>
              <InView
                className={styles.headerInView}
                label={inView.label}
                valueBadge={inView.valueBadge}
                valueBadgeColor="Grass"
                valueBadgeType={inView.valueBadgeType ?? 'Outline'}
                hideBadge={inView.hideBadge}
                tabs={inView.tabs}
                selectedTab={inView.selectedTab}
                onTabChange={inView.onTabChange}
                sectionTitle={inView.sectionTitle}
                items={inView.items}
                selectedItems={inView.selectedItems}
                onSelectedItemsChange={inView.onSelectedItemsChange}
                onApply={inView.onApply}
                onClearAll={inView.onClearAll}
                open={inView.open}
                onOpenChange={inView.onOpenChange}
              />
            </div>
          )}

          {/* Currency Dropdown - only on large screens (secondary style) */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button type="button" className={styles.currencyDropdown}>
                <span>{currency}</span>
                <ChevronDown size={16} />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className={styles.compactDropdownContent}>
              {currencies.map((curr: string) => (
                <DropdownMenu.Item
                  key={curr}
                  isActive={curr === currency}
                  onSelect={() => onCurrencyChange?.(curr)}
                >
                  {curr}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>

        {/* Right Container */}
        <div className={styles.rightContainer}>
          {/* Search Input - only on largest screens (primary style) */}
          <FormRoot className={styles.searchInputWrapper}>
            <Input
              name="header-search"
              placeholder="Search accounts, clients, employers"
              leftIcon={Search}
              defaultValue={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              variant="primary"
              className={styles.searchInput}
            />
          </FormRoot>

          {/* Search Icon - on smaller screens */}
          <IconButton
            ariaLabel="Search"
            size="M"
            color="Black"
            onClick={onSearchClick}
            className={styles.searchIcon}
          >
            <Search size={20} />
          </IconButton>

          {/* Right Actions Group - sp-12 gap between Language, Notification, User */}
          <div className={styles.rightActionsGroup}>
            {/* Language Dropdown - only on large screens (secondary style) */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button type="button" className={styles.languageDropdown}>
                  <span>{language}</span>
                  <ChevronDown size={16} />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content className={styles.compactDropdownContent}>
                {languages.map((lang: string) => (
                  <DropdownMenu.Item
                    key={lang}
                    isActive={lang === language}
                    onSelect={() => onLanguageChange?.(lang)}
                  >
                    {lang}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Root>

            {/* Notification Bell */}
            <div className={styles.notificationWrapper}>
              <IconButton
                ariaLabel="Notifications"
                size="M"
                color="Black"
                onClick={onNotificationClick}
              >
                <Bell size={20} />
              </IconButton>
              {notificationCount > 0 && (
                <span className={styles.notificationBadge}>
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </div>

            {/* User Dropdown - Full name on large screens */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button
                  type="button"
                  className={styles.userDropdownFull}
                >
                  <span className={styles.userName}>{user.fullName}</span>
                  <ChevronDown size={16} />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content className={styles.userMenuContent} position="bottom-right">
                {userMenuItems.map((item) => (
                  <DropdownMenu.Item
                    key={item.id}
                    onSelect={item.onSelect}
                  >
                    {item.label}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Root>

            {/* User Dropdown - Initials on small screens (<968px) */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button
                  type="button"
                  className={styles.userDropdownInitials}
                >
                  <span className={styles.userInitials}>{user.initials}</span>
                  <ChevronDown size={16} />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content className={styles.userMenuContentMobile} position="bottom-right">
                {/* Language ButtonGroup at top */}
                <div className={styles.mobileMenuButtonGroup}>
                  <ButtonGroup
                    type="single"
                    value={language}
                    onValueChange={(val) => val && onLanguageChange?.(val)}
                    size="S"
                  >
                    {languages.map((lang: string) => (
                      <ButtonGroupItem key={lang} value={lang}>
                        {lang}
                      </ButtonGroupItem>
                    ))}
                  </ButtonGroup>
                </div>

                <DropdownMenu.Separator />

                {/* Regular menu items */}
                {userMenuItems.map((item) => (
                  <DropdownMenu.Item
                    key={item.id}
                    onSelect={item.onSelect}
                  >
                    {item.label}
                  </DropdownMenu.Item>
                ))}

                <DropdownMenu.Separator />

                {/* Currency ButtonGroup at bottom */}
                <div className={styles.mobileMenuButtonGroup}>
                  <ButtonGroup
                    type="single"
                    value={currency}
                    onValueChange={(val) => val && onCurrencyChange?.(val)}
                    size="S"
                  >
                    {currencies.map((curr: string) => (
                      <ButtonGroupItem key={curr} value={curr}>
                        {curr}
                      </ButtonGroupItem>
                    ))}
                  </ButtonGroup>
                </div>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>
        </div>
        </div>

        {/* Secondary Row - Mobile only (<480px) */}
        <div className={styles.secondaryRow}>
          {/* Navigation Menu Button */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button
                buttonStyle="tertiary"
                size="default"
                icon={<Menu size={20} />}
                className={styles.menuButton}
              >
                Menu
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className={styles.navigationMenuContent}>
              {navigationMenuItems.map((item) => (
                <DropdownMenu.Item
                  key={item.id}
                  onSelect={item.onSelect}
                >
                  {item.label}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Root>

          {/* InView Name Selector - Mobile version */}
          {inView && (
            <button type="button" className={styles.mobileInViewSelector}>
              <span>{inView.label}</span>
              <ChevronDown size={16} />
            </button>
          )}
        </div>
      </header>
    );
  }
);

Header.displayName = 'Header';

export default Header;

