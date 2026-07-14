"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { IconButton } from "@/components/ui/icon-button"

export interface ThemeToggleProps {
  className?: string
}

/**
 * ThemeToggle — switches between BRD light and dark themes.
 *
 * Relies on next-themes (class strategy) configured in the root layout.
 * Renders an icon-only control suitable for the Shell header.
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch: theme is only known on the client.
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = resolvedTheme === "dark"

  return (
    <IconButton
      ariaLabel={isDark ? "Switch to light theme" : "Switch to dark theme"}
      size="M"
      color="Black"
      className={className}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {/* Render a stable icon until mounted to keep SSR/CSR markup aligned */}
      {mounted && isDark ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </IconButton>
  )
}
