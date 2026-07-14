import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs"
import { join } from "path"

// Manually import all app modules to extract their metadata
import * as accordionModule from "./app/accordion/page.tsx"
import * as alertModule from "./app/alert/page.tsx"
import * as alertDialogModule from "./app/alert-dialog/page.tsx"
import * as aspectRatioModule from "./app/aspect-ratio/page.tsx"
import * as avatarModule from "./app/avatar/page.tsx"
import * as badgeModule from "./app/badge/page.tsx"
import * as breadcrumbModule from "./app/breadcrumb/page.tsx"
import * as buttonModule from "./app/button/page.tsx"
import * as buttonGroupModule from "./app/button-group/page.tsx"
import * as calendarModule from "./app/calendar/page.tsx"
import * as cardModule from "./app/card/page.tsx"
import * as carouselModule from "./app/carousel/page.tsx"
import * as chartModule from "./app/chart/page.tsx"
import * as chipModule from "./app/chip/page.tsx"
import * as checkboxModule from "./app/checkbox/page.tsx"
import * as collapsibleModule from "./app/collapsible/page.tsx"
import * as commandModule from "./app/command/page.tsx"
import * as contextMenuModule from "./app/context-menu/page.tsx"
import * as currencySelectorModule from "./app/currency-selector/page.tsx"
import * as dataPointCardModule from "./app/data-point-card/page.tsx"
import * as dialogModule from "./app/dialog/page.tsx"
import * as drawerModule from "./app/drawer/page.tsx"
import * as dropdownMenuModule from "./app/dropdown-menu/page.tsx"
import * as footerModule from "./app/footer/page.tsx"
import * as headerModule from "./app/header/page.tsx"
import * as hoverCardModule from "./app/hover-card/page.tsx"
import * as iconButtonModule from "./app/icon-button/page.tsx"
import * as inputModule from "./app/input/page.tsx"
import * as inputOtpModule from "./app/input-otp/page.tsx"
import * as labelModule from "./app/label/page.tsx"
import * as languageSelectorModule from "./app/language-selector/page.tsx"
import * as leftNavigationModule from "./app/left-navigation/page.tsx"
import * as linkModule from "./app/link/page.tsx"
import * as menubarModule from "./app/menubar/page.tsx"
import * as pageContainerModule from "./app/page-container/page.tsx"
import * as paginationModule from "./app/pagination/page.tsx"
import * as popoverModule from "./app/popover/page.tsx"
import * as progressModule from "./app/progress/page.tsx"
import * as radioGroupModule from "./app/radio-group/page.tsx"
import * as resizableModule from "./app/resizable/page.tsx"
import * as scrollAreaModule from "./app/scroll-area/page.tsx"
import * as selectModule from "./app/select/page.tsx"
import * as separatorModule from "./app/separator/page.tsx"
import * as shellModule from "./app/shell/page.tsx"
import * as sheetModule from "./app/sheet/page.tsx"
import * as sideToolbarModule from "./app/side-toolbar/page.tsx"
import * as skeletonModule from "./app/skeleton/page.tsx"
import * as sliderModule from "./app/slider/page.tsx"
import * as sonnerModule from "./app/sonner/page.tsx"
import * as stepperModule from "./app/stepper/page.tsx"
import * as switchModule from "./app/switch/page.tsx"
import * as tableModule from "./app/table/page.tsx"
import * as tabsModule from "./app/tabs/page.tsx"
import * as textareaModule from "./app/textarea/page.tsx"
import * as themeModule from "./app/theme/page.tsx"
import * as toastModule from "./app/toast/page.tsx"
import * as toggleModule from "./app/toggle/page.tsx"
import * as tooltipModule from "./app/tooltip/page.tsx"
import * as topNavigationModule from "./app/top-navigation/page.tsx"
import * as userMenuModule from "./app/user-menu/page.tsx"
import * as widgetModule from "./app/widget/page.tsx"
import * as dashboardGridModule from "./app/dashboard-grid/page.tsx"
import * as brdHighchartsModule from "./app/brd-highcharts/page.tsx"
import * as appStarterModule from "./app/app-starter/page.tsx"

// Output directory for generated registry files
const OUTPUT_DIR = join(process.cwd(), "public", "r")

// Registry base URL for registryDependencies
const REGISTRY_URL = "https://shad-brd-registery.vercel.app"

// Prefix for component names to prevent v0 from using built-in shadcn components
const COMPONENT_PREFIX = "brdcomp-"

// Map of component file names to their registry names
const COMPONENT_NAME_MAP: Record<string, string> = {
  "accordion": "accordion",
  "alert": "alert",
  "alert-dialog": "alert-dialog",
  "aspect-ratio": "aspect-ratio",
  "avatar": "avatar",
  "badge": "badge",
  "breadcrumb": "breadcrumb",
  "button": "button",
  "button-group": "button-group",
  "calendar": "calendar",
  "card": "card",
  "carousel": "carousel",
  "chart": "chart",
  "chip": "chip",
  "checkbox": "checkbox",
  "collapsible": "collapsible",
  "command": "command",
  "context-menu": "context-menu",
  "currency-selector": "currency-selector",
  "data-point-card": "data-point-card",
  "dialog": "dialog",
  "drawer": "drawer",
  "dropdown-menu": "dropdown-menu",
  "footer": "footer",
  "header": "header",
  "hover-card": "hover-card",
  "icon-button": "icon-button",
  "input": "input",
  "input-otp": "input-otp",
  "label": "label",
  "language-selector": "language-selector",
  "left-navigation": "left-navigation",
  "link": "link",
  "menubar": "menubar",
  "page-container": "page-container",
  "pagination": "pagination",
  "popover": "popover",
  "progress": "progress",
  "radio-group": "radio-group",
  "resizable": "resizable",
  "scroll-area": "scroll-area",
  "select": "select",
  "separator": "separator",
  "shell": "shell",
  "sheet": "sheet",
  "sidebar": "sidebar",
  "side-toolbar": "side-toolbar",
  "skeleton": "skeleton",
  "slider": "slider",
  "sonner": "sonner",
  "stepper": "stepper",
  "switch": "switch",
  "table": "table",
  "tabs": "tabs",
  "textarea": "textarea",
  "theme": "theme",
  "toast": "toast",
  "toaster": "toast",  // toaster imports from toast
  "toggle": "toggle",
  "toggle-group": "button-group",
  "tooltip": "tooltip",
  "top-navigation": "top-navigation",
  "user-menu": "user-menu",
  "widget": "widget",
  "dashboard-grid": "dashboard-grid",
  "brd-highcharts": "brd-highcharts",
  "use-mobile": "sidebar",  // hook used by sidebar
  "use-toast": "toast",  // hook used by toast
  "app-starter": "app-starter",
}

// Extract component dependencies from file content by parsing imports
function extractComponentDependencies(content: string): string[] {
  const deps: Set<string> = new Set()

  // Match imports from @/components/ui/xxx
  const importRegex = /from\s+['"]@\/components\/ui\/([^'"]+)['"]/g
  let match
  while ((match = importRegex.exec(content)) !== null) {
    const componentName = match[1]
    if (COMPONENT_NAME_MAP[componentName]) {
      deps.add(COMPONENT_NAME_MAP[componentName])
    }
  }

  // Match imports from @/hooks/xxx (for things like use-toast)
  const hookRegex = /from\s+['"]@\/hooks\/([^'"]+)['"]/g
  while ((match = hookRegex.exec(content)) !== null) {
    const hookName = match[1]
    if (COMPONENT_NAME_MAP[hookName]) {
      deps.add(COMPONENT_NAME_MAP[hookName])
    }
  }

  return Array.from(deps)
}

// Extract metadata from all modules - updated to include all components
const modules = [
  { name: "accordion", module: accordionModule },
  { name: "alert", module: alertModule },
  { name: "alert-dialog", module: alertDialogModule },
  { name: "aspect-ratio", module: aspectRatioModule },
  { name: "avatar", module: avatarModule },
  { name: "badge", module: badgeModule },
  { name: "breadcrumb", module: breadcrumbModule },
  { name: "button", module: buttonModule },
  { name: "button-group", module: buttonGroupModule },
  { name: "calendar", module: calendarModule },
  { name: "card", module: cardModule },
  { name: "carousel", module: carouselModule },
  { name: "chart", module: chartModule },
  { name: "chip", module: chipModule },
  { name: "checkbox", module: checkboxModule },
  { name: "collapsible", module: collapsibleModule },
  { name: "command", module: commandModule },
  { name: "context-menu", module: contextMenuModule },
  { name: "currency-selector", module: currencySelectorModule },
  { name: "data-point-card", module: dataPointCardModule },
  { name: "dialog", module: dialogModule },
  { name: "drawer", module: drawerModule },
  { name: "dropdown-menu", module: dropdownMenuModule },
  { name: "footer", module: footerModule },
  { name: "header", module: headerModule },
  { name: "hover-card", module: hoverCardModule },
  { name: "icon-button", module: iconButtonModule },
  { name: "input", module: inputModule },
  { name: "input-otp", module: inputOtpModule },
  { name: "label", module: labelModule },
  { name: "language-selector", module: languageSelectorModule },
  { name: "left-navigation", module: leftNavigationModule },
  { name: "link", module: linkModule },
  { name: "menubar", module: menubarModule },
  { name: "page-container", module: pageContainerModule },
  { name: "pagination", module: paginationModule },
  { name: "popover", module: popoverModule },
  { name: "progress", module: progressModule },
  { name: "radio-group", module: radioGroupModule },
  { name: "resizable", module: resizableModule },
  { name: "scroll-area", module: scrollAreaModule },
  { name: "select", module: selectModule },
  { name: "separator", module: separatorModule },
  { name: "shell", module: shellModule },
  { name: "sheet", module: sheetModule },
  { name: "side-toolbar", module: sideToolbarModule },
  { name: "skeleton", module: skeletonModule },
  { name: "slider", module: sliderModule },
  { name: "sonner", module: sonnerModule },
  { name: "stepper", module: stepperModule },
  { name: "switch", module: switchModule },
  { name: "table", module: tableModule },
  { name: "tabs", module: tabsModule },
  { name: "textarea", module: textareaModule },
  { name: "theme", module: themeModule },
  { name: "toast", module: toastModule },
  { name: "toggle", module: toggleModule },
  { name: "tooltip", module: tooltipModule },
  { name: "top-navigation", module: topNavigationModule },
  { name: "user-menu", module: userMenuModule },
  { name: "widget", module: widgetModule },
  { name: "dashboard-grid", module: dashboardGridModule },
  { name: "brd-highcharts", module: brdHighchartsModule },
  { name: "app-starter", module: appStarterModule },
]

function getFileBasePath(fileType: string) {
  if (fileType === "registry:ui" || fileType === "registry:block") {
    return "components"
  }

  if (fileType === "registry:lib") {
    return "lib"
  }

  if (fileType === "registry:hook") {
    return "hooks"
  }

  if (fileType === "registry:style") {
    return "app"
  }

  if (fileType === "registry:page") {
    return "v0"
  }

  throw new Error(`Unknown file type: ${fileType}`)
}

function getOutputPath(file: { path: string; type: string; target?: string }) {
  if (file.type === "registry:lib") {
    return file.target ?? `lib/${file.path}`
  }

  if (file.type === "registry:hook") {
    return file.path
  }

  if (file.type === "registry:style") {
    return file.target ?? `app/${file.path}`
  }

  if (file.type === "registry:page") {
    return file.target ?? `app/${file.path}`
  }

  return `components/${file.path}`
}

function buildDefaultRegistryDependencies(name: string, componentDeps: Set<string>) {
  return [
    `${REGISTRY_URL}/r/theme.json`,
    ...Array.from(componentDeps).map((dep) => `${REGISTRY_URL}/r/${COMPONENT_PREFIX}${dep}.json`),
  ]
}

function buildAppStarterDependencies(registryItems: Array<{ name: string; type: string }>) {
  const dependencySet = new Set<string>([
    `${REGISTRY_URL}/r/theme.json`,
    `${REGISTRY_URL}/r/${COMPONENT_PREFIX}shell.json`,
  ])

  for (const item of registryItems) {
    if (item.name === `${COMPONENT_PREFIX}app-starter`) {
      continue
    }

    if (item.name === "all-components") {
      continue
    }

    if (item.type === "registry:ui" || item.type === "registry:hook") {
      dependencySet.add(`${REGISTRY_URL}/r/${item.name}.json`)
    }
  }

  dependencySet.add(`${REGISTRY_URL}/r/${COMPONENT_PREFIX}widget.json`)

  return Array.from(dependencySet)
}

// Build main registry data matching shadcn schema (plain array format like https://ui.shadcn.com/r/index.json)
const registryItems = modules.map(({ name, module }) => {
  const meta = module.meta

  console.log(`Processing ${name}:`, {
    name: meta?.name,
    title: meta?.title,
    description: meta?.description,
    type: meta?.type,
    dependencies: meta?.dependencies,
    files: meta?.files,
  })

  // Collect all component dependencies from file contents
  const componentDeps: Set<string> = new Set()

  // Read file content from filesystem if files are specified in meta
  const files = meta?.files?.map((file: any) => {
    let content = ""

    try {
      const basePath = getFileBasePath(file.type || meta?.type)

      // Read the actual file content from the filesystem
      const filePath = join(process.cwd(), basePath, file.path)
      content = readFileSync(filePath, "utf-8")
      console.log(`Successfully read content for ${file.path} (${content.length} characters)`)

      // Extract component dependencies from this file
      const deps = extractComponentDependencies(content)
      deps.forEach(dep => {
        // Don't add self as dependency
        if (dep !== name) {
          componentDeps.add(dep)
        }
      })
    } catch (error) {
      // Throw error if file not found
      throw new Error(`File not found: ${file.path}. Error: ${error}`)
    }

    const outputPath = getOutputPath(file)

    return {
      path: outputPath,
      type: file.type || "registry:ui",
      target: file.target,
      content: content, // Add the actual file content here
    }
  }) || [
    {
      path: `components/ui/${name}.tsx`,
      type: "registry:ui",
      content: `// Default placeholder content for ${name}`,
    },
  ]

  // Add prefix to component name to prevent v0 from using built-in shadcn components
  const prefixedName = `${COMPONENT_PREFIX}${name}`

  // Build registryDependencies: theme + any component dependencies found in imports
  const registryDependencies = buildDefaultRegistryDependencies(name, componentDeps)

  if (componentDeps.size > 0) {
    console.log(`  Component dependencies for ${name}:`, Array.from(componentDeps))
  }

  return {
    name: prefixedName,
    type: meta?.type || "registry:ui",
    title: meta?.title || name,
    description: meta?.description || "",
    dependencies: meta?.dependencies || [],
    categories: meta?.categories || [],
    meta: meta?.meta || undefined,
    registryDependencies,
    files: files,
  }
})

const allRegistryDependencies = [
  `${REGISTRY_URL}/r/theme.json`,
  ...registryItems.map((item) => `${REGISTRY_URL}/r/${item.name}.json`),
]

const widgetItem = registryItems.find(
  (item) => item.name === `${COMPONENT_PREFIX}widget`
)
if (widgetItem) {
  widgetItem.registryDependencies = allRegistryDependencies.filter(
    (item) =>
      !item.endsWith(`/${COMPONENT_PREFIX}widget.json`) &&
      !item.endsWith(`/${COMPONENT_PREFIX}app-starter.json`)
  )
}

const appStarterItem = registryItems.find(
  (item) => item.name === `${COMPONENT_PREFIX}app-starter`
)
if (appStarterItem) {
  appStarterItem.registryDependencies = buildAppStarterDependencies(registryItems)
}

console.log("Registry Data Summary:", {
  totalComponents: registryItems.length,
})

// Write registry files to public directory for static serving
function writeRegistryFiles() {
  try {
    // Ensure output directory exists
    if (!existsSync(OUTPUT_DIR)) {
      mkdirSync(OUTPUT_DIR, { recursive: true })
    }

    // Write main registry index as a plain array (matching https://ui.shadcn.com/r/index.json format)
    // This format is used by shadcn CLI
    writeFileSync(
      join(OUTPUT_DIR, "index.json"),
      JSON.stringify(registryItems, null, 2)
    )
    console.log("Main registry written to public/r/index.json")

    // Write registry.json in object format (matching Vercel registry-starter format)
    // This format is required by v0.dev "Open in v0" button and MCP
    const registryObject = {
      $schema: "https://ui.shadcn.com/schema/registry.json",
      name: "BRD Component Registry",
      type: "registry:ui",
      homepage: "https://shad-brd-registery.vercel.app",
      items: registryItems,
    }
    writeFileSync(
      join(OUTPUT_DIR, "registry.json"),
      JSON.stringify(registryObject, null, 2)
    )
    console.log("Registry object written to public/r/registry.json (for v0.dev)")

    // Generate theme.json with globals.css content
    const themeMeta = themeModule.meta
    const globalsPath = join(process.cwd(), "app", "globals.css")
    const globalsContent = readFileSync(globalsPath, "utf-8")

    const themeItem = {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      name: "theme",
      type: "registry:theme",
      title: themeMeta?.title || "BRD Theme",
      description: themeMeta?.description || "BRD Design System theme with Figma design tokens",
      files: [
        {
          path: "app/globals.css",
          type: "registry:style",
          target: "app/globals.css",
          content: globalsContent
        }
      ]
    }

    writeFileSync(
      join(OUTPUT_DIR, "theme.json"),
      JSON.stringify(themeItem, null, 2)
    )
    console.log("Theme written to public/r/theme.json")

    // Write individual registry items
    for (const item of registryItems) {
      const individualItem = {
        $schema: "https://ui.shadcn.com/schema/registry-item.json",
        ...item,
      }

      writeFileSync(
        join(OUTPUT_DIR, `${item.name}.json`),
        JSON.stringify(individualItem, null, 2)
      )
      console.log(`Individual item ${item.name} written to public/r/${item.name}.json`)
    }

    // Create "all-components" block that references all components via registryDependencies
    // This allows v0 to open all components at once, similar to registry-starter's "dashboard" block
    const allComponentsBlock = {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      name: "all-components",
      type: "registry:block",
      title: "All BRD Components",
      description: "A complete collection of all BRD design system components. Open this in v0 to get access to all styled components.",
      registryDependencies: [
        `${REGISTRY_URL}/r/theme.json`,  // Theme first so CSS variables are available
        ...registryItems
          .filter((item) => item.name !== `${COMPONENT_PREFIX}app-starter`)
          .map(item => `${REGISTRY_URL}/r/${item.name}.json`)
      ],
      files: []
    }

    writeFileSync(
      join(OUTPUT_DIR, "all-components.json"),
      JSON.stringify(allComponentsBlock, null, 2)
    )
    console.log("All-components block written to public/r/all-components.json")

    console.log("Registry build complete!")
  } catch (error) {
    console.error("Failed to write registry files:", error)
    throw error
  }
}

// Execute the build
writeRegistryFiles()
