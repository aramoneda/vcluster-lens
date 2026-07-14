import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ComponentPageLayout } from "@/components/component-page-layout"
import { registryMetadata } from "@/lib/registry-metadata"

// Added dynamic export for force-dynamic rendering
export const dynamic = "force-dynamic"

export const meta = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "tabs",
  type: "registry:ui",
  title: "Tabs",
  description: "A set of layered sections of content—known as tab panels—that are displayed one at a time. Based on old Tabset component.",
  ...registryMetadata["tabs"],
  dependencies: [
    "@radix-ui/react-tabs",
    "class-variance-authority",
  ],
  files: [
    {
      path: "ui/tabs.tsx",
      type: "registry:ui",
    },
  ],
}

export default function TabsPage() {
  return (
    <ComponentPageLayout meta={meta} title="Tabs" description="Based on old Tabset component with title, medium, and small variants.">
      <div className="space-y-12">
        {/* Title Variant (Default) */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Title Variant (Default)</h3>
          <Tabs defaultValue="overview" variant="title">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <div className="text-sm text-muted-foreground">
                Overview content goes here. This tab uses the title variant with larger text.
              </div>
            </TabsContent>
            <TabsContent value="analytics">
              <div className="text-sm text-muted-foreground">
                Analytics dashboard and metrics would be displayed here.
              </div>
            </TabsContent>
            <TabsContent value="reports">
              <div className="text-sm text-muted-foreground">
                Generated reports and downloads available in this section.
              </div>
            </TabsContent>
            <TabsContent value="notifications">
              <div className="text-sm text-muted-foreground">
                Notification preferences and history shown here.
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Medium Variant */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Medium Variant</h3>
          <Tabs defaultValue="profile" variant="medium">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <div className="text-sm text-muted-foreground">
                Profile information and preferences.
              </div>
            </TabsContent>
            <TabsContent value="settings">
              <div className="text-sm text-muted-foreground">
                Application settings and configuration.
              </div>
            </TabsContent>
            <TabsContent value="security">
              <div className="text-sm text-muted-foreground">
                Security settings and two-factor authentication.
              </div>
            </TabsContent>
            <TabsContent value="billing">
              <div className="text-sm text-muted-foreground">
                Billing history and payment methods.
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Small Variant */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Small Variant (No Border)</h3>
          <Tabs defaultValue="all" variant="small">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <div className="text-sm text-muted-foreground">
                All items displayed here.
              </div>
            </TabsContent>
            <TabsContent value="active">
              <div className="text-sm text-muted-foreground">
                Active items only.
              </div>
            </TabsContent>
            <TabsContent value="draft">
              <div className="text-sm text-muted-foreground">
                Draft items pending review.
              </div>
            </TabsContent>
            <TabsContent value="archived">
              <div className="text-sm text-muted-foreground">
                Archived items for reference.
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* With Disabled Tab */}
        <section>
          <h3 className="text-lg font-semibold mb-4">With Disabled Tab</h3>
          <Tabs defaultValue="tab1" variant="medium">
            <TabsList>
              <TabsTrigger value="tab1">Enabled Tab</TabsTrigger>
              <TabsTrigger value="tab2" disabled>Disabled Tab</TabsTrigger>
              <TabsTrigger value="tab3">Another Tab</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1">
              <div className="text-sm text-muted-foreground">
                Content for the first enabled tab.
              </div>
            </TabsContent>
            <TabsContent value="tab2">
              <div className="text-sm text-muted-foreground">
                This content is not accessible because the tab is disabled.
              </div>
            </TabsContent>
            <TabsContent value="tab3">
              <div className="text-sm text-muted-foreground">
                Content for the third tab.
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Size Comparison */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Size Comparison</h3>
          <div className="space-y-8">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Title (h-9, text-lg)</p>
              <Tabs defaultValue="tab1" variant="title">
                <TabsList>
                  <TabsTrigger value="tab1">Tab One</TabsTrigger>
                  <TabsTrigger value="tab2">Tab Two</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Medium (h-8, text-sm)</p>
              <Tabs defaultValue="tab1" variant="medium">
                <TabsList>
                  <TabsTrigger value="tab1">Tab One</TabsTrigger>
                  <TabsTrigger value="tab2">Tab Two</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Small (h-7, text-sm, no border)</p>
              <Tabs defaultValue="tab1" variant="small">
                <TabsList>
                  <TabsTrigger value="tab1">Tab One</TabsTrigger>
                  <TabsTrigger value="tab2">Tab Two</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </section>
      </div>
    </ComponentPageLayout>
  )
}
