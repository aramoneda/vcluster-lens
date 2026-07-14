import type { SandboxViewId } from "../views/view-registry"

export interface BalanceRow {
  id: number
  account: string
  currency: string
  accountType: string
  accountSubtype: string
  cash: number
  buyingPower: number
  totalValue: number
}

export interface BalanceDatapointMetric {
  id: string
  label: string
  value: string
  emphasis?: "default" | "brand"
}

export interface BalancesViewState {
  activeTopId?: string
  activeLeftId?: string
  activeToolbarId?: string
  asOf: string
}

export interface BalancesDatapointCardProps extends BalanceDatapointMetric {
  className?: string
}

export interface BalancesGridProps {
  rows: BalanceRow[]
}

export interface BalancesViewProps {
  onNavigateView?: (viewId: SandboxViewId) => void
}
