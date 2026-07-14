export type RegistryExample = {
  title: string
  code: string
}

export type RegistryDocs = {
  title: string
  description: string
  categories: string[]
  meta: {
    tags: string[]
    examples: RegistryExample[]
  }
}

export const registryMetadata: Record<string, RegistryDocs> = {
  accordion: {
    title: "Accordion",
    description:
      "Expandable content panels for saving space. Use for text, cards, images, or charts; support single or multiple open items while preserving keyboard navigation and ARIA semantics.",
    categories: ["disclosure", "layout"],
    meta: {
      tags: ["accordion", "collapse", "disclosure", "content"],
      examples: [
        {
          title: "Single item accordion",
          code:
            'import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"\n\n<Accordion type="single" collapsible>\n  <AccordionItem value="details">\n    <AccordionTrigger>Details</AccordionTrigger>\n    <AccordionContent>Expandable content goes here.</AccordionContent>\n  </AccordionItem>\n</Accordion>',
        },
      ],
    },
  },
  alert: {
    title: "Alert",
    description:
      "Inline callout bar for info, success, warning, or critical (error) states. Supports optional icon, links/actions, and dismiss button for transient messages.",
    categories: ["feedback", "status"],
    meta: {
      tags: ["alert", "status", "callout", "feedback"],
      examples: [
        {
          title: "Dismissible alert with link",
          code:
            'import { Alert, AlertTitle, AlertDescription, AlertActions, AlertLink } from "@/components/ui/alert"\n\n<Alert variant="warning" dismissible>\n  <AlertTitle>Warning</AlertTitle>\n  <AlertDescription>Review changes before saving.</AlertDescription>\n  <AlertActions>\n    <AlertLink href="/learn-more">Learn more</AlertLink>\n  </AlertActions>\n</Alert>',
        },
      ],
    },
  },
  "alert-dialog": {
    title: "Alert Dialog",
    description:
      "A modal alert or confirmation dialog that requires an explicit user decision before continuing. Use for critical or destructive actions that need acknowledgement.",
    categories: ["overlay", "confirmation"],
    meta: {
      tags: ["dialog", "alert-dialog", "modal", "confirmation"],
      examples: [
        {
          title: "Confirm action",
          code:
            'import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"\n\n<AlertDialog>\n  <AlertDialogTrigger>Delete</AlertDialogTrigger>\n  <AlertDialogContent>\n    <AlertDialogHeader>\n      <AlertDialogTitle>Delete item?</AlertDialogTitle>\n      <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>\n    </AlertDialogHeader>\n    <AlertDialogFooter>\n      <AlertDialogCancel>Cancel</AlertDialogCancel>\n      <AlertDialogAction>Confirm</AlertDialogAction>\n    </AlertDialogFooter>\n  </AlertDialogContent>\n</AlertDialog>',
        },
      ],
    },
  },
  "aspect-ratio": {
    title: "Aspect Ratio",
    description:
      "A utility wrapper that preserves a consistent aspect ratio for media like images or videos across responsive layouts.",
    categories: ["layout", "media"],
    meta: {
      tags: ["aspect-ratio", "media", "responsive", "layout"],
      examples: [
        {
          title: "Responsive media",
          code:
            'import { AspectRatio } from "@/components/ui/aspect-ratio"\n\n<AspectRatio ratio={16 / 9}>\n  <img src="/placeholder.jpg" alt="Preview" />\n</AspectRatio>',
        },
      ],
    },
  },
  avatar: {
    title: "Avatar",
    description:
      "A compact identity component for showing user initials. Prefer `AvatarFallback` and avoid images in this system.",
    categories: ["identity", "data-display"],
    meta: {
      tags: ["avatar", "profile", "image", "fallback"],
      examples: [
        {
          title: "Initials only",
          code:
            'import { Avatar, AvatarFallback } from "@/components/ui/avatar"\n\n<Avatar>\n  <AvatarFallback>JD</AvatarFallback>\n</Avatar>',
        },
      ],
    },
  },
  badge: {
    title: "Badge",
    description:
      "A small label used to highlight status, categories, or counts. Variants: filled or outline. Colors: default, sky, grass, bored, negative, neutral, dark. Sizes: sm, default, lg.",
    categories: ["data-display", "status"],
    meta: {
      tags: ["badge", "label", "status", "tag"],
      examples: [
        {
          title: "Semantic badge",
          code:
            'import { Badge } from "@/components/ui/badge"\n\n<Badge variant="filled" color="grass">Active</Badge>',
        },
      ],
    },
  },
  breadcrumb: {
    title: "Breadcrumb",
    description:
      "A hierarchical navigation trail with clickable ancestor links. Use the composable `Breadcrumb*` components or the `Breadcrumbs` items array; optional separators and ellipsis are available.",
    categories: ["navigation"],
    meta: {
      tags: ["breadcrumb", "navigation", "hierarchy", "links"],
      examples: [
        {
          title: "Navigation trail",
          code:
            'import { Breadcrumbs } from "@/components/ui/breadcrumb"\n\n<Breadcrumbs items={[\n  { text: "Home", href: "/" },\n  { text: "Docs", href: "/docs" },\n  { text: "Current" },\n]} />',
        },
      ],
    },
  },
  button: {
    title: "Button",
    description:
      "An interactive control for actions and form submissions. Variants: default (primary), outline (secondary), secondary (tertiary), destructive (error). Sizes: sm, default, lg, icon, icon-sm, icon-lg. For labeled buttons with icons, compose the icon and text as children. Use IconButton for icon-only actions. Ghost and link are deprecated.",
    categories: ["forms", "actions"],
    meta: {
      tags: ["button", "action", "cta", "form"],
      examples: [
        {
          title: "Primary action",
          code:
            'import { Button } from "@/components/ui/button"\n\n<Button>Save changes</Button>',
        },
        {
          title: "Button with leading icon",
          code:
            'import { Download } from "lucide-react"\nimport { Button } from "@/components/ui/button"\n\n<Button variant="outline">\n  <Download className="size-4" />\n  Export\n</Button>',
        },
      ],
    },
  },
  calendar: {
    title: "Calendar",
    description:
      "A date selection calendar for single or range selections, with accessible keyboard navigation and month controls.",
    categories: ["forms", "date-time"],
    meta: {
      tags: ["calendar", "date-picker", "schedule", "input"],
      examples: [
        {
          title: "Single date",
          code:
            'import { Calendar } from "@/components/ui/calendar"\n\n<Calendar mode="single" selected={new Date()} />',
        },
      ],
    },
  },
  card: {
    title: "Card",
    description:
      "A flexible content container for grouping related information. Use header/content/footer slots or place any custom layout inside.",
    categories: ["layout", "data-display"],
    meta: {
      tags: ["card", "container", "layout", "surface"],
      examples: [
        {
          title: "Card layout",
          code:
            'import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"\n\n<Card>\n  <CardHeader>\n    <CardTitle>Card title</CardTitle>\n  </CardHeader>\n  <CardContent>Card content</CardContent>\n  <CardFooter>Card footer</CardFooter>\n</Card>',
        },
      ],
    },
  },
  carousel: {
    title: "Carousel",
    description:
      "A horizontally scrollable carousel for media or cards, with optional next/previous controls and snap alignment.",
    categories: ["media", "layout"],
    meta: {
      tags: ["carousel", "slider", "media", "scroll"],
      examples: [
        {
          title: "Image carousel",
          code:
            'import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"\n\n<Carousel>\n  <CarouselContent>\n    <CarouselItem>Slide 1</CarouselItem>\n    <CarouselItem>Slide 2</CarouselItem>\n  </CarouselContent>\n  <CarouselPrevious />\n  <CarouselNext />\n</Carousel>',
        },
      ],
    },
  },
  chart: {
    title: "Chart",
    description:
      "Legacy Recharts primitives for lightweight internal chart composition. For v0-generated application views, prefer Highcharts with the BRD Highcharts theme helper and chart swatches 1-24 in sequence.",
    categories: ["data-visualization"],
    meta: {
      tags: ["chart", "data", "visualization", "graph"],
      examples: [
        {
          title: "Chart container",
          code:
            'import { ChartContainer } from "@/components/ui/chart"\n\n<ChartContainer config={{}}>\n  {/* Render Recharts components here */}\n</ChartContainer>',
        },
      ],
    },
  },
  chip: {
    title: "Chip",
    description:
      "An interactive chip for compact selected filters, tags, and removable pills. Supports optional leading icon, selected state, and dismiss action.",
    categories: ["forms", "data-display", "selection"],
    meta: {
      tags: ["chip", "tag", "pill", "filter", "selection", "removable"],
      examples: [
        {
          title: "Selected removable chip",
          code:
            'import { Star } from "lucide-react"\nimport { Chip } from "@/components/ui/chip"\n\n<Chip\n  icon={<Star className="size-4" />}\n  selected\n  onClick={() => {}}\n  onRemove={() => {}}\n>\n  Chip Label\n</Chip>',
        },
      ],
    },
  },
  checkbox: {
    title: "Checkbox",
    description:
      "A selectable checkbox for binary choices, supporting labels, supporting text, and an indeterminate state.",
    categories: ["forms"],
    meta: {
      tags: ["checkbox", "input", "form", "selection"],
      examples: [
        {
          title: "Checkbox with label",
          code:
            'import { Checkbox } from "@/components/ui/checkbox"\n\n<Checkbox label="Accept terms" />',
        },
      ],
    },
  },
  collapsible: {
    title: "Collapsible",
    description:
      "A simple show/hide disclosure pattern that toggles content visibility with a trigger control.",
    categories: ["disclosure"],
    meta: {
      tags: ["collapsible", "disclosure", "toggle", "content"],
      examples: [
        {
          title: "Collapsible content",
          code:
            'import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"\n\n<Collapsible>\n  <CollapsibleTrigger>Show details</CollapsibleTrigger>\n  <CollapsibleContent>Hidden content.</CollapsibleContent>\n</Collapsible>',
        },
      ],
    },
  },
  "currency-selector": {
    title: "Currency Selector",
    description:
      "An input-like trigger that opens a currency dropdown with active selection.",
    categories: ["forms", "navigation"],
    meta: {
      tags: ["currency", "selector", "dropdown", "input"],
      examples: [
        {
          title: "Currency select",
          code:
            'import { CurrencySelector } from "@/components/ui/currency-selector"\n\n<CurrencySelector options={[{ id: "usd", label: "USD" }]} selectedId="usd" />',
        },
      ],
    },
  },
  "data-point-card": {
    title: "Data Point Card",
    description:
      "A compact metric card for key user-facing values with optional icon, action, trend, badge, and CTA.",
    categories: ["data-display", "dashboard", "cards"],
    meta: {
      tags: ["metric", "kpi", "card", "stat", "dashboard", "data-point"],
      examples: [
        {
          title: "Metric card with trend and badge",
          code:
            'import { ArrowUpRight, LayoutGrid } from "lucide-react"\nimport { Badge } from "@/components/ui/badge"\nimport { DataPointCard } from "@/components/ui/data-point-card"\n\n<DataPointCard\n  size="md"\n  color="blue"\n  label="Available Cash"\n  value="$50,000.00"\n  topLeftIcon={<LayoutGrid className="size-4" />}\n  trend={{ icon: <ArrowUpRight className="size-4" />, label: "+8.2%", tone: "success" }}\n  badge={<Badge variant="outline" color="neutral" size="sm">YTD</Badge>}\n/>',
        },
      ],
    },
  },
  command: {
    title: "Command",
    description:
      "A command palette component for quick search and navigation, optimized for keyboard interaction.",
    categories: ["navigation", "input"],
    meta: {
      tags: ["command", "palette", "search", "navigation"],
      examples: [
        {
          title: "Command palette",
          code:
            'import { Command, CommandInput, CommandList, CommandItem } from "@/components/ui/command"\n\n<Command>\n  <CommandInput placeholder="Search..." />\n  <CommandList>\n    <CommandItem>Profile</CommandItem>\n    <CommandItem>Settings</CommandItem>\n  </CommandList>\n</Command>',
        },
      ],
    },
  },
  "context-menu": {
    title: "Context Menu",
    description:
      "A right-click or long-press menu with support for submenus, separators, and disabled items.",
    categories: ["navigation", "overlay"],
    meta: {
      tags: ["context-menu", "menu", "overlay", "actions"],
      examples: [
        {
          title: "Right-click menu",
          code:
            'import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from "@/components/ui/context-menu"\n\n<ContextMenu>\n  <ContextMenuTrigger>Right click me</ContextMenuTrigger>\n  <ContextMenuContent>\n    <ContextMenuItem>Edit</ContextMenuItem>\n    <ContextMenuItem>Delete</ContextMenuItem>\n  </ContextMenuContent>\n</ContextMenu>',
        },
      ],
    },
  },
  dialog: {
    title: "Dialog",
    description:
      "A modal dialog with structured header, body, and footer regions. Sizes: xs, sm, md, lg, and fluid.",
    categories: ["overlay"],
    meta: {
      tags: ["dialog", "modal", "overlay", "focus"],
      examples: [
        {
          title: "Modal dialog",
          code:
            'import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"\n\n<Dialog>\n  <DialogTrigger>Open</DialogTrigger>\n  <DialogContent>\n    <DialogHeader>\n      <DialogTitle>Dialog title</DialogTitle>\n      <DialogDescription>Dialog description</DialogDescription>\n    </DialogHeader>\n  </DialogContent>\n</Dialog>',
        },
      ],
    },
  },
  drawer: {
    title: "Drawer",
    description:
      "A slide-in drawer from the right for supplemental content or actions, optimized for constrained layouts.",
    categories: ["overlay"],
    meta: {
      tags: ["drawer", "sheet", "overlay", "mobile"],
      examples: [
        {
          title: "Bottom drawer",
          code:
            'import { Drawer, DrawerTrigger, DrawerContent } from "@/components/ui/drawer"\n\n<Drawer>\n  <DrawerTrigger>Open drawer</DrawerTrigger>\n  <DrawerContent>Drawer content</DrawerContent>\n</Drawer>',
        },
      ],
    },
  },
  "dropdown-menu": {
    title: "Dropdown Menu",
    description:
      "A menu anchored to a trigger element, with support for items, groups, separators, checkbox items, and radio items.",
    categories: ["navigation", "overlay"],
    meta: {
      tags: ["dropdown", "menu", "actions", "overlay"],
      examples: [
        {
          title: "Menu actions",
          code:
            'import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"\n\n<DropdownMenu>\n  <DropdownMenuTrigger>Open</DropdownMenuTrigger>\n  <DropdownMenuContent>\n    <DropdownMenuItem>Edit</DropdownMenuItem>\n    <DropdownMenuItem>Delete</DropdownMenuItem>\n  </DropdownMenuContent>\n</DropdownMenu>',
        },
      ],
    },
  },
  "expandable-panel": {
    title: "Expandable Panel",
    description:
      "A single collapsible section (Expansion/Accordion behavior) with a title, an optional accessory region (progress bar, value, badges), and a chevron toggle. Built on Radix Collapsible for full keyboard accessibility and animated expand/collapse. Includes an ExpandableProgress accessory that turns red when over-allocated.",
    categories: ["data-display", "layout"],
    registryDependencies: ["collapsible"],
    meta: {
      tags: ["expandable", "panel", "collapsible", "accordion", "expansion", "disclosure"],
      examples: [
        {
          title: "Panel with progress accessory",
          code:
            'import { ExpandablePanel, ExpandableProgress } from "@/components/ui/expandable-panel"\n\n<ExpandablePanel\n  title="Allocations"\n  defaultOpen\n  accessory={<ExpandableProgress current={1000} total={1000} />}\n>\n  <p>Allocation details go here.</p>\n</ExpandablePanel>',
        },
        {
          title: "Simple panel with inline value",
          code:
            'import { ExpandablePanel } from "@/components/ui/expandable-panel"\n\n<ExpandablePanel\n  title="Total Consideration"\n  accessory={<span className="[font:var(--font-body-large)]">USD <strong>122,300.00</strong></span>}\n>\n  <p>Breakdown of fees and consideration.</p>\n</ExpandablePanel>',
        },
      ],
    },
  },
  footer: {
    title: "Footer",
    description:
      "A responsive footer with logo and copyright text.",
    categories: ["layout", "navigation"],
    meta: {
      tags: ["footer", "layout", "branding"],
      examples: [
        {
          title: "Footer",
          code: 'import { Footer } from "@/components/ui/footer"\n\n<Footer />',
        },
      ],
    },
  },
  "hover-card": {
    title: "Hover Card",
    description:
      "A lightweight preview panel that appears on hover or focus, useful for quick summaries. Similar to Popover but optimized for hover.",
    categories: ["overlay", "data-display"],
    meta: {
      tags: ["hover-card", "preview", "overlay", "tooltip"],
      examples: [
        {
          title: "Hover preview",
          code:
            'import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card"\n\n<HoverCard>\n  <HoverCardTrigger>Hover me</HoverCardTrigger>\n  <HoverCardContent>Preview content</HoverCardContent>\n</HoverCard>',
        },
      ],
    },
  },
  header: {
    title: "Header",
    description:
      "Responsive top header with logo, selectors, search, notifications, and user menu.",
    categories: ["navigation", "layout"],
    meta: {
      tags: ["header", "navigation", "app-shell", "toolbar"],
      examples: [
        {
          title: "App header",
          code:
            'import { Header } from "@/components/ui/header"\n\n<Header userName="John Smith" userInitials="JS" />',
        },
      ],
    },
  },
  "icon-button": {
    title: "Icon Button",
    description:
      "An icon-only button with built-in accessibility labeling, size variants, and active states. Use `ariaLabel` for the tooltip and assistive text.",
    categories: ["actions", "icons"],
    meta: {
      tags: ["icon-button", "button", "action", "a11y"],
      examples: [
        {
          title: "Icon action",
          code:
            'import { IconButton } from "@/components/ui/icon-button"\n\n<IconButton ariaLabel="Edit">\n  <span>Edit</span>\n</IconButton>',
        },
      ],
    },
  },
  input: {
    title: "Input",
    description:
      "A text input and field wrapper with labels, icons, helper text, and validation feedback. Use for search and for calendar/time pickers with icons.",
    categories: ["forms"],
    meta: {
      tags: ["input", "text-field", "form", "validation"],
      examples: [
        {
          title: "Text input",
          code:
            'import { Input } from "@/components/ui/input"\n\n<Input placeholder="Enter your name" />',
        },
      ],
    },
  },
  "input-otp": {
    title: "Input OTP",
    description:
      "A segmented input for one-time passcodes with auto-advance and keyboard support.",
    categories: ["forms", "security"],
    meta: {
      tags: ["otp", "input", "verification", "security"],
      examples: [
        {
          title: "One-time code",
          code:
            'import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"\n\n<InputOTP maxLength={6}>\n  <InputOTPGroup>\n    <InputOTPSlot index={0} />\n    <InputOTPSlot index={1} />\n    <InputOTPSlot index={2} />\n    <InputOTPSlot index={3} />\n    <InputOTPSlot index={4} />\n    <InputOTPSlot index={5} />\n  </InputOTPGroup>\n</InputOTP>',
        },
      ],
    },
  },
  label: {
    title: "Label",
    description:
      "A form label component that pairs with inputs and supports accessible descriptions.",
    categories: ["forms"],
    meta: {
      tags: ["label", "form", "a11y", "input"],
      examples: [
        {
          title: "Labelled input",
          code:
            'import { Label } from "@/components/ui/label"\n\n<Label htmlFor="email">Email</Label>',
        },
      ],
    },
  },
  "language-selector": {
    title: "Language Selector",
    description:
      "An input-like trigger that opens a language dropdown with active selection.",
    categories: ["forms", "navigation"],
    meta: {
      tags: ["language", "selector", "dropdown", "input"],
      examples: [
        {
          title: "Language select",
          code:
            'import { LanguageSelector } from "@/components/ui/language-selector"\n\n<LanguageSelector options={[{ id: "eng", label: "ENG" }]} selectedId="eng" />',
        },
      ],
    },
  },
  "left-navigation": {
    title: "Left Navigation",
    description:
      "A fixed left-edge L1 navigation with icon labels and active state highlighting.",
    categories: ["navigation"],
    meta: {
      tags: ["left-navigation", "nav", "sidebar", "l1", "navigation"],
      examples: [
        {
          title: "Primary nav",
          code:
            'import { LeftNavigation } from "@/components/ui/left-navigation"\nimport { Home } from "lucide-react"\n\n<LeftNavigation items={[{ id: "home", label: "Home", icon: Home }]} />',
        },
      ],
    },
  },
  link: {
    title: "Link",
    description:
      "A styled anchor/link component with sizing and icon support, consistent with BRD typography.",
    categories: ["navigation"],
    meta: {
      tags: ["link", "anchor", "navigation", "text"],
      examples: [
        {
          title: "Inline link",
          code:
            'import { Link } from "@/components/ui/link"\n\n<Link href="/docs">Documentation</Link>',
        },
      ],
    },
  },
  menubar: {
    title: "Menubar",
    description:
      "A horizontal application menu bar with nested menus, shortcuts, and separators.",
    categories: ["navigation"],
    meta: {
      tags: ["menubar", "menu", "navigation", "app"],
      examples: [
        {
          title: "App menu",
          code:
            'import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem } from "@/components/ui/menubar"\n\n<Menubar>\n  <MenubarMenu>\n    <MenubarTrigger>File</MenubarTrigger>\n    <MenubarContent>\n      <MenubarItem>New</MenubarItem>\n      <MenubarItem>Open</MenubarItem>\n    </MenubarContent>\n  </MenubarMenu>\n</Menubar>',
        },
      ],
    },
  },
  pagination: {
    title: "Pagination",
    description:
      "Pagination controls to navigate between pages of content, including previous/next and page items.",
    categories: ["navigation"],
    meta: {
      tags: ["pagination", "navigation", "pages", "list"],
      examples: [
        {
          title: "Page navigation",
          code:
            'import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination"\n\n<Pagination>\n  <PaginationContent>\n    <PaginationItem>\n      <PaginationLink href="#">1</PaginationLink>\n    </PaginationItem>\n  </PaginationContent>\n</Pagination>',
        },
      ],
    },
  },
  "page-container": {
    title: "Page Container",
    description:
      "Responsive page container with header and content spacing.",
    categories: ["layout"],
    meta: {
      tags: ["page-container", "layout", "header"],
      examples: [
        {
          title: "Page container",
          code:
            'import { PageContainer, PageHeader } from "@/components/ui/page-container"\n\n<PageContainer>\n  <PageHeader title="Overview" />\n  <div>Content</div>\n</PageContainer>',
        },
      ],
    },
  },
  popover: {
    title: "Popover",
    description:
      "A floating panel anchored to a trigger, useful for lightweight forms or contextual info. It can contain any content.",
    categories: ["overlay"],
    meta: {
      tags: ["popover", "overlay", "floating", "context"],
      examples: [
        {
          title: "Popover content",
          code:
            'import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"\n\n<Popover>\n  <PopoverTrigger>Open</PopoverTrigger>\n  <PopoverContent>Popover content</PopoverContent>\n</Popover>',
        },
      ],
    },
  },
  progress: {
    title: "Progress",
    description:
      "A linear progress indicator for tasks or loading states, showing completion percentage.",
    categories: ["feedback"],
    meta: {
      tags: ["progress", "loading", "status", "bar"],
      examples: [
        {
          title: "Progress value",
          code:
            'import { Progress } from "@/components/ui/progress"\n\n<Progress value={65} />',
        },
      ],
    },
  },
  "radio-group": {
    title: "Radio Group",
    description:
      "An exclusive selection group for choosing one option from a list, with labels and helper text.",
    categories: ["forms"],
    meta: {
      tags: ["radio", "selection", "form", "input"],
      examples: [
        {
          title: "Radio options",
          code:
            'import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"\n\n<RadioGroup defaultValue="a">\n  <RadioGroupItem value="a" label="Option A" />\n  <RadioGroupItem value="b" label="Option B" />\n</RadioGroup>',
        },
      ],
    },
  },
  resizable: {
    title: "Resizable",
    description:
      "A resizable panel group with draggable handles for split views and adjustable layouts.",
    categories: ["layout"],
    meta: {
      tags: ["resizable", "split", "layout", "panels"],
      examples: [
        {
          title: "Split panels",
          code:
            'import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"\n\n<ResizablePanelGroup direction="horizontal">\n  <ResizablePanel>Left</ResizablePanel>\n  <ResizableHandle />\n  <ResizablePanel>Right</ResizablePanel>\n</ResizablePanelGroup>',
        },
      ],
    },
  },
  "scroll-area": {
    title: "Scroll Area",
    description:
      "A scrollable container with styled scrollbars for content that overflows its bounds.",
    categories: ["layout"],
    meta: {
      tags: ["scroll-area", "overflow", "scrollbar", "container"],
      examples: [
        {
          title: "Scrollable content",
          code:
            'import { ScrollArea } from "@/components/ui/scroll-area"\n\n<ScrollArea className="h-32 w-64">Long content...</ScrollArea>',
        },
      ],
    },
  },
  select: {
    title: "Select",
    description:
      "A custom select dropdown for choosing a single option, with groups and labels. Similar to Dropdown Menu but for selection.",
    categories: ["forms"],
    meta: {
      tags: ["select", "dropdown", "form", "input"],
      examples: [
        {
          title: "Select options",
          code:
            'import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"\n\n<Select>\n  <SelectTrigger>\n    <SelectValue placeholder="Pick one" />\n  </SelectTrigger>\n  <SelectContent>\n    <SelectItem value="a">Option A</SelectItem>\n    <SelectItem value="b">Option B</SelectItem>\n  </SelectContent>\n</Select>',
        },
      ],
    },
  },
  separator: {
    title: "Separator",
    description:
      "A horizontal or vertical divider used to separate content and improve visual structure.",
    categories: ["layout"],
    meta: {
      tags: ["separator", "divider", "layout", "spacing"],
      examples: [
        {
          title: "Section divider",
          code:
            'import { Separator } from "@/components/ui/separator"\n\n<Separator />',
        },
      ],
    },
  },
  sheet: {
    title: "Sheet",
    description:
      "Deprecated. Use Drawer or Dialog instead for side panels or overlays.",
    categories: ["overlay"],
    meta: {
      tags: ["sheet", "drawer", "overlay", "panel"],
      examples: [
        {
          title: "Side sheet",
          code:
            'import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"\n\n<Sheet>\n  <SheetTrigger>Open</SheetTrigger>\n  <SheetContent side="right">Sheet content</SheetContent>\n</Sheet>',
        },
      ],
    },
  },
  shell: {
    title: "Shell",
    description:
      "A composed application shell combining header, navigation, page container, and footer.",
    categories: ["layout", "navigation"],
    meta: {
      tags: ["shell", "app-shell", "layout", "template", "navigation"],
      examples: [
        {
          title: "App shell",
          code:
            'import { Shell } from "@/components/ui/shell"\n\n<Shell>{/* page content */}</Shell>',
        },
      ],
    },
  },
  "app-starter": {
    title: "App Starter",
    description:
      "A root application starter built on BRD Shell with access to all BRD tokens and components, including Widget, plus starter helpers for BRD typography, Highcharts, and AG Grid. Use this as the default entrypoint for generating new views in v0.",
    categories: ["starter", "layout"],
    meta: {
      tags: ["starter", "app-starter", "prototype", "shell", "layout", "root-app", "v0", "widget", "highcharts", "ag-grid", "typography"],
      examples: [
        {
          title: "Root app scaffold",
          code:
            'import { Shell } from "@/components/ui/shell"\n\n// app/page.tsx starter scaffold that composes Shell, Widget, and other BRD components.',
        },
      ],
    },
  },
  "side-toolbar": {
    title: "Side Toolbar",
    description:
      "A fixed right-edge vertical toolbar of icon buttons for quick actions or panels.",
    categories: ["navigation", "actions"],
    meta: {
      tags: ["side-toolbar", "toolbar", "actions", "fixed", "icons"],
      examples: [
        {
          title: "Side toolbar",
          code:
            'import { SideToolbar } from "@/components/ui/side-toolbar"\nimport { Info } from "lucide-react"\n\n<SideToolbar items={[{ id: "info", label: "Info", icon: Info }]} />',
        },
      ],
    },
  },
  skeleton: {
    title: "Skeleton",
    description:
      "A placeholder shimmer used while content is loading, providing visual continuity.",
    categories: ["feedback"],
    meta: {
      tags: ["skeleton", "loading", "placeholder", "progress"],
      examples: [
        {
          title: "Loading placeholder",
          code:
            'import { Skeleton } from "@/components/ui/skeleton"\n\n<Skeleton className="h-4 w-40" />',
        },
      ],
    },
  },
  slider: {
    title: "Slider",
    description:
      "A range slider input for selecting a value within a continuous interval.",
    categories: ["forms"],
    meta: {
      tags: ["slider", "range", "input", "form"],
      examples: [
        {
          title: "Slider value",
          code:
            'import { Slider } from "@/components/ui/slider"\n\n<Slider defaultValue={[50]} max={100} />',
        },
      ],
    },
  },
  sonner: {
    title: "Sonner Toaster",
    description:
      "A toast renderer that mounts the Sonner toaster with theme-aware styling. Ensure the `Toaster` is rendered once at app root.",
    categories: ["feedback"],
    meta: {
      tags: ["toast", "sonner", "notifications", "feedback"],
      examples: [
        {
          title: "Toaster mount",
          code:
            'import { Toaster } from "@/components/ui/sonner"\n\n<Toaster />',
        },
      ],
    },
  },
  "split-button": {
    title: "Split Button",
    description:
      "A primary action paired with a trailing menu trigger that shares the exact Button styling, variants, and sizes. The main segment fires onClick; the trailing chevron segment opens a dropdown menu. Variants: default (primary), outline (secondary), secondary (tertiary), destructive (error). Sizes: sm, default, lg.",
    categories: ["forms", "actions"],
    meta: {
      tags: ["split-button", "button", "menu", "dropdown", "action"],
      examples: [
        {
          title: "Split action with menu",
          code:
            'import { Download } from "lucide-react"\nimport { SplitButton } from "@/components/ui/split-button"\nimport { DropdownMenuItem } from "@/components/ui/dropdown-menu"\n\n<SplitButton\n  icon={<Download />}\n  onClick={() => {}}\n  menu={\n    <>\n      <DropdownMenuItem>Export as CSV</DropdownMenuItem>\n      <DropdownMenuItem>Export as PDF</DropdownMenuItem>\n    </>\n  }\n>\n  Download\n</SplitButton>',
        },
      ],
    },
  },
  stepper: {
    title: "Stepper",
    description:
      "An onboarding and workflow progress indicator for multi-step flows with inferred completed, current, and upcoming states.",
    categories: ["navigation", "onboarding", "data-display"],
    meta: {
      tags: ["stepper", "wizard", "onboarding", "progress", "steps"],
      examples: [
        {
          title: "Onboarding progress",
          code:
            'import { Stepper } from "@/components/ui/stepper"\n\n<Stepper\n  currentStepIndex={1}\n  steps={[\n    { title: "Company details", description: "Website and location" },\n    { title: "Your details", description: "Name and email" },\n    { title: "Verification", description: "Confirm your account" },\n  ]}\n/>',
        },
      ],
    },
  },
  switch: {
    title: "Switch",
    description:
      "A toggle switch for binary settings, with optional label and size variants.",
    categories: ["forms"],
    meta: {
      tags: ["switch", "toggle", "input", "form"],
      examples: [
        {
          title: "Toggle setting",
          code:
            'import { Switch } from "@/components/ui/switch"\n\n<Switch label="Enable notifications" />',
        },
      ],
    },
  },
  table: {
    title: "Table",
    description:
      "A lightweight semantic table for simple static tabular content. For primary application data tables in v0-generated views, prefer AG Grid with the BRD AG Grid theme helper.",
    categories: ["data-display"],
    meta: {
      tags: ["table", "data", "rows", "columns"],
      examples: [
        {
          title: "Simple table",
          code:
            'import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"\n\n<Table>\n  <TableHeader>\n    <TableRow>\n      <TableHead>Name</TableHead>\n      <TableHead>Status</TableHead>\n    </TableRow>\n  </TableHeader>\n  <TableBody>\n    <TableRow>\n      <TableCell>Project A</TableCell>\n      <TableCell>Active</TableCell>\n    </TableRow>\n  </TableBody>\n</Table>',
        },
      ],
    },
  },
  tabs: {
    title: "Tabs",
    description:
      "Tabbed navigation for switching between related sections without changing pages.",
    categories: ["navigation"],
    meta: {
      tags: ["tabs", "navigation", "content", "layout"],
      examples: [
        {
          title: "Tabbed content",
          code:
            'import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"\n\n<Tabs defaultValue="a">\n  <TabsList>\n    <TabsTrigger value="a">A</TabsTrigger>\n    <TabsTrigger value="b">B</TabsTrigger>\n  </TabsList>\n  <TabsContent value="a">Content A</TabsContent>\n  <TabsContent value="b">Content B</TabsContent>\n</Tabs>',
        },
      ],
    },
  },
  textarea: {
    title: "Textarea",
    description:
      "A multi-line text input with optional label and validation feedback via field wrapper. Similar to Input.",
    categories: ["forms"],
    meta: {
      tags: ["textarea", "input", "form", "multiline"],
      examples: [
        {
          title: "Multiline input",
          code:
            'import { Textarea } from "@/components/ui/textarea"\n\n<Textarea rows={4} placeholder="Enter details..." />',
        },
      ],
    },
  },
  theme: {
    title: "Theme",
    description:
      "Global BRD theme tokens and CSS variables for colors, typography, spacing, and radius.",
    categories: ["theming"],
    meta: {
      tags: ["theme", "tokens", "css-vars", "design-system"],
      examples: [
        {
          title: "Theme file",
          code: '/* app/globals.css contains BRD tokens and theme variables */',
        },
      ],
    },
  },
  toast: {
    title: "Toast",
    description:
      "Toast primitives for transient notifications, including provider, viewport, and actions. Ensure the provider and viewport are mounted to render toasts.",
    categories: ["feedback"],
    meta: {
      tags: ["toast", "notification", "feedback", "overlay"],
      examples: [
        {
          title: "Toast layout",
          code:
            'import { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription } from "@/components/ui/toast"\n\n<ToastProvider>\n  <Toast>\n    <ToastTitle>Saved</ToastTitle>\n    <ToastDescription>Your changes were saved.</ToastDescription>\n  </Toast>\n  <ToastViewport />\n</ToastProvider>',
        },
      ],
    },
  },
  toggle: {
    title: "Toggle",
    description:
      "A standalone toggle button for on/off states with optional pressed styling.",
    categories: ["forms", "actions"],
    meta: {
      tags: ["toggle", "button", "input", "state"],
      examples: [
        {
          title: "Toggle pressed",
          code:
            'import { Toggle } from "@/components/ui/toggle"\n\n<Toggle pressed>Bold</Toggle>',
        },
      ],
    },
  },
  "button-group": {
    title: "Button Group",
    description:
      "A group of toggle buttons that supports single or multiple selection behavior. Works well for timeframe selectors.",
    categories: ["forms", "actions"],
    meta: {
      tags: ["button-group", "toggle-group", "selection", "buttons", "input"],
      examples: [
        {
          title: "Button group options",
          code:
            'import { ButtonGroup, ButtonGroupItem } from "@/components/ui/button-group"\n\n<ButtonGroup type="single" value="left">\n  <ButtonGroupItem value="left">Left</ButtonGroupItem>\n  <ButtonGroupItem value="right">Right</ButtonGroupItem>\n</ButtonGroup>',
        },
      ],
    },
  },
  "toggle-group": {
    title: "Toggle Group",
    description:
      "Legacy alias for Button Group. Use Button Group for new BRD implementations.",
    categories: ["forms", "actions"],
    meta: {
      tags: ["toggle-group", "button-group", "selection", "buttons", "input", "legacy"],
      examples: [
        {
          title: "Legacy toggle group alias",
          code:
            'import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"\n\n<ToggleGroup type="single" value="left">\n  <ToggleGroupItem value="left">Left</ToggleGroupItem>\n  <ToggleGroupItem value="right">Right</ToggleGroupItem>\n</ToggleGroup>',
        },
      ],
    },
  },
  "top-navigation": {
    title: "Top Navigation",
    description:
      "Tab-like top navigation with hover-triggered dropdown menus and nested submenus.",
    categories: ["navigation"],
    meta: {
      tags: ["top-navigation", "tabs", "menu", "navigation"],
      examples: [
        {
          title: "Top nav",
          code:
            'import { TopNavigation } from "@/components/ui/top-navigation"\n\n<TopNavigation items={[{ id: "level-2", label: "Level 2" }]} />',
        },
      ],
    },
  },
  tooltip: {
    title: "Tooltip",
    description:
      "A small contextual hint shown on hover or focus, with configurable placement and delay.",
    categories: ["feedback", "overlay"],
    meta: {
      tags: ["tooltip", "hint", "overlay", "a11y"],
      examples: [
        {
          title: "Tooltip hint",
          code:
            'import { SimpleTooltip } from "@/components/ui/tooltip"\n\n<SimpleTooltip content="More info">\n  <span>Hover me</span>\n</SimpleTooltip>',
        },
      ],
    },
  },
  "tree-view": {
    title: "Tree View",
    description:
      "A hierarchical, expandable tree for nested folders or categories. Each node has a folder icon, label, optional count badge, and optional selection checkbox, with chevron expand/collapse, hover, and selected (blue) states across unlimited nesting levels.",
    categories: ["navigation", "data-display"],
    meta: {
      tags: ["tree-view", "tree", "hierarchy", "nested", "folder", "explorer"],
      examples: [
        {
          title: "Selectable tree with counts",
          code:
            'import { TreeView, type TreeNode } from "@/components/ui/tree-view"\n\nconst data: TreeNode[] = [\n  {\n    id: "1",\n    label: "Tree View Level 1",\n    count: 36,\n    children: [\n      { id: "1-1", label: "Tree View Level 2", count: 36 },\n    ],\n  },\n]\n\n<TreeView data={data} defaultExpandedIds={["1"]} />',
        },
      ],
    },
  },
  "user-menu": {
    title: "User Menu",
    description:
      "A user name trigger that opens a dropdown menu for account actions.",
    categories: ["navigation", "overlay"],
    meta: {
      tags: ["user-menu", "dropdown", "account", "profile"],
      examples: [
        {
          title: "User menu",
          code:
            'import { UserMenu } from "@/components/ui/user-menu"\n\n<UserMenu name="John Smith" items={[{ id: "profile", label: "Profile" }]} />',
        },
      ],
    },
  },
  "brd-highcharts": {
    title: "BRD Highcharts",
    description:
      "The complete BRD Highcharts data-visualization kit: a fully themed Highcharts configuration (colors, typography, spacing, axes, tooltips), reusable tooltip formatters, chart sizing/scroll/data-label utilities, a responsive donut chart helper, and the DonutCenterText overlay component. All colors resolve from BRD design tokens, so charts are correct in both light and dark mode. Install this whenever a screen needs charts or data visualization.",
    categories: ["data-display", "charts"],
    meta: {
      tags: ["highcharts", "charts", "data-visualization", "donut", "tooltip", "dark-mode", "theme"],
      examples: [
        {
          title: "Apply the theme + render a donut with center text",
          code:
            'import Highcharts from "highcharts"\nimport HighchartsReact from "highcharts-react-official"\nimport { applyBrdHighchartsTheme, getBrdDonutChartOptions } from "@/lib/brd-highcharts-theme"\nimport { DonutCenterText } from "@/lib/brd-highcharts-components"\n\napplyBrdHighchartsTheme(Highcharts)\n\nconst data = [\n  { name: "Equities", value: 55, color: "var(--chart-1)" },\n  { name: "Fixed Income", value: 30, color: "var(--chart-2)" },\n  { name: "Cash", value: 15, color: "var(--chart-3)" },\n]\n\n<div className="relative" style={{ width: 220, height: 220 }}>\n  <HighchartsReact highcharts={Highcharts} options={getBrdDonutChartOptions(data)} />\n  <DonutCenterText size={220} label="Total AUM" primaryValue="$2.5M" secondaryValue="2024 YTD" />\n</div>',
        },
      ],
    },
  },
  "dashboard-grid": {
    title: "Dashboard Grid",
    description:
      "A responsive, drag-to-reorder dashboard grid for Widgets. Uses a container-measured CSS grid (ResizeObserver, not viewport media queries) so it adapts to the available content width inside any shell or nav state. Maps each widget's S/M/L size to a responsive column span and densely packs tiles (grid-auto-flow: dense) to fill gaps. On mobile every widget collapses to S.",
    categories: ["layout", "data-display"],
    meta: {
      tags: ["dashboard", "grid", "widget", "layout", "drag-and-drop", "responsive", "dnd-kit"],
      examples: [
        {
          title: "Reorderable widget dashboard",
          code:
            'import { DashboardGrid, DashboardGridItem } from "@/components/ui/dashboard-grid"\n\n<DashboardGrid>\n  <DashboardGridItem id="aum" defaultSize="M">\n    <AssetAllocationWidget />\n  </DashboardGridItem>\n  <DashboardGridItem id="alerts" defaultSize="S">\n    <AlertsWidget />\n  </DashboardGridItem>\n</DashboardGrid>',
        },
      ],
    },
  },
  "brd-highcharts": {
    title: "BRD Highcharts",
    description:
      "The complete BRD Highcharts data-visualization system: the global theme (24-color swatch palette, BRD typography/spacing/axis/legend/tooltip defaults), tooltip formatters for every chart type, responsive bar-width/stack/scroll/donut helpers, and the DonutCenterText overlay component. Apply the theme once per module with applyBrdHighchartsTheme(Highcharts), then build column, bar, stacked, line, area, combo, and donut charts that are dark-mode correct out of the box. Install this whenever a chart, graph, plot, or data visualization is requested.",
    categories: ["chart", "data-display"],
    meta: {
      tags: ["chart", "graph", "highcharts", "data-visualization", "donut", "line", "column", "bar", "area", "tooltip", "dashboard"],
      examples: [
        {
          title: "Apply theme + column chart",
          code:
            'import Highcharts from "highcharts"\nimport HighchartsReact from "@highcharts/react"\nimport { applyBrdHighchartsTheme, brdHighchartsTheme } from "@/lib/brd-highcharts-theme"\n\napplyBrdHighchartsTheme(Highcharts)\n\nconst options: Highcharts.Options = {\n  ...brdHighchartsTheme,\n  chart: { ...brdHighchartsTheme.chart, type: "column" },\n  xAxis: { categories: ["Q1", "Q2", "Q3", "Q4"] },\n  series: [{ type: "column", name: "Revenue", data: [4, 6, 5, 8] }],\n}\n\n<div className="h-full w-full">\n  <HighchartsReact highcharts={Highcharts} options={options} containerProps={{ style: { height: "100%", width: "100%" } }} />\n</div>',
        },
      ],
    },
  },
  widget: {
    title: "Widget",
    description:
      "A dashboard widget shell for complex content with S/M/L width ranges, fixed per-size heights, unified token spacing, and responsive zoom for S and M. Composes IconButton, Link, Dialog, and DropdownMenu.",
    categories: ["layout", "data-display"],
    meta: {
      tags: ["widget", "dashboard", "card", "layout"],
      examples: [
        {
          title: "Range-sized widget shell",
          code:
            'import { Widget } from "@/components/ui/widget"\n\n<Widget size="M" title="Sales" timestamp="Updated now">\n  Widget content\n</Widget>',
        },
      ],
    },
  },
}
