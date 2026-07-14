import type { SandboxViewId } from "../views/view-registry"

export type AumViewMode = "investment" | "product"

export interface AumBubblePoint {
  id: string
  label: string
  secondaryLabel?: string
  value: number
  displayValue: string
  x: number
  y: number
  z: number
  colorToken: `--color-chart-${number}`
  labelTone: "light" | "dark"
}

export interface AumInvestmentRow {
  id: number
  securityType: string
  totalValue: number
  percentTotal: number
}

export interface AumProductRow {
  id: number
  accountType: string
  accountSubtype: string
  accounts: number
  totalValue: number
  percentTotal: number
}

export interface AumPopoverState {
  point: AumBubblePoint
  anchorX: number
  anchorY: number
}

export interface AumViewState {
  activeTopId?: string
  activeLeftId?: string
  activeToolbarId?: string
  mode: AumViewMode
  showChart: boolean
}

export interface AumViewProps {
  onNavigateView?: (viewId: SandboxViewId) => void
}
