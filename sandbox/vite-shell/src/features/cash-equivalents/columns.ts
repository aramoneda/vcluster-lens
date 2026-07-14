import { createElement } from "react"
import type { MouseEvent as ReactMouseEvent } from "react"
import type {
  ColDef,
  ICellRendererParams,
  ValueFormatterParams,
} from "ag-grid-community"
import { MoreVertical } from "lucide-react"
import { Link } from "@one-brd-test/ui"

import type { CashRow } from "./types"

const numberFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function formatAmount(params: ValueFormatterParams<CashRow, number>): string {
  return numberFormatter.format(params.value ?? 0)
}

function linkRenderer(params: ICellRendererParams<CashRow, string>) {
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

const moneyColumnBase: ColDef<CashRow> = {
  filter: "agNumberColumnFilter",
  valueFormatter: formatAmount,
  cellClass: "brd-cell-number",
  headerClass: "brd-header-number",
}

export const cashDefaultColDef: ColDef<CashRow> = {
  sortable: true,
  filter: "agTextColumnFilter",
  floatingFilter: true,
  resizable: true,
  suppressMovable: true,
}

export const cashColumnDefs: ColDef<CashRow>[] = [
  {
    field: "account",
    headerName: "Account",
    minWidth: 160,
    cellRenderer: linkRenderer,
    filter: "agTextColumnFilter",
  },
  {
    colId: "actions",
    headerName: "",
    minWidth: 44,
    maxWidth: 44,
    width: 44,
    sortable: false,
    filter: false,
    floatingFilter: false,
    resizable: false,
    suppressHeaderMenuButton: true,
    cellClass: "brd-cell-action",
    cellRenderer: actionRenderer,
  },
  {
    field: "clientName",
    headerName: "Client Name",
    minWidth: 170,
    cellRenderer: linkRenderer,
    filter: "agTextColumnFilter",
  },
  {
    field: "accountType",
    headerName: "Account Type",
    minWidth: 150,
    filter: "agTextColumnFilter",
  },
  {
    field: "accountSubtype",
    headerName: "Account Subtype",
    minWidth: 170,
    filter: "agTextColumnFilter",
  },
  {
    ...moneyColumnBase,
    field: "pendingCash",
    headerName: "Pending Cash",
    minWidth: 150,
  },
  {
    ...moneyColumnBase,
    field: "pendingEquivalents",
    headerName: "Pending Equivalents",
    minWidth: 180,
  },
  {
    ...moneyColumnBase,
    field: "totalPending",
    headerName: "Total Pending (Cash/CE)",
    minWidth: 220,
  },
  {
    ...moneyColumnBase,
    field: "settledCash",
    headerName: "Settled Cash",
    minWidth: 150,
  },
  {
    ...moneyColumnBase,
    field: "settledEquivalents",
    headerName: "Settled Equivalents",
    minWidth: 180,
  },
  {
    ...moneyColumnBase,
    field: "totalSettled",
    headerName: "Total Settled",
    minWidth: 150,
  },
]
