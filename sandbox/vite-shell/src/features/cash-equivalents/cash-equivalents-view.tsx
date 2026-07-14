import { useMemo, useState } from "react"
import { ChevronDown } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Link,
  PageHeader,
  Shell,
} from "@one-brd-test/ui"

import { CashGrid } from "./cash-grid"
import { DatapointCard } from "./datapoint-card"
import { generateCashRows } from "./mock-data"
import type { CashEquivalentsViewState, DatapointMetric } from "./types"
import {
  createSandboxTopNavItems,
  sandboxLeftNavItems,
  sandboxSideToolbarItems,
  type SandboxTopNavigationItem,
  type SandboxViewId,
} from "../views/view-registry"

import "./cash-equivalents.css"

const datapoints: DatapointMetric[] = [
  { id: "total-cash", label: "Total Cash", value: "$999,999,999.00" },
  { id: "accounts", label: "Accounts", value: "345" },
  { id: "accounts-cash-gt-10k", label: "Accounts with Cash >10k", value: "212" },
  { id: "total-ce", label: "Total Cash Equivalents", value: "$999,999,999.00" },
  { id: "accounts-ce-gt-10k", label: "Accounts with CE >10k", value: "123" },
]

const asOfOptions = [
  { id: "intraday", label: "Intraday" },
  { id: "prior-business-day-close", label: "Prior Business Day Close" },
]

interface CashEquivalentsViewProps {
  onNavigateView?: (viewId: SandboxViewId) => void
}

export function CashEquivalentsView({ onNavigateView }: CashEquivalentsViewProps) {
  const topNavItems = useMemo(() => createSandboxTopNavItems(), [])

  const [state, setState] = useState<CashEquivalentsViewState>({
    activeTopId: "cash-equivalents",
    activeLeftId: "clients",
    activeToolbarId: "favorite",
    asOf: "intraday",
  })

  const rows = useMemo(() => generateCashRows(220), [])
  const selectedAsOf = asOfOptions.find((option) => option.id === state.asOf) ?? asOfOptions[0]

  return (
    <div className="cash-equivalents-view min-h-screen bg-[var(--color-surface-background)]">
      <Shell
        headerProps={{
          userName: "John Smith",
          userInitials: "JS",
          selectedCurrencyId: "usd",
          selectedLanguageId: "eng",
          notificationCount: 0,
        }}
        topNavigationProps={{
          items: topNavItems,
          activeId: state.activeTopId,
          onItemSelect: (item) => {
            const navItem = item as SandboxTopNavigationItem
            setState((prev) => ({ ...prev, activeTopId: navItem.id }))
            if (navItem.viewId && navItem.viewId !== "cash-equivalents") {
              onNavigateView?.(navItem.viewId)
            }
          },
          className: "pl-[var(--shell-left-rail-width)]",
        }}
        leftNavigationProps={{
          items: sandboxLeftNavItems,
          activeId: state.activeLeftId,
          onItemSelect: (item) => setState((prev) => ({ ...prev, activeLeftId: item.id })),
          position: "fixed",
        }}
        sideToolbarProps={{
          items: sandboxSideToolbarItems,
          activeId: state.activeToolbarId,
          onItemSelect: (item) => setState((prev) => ({ ...prev, activeToolbarId: item.id })),
          position: "fixed",
        }}
        pageContainerProps={{ className: "pb-10" }}
        footerProps={{
          copyrightText: `${new Date().getFullYear()} (C) | All rights reserved.`,
        }}
      >
        <div className="ce-content-stack">
          <PageHeader
            className="ce-page-header"
            title="Cash & Equivalents"
            timestamp="Last Update 12/22/2024 12:30 PM ET"
            onRefresh={() => {}}
            actions={(
              <div className="ce-asof-wrap">
                <span className="ce-asof-label">As of:</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button type="button" className="ce-asof-trigger">
                      <span>{selectedAsOf.label}</span>
                      <ChevronDown className="size-4 text-[var(--color-icon-brand)]" aria-hidden="true" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent position="bottom-right" className="min-w-[240px]">
                    {asOfOptions.map((option) => (
                      <DropdownMenuItem
                        key={option.id}
                        isActive={option.id === state.asOf}
                        onSelect={() => setState((prev) => ({ ...prev, asOf: option.id }))}
                      >
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          />

          <section className="grid grid-cols-5 items-start gap-3">
            {datapoints.map((metric) => (
              <DatapointCard
                key={metric.id}
                id={metric.id}
                label={metric.label}
                value={metric.value}
              />
            ))}
          </section>

          <CashGrid rows={rows} />

          <div className="pt-1">
            <Link href="#" onClick={(event) => event.preventDefault()}>
              Disclosures
            </Link>
          </div>
        </div>
      </Shell>
    </div>
  )
}
