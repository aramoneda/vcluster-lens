import { useMemo, useRef } from "react"
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community"
import type { AgGridReact as AgGridReactType } from "ag-grid-react"
import { AgGridReact } from "ag-grid-react"

import { Link } from "@one-brd-test/ui"

import { balancesColumnDefs, balancesDefaultColDef } from "./columns"
import type { BalanceRow, BalancesGridProps } from "./types"

ModuleRegistry.registerModules([AllCommunityModule])

export function BalancesGrid({ rows }: BalancesGridProps) {
  const columnDefs = useMemo(() => balancesColumnDefs, [])
  const defaultColDef = useMemo(() => balancesDefaultColDef, [])
  const gridRef = useRef<AgGridReactType<BalanceRow>>(null)

  return (
    <section className="balances-grid-panel">
      <div className="balances-grid-header">
        <h4 className="balances-grid-title">Balance Details</h4>
        <Link
          href="#"
          className="balances-reset-link"
          onClick={(event) => {
            event.preventDefault()
            gridRef.current?.api.resetColumnState()
          }}
        >
          Reset Columns
        </Link>
      </div>
      <div className="ag-theme-quartz brd-ag-theme-map brd-ag-grid h-[980px] w-full">
        <AgGridReact
          ref={gridRef}
          rowData={rows}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination
          paginationPageSize={100}
          rowHeight={44}
          headerHeight={44}
          floatingFiltersHeight={44}
          suppressRowHoverHighlight={false}
          suppressRowTransform
        />
      </div>
    </section>
  )
}
