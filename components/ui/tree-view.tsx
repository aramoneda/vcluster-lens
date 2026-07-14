"use client"

import * as React from "react"
import { ChevronRight, Folder } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

export interface TreeNode {
  /** Unique identifier for the node. */
  id: string
  /** Visible label. */
  label: React.ReactNode
  /** Optional trailing count badge (e.g. number of items). */
  count?: number
  /** Child nodes. Presence of `children` makes the node expandable. */
  children?: TreeNode[]
  /**
   * Whether this node renders a selection checkbox. Falls back to the
   * TreeView-level `selectable` setting when undefined.
   */
  selectable?: boolean
  /** Optional custom leading icon (defaults to a folder). */
  icon?: React.ReactNode
}

type TreeViewContextValue = {
  expandedIds: Set<string>
  toggleExpanded: (id: string) => void
  selectedIds: Set<string>
  toggleSelected: (id: string) => void
  selectable: boolean
}

const TreeViewContext = React.createContext<TreeViewContextValue | null>(null)

function useTreeViewContext() {
  const ctx = React.useContext(TreeViewContext)
  if (!ctx) {
    throw new Error("TreeView compound components must be used within <TreeView>")
  }
  return ctx
}

function useControllableSet(
  controlled: string[] | undefined,
  defaultValue: string[] | undefined,
  onChange: ((ids: string[]) => void) | undefined,
) {
  const isControlled = controlled != null
  const [uncontrolled, setUncontrolled] = React.useState<Set<string>>(
    () => new Set(defaultValue ?? []),
  )
  const value = React.useMemo(
    () => (isControlled ? new Set(controlled) : uncontrolled),
    [isControlled, controlled, uncontrolled],
  )

  const update = React.useCallback(
    (next: Set<string>) => {
      if (!isControlled) setUncontrolled(next)
      onChange?.(Array.from(next))
    },
    [isControlled, onChange],
  )

  return [value, update] as const
}

export interface TreeViewProps extends React.HTMLAttributes<HTMLUListElement> {
  /** Tree data. */
  data: TreeNode[]
  /** Show a selection checkbox on each node (per-node `selectable` overrides). */
  selectable?: boolean
  /** Controlled set of expanded node ids. */
  expandedIds?: string[]
  /** Initial expanded node ids (uncontrolled). */
  defaultExpandedIds?: string[]
  /** Called when the expanded set changes. */
  onExpandedChange?: (ids: string[]) => void
  /** Controlled set of selected (checked) node ids. */
  selectedIds?: string[]
  /** Initial selected node ids (uncontrolled). */
  defaultSelectedIds?: string[]
  /** Called when the selected set changes. */
  onSelectedChange?: (ids: string[]) => void
}

function TreeView({
  data,
  selectable = true,
  expandedIds,
  defaultExpandedIds,
  onExpandedChange,
  selectedIds,
  defaultSelectedIds,
  onSelectedChange,
  className,
  ...props
}: TreeViewProps) {
  const [expanded, setExpanded] = useControllableSet(
    expandedIds,
    defaultExpandedIds,
    onExpandedChange,
  )
  const [selected, setSelected] = useControllableSet(
    selectedIds,
    defaultSelectedIds,
    onSelectedChange,
  )

  const toggleExpanded = React.useCallback(
    (id: string) => {
      const next = new Set(expanded)
      next.has(id) ? next.delete(id) : next.add(id)
      setExpanded(next)
    },
    [expanded, setExpanded],
  )

  const toggleSelected = React.useCallback(
    (id: string) => {
      const next = new Set(selected)
      next.has(id) ? next.delete(id) : next.add(id)
      setSelected(next)
    },
    [selected, setSelected],
  )

  const ctx = React.useMemo<TreeViewContextValue>(
    () => ({
      expandedIds: expanded,
      toggleExpanded,
      selectedIds: selected,
      toggleSelected,
      selectable,
    }),
    [expanded, toggleExpanded, selected, toggleSelected, selectable],
  )

  return (
    <TreeViewContext.Provider value={ctx}>
      <ul
        role="tree"
        data-slot="tree-view"
        className={cn("w-full", className)}
        {...props}
      >
        {data.map((node) => (
          <TreeItem key={node.id} node={node} level={1} />
        ))}
      </ul>
    </TreeViewContext.Provider>
  )
}

interface TreeItemProps {
  node: TreeNode
  level: number
}

function TreeItem({ node, level }: TreeItemProps) {
  const { expandedIds, toggleExpanded, selectedIds, toggleSelected, selectable } =
    useTreeViewContext()

  const hasChildren = !!node.children && node.children.length > 0
  const isExpanded = expandedIds.has(node.id)
  const isSelected = selectedIds.has(node.id)
  const showCheckbox = node.selectable ?? selectable

  // 12px base + 28px per nesting level keeps chevron/folder aligned per depth.
  const indent = 12 + (level - 1) * 28

  return (
    <li role="treeitem" aria-expanded={hasChildren ? isExpanded : undefined} aria-selected={isSelected}>
      <div
        data-slot="tree-item-row"
        data-selected={isSelected || undefined}
        className={cn(
          "group/tree-row flex items-center gap-2 rounded-[var(--radius-xs)] py-1.5 pr-2",
          "transition-colors duration-150",
          "hover:bg-[var(--color-surface-hover)]",
          "data-[selected]:bg-[var(--color-surface-selected)]",
        )}
        style={{ paddingLeft: indent }}
      >
        {/* Expand / collapse control (or spacer for leaves) */}
        {hasChildren ? (
          <button
            type="button"
            onClick={() => toggleExpanded(node.id)}
            aria-label={isExpanded ? "Collapse" : "Expand"}
            className="flex size-5 shrink-0 items-center justify-center rounded-[var(--radius-xxs)] text-[var(--color-text-link-default)] hover:bg-black/5"
          >
            <ChevronRight
              className={cn(
                "size-4 transition-transform duration-150",
                isExpanded && "rotate-90",
              )}
              aria-hidden
            />
          </button>
        ) : (
          <span className="size-5 shrink-0" aria-hidden />
        )}

        {/* Leading icon */}
        <span
          className={cn(
            "flex shrink-0 items-center justify-center",
            isSelected
              ? "text-[var(--color-text-link-default)]"
              : "text-[var(--color-text-primary)]",
          )}
        >
          {node.icon ?? <Folder className="size-5" aria-hidden />}
        </span>

        {/* Label */}
        <span
          className={cn(
            "min-w-0 flex-1 truncate [font:var(--font-body-medium-semibold)]",
            isSelected
              ? "text-[var(--color-text-link-default)]"
              : "text-[var(--color-text-primary)]",
          )}
        >
          {node.label}
        </span>

        {/* Count badge */}
        {node.count != null && (
          <Badge variant="filled" color="default" size="sm" className="shrink-0">
            {node.count}
          </Badge>
        )}

        {/* Selection checkbox */}
        {showCheckbox && (
          <Checkbox
            className="ml-2 shrink-0"
            checked={isSelected}
            onCheckedChange={() => toggleSelected(node.id)}
            aria-label={typeof node.label === "string" ? node.label : "Select node"}
          />
        )}
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <ul role="group">
          {node.children!.map((child) => (
            <TreeItem key={child.id} node={child} level={level + 1} />
          ))}
        </ul>
      )}
    </li>
  )
}

export { TreeView, TreeItem }
