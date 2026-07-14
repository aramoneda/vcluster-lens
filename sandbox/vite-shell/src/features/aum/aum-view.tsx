import { useMemo, useState } from "react"

import {
  Link,
  PageHeader,
  Shell,
  ToggleGroup,
  ToggleGroupItem,
} from "@one-brd-test/ui"

import {
  getAumBubblePoints,
  getAumTableTitle,
  getInvestmentRows,
  getProductRows,
} from "./aum-data"
import { AumBubbleChart } from "./aum-bubble-chart"
import { AumGrid } from "./aum-grid"
import type { AumViewProps, AumViewState } from "./types"
import {
  createSandboxTopNavItems,
  sandboxLeftNavItems,
  sandboxSideToolbarItems,
  type SandboxTopNavigationItem,
} from "../views/view-registry"

import "./aum.css"

export function AumView({ onNavigateView }: AumViewProps) {
  const topNavItems = useMemo(() => createSandboxTopNavItems(), [])
  const investmentRows = useMemo(() => getInvestmentRows(), [])
  const productRows = useMemo(() => getProductRows(), [])

  const [state, setState] = useState<AumViewState>({
    activeTopId: "aum",
    activeLeftId: "clients",
    activeToolbarId: "favorite",
    mode: "investment",
    showChart: true,
  })

  const bubblePoints = useMemo(() => getAumBubblePoints(state.mode), [state.mode])
  const tableTitle = getAumTableTitle(state.mode)

  return (
    <div className="aum-view min-h-screen bg-[var(--color-surface-background)]">
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

            if (navItem.viewId && navItem.viewId !== "aum") {
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
        <div className="aum-content-stack">
          <PageHeader
            className="aum-page-header"
            title="Asset Under Management"
            timestamp="Last Update 12/22/2024 12:30 PM ET"
            onRefresh={() => {}}
            actions={(
              <ToggleGroup
                type="single"
                size="default"
                value={state.mode}
                className="aum-view-toggle"
                onValueChange={(value) => {
                  if (value === "investment" || value === "product") {
                    setState((prev) => ({ ...prev, mode: value }))
                  }
                }}
              >
                <ToggleGroupItem
                  value="investment"
                  className="aum-view-toggle-item"
                >
                  AUM by Investment Type
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="product"
                  className="aum-view-toggle-item"
                >
                  AUM by Product Type
                </ToggleGroupItem>
              </ToggleGroup>
            )}
          />

          {state.showChart && <AumBubbleChart points={bubblePoints} />}

          <AumGrid
            mode={state.mode}
            title={tableTitle}
            investmentRows={investmentRows}
            productRows={productRows}
            showChart={state.showChart}
            onShowChartChange={(checked) => setState((prev) => ({ ...prev, showChart: checked }))}
          />

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
