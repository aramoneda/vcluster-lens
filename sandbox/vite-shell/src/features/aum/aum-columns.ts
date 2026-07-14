import type { ColDef, ValueFormatterParams } from "ag-grid-community"

const valueFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function formatMoney(params: ValueFormatterParams<any, number>): string {
  return valueFormatter.format(params.value ?? 0)
}

function formatPercent(params: ValueFormatterParams<any, number>): string {
  return `${(params.value ?? 0).toFixed(2)}%`
}

const numericColumnBase: ColDef<any> = {
  headerClass: "brd-aum-header-number",
  cellClass: "brd-aum-cell-number",
}

export const aumDefaultColDef: ColDef<any> = {
  sortable: true,
  filter: false,
  floatingFilter: false,
  resizable: false,
  suppressMovable: true,
}

export const aumInvestmentColumnDefs: ColDef<any>[] = [
  {
    field: "securityType",
    headerName: "Security Type",
    minWidth: 320,
    flex: 1,
  },
  {
    ...numericColumnBase,
    field: "totalValue",
    headerName: "Total Value",
    minWidth: 240,
    valueFormatter: formatMoney,
    sort: "desc",
    sortingOrder: ["desc", "asc"],
  },
  {
    ...numericColumnBase,
    field: "percentTotal",
    headerName: "% of Total",
    minWidth: 220,
    valueFormatter: formatPercent,
  },
]

export const aumProductColumnDefs: ColDef<any>[] = [
  {
    field: "accountType",
    headerName: "Account Type",
    minWidth: 220,
    flex: 1,
  },
  {
    field: "accountSubtype",
    headerName: "Account Subtype",
    minWidth: 220,
    flex: 1,
  },
  {
    ...numericColumnBase,
    field: "accounts",
    headerName: "Accounts",
    minWidth: 140,
    valueFormatter: (params) => String(params.value ?? 0),
  },
  {
    ...numericColumnBase,
    field: "totalValue",
    headerName: "Total Value",
    minWidth: 220,
    valueFormatter: formatMoney,
    sort: "desc",
    sortingOrder: ["desc", "asc"],
  },
  {
    ...numericColumnBase,
    field: "percentTotal",
    headerName: "% of Total",
    minWidth: 180,
    valueFormatter: formatPercent,
  },
]
