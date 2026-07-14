# BRD Widget Generation Rules for v0

This document provides specific rules for generating Widget components in v0. For general BRD component rules, refer to `v0-rules.md`.

---

## CRITICAL: Only build a Widget when explicitly asked

Do **NOT** reach for `Widget` as a generic card/panel. Build a Widget **only** when the user explicitly asks for a "widget" (or a dashboard tile that resizes/zooms). For everything else use `Card`, `Item`, `DataPointCard`, or plain layout.

---

## CRITICAL: One Widget instance, content per size

A Widget is a **single, self-contained instance** that holds **distinct content for each size** and swaps between them as it is resized. You do **NOT** create three separate widgets, and you do **NOT** auto-shrink the M view into S.

Provide content through the size-keyed slots:

| Slot | Renders when size is… | Fallback |
|------|-----------------------|----------|
| `renderS` | **S** (condensed, mobile representation of M) | `renderM` → `children` |
| `renderM` | **M** (default authoring size). **Also repeated on Zoom.** | `children` |
| `renderL` | **L** (expanded) | `renderM` → `children` |

- **S is the mobile representation of M** — a condensed view, not just a smaller M. Author it deliberately.
- **Zoom always repeats the M content** (`renderM`), never S.
- `children` remains supported as a single-content fallback for trivial widgets, but for real content prefer the slots.

```tsx
import { Widget } from "@/components/ui/widget"

<Widget
  size="M"                         // initial size; user can resize via the corner handle
  title="Revenue Overview"
  timestamp={Date.now()}           // real timestamp (Date | epoch ms), never a preformatted string
  renderS={<CondensedKpi />}       // mobile representation
  renderM={<DefaultChart />}       // default + Zoom content
  renderL={<ExpandedChart />}      // expanded
/>
```

---

## Resizing

- The Widget renders a **bottom-right corner handle** that cycles **S → M → L → M → S**.
- Drag the handle horizontally, or focus it and use **Arrow keys** (Right/Up grow, Left/Down shrink).
- Size is **uncontrolled by default** (seeded from the `size` prop). Pass `onSizeChange` to control it.
- Pass `resizable={false}` to lock the size and hide the handle.

---

## Widget Sizes and Dimensions

Widths are **ranges** (min–max); the widget grows within its range to fill available space. Heights are **fixed** per size.

| Size | Min Width | Max Width | Height (FIXED) | Use Case |
|------|-----------|-----------|----------------|----------|
| **S** | 290px | 456px | 315px | Condensed mobile view: single KPI, sparkline, summary |
| **M** | 580px | 912px | 654px | Default: charts, tables, detailed content (also the Zoom view) |
| **L** | 872px | 1368px | 654px | Expanded: more rows, larger charts, side-by-side detail |

### ⚠️ Heights are FIXED — do not override

The content area scrolls internally (`overflow-auto`). Never set custom heights on the Widget.

```tsx
// ❌ WRONG
<Widget size="M" className="h-[800px]" />
<div className="h-screen"><Widget size="M" /></div>

// ✅ CORRECT — let the widget own its height; content scrolls if needed
<Widget size="M" renderM={<Content />} />
```

### Charts must fill available space

The content area is a flex column with `min-h-0`. Charts/grids inside should fill it:

```tsx
renderM={
  <div className="flex flex-1 flex-col min-h-0">
    <HighchartsReact ... containerProps={{ style: { flex: 1, minHeight: 0 } }} />
  </div>
}
```

---

## Widget Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `size` | `"S" \| "M" \| "L"` | No (default `"M"`) | Initial size when uncontrolled |
| `onSizeChange` | `(size) => void` | No | Makes size controlled |
| `resizable` | `boolean` | No (default `true`) | Show the corner resize handle |
| `title` | `string` | Yes | Widget title in header |
| `timestamp` | `Date \| number` | Yes | Real timestamp; rendered as a live "updated … ago" label |
| `onRefresh` | `() => void` | No | Refresh callback. Icon on S, link on M/L |
| `onInfoClick` | `() => void` | No | Info button callback (shows IconButton if provided) |
| `menuItems` | `WidgetMenuItem[]` | No | Dropdown menu items (`{label, onClick, disabled?}`) |
| `sourceLink` | `{label, href}` | No | Footer left link |
| `viewMoreLink` | `{label, href}` | No | Footer right link |
| `renderS` / `renderM` / `renderL` | `ReactNode` | No* | Size-keyed content slots |
| `children` | `ReactNode` | No* | Fallback content when slots are omitted |

\* Provide at least `renderM` (or `children`).

---

## Size-Specific Element Visibility

| Element | S | M | L |
|---------|---|---|---|
| Title / Timestamp | ✅ | ✅ | ✅ |
| Refresh | Icon only | Link + text | Link + text |
| Info IconButton | Optional | Optional | Optional |
| ZoomIn button (repeats M) | ✅ Auto | ✅ Auto | ❌ Hidden |
| Menu / Footer links | Optional | Optional | Optional |
| Resize handle | ✅ | ✅ | ✅ |

---

## Content Rules by Size

### Size S — condensed mobile representation of M
WCAG 2.1: 44×44px touch targets, 4.5:1 text contrast, visible 2px focus, keyboard-accessible, `aria-label` on icon-only buttons, no horizontal scroll, no text below 12px.

**ALLOWED:** KPI + trend, sparklines, bullet summaries, simple progress, icon+value.
**NOT ALLOWED:** tables, complex charts, long text, multiple dense sections.

### Size M — default view (also the Zoom view)
All S content **plus** full charts, data tables, detailed lists, multiple sections.

### Size L — expanded view
Same as M **plus** more rows, larger charts, additional detail panels, side-by-side comparisons.

---

## Laying out multiple widgets: DashboardGrid

To place several widgets in a responsive, draggable dashboard, use **`DashboardGrid`** with one `DashboardGridItem` per widget. The grid owns **positioning, responsiveness, and reorder**; each widget still owns its own size and content.

```tsx
import { DashboardGrid, DashboardGridItem } from "@/components/ui/dashboard-grid"
import { Widget } from "@/components/ui/widget"

<DashboardGrid>
  <DashboardGridItem id="revenue" defaultSize="M">
    <Widget title="Revenue" timestamp={Date.now()} renderS={<Kpi />} renderM={<RevenueChart />} renderL={<RevenueDetail />} />
  </DashboardGridItem>
  <DashboardGridItem id="alerts" defaultSize="S">
    <Widget title="Alerts" timestamp={Date.now()} renderS={<AlertList />} renderM={<AlertTable />} />
  </DashboardGridItem>
</DashboardGrid>
```

### How it works

- **Responsive by container, not viewport.** The grid measures its **own content width** with a `ResizeObserver` (not `window` media queries), so it adapts correctly when the side nav opens/collapses or it's embedded in a panel. Column count steps up with available width.
- **Size → column span.** Each item's live `S`/`M`/`L` size maps to a responsive column span; tiles densely repack (`grid-auto-flow: dense`) to fill gaps left by smaller widgets.
- **Mobile collapses to S.** Below the smallest breakpoint every widget renders its `S` representation in a single column, and per-widget corner resizing is disabled.
- **The child must be a single `<Widget>`** (or a wrapper that forwards props). The grid **clones the child** to inject the controlled `size`, `onSizeChange`, `fluid` (fill the column, ignore the standalone max-width), and mobile `resizable={false}`. Do not pass `size`/`fluid` yourself — set the starting size with `defaultSize` on the item.

### Props

| Prop | On | Type | Description |
|------|----|------|-------------|
| `id` | `DashboardGridItem` | `string` (required) | Stable unique id for ordering + size tracking |
| `defaultSize` | `DashboardGridItem` | `"S" \| "M" \| "L"` (default `"M"`) | Initial widget size |
| `order` / `onReorder` | `DashboardGrid` | `string[]` / `(ids) => void` | Control the order (uncontrolled by default) |
| `sortable` | `DashboardGrid` | `boolean` (default `true`) | Enable drag-to-reorder |

- Drag from the **grip handle** (top-left, appears on hover) — never the whole card, so it won't conflict with the resize handle or interactive content.

> **`WidgetGrid` is deprecated.** It still works as a thin alias of `DashboardGrid` for backward compatibility, but all new dashboards should use `DashboardGrid` / `DashboardGridItem`.

---

## DO NOT

❌ Build a Widget when not explicitly requested (use Card/Item/DataPointCard instead).
❌ Create three stacked Widgets for one dataset — use one Widget with `renderS/renderM/renderL`.
❌ Make Zoom show L — Zoom repeats **M**.
❌ Use invalid size values (`"small"`, `"medium"`, `"large"`) — use `"S"`, `"M"`, `"L"`.
❌ Put tables/complex charts in the S slot.
❌ Override widget height (`h-[800px]`, `min-h-screen`, parent `h-screen`).
❌ Pass a preformatted timestamp string — pass a `Date` or epoch ms.
❌ Use raw Tailwind colors (`text-green-500`, `bg-white`) — use BRD tokens.

---

## ALWAYS

✅ Author distinct content per size (`renderS` condensed, `renderM` default, `renderL` expanded).
✅ Use BRD design tokens for color, spacing, radius, and typography.
✅ Use BRD components inside content (`IconButton`, `Link`, `Badge`, AG Grid, Highcharts) — never raw HTML equivalents.
✅ Let charts/grids fill the flex content area with `flex-1 min-h-0`.

---

## BRD tokens (quick reference)

| Token | Usage |
|-------|-------|
| `--color-text-primary` / `--color-text-secondary` | Main / secondary text |
| `--color-state-success` / `--color-state-error` / `--color-state-warning` | Positive / negative / pending |
| `--color-surface-widget` | Widget background |
| `--color-surface-background` | Inset section backgrounds |
| `--color-stroke-default` | Borders, dividers |
| `--radius-xs` / `--radius-s` / `--radius-m` | Chips / cards / large containers |
| `--spacing-sp-4 … --spacing-sp-48` | Spacing scale |

### IconButton
```tsx
<IconButton ariaLabel="Refresh" size="S" color="Blue"><RefreshCw size={16} /></IconButton>
```
Sizes: `"M"` (32px), `"S"` (24px), `"XS"` (16px). Colors: `"Blue"`, `"Black"`.

### Link
```tsx
<Link href="#" size="M">View source</Link>
```
Sizes: `"L"`, `"M"`, `"S"`.

### Badge
```tsx
<Badge color="grass">Active</Badge>
```
Colors: `"default"`, `"sky"`, `"grass"`, `"bored"`, `"negative"`, `"neutral"`, `"dark"`.
