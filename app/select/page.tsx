import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ComponentPageLayout } from "@/components/component-page-layout"
import { registryMetadata } from "@/lib/registry-metadata"

// Added dynamic export for force-dynamic rendering
export const dynamic = "force-dynamic"

export const meta = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "select",
  type: "registry:ui",
  title: "Select",
  description: "Displays a list of options for the user to pick from—triggered by a button.",
  ...registryMetadata["select"],
  dependencies: [
    "@radix-ui/react-select",
    "lucide-react",
  ],
  files: [
    {
      path: "ui/select.tsx",
      type: "registry:ui",
    },
  ],
}

const securities = [
  {
    value: "US38384EV697",
    cusip: "US38384EV697",
    issuer: "JP Morgan",
    price: "$34.12",
    tags: "C  TR  BD",
    coupon: "6.125",
    maturity: "11/15/27",
    allowable: "USD 12,848,242.9 Allowable",
  },
  {
    value: "CA135087R481",
    cusip: "CA135087R481",
    issuer: "JP Morgan",
    price: "$182.45",
    tags: "C  TR  BD",
    coupon: "6.125",
    maturity: "11/15/27",
    allowable: "USD 14,098,290.9 Allowable",
  },
  {
    value: "0937833100",
    cusip: "0937833100",
    issuer: "JP Morgan",
    price: "$56.09",
    tags: "C  TR  BD",
    coupon: "6.125",
    maturity: "11/15/27",
    allowable: "USD 10,241,966.2 Allowable",
  },
]

function SecurityOption({ s }: { s: (typeof securities)[number] }) {
  return (
    <div className="flex flex-col gap-[var(--spacing-sp-4)]">
      <span
        className="text-[var(--color-text-primary)] group-data-[state=checked]:text-[var(--color-text-selected)]"
        style={{ font: "var(--font-body-medium-semibold)" }}
      >
        {s.cusip}
      </span>
      <span
        className="text-[var(--color-text-secondary)]"
        style={{ font: "var(--font-body-medium)" }}
      >
        {s.issuer} • {s.price}
      </span>
      <span
        className="text-[var(--color-text-secondary)]"
        style={{ font: "var(--font-body-medium)" }}
      >
        {s.tags}{"   "}{s.coupon}{"   "}{s.maturity}
      </span>
      <span
        className="text-[var(--color-text-secondary)]"
        style={{ font: "var(--font-body-medium)" }}
      >
        {s.allowable}
      </span>
    </div>
  )
}

function SelectExample() {
  return (
    <div className="space-y-[var(--spacing-sp-32)] max-w-sm">
      <div className="space-y-[var(--spacing-sp-4)]">
        <Label>Select a fruit</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="blueberry">Blueberry</SelectItem>
            <SelectItem value="grapes">Grapes</SelectItem>
            <SelectItem value="pineapple">Pineapple</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-[var(--spacing-sp-4)]">
        <Label>Sizes</Label>
        <div className="flex flex-col gap-[var(--spacing-sp-8)]">
          <Select>
            <SelectTrigger className="w-full" size="default">
              <SelectValue placeholder="Default (36px)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full" size="sm">
              <SelectValue placeholder="Small (32px)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full" size="xs">
              <SelectValue placeholder="Extra small (24px)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-[var(--spacing-sp-4)]">
        <Label>Security</Label>
        <Select defaultValue="US38384EV697">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Search an option" />
          </SelectTrigger>
          <SelectContent>
            {securities.map((s) => (
              <SelectItem
                key={s.value}
                value={s.value}
                variant="custom"
                className="group"
                triggerLabel={s.cusip}
                textValue={s.cusip}
              >
                <SecurityOption s={s} />
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export default function SelectPage() {
  return (
    <ComponentPageLayout meta={meta}>
      <SelectExample />
    </ComponentPageLayout>
  )
}
