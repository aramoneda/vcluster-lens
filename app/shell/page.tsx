import { ComponentPageLayout } from "@/components/component-page-layout"
import { registryMetadata } from "@/lib/registry-metadata"

export const dynamic = "force-dynamic"

export const meta = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "shell",
  type: "registry:block",
  title: "Shell",
  description:
    "Composed application shell with header, navigation layers, page container, and footer.",
  ...registryMetadata["shell"],
  files: [
    {
      path: "ui/shell.tsx",
      type: "registry:block",
    },
  ],
  dependencies: [],
  registryDependencies: [
    "footer",
    "header",
    "left-navigation",
    "page-container",
    "side-toolbar",
    "top-navigation",
  ],
}

export default function ShellPage() {
  return (
    <ComponentPageLayout
      meta={meta}
      headerActions={(
        <a
          href="/shell/demo"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md border border-[var(--color-stroke-default)] px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] transition-colors"
        >
          Open in new tab
        </a>
      )}
      title="Shell"
      description="Combine header, navigation, and page containers into a full layout shell."
    >
      <div className="rounded-md border border-[var(--color-stroke-default)] bg-[var(--color-surface-foreground)] p-4 text-sm text-[var(--color-text-secondary)]">
        For generating a new view in v0, start from <a href="/app-starter" className="font-medium text-[var(--color-icon-brand)] hover:underline">App Starter</a>. Use Shell directly when you need the layout primitive on its own.
      </div>
    </ComponentPageLayout>
  )
}
