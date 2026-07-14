"use client"

import { useMemo } from "react"
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community"
import type { ColDef } from "ag-grid-community"
import { AgGridReact } from "ag-grid-react"
import { Calendar } from "lucide-react"

import {
  ExpandablePanel,
  ExpandableProgress,
} from "@/components/ui/expandable-panel"
import { InputField } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { brdAgGridTheme } from "@/lib/brd-ag-grid-theme"
import { ComponentPageLayout } from "@/components/component-page-layout"
import { registryMetadata } from "@/lib/registry-metadata"

ModuleRegistry.registerModules([AllCommunityModule])

export const meta = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "expandable-panel",
  type: "registry:ui",
  title: "Expandable Panel",
  description:
    "A single collapsible section (Expansion/Accordion behavior) with a title, an optional accessory region, and a chevron toggle.",
  ...registryMetadata["expandable-panel"],
  files: [
    {
      path: "ui/expandable-panel.tsx",
      type: "registry:ui",
    },
  ],
  registryDependencies: ["collapsible"],
  dependencies: ["lucide-react", "@radix-ui/react-collapsible"],
}

type AllocationRow = {
  fund: string
  strategy: string
  custodian: string
  box: string
  qty: number
  pct: string
  actual: string
}

const allocationRows: AllocationRow[] = [
  { fund: "Fund A", strategy: "Strategy 1", custodian: "Custodian", box: "General", qty: 1000, pct: "50%", actual: "50%" },
  { fund: "Fund B", strategy: "Strategy 2", custodian: "Custodian", box: "General", qty: 1000, pct: "25%", actual: "25%" },
  { fund: "Fund C", strategy: "Strategy 3", custodian: "Custodian", box: "General", qty: 1000, pct: "25%", actual: "25%" },
]

function FundCell({ value }: { value: string }) {
  return (
    <span className="flex items-center gap-[var(--spacing-sp-8)]">
      <span
        aria-hidden
        className="flex size-4 shrink-0 items-center justify-center rounded-full bg-[var(--color-state-error)] text-[10px] font-bold leading-none text-[var(--color-surface-widget)]"
      >
        !
      </span>
      <span>{value}</span>
    </span>
  )
}

function AllocationsGrid() {
  const columnDefs = useMemo<ColDef<AllocationRow>[]>(
    () => [
      { field: "fund", headerName: "Fund", cellRenderer: FundCell, flex: 1.2, minWidth: 140 },
      { field: "strategy", headerName: "Strategy", flex: 1, minWidth: 120 },
      { field: "custodian", headerName: "Custodian", flex: 1, minWidth: 120 },
      { field: "box", headerName: "Box", flex: 1, minWidth: 100 },
      { field: "qty", headerName: "Qty.", type: "numericColumn", valueFormatter: (p) => p.value?.toLocaleString(), width: 110 },
      { field: "pct", headerName: "%", width: 90 },
      { field: "actual", headerName: "Actual %", width: 120 },
    ],
    [],
  )

  const defaultColDef = useMemo<ColDef>(
    () => ({ sortable: true, filter: true, floatingFilter: true, resizable: true }),
    [],
  )

  return (
    <div className="rounded-[var(--radius-s)] bg-[var(--color-surface-widget)] p-[var(--spacing-sp-8)]">
      <div className="h-[260px] w-full">
        <AgGridReact<AllocationRow>
          theme={brdAgGridTheme}
          rowData={allocationRows}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowHeight={44}
          headerHeight={44}
          floatingFiltersHeight={44}
          suppressRowHoverHighlight={false}
        />
      </div>
    </div>
  )
}

function LabeledSelect({
  label,
  value,
  required,
  options,
}: {
  label: string
  value?: string
  required?: boolean
  options: string[]
}) {
  return (
    <div className="flex w-full flex-col gap-[var(--spacing-sp-4)]">
      <div className="flex items-center gap-0.5">
        <Label className="text-sm leading-5 font-normal text-[var(--color-text-secondary)]">
          {label}
        </Label>
        {required && <span className="ml-0.5 font-semibold text-[var(--error-accent)]">*</span>}
      </div>
      <Select defaultValue={value}>
        <SelectTrigger className="h-9 w-full">
          <SelectValue placeholder="" />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

const people = ["James Joyce", "Samuel Beckett", "Oscar Wilde", "W.B. Yeats"]

function MoreDetailsForm() {
  return (
    <div className="grid grid-cols-1 gap-[var(--spacing-sp-16)] sm:grid-cols-2 lg:grid-cols-4">
      <InputField label="Trade Date" required defaultValue="10/27/2025" icon={Calendar} />
      <InputField label="Settle Date" required defaultValue="10/28/2025" icon={Calendar} />
      <LabeledSelect label="Trade Currency" value="James Joyce" options={people} />
      <LabeledSelect label="Settle Currency" value="Samuel Beckett" options={people} />
      <LabeledSelect label="Trader" value="James Joyce" options={people} />
      <LabeledSelect label="Portfolio Manager" value="Samuel Beckett" options={people} />
      <LabeledSelect label="Analyst" value="Samuel Beckett" options={people} />
      <LabeledSelect label="Trade Market" options={people} />
      <LabeledSelect label="Settle FX" options={people} />
      <LabeledSelect label="Cross FX" options={people} />
      <LabeledSelect label="Priority" options={["Low", "Medium", "High"]} />
    </div>
  )
}

function ExpandablePanelExample() {
  return (
    <div className="space-y-8">
      {/* Progress accessory — within target (blue) */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">With progress accessory</h3>
        <ExpandablePanel
          title="Allocations"
          defaultOpen
          accessory={<ExpandableProgress current={1000} total={1000} />}
        >
          <AllocationsGrid />
        </ExpandablePanel>
      </div>

      {/* Progress accessory — over-allocated (red) */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Over-allocated (error state)</h3>
        <ExpandablePanel
          title="Allocations"
          defaultOpen
          accessory={<ExpandableProgress current={1100} total={1000} />}
        >
          <AllocationsGrid />
        </ExpandablePanel>
      </div>

      {/* Form content */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Form content</h3>
        <ExpandablePanel title="More Details" defaultOpen>
          <MoreDetailsForm />
        </ExpandablePanel>
      </div>

      {/* Inline value accessory */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Inline value accessory</h3>
        <ExpandablePanel
          title="Total Consideration"
          accessory={
            <span className="text-[var(--color-text-primary)] [font:var(--font-body-large)]">
              USD <strong className="[font:var(--font-body-large-bold)]">122,300.00</strong>
            </span>
          }
        >
          <p className="text-[var(--color-text-secondary)] [font:var(--font-body-medium)]">
            Detailed breakdown of the total consideration goes here.
          </p>
        </ExpandablePanel>
      </div>

      {/* Title only */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Title only</h3>
        <ExpandablePanel title="Commissions and Fees">
          <p className="text-[var(--color-text-secondary)] [font:var(--font-body-medium)]">
            Commission and fee schedule details go here.
          </p>
        </ExpandablePanel>
      </div>

      {/* Grouped (accordion-like stack) */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Stacked panels</h3>
        <div className="flex flex-col gap-[var(--spacing-sp-12)]">
          <ExpandablePanel
            title="Allocations"
            accessory={<ExpandableProgress current={800} total={1000} />}
          >
            <AllocationsGrid />
          </ExpandablePanel>
          <ExpandablePanel title="Commissions and Fees">
            <p className="text-[var(--color-text-secondary)] [font:var(--font-body-medium)]">
              Commission and fee schedule details go here.
            </p>
          </ExpandablePanel>
        </div>
      </div>
    </div>
  )
}

export default function ExpandablePanelPage() {
  return (
    <ComponentPageLayout meta={meta}>
      <ExpandablePanelExample />
    </ComponentPageLayout>
  )
}
