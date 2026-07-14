"use client"

import { TreeView, type TreeNode } from "@/components/ui/tree-view"
import { ComponentPageLayout } from "@/components/component-page-layout"
import { registryMetadata } from "@/lib/registry-metadata"

export const meta = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "tree-view",
  type: "registry:ui",
  title: "Tree View",
  description:
    "A hierarchical, expandable tree with folder icons, count badges, and optional selection checkboxes.",
  ...registryMetadata["tree-view"],
  files: [
    {
      path: "ui/tree-view.tsx",
      type: "registry:ui",
    },
  ],
  registryDependencies: ["badge", "checkbox"],
  dependencies: ["lucide-react"],
}

const sampleData: TreeNode[] = [
  {
    id: "1",
    label: "Tree View Level 1",
    count: 36,
    children: [
      {
        id: "1-1",
        label: "Tree View Level 2",
        count: 36,
        children: [
          { id: "1-1-1", label: "Tree View Level 3", count: 36 },
          { id: "1-1-2", label: "Tree View Level 3", count: 36 },
          { id: "1-1-3", label: "Tree View Level 3", count: 36 },
          { id: "1-1-4", label: "Tree View Level 3", count: 36 },
        ],
      },
    ],
  },
  { id: "2", label: "Tree View Level 1", count: 36 },
  { id: "3", label: "Tree View Level 1", selectable: false },
  {
    id: "4",
    label: "Tree View Level 1",
    count: 36,
    children: [
      { id: "4-1", label: "Tree View Level 2", selectable: false, children: [{ id: "4-1-1", label: "Tree View Level 3", count: 36 }] },
      { id: "4-2", label: "Tree View Level 2", count: 36, children: [{ id: "4-2-1", label: "Tree View Level 3", count: 36 }] },
      { id: "4-3", label: "Tree View Level 2", count: 36, children: [{ id: "4-3-1", label: "Tree View Level 3", count: 36 }] },
      { id: "4-4", label: "Tree View Level 2", count: 36 },
    ],
  },
  { id: "5", label: "Tree View Level 1", count: 36 },
  { id: "6", label: "Tree View Level 1", count: 36 },
  { id: "7", label: "Tree View Level 1", selectable: false },
]

function TreeViewExample() {
  return (
    <div className="space-y-8">
      {/* Selectable tree */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Selectable with counts</h3>
        <div className="max-w-md rounded-[var(--radius-s)] border border-[var(--color-stroke-default)] p-2">
          <TreeView
            data={sampleData}
            defaultExpandedIds={["1", "1-1", "4"]}
            defaultSelectedIds={["1-1-2"]}
          />
        </div>
      </div>

      {/* Read-only (no checkboxes) */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Without selection</h3>
        <div className="max-w-md rounded-[var(--radius-s)] border border-[var(--color-stroke-default)] p-2">
          <TreeView
            data={sampleData}
            selectable={false}
            defaultExpandedIds={["1", "1-1"]}
          />
        </div>
      </div>
    </div>
  )
}

export default function TreeViewPage() {
  return (
    <ComponentPageLayout meta={meta}>
      <TreeViewExample />
    </ComponentPageLayout>
  )
}
