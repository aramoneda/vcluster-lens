import type {
  AumBubblePoint,
  AumInvestmentRow,
  AumProductRow,
  AumViewMode,
} from "./types"

const currencyFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function toDisplayValue(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`
  }
  return `${Math.round(value / 1_000)}K`
}

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value)
}

const investmentBubbles: AumBubblePoint[] = [
  {
    id: "equity",
    label: "Equity",
    value: 4_500_000,
    displayValue: toDisplayValue(4_500_000),
    x: 27,
    y: 51,
    z: 44,
    colorToken: "--color-chart-1",
    labelTone: "light",
  },
  {
    id: "fixed-income",
    label: "Fixed Income",
    value: 1_500_000,
    displayValue: toDisplayValue(1_500_000),
    x: 50,
    y: 40,
    z: 30,
    colorToken: "--color-chart-3",
    labelTone: "light",
  },
  {
    id: "mutual-funds",
    label: "Mutual Funds",
    value: 2_500_000,
    displayValue: toDisplayValue(2_500_000),
    x: 67,
    y: 62,
    z: 36,
    colorToken: "--color-chart-2",
    labelTone: "dark",
  },
  {
    id: "cash-equivalents",
    label: "Cash Equiv.",
    value: 400_000,
    displayValue: toDisplayValue(400_000),
    x: 63,
    y: 27,
    z: 14,
    colorToken: "--color-chart-6",
    labelTone: "dark",
  },
  {
    id: "options",
    label: "Options",
    value: 500_000,
    displayValue: toDisplayValue(500_000),
    x: 75,
    y: 30,
    z: 16,
    colorToken: "--color-chart-4",
    labelTone: "dark",
  },
  {
    id: "alternative-assets",
    label: "Alternative",
    secondaryLabel: "Assets",
    value: 500_000,
    displayValue: toDisplayValue(500_000),
    x: 43,
    y: 74,
    z: 18,
    colorToken: "--color-chart-5",
    labelTone: "light",
  },
  {
    id: "other",
    label: "Other",
    value: 100_000,
    displayValue: toDisplayValue(100_000),
    x: 54,
    y: 62,
    z: 8,
    colorToken: "--color-chart-7",
    labelTone: "light",
  },
]

const productBubbles: AumBubblePoint[] = [
  {
    id: "mgn-long-1",
    label: "MGN-LONG",
    value: 4_500_000,
    displayValue: toDisplayValue(4_500_000),
    x: 75,
    y: 52,
    z: 44,
    colorToken: "--color-chart-1",
    labelTone: "light",
  },
  {
    id: "nominee-rrsp",
    label: "NOMINEE",
    secondaryLabel: "RRSP",
    value: 2_500_000,
    displayValue: toDisplayValue(2_500_000),
    x: 17,
    y: 57,
    z: 36,
    colorToken: "--color-chart-2",
    labelTone: "dark",
  },
  {
    id: "nominee-frri",
    label: "NOMINEE",
    secondaryLabel: "FRRI / LRIF",
    value: 1_500_000,
    displayValue: toDisplayValue(1_500_000),
    x: 54,
    y: 39,
    z: 30,
    colorToken: "--color-chart-3",
    labelTone: "light",
  },
  {
    id: "mgn-long-2",
    label: "MGN-LONG",
    value: 500_000,
    displayValue: toDisplayValue(500_000),
    x: 60,
    y: 72,
    z: 18,
    colorToken: "--color-chart-4",
    labelTone: "dark",
  },
  {
    id: "mgn-long-3",
    label: "MGN-LONG",
    value: 500_000,
    displayValue: toDisplayValue(500_000),
    x: 36,
    y: 55,
    z: 18,
    colorToken: "--color-chart-5",
    labelTone: "light",
  },
  {
    id: "nominee-resp",
    label: "NOMINEE",
    secondaryLabel: "RESP-FAM",
    value: 400_000,
    displayValue: toDisplayValue(400_000),
    x: 45,
    y: 70,
    z: 14,
    colorToken: "--color-chart-6",
    labelTone: "dark",
  },
  {
    id: "offbook-frri",
    label: "OFFBOOK",
    secondaryLabel: "FRRI / LRIF",
    value: 100_000,
    displayValue: toDisplayValue(100_000),
    x: 39,
    y: 28,
    z: 10,
    colorToken: "--color-chart-7",
    labelTone: "light",
  },
]

const investmentRows: AumInvestmentRow[] = [
  { id: 1, securityType: "Equity", totalValue: 4_500_000, percentTotal: 45 },
  { id: 2, securityType: "Mutual Funds", totalValue: 2_500_000, percentTotal: 25 },
  { id: 3, securityType: "Fixed Income", totalValue: 1_500_000, percentTotal: 15 },
  { id: 4, securityType: "Options", totalValue: 500_000, percentTotal: 5 },
  { id: 5, securityType: "Alternative Assets", totalValue: 500_000, percentTotal: 5 },
  { id: 6, securityType: "Cash Equivalents", totalValue: 400_000, percentTotal: 4 },
  { id: 7, securityType: "Other", totalValue: 100_000, percentTotal: 1 },
]

const productRows: AumProductRow[] = [
  { id: 1, accountType: "MGN-LONG", accountSubtype: "-", accounts: 145, totalValue: 4_500_000, percentTotal: 45 },
  { id: 2, accountType: "NOMINEE", accountSubtype: "RRSP", accounts: 123, totalValue: 2_500_000, percentTotal: 25 },
  { id: 3, accountType: "NOMINEE", accountSubtype: "FRRI / LRIF", accounts: 212, totalValue: 1_500_000, percentTotal: 15 },
  { id: 4, accountType: "MGN-LONG", accountSubtype: "-", accounts: 433, totalValue: 500_000, percentTotal: 5 },
  { id: 5, accountType: "MGN-LONG", accountSubtype: "-", accounts: 32, totalValue: 500_000, percentTotal: 5 },
  { id: 6, accountType: "NOMINEE", accountSubtype: "RESP-FAM", accounts: 56, totalValue: 400_000, percentTotal: 4 },
  { id: 7, accountType: "OFFBOOK", accountSubtype: "FRRI / LRIF", accounts: 76, totalValue: 100_000, percentTotal: 1 },
]

export function getAumBubblePoints(mode: AumViewMode): AumBubblePoint[] {
  return mode === "investment" ? investmentBubbles : productBubbles
}

export function getAumTableTitle(mode: AumViewMode): string {
  return mode === "investment" ? "Securities" : "Accounts"
}

export function getInvestmentRows(): AumInvestmentRow[] {
  return investmentRows
}

export function getProductRows(): AumProductRow[] {
  return productRows
}
