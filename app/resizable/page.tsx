import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { ComponentPageLayout } from "@/components/component-page-layout"
import { registryMetadata } from "@/lib/registry-metadata"

// Added dynamic export for force-dynamic rendering
export const dynamic = "force-dynamic"

export const meta = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "resizable",
  type: "registry:ui",
  title: "Resizable",
  description: "Accessible resizable panel groups and layouts with keyboard support.",
  ...registryMetadata["resizable"],
  files: [
    {
      path: "ui/resizable.tsx",
      type: "registry:ui",
    },
  ],
  dependencies: [
    "lucide-react",
    "react-resizable-panels",
  ],
}

function ResizableExample() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Horizontal</h3>
        <ResizablePanelGroup direction="horizontal" className="max-w-md rounded-lg border">
          <ResizablePanel defaultSize={50}>
            <div className="flex h-[200px] items-center justify-center p-6">
              <span className="font-semibold">One</span>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={50}>
            <div className="flex h-[200px] items-center justify-center p-6">
              <span className="font-semibold">Two</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Vertical</h3>
        <ResizablePanelGroup direction="vertical" className="min-h-[200px] max-w-md rounded-lg border">
          <ResizablePanel defaultSize={25}>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Header</span>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={75}>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Content</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Handle</h3>
        <ResizablePanelGroup direction="horizontal" className="min-h-[200px] max-w-md rounded-lg border">
          <ResizablePanel defaultSize={25}>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Sidebar</span>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={75}>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Content</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}

export default function ResizablePage() {
  return (
    <ComponentPageLayout meta={meta}>
      <ResizableExample />
    </ComponentPageLayout>
  )
}
