import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { registryMetadata } from "@/lib/registry-metadata"
// Added ComponentPageLayout import for consistent layout
import { ComponentPageLayout } from "@/components/component-page-layout"

// Added dynamic export for force-dynamic rendering
export const dynamic = "force-dynamic"

export const meta = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "table",
  type: "registry:ui",
  title: "Table",
  description: "A lightweight semantic table component for simple static content. For v0-generated application views, prefer AG Grid with the BRD AG Grid theme helper.",
  ...registryMetadata["table"],
  files: [
    {
      path: "ui/table.tsx",
      type: "registry:ui",
    },
  ],
}

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
]

// Extracted example component for consistency
function TableExample() {
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell className="font-medium">{invoice.invoice}</TableCell>
            <TableCell>{invoice.paymentStatus}</TableCell>
            <TableCell>{invoice.paymentMethod}</TableCell>
            <TableCell className="text-right">{invoice.totalAmount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default function TablePage() {
  // Now using ComponentPageLayout for consistent structure
  return (
    <ComponentPageLayout meta={meta}>
      <TableExample />
    </ComponentPageLayout>
  )
}
