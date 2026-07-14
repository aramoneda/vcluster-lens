import { useMemo } from "react"
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community"
import { AgGridReact } from "ag-grid-react"

import { cashColumnDefs, cashDefaultColDef } from "./columns"
import type { CashGridProps } from "./types"

ModuleRegistry.registerModules([AllCommunityModule])

export function CashGrid({ rows }: CashGridProps) {
  const columnDefs = useMemo(() => cashColumnDefs, [])
  const defaultColDef = useMemo(() => cashDefaultColDef, [])

  return (
    <section className="cash-grid-panel">
      <div className="ag-theme-quartz brd-ag-theme-map brd-ag-grid h-[980px] w-full">
        <AgGridReact
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
