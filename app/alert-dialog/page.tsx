import { ComponentPageLayout } from "@/components/component-page-layout"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { registryMetadata } from "@/lib/registry-metadata"

export const dynamic = "force-dynamic"

export const meta = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "alert-dialog",
  type: "registry:ui",
  title: "Alert Dialog",
  description: "A modal dialog for confirmations and alerts with sizes xs/sm/md/lg. Based on old Modal styling.",
  ...registryMetadata["alert-dialog"],
  files: [
    {
      path: "ui/alert-dialog.tsx",
      type: "registry:ui",
    },
  ],
  dependencies: [
    "@radix-ui/react-alert-dialog",
    "class-variance-authority",
  ],
  registryDependencies: ["button"],
}

export default function AlertDialogPage() {
  return (
    <ComponentPageLayout meta={meta} title="Alert Dialog" description="Modal dialog for confirmations and alerts with sizes xs/sm/md/lg. Based on old Modal styling.">
      <div className="space-y-12">
        {/* Size XS (Default) */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Size XS (Default)</h3>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">Delete Account</Button>
            </AlertDialogTrigger>
            <AlertDialogContent size="xs">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </section>

        {/* Size SM */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Size SM</h3>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">Confirm Changes</Button>
            </AlertDialogTrigger>
            <AlertDialogContent size="sm">
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm your changes</AlertDialogTitle>
                <AlertDialogDescription>
                  You have made changes to your profile settings. These changes will be applied immediately and may affect your account preferences.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Discard</AlertDialogCancel>
                <AlertDialogAction>Save Changes</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </section>

        {/* Destructive Action */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Destructive Action</h3>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Project</Button>
            </AlertDialogTrigger>
            <AlertDialogContent size="xs">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Project</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this project? All associated data, files, and settings will be permanently removed. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-[var(--color-state-error)] hover:bg-[var(--color-state-error)]/90">
                  Delete Project
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </section>

        {/* Information Alert */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Information Alert</h3>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="secondary">View Terms</Button>
            </AlertDialogTrigger>
            <AlertDialogContent size="sm">
              <AlertDialogHeader>
                <AlertDialogTitle>Terms of Service Updated</AlertDialogTitle>
                <AlertDialogDescription>
                  Our Terms of Service have been updated. Please review the changes to continue using our services. By clicking "I Accept", you agree to the new terms.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Decline</AlertDialogCancel>
                <AlertDialogAction>I Accept</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </section>

        {/* Size Comparison */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Size Comparison</h3>
          <div className="flex gap-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline">XS (500px)</Button>
              </AlertDialogTrigger>
              <AlertDialogContent size="xs">
                <AlertDialogHeader>
                  <AlertDialogTitle>Extra Small Dialog</AlertDialogTitle>
                  <AlertDialogDescription>This is an extra small alert dialog.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>OK</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline">SM (594px)</Button>
              </AlertDialogTrigger>
              <AlertDialogContent size="sm">
                <AlertDialogHeader>
                  <AlertDialogTitle>Small Dialog</AlertDialogTitle>
                  <AlertDialogDescription>This is a small alert dialog with more room for content.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>OK</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline">MD (882px)</Button>
              </AlertDialogTrigger>
              <AlertDialogContent size="md">
                <AlertDialogHeader>
                  <AlertDialogTitle>Medium Dialog</AlertDialogTitle>
                  <AlertDialogDescription>This is a medium alert dialog for more complex confirmations.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>OK</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </section>
      </div>
    </ComponentPageLayout>
  )
}
