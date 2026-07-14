export interface CashRow {
  id: number
  account: string
  clientName: string
  accountType: string
  accountSubtype: string
  pendingCash: number
  pendingEquivalents: number
  totalPending: number
  settledCash: number
  settledEquivalents: number
  totalSettled: number
}

export interface DatapointMetric {
  id: string
  label: string
  value: string
  emphasis?: "default" | "brand"
}

export interface CashEquivalentsViewState {
  activeTopId?: string
  activeLeftId?: string
  activeToolbarId?: string
  asOf: string
}

export interface DatapointCardProps extends DatapointMetric {
  className?: string
}

export interface CashGridProps {
  rows: CashRow[]
}
