import { useState } from "react"

import "./brd-export-check"

import { AumView } from "./features/aum/aum-view"
import { BalancesView } from "./features/balances/balances-view"
import { CashEquivalentsView } from "./features/cash-equivalents/cash-equivalents-view"
import { DEFAULT_SANDBOX_VIEW_ID, type SandboxViewId } from "./features/views/view-registry"

function App() {
  const [activeViewId, setActiveViewId] = useState<SandboxViewId>(DEFAULT_SANDBOX_VIEW_ID)

  if (activeViewId === "cash-equivalents") {
    return <CashEquivalentsView onNavigateView={setActiveViewId} />
  }

  if (activeViewId === "balances") {
    return <BalancesView onNavigateView={setActiveViewId} />
  }

  return <AumView onNavigateView={setActiveViewId} />
}

export default App
