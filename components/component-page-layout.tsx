import type React from "react"

interface ComponentFile {
  path: string
  type: string
  target?: string
}

interface ComponentMeta {
  $schema: string
  name: string
  type: string
  title: string
  description: string
  files: ComponentFile[]
  dependencies?: string[]
  categories?: string[]
  meta?: {
    tags?: string[]
    examples?: Array<{
      title: string
      code: string
    }>
  }
  cssVars?: {
    theme?: Record<string, string>
    light?: Record<string, string>
    dark?: Record<string, string>
  }
}

interface ComponentPageLayoutProps {
  meta: ComponentMeta
  children: React.ReactNode
  headerActions?: React.ReactNode
}

const REGISTRY_URL = "https://shad-brd-registery.vercel.app"
const COMPONENT_PREFIX = "brdcomp-"

export function ComponentPageLayout({ meta, children, headerActions }: ComponentPageLayoutProps) {
  const prefixedName = `${COMPONENT_PREFIX}${meta.name}`
  const v0Url = `https://v0.dev/chat/api/open?url=${encodeURIComponent(`${REGISTRY_URL}/r/${prefixedName}.json`)}`

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-4xl font-bold tracking-tight">{meta.title}</h1>
          <div className="flex items-center gap-2">
            {headerActions}
            <a
              href={v0Url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Open in v0
            </a>
          </div>
        </div>
        <p className="text-muted-foreground">{meta.description}</p>
      </div>

      <div className="border rounded-md p-8 bg-background">{children}</div>

      {/* Dependencies Section */}
      {meta.dependencies && meta.dependencies.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">DEPENDENCIES</h2>
          <div className="bg-muted/50 p-4 rounded-md space-y-2">
            <div className="text-sm font-medium text-muted-foreground">NPM</div>
            {meta.dependencies.map((dep, index) => (
              <div key={index} className="font-mono text-sm text-foreground">
                {dep}
              </div>
            ))}
          </div>
        </div>
      )}

      {(meta.categories && meta.categories.length > 0) || (meta.meta?.tags && meta.meta.tags.length > 0) ? (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">TAGS</h2>
          <div className="flex flex-wrap gap-2">
            {(meta.categories || []).map((category) => (
              <span
                key={`category-${category}`}
                className="rounded-full border px-2 py-1 text-xs font-medium text-foreground"
              >
                {category}
              </span>
            ))}
            {(meta.meta?.tags || []).map((tag) => (
              <span
                key={`tag-${tag}`}
                className="rounded-full border px-2 py-1 text-xs font-medium text-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {meta.meta?.examples && meta.meta.examples.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">EXAMPLES</h2>
          <div className="space-y-4">
            {meta.meta.examples.map((example, index) => (
              <div key={index} className="bg-muted/50 rounded-md p-4 space-y-2">
                <div className="text-sm font-medium text-muted-foreground">{example.title}</div>
                <pre className="overflow-x-auto rounded-md bg-background p-3 text-xs text-foreground">
                  <code>{example.code}</code>
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Files Section */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">FILES</h2>
        <div className="bg-muted/50 p-4 rounded-md">
          {meta.files.map((file, index) => (
            <div key={index} className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm text-foreground">{file.path}</span>
              <span className="text-sm text-foreground">{file.type.replace("registry:", "")}</span>
              {file.target ? (
                <span className="text-xs text-muted-foreground">
                  → {file.target}
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
