import type React from "react"

interface LayoutWrapperProps {
  children: React.ReactNode
}

/**
 * LayoutWrapper — intentionally pass-through.
 *
 * The BRD App Starter Shell is the one and only application frame.
 * No registry navigation, sidebar, or chrome is ever injected here.
 * All generated views must be placed inside app/page.tsx within the Shell.
 */
export function LayoutWrapper({ children }: LayoutWrapperProps) {
  return <>{children}</>
}
