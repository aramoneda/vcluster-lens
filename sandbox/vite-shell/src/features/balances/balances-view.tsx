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

import { BalancesDatapointCard } from "./datapoint-card"
import { BalancesGrid } from "./balances-grid"
import { generateBalanceRows } from "./mock-data"
import type { BalanceDatapointMetric, BalancesViewProps, BalancesViewState } from "./types"
import {
  createSandboxTopNavItems,
  sandboxLeftNavItems,
  sandboxSideToolbarItems,
  type SandboxTopNavigationItem,
} from "../views/view-registry"

import "./balances.css"

const datapoints: BalanceDatapointMetric[] = [
  { id: "total-value", label: "Total Value", value: "$999,999,999.00" },
  { id: "total-cash", label: "Total Cash", value: "$999,999,999.00" },
  { id: "total-buying-power", label: "Total Buying Power", value: "$999,999,999.00" },
]

const asOfOptions = [
  { id: "intraday", label: "Intraday" },
  { id: "prior-business-day-close", label: "Prior Business Day Close" },
]

export function BalancesView({ onNavigateView }: BalancesViewProps) {
  const topNavItems = useMemo(() => createSandboxTopNavItems(), [])
  const rows = useMemo(() => generateBalanceRows(220), [])

  const [state, setState] = useState<BalancesViewState>({
    activeTopId: "balances",
    activeLeftId: "clients",
    activeToolbarId: "favorite",
    asOf: "intraday",
  })

  const selectedAsOf = asOfOptions.find((option) => option.id === state.asOf) ?? asOfOptions[0]

  return (
    <div className="balances-view min-h-screen bg-[var(--color-surface-background)]">
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
            if (navItem.viewId && navItem.viewId !== "balances") {
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
        <div className="bal-content-stack">
          <PageHeader
            className="bal-page-header"
            title="Balances"
            timestamp="Last Update 12/22/2024 12:30 PM ET"
            onRefresh={() => {}}
            actions={(
              <div className="bal-asof-wrap">
                <span className="bal-asof-label">As of:</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button type="button" className="bal-asof-trigger">
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

          <section className="grid grid-cols-3 items-start gap-3">
            {datapoints.map((metric) => (
              <BalancesDatapointCard
                key={metric.id}
                id={metric.id}
                label={metric.label}
                value={metric.value}
              />
            ))}
          </section>

          <BalancesGrid rows={rows} />

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
