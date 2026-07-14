import { createElement } from "react"
import type { MouseEvent as ReactMouseEvent } from "react"
import type {
  ColDef,
  ICellRendererParams,
  ValueFormatterParams,
} from "ag-grid-community"
import { MoreVertical } from "lucide-react"

import { Link } from "@one-brd-test/ui"

import type { BalanceRow } from "./types"

const numberFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function formatAmount(params: ValueFormatterParams<BalanceRow, number>): string {
  return numberFormatter.format(params.value ?? 0)
}

function linkRenderer(params: ICellRendererParams<BalanceRow, string>) {
  return createElement(
    Link,
    {
      href: "#",
      className: "brd-grid-link",
      onClick: (event: ReactMouseEvent<HTMLAnchorElement>) => event.preventDefault(),
    },
    params.value ?? ""
  )
}

function actionRenderer() {
  return createElement(
    "button",
    {
      type: "button",
      className: "brd-grid-action-button",
      "aria-label": "Row actions",
    },
    createElement(MoreVertical, { className: "size-4" })
  )
}

const moneyColumnBase: ColDef<BalanceRow> = {
  filter: "agNumberColumnFilter",
  valueFormatter: formatAmount,
  cellClass: "brd-cell-number",
  headerClass: "brd-header-number",
  floatingFilter: false,
}

export const balancesDefaultColDef: ColDef<BalanceRow> = {
  sortable: true,
  filter: "agTextColumnFilter",
  floatingFilter: true,
  resizable: true,
  suppressMovable: true,
}

export const balancesColumnDefs: ColDef<BalanceRow>[] = [
  {
    field: "account",
    headerName: "Account",
    minWidth: 160,
    cellRenderer: linkRenderer,
    filter: "agTextColumnFilter",
  },
  {
    colId: "actions",
    field: "id",
    headerName: "Action",
    minWidth: 72,
    maxWidth: 72,
    width: 72,
    sortable: false,
    filter: false,
    floatingFilter: false,
    resizable: false,
    suppressHeaderMenuButton: true,
    cellClass: "brd-cell-action",
    cellRenderer: actionRenderer,
    valueGetter: () => "",
  },
  {
    field: "currency",
    headerName: "Currency",
    minWidth: 130,
    filter: "agTextColumnFilter",
  },
  {
    field: "accountType",
    headerName: "Account Type",
    minWidth: 180,
    filter: "agTextColumnFilter",
  },
  {
    field: "accountSubtype",
    headerName: "Account Subtype",
    minWidth: 180,
    filter: "agTextColumnFilter",
  },
  {
    ...moneyColumnBase,
    field: "cash",
    headerName: "Cash",
    minWidth: 150,
  },
  {
    ...moneyColumnBase,
    field: "buyingPower",
    headerName: "Buying Power",
    minWidth: 180,
    sort: "desc",
    sortingOrder: ["desc", "asc"],
  },
  {
    ...moneyColumnBase,
    field: "totalValue",
    headerName: "Total Value",
    minWidth: 170,
  },
]
