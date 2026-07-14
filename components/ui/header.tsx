"use client"

import * as React from "react"
import { Bell, Search } from "lucide-react"

import { CurrencySelector, type CurrencyOption } from "@/components/ui/currency-selector"
import { LanguageSelector, type LanguageOption } from "@/components/ui/language-selector"
import { UserMenu, type UserMenuItem } from "@/components/ui/user-menu"
import { IconButton } from "@/components/ui/icon-button"
import { InputField } from "@/components/ui/input"
import {
  SimpleNavigation,
  type SimpleNavigationItem,
} from "@/components/ui/simple-navigation"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { cn } from "@/lib/utils"

export type HeaderUserMenuItem = UserMenuItem

export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  userName?: string
  userInitials?: string
  userMenuItems?: UserMenuItem[]
  /** Optional custom content rendered next to the logo (e.g. a brand/app label). Separated by a divider. */
  logoSlot?: React.ReactNode
  /** Optional segmented navigation rendered in the center of the header. Hidden when no items are provided. */
  navigationItems?: SimpleNavigationItem[]
  /** Currently active navigation item id */
  activeNavigationId?: string
  /** Callback when a navigation item is selected */
  onNavigationSelect?: (item: SimpleNavigationItem) => void
  /** Show the currency selector in the header. Hidden by default. */
  showCurrencySelector?: boolean
  currencyOptions?: CurrencyOption[]
  selectedCurrencyId?: string
  onCurrencySelect?: (option: CurrencyOption) => void
  languageOptions?: LanguageOption[]
  selectedLanguageId?: string
  onLanguageSelect?: (option: LanguageOption) => void
  searchValue?: string
  onSearchChange?: (value: string) => void
  onNotificationClick?: () => void
  notificationCount?: number
  /** Optional override for the logo source. Defaults to the BRD logo at /brd-logo.svg */
  logoSrc?: string
  /** Alt text for the logo. Defaults to "Broadridge" */
  logoAlt?: string
  /** Show the light/dark theme toggle. Shown by default. */
  showThemeToggle?: boolean
}

function Header({
  userName = "John Smith",
  userInitials = "JS",
  userMenuItems = [],
  logoSlot,
  navigationItems,
  activeNavigationId,
  onNavigationSelect,
  showCurrencySelector = false,
  currencyOptions = [
    { id: "usd", label: "USD" },
    { id: "cad", label: "CAD" },
  ],
  selectedCurrencyId = "usd",
  onCurrencySelect,
  languageOptions = [
    { id: "eng", label: "ENG" },
    { id: "fr", label: "FR" },
  ],
  selectedLanguageId = "eng",
  onLanguageSelect,
  searchValue,
  onSearchChange,
  onNotificationClick,
  notificationCount = 0,
  logoSrc = "/brd-logo.svg",
  logoAlt = "Broadridge",
  showThemeToggle = true,
  className,
  ...props
}: HeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full bg-[var(--color-surface-foreground)]",
        className
      )}
      {...props}
    >
      <div className="relative flex h-14 items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoSrc || "/placeholder.svg"}
            alt={logoAlt}
            width={121}
            height={48}
            className="shrink-0 dark:brightness-0 dark:invert"
          />
          {logoSlot && (
            <div className="flex items-center gap-4">
              <span
                aria-hidden="true"
                className="h-6 w-px bg-[var(--color-stroke-default)]"
              />
              <div className="flex items-center">{logoSlot}</div>
            </div>
          )}
          {showCurrencySelector && (
            <div className="hidden min-[721px]:block">
              <CurrencySelector
                options={currencyOptions}
                selectedId={selectedCurrencyId}
                onSelect={onCurrencySelect}
                triggerClassName="h-9 px-3 py-2"
                menuClassName="min-w-[120px]"
              />
            </div>
          )}
        </div>

        {navigationItems && navigationItems.length > 0 && (
          <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 min-[968px]:block">
            <SimpleNavigation
              items={navigationItems}
              activeId={activeNavigationId}
              onSelect={onNavigationSelect}
            />
          </div>
        )}

        <div className="flex items-center gap-3">
          <div className="hidden min-[1281px]:block w-[280px] xl:w-[320px]">
            <InputField
              name="header-search"
              placeholder="Search accounts, clients, employers"
              leftIcon={Search}
              value={searchValue}
              onChange={(event) => onSearchChange?.(event.target.value)}
            />
          </div>
          <IconButton
            ariaLabel="Search"
            size="M"
            color="Black"
            className="min-[1281px]:hidden"
          >
            <Search className="h-5 w-5" />
          </IconButton>

          <div className="hidden min-[721px]:block">
            <LanguageSelector
              options={languageOptions}
              selectedId={selectedLanguageId}
              onSelect={onLanguageSelect}
              triggerClassName="h-9 px-3 py-2"
              menuClassName="min-w-[120px]"
            />
          </div>

          {showThemeToggle && <ThemeToggle />}

          <div className="relative">
            <IconButton
              ariaLabel="Notifications"
              size="M"
              color="Black"
              onClick={onNotificationClick}
            >
              <Bell className="h-5 w-5" />
            </IconButton>
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 rounded-full bg-[var(--color-state-error)] px-1.5 text-[10px] font-semibold text-white">
                {notificationCount > 9 ? "9+" : notificationCount}
              </span>
            )}
          </div>

          <div className="hidden min-[721px]:block">
            <UserMenu name={userName} items={userMenuItems} />
          </div>
          <div className="min-[721px]:hidden">
            <UserMenu name={userInitials} items={userMenuItems} />
          </div>
        </div>
      </div>
    </header>
  )
}

export { Header }
