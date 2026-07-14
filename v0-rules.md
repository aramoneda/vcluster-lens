# BRD Design System - v0 Rules

## CRITICAL: App Shell — Single Frame Rule

**The BRD App Starter Shell (`v0/app-starter/page.tsx`) is the one and only application frame.**

- **ALWAYS write generated views to `app/page.tsx`.** Never create a new route (e.g. `app/dashboard/page.tsx`) as the primary delivery target.
- **NEVER replace `app/page.tsx` with a redirect.** The Shell, header, top navigation, and toolbar must stay in `app/page.tsx`.
- **NEVER render registry UI.** Do not render `ComponentSidebar`, `ComponentPageLayout`, `LayoutWrapper` with sidebar logic, or any registry chrome. These are documentation-only and must never appear in generated app views.
- **Shell is used exactly once**, at the top level of `app/page.tsx`. All new UI — widgets, tables, charts, forms — goes inside the Shell's content area slot only.
- When generating a new view, read `v0/app-starter/page.tsx` first, copy it as the base for `app/page.tsx`, then replace only the content area with the requested UI.

---

## Critical: Component Naming Convention

All BRD components use the `brdcomp-` prefix. When v0 generates code, it MUST import from these prefixed components:

```tsx
// ✅ CORRECT
import { Badge } from "@/components/ui/badge"       // This is brdcomp-badge
import { Button } from "@/components/ui/button"     // This is brdcomp-button
import { IconButton } from "@/components/ui/icon-button"
import { Link } from "@/components/ui/link"

// ❌ WRONG - These standard shadcn imports don't exist
// Don't import from next/link for styled links, use our Link component
```

---

## Complete Component API Reference

---

### Badge

**Import:** `import { Badge } from "@/components/ui/badge"`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"filled"` \| `"outline"` | `"filled"` | Visual style |
| `color` | `"default"` \| `"sky"` \| `"grass"` \| `"bored"` \| `"negative"` \| `"neutral"` \| `"dark"` | `"default"` | Semantic color |
| `size` | `"sm"` \| `"default"` \| `"lg"` | `"default"` | Size |

**Color Semantic Meanings:**
- `default` - Primary brand color (blue)
- `sky` - Informational, neutral highlight (light blue)
- `grass` - Success, positive, approved (green)
- `bored` - Warning, pending, attention needed (orange/yellow)
- `negative` - Error, critical, rejected, danger (red)
- `neutral` - Inactive, disabled appearance (gray)
- `dark` - High emphasis, dark mode friendly (dark gray/black)

**Examples:**
```tsx
<Badge color="sky">New</Badge>
<Badge color="grass">Approved</Badge>
<Badge color="bored">Pending</Badge>
<Badge color="negative">Rejected</Badge>
<Badge variant="outline" color="grass">Success</Badge>
```

---

### Button

**Import:** `import { Button } from "@/components/ui/button"`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default"` \| `"destructive"` \| `"outline"` \| `"secondary"` | `"default"` | Visual style |
| `size` | `"sm"` \| `"default"` \| `"lg"` \| `"icon"` \| `"icon-sm"` \| `"icon-lg"` | `"default"` | Size |
| `isLoading` | `boolean` | `false` | Shows animated loading dots |
| `icon` | `ReactNode` | - | Legacy convenience prop. Prefer placing the icon directly inside the button before the label. |
| `disabled` | `boolean` | `false` | Disabled state |

**Variant Meanings:**
- `default` - Primary action (solid blue)
- `secondary` - Secondary action (light blue background)
- `outline` - Bordered button (white with border)
- `destructive` - Dangerous action (solid red)

**Composition Rules:**
- For buttons with visible text, place the icon directly inside `<Button>` next to the label.
- Use `IconButton` for icon-only actions.
- Do not invent custom stacked icon/text button layouts.
- Do not add `flex-col`, `h-auto`, or wrapper markup that stacks the icon above or below the label.

**Examples:**
```tsx
<Button>Save Changes</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="outline">Edit</Button>
<Button variant="destructive">Delete</Button>
<Button isLoading>Saving...</Button>
<Button>
  <PlusIcon className="size-4" />
  Add Item
</Button>
<Button variant="outline">
  <DownloadIcon className="size-4" />
  Export
</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
```

---

### IconButton

**Import:** `import { IconButton } from "@/components/ui/icon-button"`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `ariaLabel` | `string` | **required** | Accessible label (shown in tooltip) |
| `size` | `"M"` \| `"S"` \| `"XS"` | `"M"` | Size (32px / 24px / 16px) |
| `color` | `"Blue"` \| `"Black"` | `"Blue"` | Icon color |
| `isActive` | `boolean` | `false` | Active/selected state |
| `disabled` | `boolean` | `false` | Disabled state |

**Examples:**
```tsx
<IconButton ariaLabel="Edit item">
  <PencilIcon className="size-4" />
</IconButton>
<IconButton ariaLabel="Delete" color="Black" size="S">
  <TrashIcon className="size-4" />
</IconButton>
<IconButton ariaLabel="Settings" isActive>
  <SettingsIcon className="size-4" />
</IconButton>
```

---

### Link

**Import:** `import { Link } from "@/components/ui/link"`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"sm"` \| `"default"` \| `"lg"` | `"default"` | Text size |
| `icon` | `ReactNode` | - | Optional icon |
| `trailingIcon` | `boolean` | `false` | Place icon after text |
| `disabled` | `boolean` | `false` | Disabled state |
| `href` | `string` | - | Link destination |

**Examples:**
```tsx
<Link href="/docs">Documentation</Link>
<Link href="/help" size="sm">Help Center</Link>
<Link href="https://example.com" icon={<ExternalLinkIcon />} trailingIcon>
  External Link
</Link>
```

---

### Alert

**Import:** `import { Alert, AlertTitle, AlertDescription, AlertActions, AlertLink } from "@/components/ui/alert"`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"info"` \| `"success"` \| `"warning"` \| `"critical"` | `"info"` | Semantic type |
| `dismissible` | `boolean` | `false` | Shows close button |
| `onDismiss` | `() => void` | - | Dismiss callback |
| `showIcon` | `boolean` | `true` | Show variant icon |

**Examples:**
```tsx
<Alert variant="info">
  <AlertTitle>Information</AlertTitle>
  <AlertDescription>This is an informational message.</AlertDescription>
</Alert>

<Alert variant="success" dismissible>
  <AlertTitle>Success!</AlertTitle>
  <AlertDescription>Your changes have been saved.</AlertDescription>
</Alert>

<Alert variant="warning">
  <AlertTitle>Warning</AlertTitle>
  <AlertDescription>Please review before proceeding.</AlertDescription>
</Alert>

<Alert variant="critical">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Something went wrong. Please try again.</AlertDescription>
  <AlertActions>
    <AlertLink href="/help">Get Help</AlertLink>
  </AlertActions>
</Alert>
```

---

### Dialog

**Import:** `import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter } from "@/components/ui/dialog"`

**DialogContent Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"xs"` \| `"sm"` \| `"md"` \| `"lg"` | `"xs"` | Dialog width |

**Size Dimensions:**
- `xs` - 500px width
- `sm` - 594px width
- `md` - 882px width
- `lg` - 1172px width

**Examples:**
```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent size="sm">
    <DialogHeader>
      <DialogTitle>Confirm Action</DialogTitle>
      <DialogDescription>Are you sure you want to proceed?</DialogDescription>
    </DialogHeader>
    <DialogBody>
      <p>This action cannot be undone.</p>
    </DialogBody>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

### Input & InputField

**Import:** `import { Input, InputField } from "@/components/ui/input"`

**Input** - Simple styled input element
**InputField** - Full field with label, icons, and feedback

**InputField Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Field label |
| `variant` | `"primary"` \| `"secondary"` | `"primary"` | Visual style |
| `isInvalid` | `boolean` | `false` | Error state |
| `errorMessage` | `string` | - | Error message to display |
| `feedback` | `{ message: string, type: "error" \| "success" \| "info" \| "warning" }` | - | Feedback message |
| `leftIcon` | `ComponentType` | - | Icon on left |
| `icon` | `ComponentType` | - | Icon on right |
| `labelPosition` | `"top"` \| `"left"` | `"top"` | Label position |
| `required` | `boolean` | `false` | Shows required indicator |

**Examples:**
```tsx
<Input placeholder="Simple input" />

<InputField
  label="Email"
  placeholder="Enter your email"
  required
/>

<InputField
  label="Search"
  leftIcon={SearchIcon}
  placeholder="Search..."
/>

<InputField
  label="Password"
  isInvalid
  errorMessage="Password must be at least 8 characters"
/>

<InputField
  label="Username"
  feedback={{ message: "Username is available", type: "success" }}
/>
```

---

### Textarea & TextareaField

**Import:** `import { Textarea, TextareaField } from "@/components/ui/textarea"`

Same API as Input/InputField but for multi-line text.

**Examples:**
```tsx
<Textarea placeholder="Enter description..." rows={4} />

<TextareaField
  label="Description"
  placeholder="Enter a detailed description"
  required
/>
```

---

### Checkbox

**Import:** `import { Checkbox } from "@/components/ui/checkbox"`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"sm"` \| `"default"` | `"sm"` | Checkbox size |
| `label` | `ReactNode` | - | Label text |
| `supportingText` | `ReactNode` | - | Helper text below label |
| `checked` | `boolean \| "indeterminate"` | - | Checked state |
| `disabled` | `boolean` | `false` | Disabled state |

**Examples:**
```tsx
<Checkbox />
<Checkbox label="Accept terms and conditions" />
<Checkbox
  label="Email notifications"
  supportingText="Receive updates about your account"
/>
<Checkbox checked="indeterminate" label="Select all" />
```

---

### Switch

**Import:** `import { Switch } from "@/components/ui/switch"`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"default"` \| `"small"` | `"default"` | Switch size |
| `label` | `ReactNode` | - | Label text |
| `labelPosition` | `"left"` \| `"right"` | `"right"` | Label position |
| `disabled` | `boolean` | `false` | Disabled state |

**Examples:**
```tsx
<Switch />
<Switch label="Enable notifications" />
<Switch label="Dark mode" labelPosition="left" />
<Switch size="small" label="Compact" />
```

---

### RadioGroup

**Import:** `import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"`

**RadioGroup Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `orientation` | `"vertical"` \| `"horizontal"` | `"vertical"` | Layout direction |
| `size` | `"sm"` \| `"default"` | `"default"` | Radio size |

**RadioGroupItem Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `ReactNode` | - | Label text |
| `supportingText` | `ReactNode` | - | Helper text |
| `value` | `string` | **required** | Item value |

**Examples:**
```tsx
<RadioGroup defaultValue="option1">
  <RadioGroupItem value="option1" label="Option 1" />
  <RadioGroupItem value="option2" label="Option 2" />
  <RadioGroupItem value="option3" label="Option 3" supportingText="With description" />
</RadioGroup>

<RadioGroup orientation="horizontal">
  <RadioGroupItem value="sm" label="Small" />
  <RadioGroupItem value="md" label="Medium" />
  <RadioGroupItem value="lg" label="Large" />
</RadioGroup>
```

---

### Tabs

**Import:** `import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"title"` \| `"medium"` \| `"small"` | `"title"` | Tab style/size |

**Variant Descriptions:**
- `title` - Large tabs for page-level navigation
- `medium` - Standard tabs for section navigation
- `small` - Compact tabs for dense UIs

**Examples:**
```tsx
<Tabs defaultValue="tab1" variant="title">
  <TabsList>
    <TabsTrigger value="tab1">Overview</TabsTrigger>
    <TabsTrigger value="tab2">Details</TabsTrigger>
    <TabsTrigger value="tab3">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Overview content</TabsContent>
  <TabsContent value="tab2">Details content</TabsContent>
  <TabsContent value="tab3">Settings content</TabsContent>
</Tabs>
```

---

### Popover

**Import:** `import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"`

**PopoverContent Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"M"` \| `"S"` \| `"XS"` | `"M"` | Padding size |

**Examples:**
```tsx
<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">Open Popover</Button>
  </PopoverTrigger>
  <PopoverContent size="M">
    <p>Popover content here</p>
  </PopoverContent>
</Popover>
```

---

### DropdownMenu

**Import:** `import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"`

**DropdownMenuContent Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `"bottom-left"` \| `"bottom-center"` \| `"bottom-right"` \| `"top-left"` \| `"top-center"` \| `"top-right"` \| `"left"` \| `"right"` | `"bottom-left"` | Menu position |

**Examples:**
```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Options</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent position="bottom-right">
    <DropdownMenuItem>Edit</DropdownMenuItem>
    <DropdownMenuItem>Duplicate</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

### Sheet

**Import:** `import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"`

**SheetContent Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `side` | `"top"` \| `"right"` \| `"bottom"` \| `"left"` | `"right"` | Slide direction |

**Examples:**
```tsx
<Sheet>
  <SheetTrigger asChild>
    <Button>Open Sheet</Button>
  </SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Sheet Title</SheetTitle>
      <SheetDescription>Sheet description</SheetDescription>
    </SheetHeader>
    <div>Sheet body content</div>
    <SheetFooter>
      <Button>Save</Button>
    </SheetFooter>
  </SheetContent>
</Sheet>
```

---

### Tooltip

**Import:** `import { SimpleTooltip } from "@/components/ui/tooltip"` (preferred)
**Or:** `import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"`

**SimpleTooltip Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `ReactNode` | **required** | Tooltip content |
| `side` | `"top"` \| `"right"` \| `"bottom"` \| `"left"` | - | Position |
| `delayDuration` | `number` | - | Delay in ms |

**Examples:**
```tsx
<SimpleTooltip content="Edit this item">
  <Button variant="outline">Edit</Button>
</SimpleTooltip>

<SimpleTooltip content="Delete permanently" side="bottom">
  <IconButton ariaLabel="Delete">
    <TrashIcon />
  </IconButton>
</SimpleTooltip>
```

---

### Card

**Import:** `import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction } from "@/components/ui/card"`

**Examples:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description text</CardDescription>
    <CardAction>
      <Button variant="outline" size="sm">Action</Button>
    </CardAction>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Submit</Button>
  </CardFooter>
</Card>
```

---

### Select

**Import:** `import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel } from "@/components/ui/select"`

**SelectTrigger Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"sm"` \| `"default"` | `"default"` | Trigger size |

**Examples:**
```tsx
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
    <SelectItem value="option3">Option 3</SelectItem>
  </SelectContent>
</Select>
```

---

### Avatar

**Import:** `import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"`

**Examples:**
```tsx
<Avatar>
  <AvatarImage src="/user.jpg" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

---

### Progress

**Import:** `import { Progress } from "@/components/ui/progress"`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | - | Progress value (0-100) |

**Examples:**
```tsx
<Progress value={33} />
<Progress value={66} />
<Progress value={100} />
```

---

## Design Tokens & CSS Variables

The design system uses CSS custom properties. Key patterns:

### Color Token Categories:
- `--color-surface-*` - Background colors
- `--color-text-*` - Text/foreground colors
- `--color-stroke-*` - Border colors
- `--color-icon-*` - Icon colors
- `--color-state-*` - State colors (error, success, warning)

### Common Tokens:
```css
/* Backgrounds */
--color-surface-background      /* Page background */
--color-surface-foreground      /* Card/panel background */
--color-surface-hover           /* Hover state */
--color-surface-selected        /* Selected state */

/* Text */
--color-text-primary            /* Primary text */
--color-text-secondary          /* Secondary/muted text */
--color-text-disabled           /* Disabled text */
--color-text-link-default       /* Link color */

/* Borders */
--color-stroke-default          /* Default border */
--color-stroke-dark             /* Emphasized border */
--color-stroke-brand            /* Brand/focus border */

/* States */
--color-state-error             /* Error red */
--color-state-success           /* Success green */
--color-state-warning           /* Warning orange */
```

### Typography Tokens:
- `--font-family-brand` - The only approved font family for BRD interfaces
- `--font-body-small-*` - Small body text tokens
- `--font-body-medium-*` - Default body text tokens
- `--font-body-large-*` - Large body text tokens
- `--font-headline-h1-*` through `--font-headline-h5-*` - Headline tokens
- `--font-utility-link-*` - Link typography tokens

When v0 generates custom CSS or inline style objects, it must use BRD typography tokens instead of ad hoc font families, sizes, line heights, or font weights.

- Prefer composed BRD tokens like `--font-body-medium`, `--font-body-medium-semibold`, `--font-body-large`, `--font-headline-h1`, `--font-headline-h2`, `--font-headline-h3`, `--font-headline-h4`, `--font-headline-h5`, and `--font-utility-link` when applying a complete text style.
- Use granular `size` / `line-height` / `weight` tokens only when an API requires separate values.
- Do not use generic Tailwind typography utilities like `text-lg`, `text-sm`, `leading-6`, or `leading-5` for BRD text when an equivalent BRD typography token exists.

```tsx
className="font-[var(--font-family-brand)] text-[length:var(--font-body-medium-size)] leading-[var(--font-body-medium-line-height)] font-[var(--font-body-medium-regular-weight)]"
```

### Spacing Tokens:
- `--spacing-sp-1`
- `--spacing-sp-2`
- `--spacing-sp-4`
- `--spacing-sp-6`
- `--spacing-sp-8`
- `--spacing-sp-12`
- `--spacing-sp-16`
- `--spacing-sp-24`
- `--spacing-sp-32`
- `--spacing-sp-36`
- `--spacing-sp-40`
- `--spacing-sp-48`
- `--spacing-sp-64`
- `--spacing-sp-80`
- `--spacing-sp-96`

When v0 generates layout spacing, it must prefer BRD spacing tokens for `gap`, `padding`, `margin`, and sectional spacing instead of arbitrary pixel values.

```tsx
className="gap-[var(--spacing-sp-16)] px-[var(--spacing-sp-24)] py-[var(--spacing-sp-16)]"
```

### Shadows:
- Do not add `shadow-*`, `box-shadow`, or custom elevation styles by default.
- Only use shadows when they are already built into an existing BRD component.
- Only add new shadows when the user explicitly asks for them.

### Timestamps:
- Never change the format of timestamps provided by the data source or API.
- Display timestamps exactly as received without reformatting, converting timezones, or altering precision.
- If formatting is required, use the format specified by the user or match the existing application pattern.

### DataPoint Cards Layout:
- When displaying multiple DataPoint Cards, always stretch them equally to fill the available width.
- Use a consistent gap of `--spacing-sp-24` between DataPoint Cards.
- Apply `flex` with `gap-[var(--spacing-sp-24)]` and ensure each card has `flex-1` to distribute space equally.

```tsx
// ✅ CORRECT - Equally stretched DataPoint Cards with sp-24 gap
<div className="flex gap-[var(--spacing-sp-24)]">
  <DataPointCard className="flex-1" ... />
  <DataPointCard className="flex-1" ... />
  <DataPointCard className="flex-1" ... />
</div>

// ❌ WRONG - Fixed widths or inconsistent gaps
<div className="flex gap-4">
  <DataPointCard className="w-64" ... />
  <DataPointCard className="w-64" ... />
</div>
```

---

## Charts & Data Grids

### Charts

- Use `Highcharts` for application charts in generated BRD views.
- Apply the shared BRD theme from `@/lib/brd-highcharts-theme`.
- Assign series colors in BRD chart swatch order `1` through `24`.
- Do not generate primary application charts with `Recharts`.
- For any chart/data-visualization work, use the **`brd-highcharts-charts` skill**. The full kit —
  theme, tooltip formatters (`@/lib/tooltip-utilities`), sizing/scroll/donut helpers
  (`@/lib/chart-utils`), and the `DonutCenterText` overlay (`@/lib/brd-highcharts-components`) —
  is bundled by the **`brd-highcharts`** registry block. All chart text/tooltip colors resolve from
  BRD design tokens, so charts are correct in both light and dark mode; never hardcode hex colors.

**Preferred pattern:**
```tsx
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"

import {
  applyBrdHighchartsTheme,
  brdChartSwatches,
} from "@/lib/brd-highcharts-theme"

applyBrdHighchartsTheme(Highcharts)

<HighchartsReact
  highcharts={Highcharts}
  options={{
    chart: { type: "column" },
    series: [
      { type: "column", data: [12, 18, 14], color: brdChartSwatches[0] },
      { type: "column", data: [9, 13, 11], color: brdChartSwatches[1] },
    ],
  }}
/>
```

### Tables & Grids

- Use `AG Grid` for all primary application tables and data grids.
- Apply the shared BRD theme from `@/lib/brd-ag-grid-theme`.
- Do not generate primary application tables with plain HTML `<table>` markup or the lightweight BRD `Table` component.
- The BRD `Table` component is only for very small, static supporting tables.
- Wrap AG Grid in a borderless BRD surface container with padding `var(--spacing-sp-8)`.
- Do not add an extra outer border around the AG Grid wrapper unless the user explicitly asks for it.

**Preferred pattern:**
```tsx
import { AgGridReact } from "ag-grid-react"

import { brdAgGridTheme } from "@/lib/brd-ag-grid-theme"

<AgGridReact
  theme={brdAgGridTheme}
  rowData={rows}
  columnDefs={columnDefs}
/>
```

---

## Chip

- Use `Chip` for compact selected filters, tags, and dismissible pills when the BRD registry pattern fits.
- Do not recreate chip-like controls with ad hoc rounded `div`s or custom borders if `Chip` covers the use case.
- Use `selected` for the active state.
- Use `icon` for the leading icon.
- Use `onRemove` for removable chips.
- Keep chip label typography on BRD body tokens.
- Do not generate fake props like `state="hover"` or `state="selected"` for `Chip`.

**Preferred pattern:**
```tsx
import { Star } from "lucide-react"

import { Chip } from "@/components/ui/chip"

<Chip
  icon={<Star className="size-4" />}
  selected
  onClick={() => {}}
  onRemove={() => {}}
>
  Chip Label
</Chip>
```

---

## Data Point Card

- Use `DataPointCard` for compact KPI, stat, and metric surfaces instead of hand-rolling ad hoc cards.
- Prefer `DataPointCard` over generic `Card` when the UI is primarily `label + value` with small accessories.
- Use `label` and `value` as the core content.
- Use `trend`, `badge`, and `valueAccessory` for metric-side accessories.
- Use `action` for top-right icon actions.
- Use `cta` for bottom metric-card links.
- Keep color variants limited to `blue`, `gray`, `light`, and `superLight`.
- Do not invent fake props like `state`, `variant="metric"`, or `emphasis="kpi"` when `DataPointCard` already fits.

**Preferred pattern:**
```tsx
import { ArrowUpRight, LayoutGrid, MoreHorizontal } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { DataPointCard } from "@/components/ui/data-point-card"

<DataPointCard
  size="md"
  color="blue"
  label="Available Cash"
  value="$50,000.00"
  topLeftIcon={<LayoutGrid className="size-4" />}
  action={{ ariaLabel: "More options", icon: <MoreHorizontal className="size-4" />, onClick: () => {} }}
  trend={{ icon: <ArrowUpRight className="size-4" />, label: "+8.2%", tone: "success" }}
  badge={<Badge variant="outline" color="neutral" size="sm">YTD</Badge>}
/>
```

---

## Stepper

- Use `Stepper` for onboarding and multi-step workflow progress instead of hand-rolling circles, lines, and status text.
- Prefer passing `steps` and `currentStepIndex` over inventing per-step state props.
- Keep `Stepper` display-only in generated code unless a separate navigation component is explicitly required.
- Use `title` and optional `description` for each step.
- Do not invent fake props like `variant="wizard"`, `orientation`, or `state="completed"` for v1.

**Preferred pattern:**
```tsx
import { Stepper } from "@/components/ui/stepper"

<Stepper
  currentStepIndex={1}
  steps={[
    { title: "Company details", description: "Website and location" },
    { title: "Your details", description: "Name and email" },
    { title: "Verification", description: "Confirm your account" },
  ]}
/>
```

---

## Widget

- Use `Widget` as the sanctioned BRD shell for complex dashboard content such as charts, AG Grid tables, forms, lists, summaries, and mixed layouts.
- Do not treat `Widget` as a fixed-width KPI card. `S`, `M`, and `L` are range-sized variants with their own min and max widths.
- Design every widget concept in all three sizes:
  - `S` for compact and mobile-fit usage
  - `M` as the default implementation
  - `L` as the larger desktop implementation
- Keep widget shell spacing on BRD tokens. Root widget padding should be `sp-24`.
- Use BRD composed typography tokens for widget chrome instead of generic `text-*` utilities.
- Do not add shadows to widget shells unless the user explicitly asks for elevation.
- Do not hardcode widget widths in generated app views.
- `S` and `M` support zoom. Zoom is an enlarged responsive widget shell, not a separate arbitrary modal design.

**Preferred pattern:**
```tsx
import { Widget } from "@/components/ui/widget"

<Widget
  size="M"
  title="Revenue overview"
  timestamp="Updated now"
  sourceLink={{ label: "View source", href: "#" }}
  viewMoreLink={{ label: "View details", href: "#" }}
>
  Widget content
</Widget>
```

---

## ❌ DO NOT USE (Invalid in BRD)

These standard shadcn/ui patterns do NOT exist in BRD:

| Invalid | Use Instead |
|---------|-------------|
| `<Button variant="ghost">` | `<Button variant="secondary">` |
| `<Button variant="link">` | `<Link>` component |
| `<Badge variant="destructive">` | `<Badge color="negative">` |
| `<Badge variant="secondary">` | `<Badge color="neutral">` |
| `<Badge variant="outline">` alone | `<Badge variant="outline" color="...">` |
| `<Alert variant="destructive">` | `<Alert variant="critical">` |
| `<Alert variant="default">` | `<Alert variant="info">` |
| `import Link from "next/link"` for styled links | `import { Link } from "@/components/ui/link"` |

---

## ✅ ALWAYS USE (BRD Patterns)

| Component | Pattern |
|-----------|---------|
| Badge | Use `color` prop for semantic meaning |
| Button | Use `isLoading` for loading states |
| IconButton | Always provide `ariaLabel` |
| Alert | Use semantic `variant`: info/success/warning/critical |
| Dialog | Specify `size` on DialogContent |
| Tabs | Specify `variant` for correct sizing |
| Form fields | Use `InputField`/`TextareaField` with `label` and `feedback` |
| Tooltips | Use `SimpleTooltip` wrapper for easy tooltips |

---

## Icon Usage

Use Lucide React icons throughout:

```tsx
import {
  Plus, Trash, Pencil, Settings, Search,
  ChevronDown, ChevronRight, ExternalLink,
  Check, X, AlertCircle, Info
} from "lucide-react"

// Icon sizing
<PlusIcon className="size-4" />  // 16px - default for most uses
<PlusIcon className="size-5" />  // 20px - for buttons
<PlusIcon className="size-6" />  // 24px - for larger elements
```
