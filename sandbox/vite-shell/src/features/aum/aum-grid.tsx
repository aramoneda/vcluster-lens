import { useMemo } from "react"
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community"
import { AgGridReact } from "ag-grid-react"

import { Switch } from "@one-brd-test/ui"

import {
  aumDefaultColDef,
  aumInvestmentColumnDefs,
  aumProductColumnDefs,
} from "./aum-columns"
import type { AumInvestmentRow, AumProductRow, AumViewMode } from "./types"

ModuleRegistry.registerModules([AllCommunityModule])

interface AumGridProps {
  mode: AumViewMode
  title: string
  investmentRows: AumInvestmentRow[]
  productRows: AumProductRow[]
  showChart: boolean
  onShowChartChange: (checked: boolean) => void
}

export function AumGrid({
  mode,
  title,
  investmentRows,
  productRows,
  showChart,
  onShowChartChange,
}: AumGridProps) {
  const rowData = useMemo<Array<AumInvestmentRow | AumProductRow>>(
    () => (mode === "investment" ? investmentRows : productRows),
    [investmentRows, mode, productRows]
  )

  const columnDefs = useMemo(
    () => (mode === "investment"
      ? aumInvestmentColumnDefs
      : aumProductColumnDefs),
    [mode]
  )

  return (
    <section className="aum-grid-panel">
      <div className="aum-grid-panel-header">
        <h4 className="aum-grid-title">{title}</h4>
        <Switch
          checked={showChart}
          onCheckedChange={onShowChartChange}
          label="Show Chart"
          labelPosition="right"
        />
      </div>

      <div className="ag-theme-quartz brd-ag-theme-map brd-aum-grid w-full">
        <AgGridReact<any>
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={aumDefaultColDef}
          rowHeight={44}
          headerHeight={44}
          animateRows={false}
          suppressCellFocus
          suppressRowHoverHighlight={false}
          domLayout="autoHeight"
        />
      </div>
    </section>
  )
}
