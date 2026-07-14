import {
  Bookmark,
  BriefcaseBusiness,
  CalendarDays,
  Grid3X3,
  Home,
  Info,
  LayoutDashboard,
  List,
  Pencil,
  Plus,
  Printer,
  SlidersHorizontal,
  Sparkles,
  Users,
} from "lucide-react"

import type {
  LeftNavigationItem,
  SideToolbarItem,
  TopNavigationItem,
} from "@one-brd-test/ui"

export type SandboxViewId = "aum" | "cash-equivalents" | "balances"

export interface SandboxTopNavigationItem extends TopNavigationItem {
  viewId?: SandboxViewId
}

export const DEFAULT_SANDBOX_VIEW_ID: SandboxViewId = "balances"

export const sandboxLeftNavItems: LeftNavigationItem[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "clients", label: "Clients", icon: Users },
  { id: "your-business", label: "Your Business", icon: BriefcaseBusiness },
  { id: "apps", label: "Apps", icon: Grid3X3 },
]

export const sandboxSideToolbarItems: SideToolbarItem[] = [
  { id: "print", label: "Print", icon: Printer },
  { id: "info", label: "Info", icon: Info },
  { id: "bookmark", label: "Bookmark", icon: Bookmark },
  { id: "favorite", label: "Favorite", icon: Sparkles },
  { id: "filters", label: "Filters", icon: SlidersHorizontal },
  { id: "calendar", label: "Calendar", icon: CalendarDays },
  { id: "list", label: "List", icon: List },
  { id: "edit", label: "Edit", icon: Pencil },
  { id: "add", label: "Add", icon: Plus },
]

export function createSandboxTopNavItems(): SandboxTopNavigationItem[] {
  return [
    {
      id: "balances",
      label: "Balances",
      viewId: "balances",
    },
    {
      id: "aum",
      label: "Asset Under Management",
      viewId: "aum",
    },
    {
      id: "cash-equivalents",
      label: "Cash & Equivalents",
      viewId: "cash-equivalents",
    },
    ...Array.from({ length: 10 }, (_, index) => ({
      id: `level-2-${index + 1}`,
      label: "Level 2",
      children: [
        { id: `level-3-${index + 1}-a`, label: "Level 3" },
        { id: `level-3-${index + 1}-b`, label: "Level 3" },
        { id: `level-3-${index + 1}-c`, label: "Level 3" },
      ],
    })),
  ]
}
