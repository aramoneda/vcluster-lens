import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth-context"
import ProtectedLayout from "@/components/protected-layout"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-family-brand",
})

export const metadata: Metadata = {
  title: "vCenter Dashboard",
  description: "Search virtual machines across your vCenter infrastructure",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-[var(--font-family-brand)]`}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <ProtectedLayout>
              <LayoutWrapper>{children}</LayoutWrapper>
            </ProtectedLayout>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
