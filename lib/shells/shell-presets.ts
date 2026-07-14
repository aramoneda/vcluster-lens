import type { ShellProps, ShellDensity } from "@/components/ui/shell"

/**
 * A ShellPreset is a set of default `ShellProps` for a persona shell. Wrappers
 * deep-merge these defaults with caller-provided props. Presets only reference
 * BRD semantic tokens (no hard-coded colors), so dark mode works automatically.
 *
 * Presets intentionally do NOT define navigation/content items — those are
 * screen-specific and supplied by the consumer. They set chrome defaults
 * (density, header/footer behavior) that define the persona's frame.
 */
export type ShellPreset = Partial<ShellProps> & { density: ShellDensity }

const sharedFooter = { copyrightText: "© 2026 BRD" }

/**
 * Financial Advisor — the standard BRD frame. Comfortable density, theme toggle
 * on, top navigation driven. This is the baseline all other shells diverge from.
 */
export const financialAdvisorPreset: ShellPreset = {
  density: "comfortable",
  headerProps: {
    userName: "John Smith",
    userInitials: "JS",
    notificationCount: 2,
    showThemeToggle: true,
  },
  footerProps: sharedFooter,
}

/**
 * Trader — high-density frame for blotters, order tickets, dense tables. Compact
 * density, search enabled for fast symbol lookup, theme toggle on.
 */
export const traderPreset: ShellPreset = {
  density: "compact",
  headerProps: {
    userName: "John Smith",
    userInitials: "JS",
    notificationCount: 2,
    showThemeToggle: true,
  },
  footerProps: sharedFooter,
}

/**
 * Ops — power-user frame for exception queues, bulk actions, monitoring. Compact
 * density with the side toolbar surfaced for quick tools. (Deactivated this pass.)
 */
export const opsPreset: ShellPreset = {
  density: "compact",
  headerProps: {
    userName: "John Smith",
    userInitials: "JS",
    notificationCount: 5,
    showThemeToggle: true,
  },
  footerProps: sharedFooter,
}

/**
 * Client — client-centric, comfortable frame for portals, statements, summaries.
 * Comfortable density, currency selector available. (Deactivated this pass.)
 */
export const clientPreset: ShellPreset = {
  density: "comfortable",
  headerProps: {
    userName: "Jordan Lee",
    userInitials: "JL",
    notificationCount: 1,
    showThemeToggle: true,
  },
  footerProps: sharedFooter,
}

/**
 * Onboarding — focused frame for guided flows / wizards. Comfortable density,
 * minimal chrome so the flow leads. Also exposed as the embeddable
 * `OnboardingFlow` region for composition. (Deactivated this pass.)
 */
export const onboardingPreset: ShellPreset = {
  density: "comfortable",
  headerProps: {
    userName: "John Smith",
    userInitials: "JS",
    showThemeToggle: true,
  },
  footerProps: sharedFooter,
}

export const shellPresets = {
  "financial-advisor": financialAdvisorPreset,
  trader: traderPreset,
  ops: opsPreset,
  client: clientPreset,
  onboarding: onboardingPreset,
} as const

export type ShellId = keyof typeof shellPresets
