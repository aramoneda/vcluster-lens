import type { ShellDensity } from "@/components/ui/shell"
import { shellPresets, type ShellPreset, type ShellId } from "@/lib/shells/shell-presets"

export type { ShellId } from "@/lib/shells/shell-presets"

export type ShellStatus = "active" | "inactive"

export interface ShellRegistryEntry {
  /** Stable id, also the route segment, preset key, and skill folder stem. */
  id: ShellId | "proxy"
  /** Human label shown in UI / docs. */
  label: string
  /** The user persona this shell serves. */
  persona: string
  /**
   * `active` shells are eligible for router auto-selection. `inactive` shells
   * ship in code but require the user to explicitly opt in. Activation is a
   * one-field flip here — the single source of truth.
   */
  status: ShellStatus
  /** Default content density for the shell. */
  density: ShellDensity
  /** Short description used in docs and the router decision matrix. */
  description: string
  /** Keywords / signals that map a prompt to this shell (router matrix). */
  keywords: string[]
  /** Skill folder name under v0_memories/user/skills/. */
  skill: string
  /** Default ShellProps for this shell (undefined for placeholders like proxy). */
  preset?: ShellPreset
}

/**
 * SHELL REGISTRY — single source of truth for the persona shell family.
 *
 * Adding a new shell = add one entry here (+ a preset, a wrapper component, and
 * a skill). Activating a shell = flip its `status` to "active". The router skill
 * only auto-selects shells whose status is "active".
 */
export const shellRegistry: ShellRegistryEntry[] = [
  {
    id: "financial-advisor",
    label: "Financial Advisor",
    persona: "Financial advisor / wealth manager",
    status: "active",
    density: "comfortable",
    description:
      "Standard BRD frame for advisor dashboards: portfolios, holdings, performance, planning. The baseline shell and current default.",
    keywords: [
      "advisor",
      "financial advisor",
      "wealth",
      "portfolio",
      "holdings",
      "performance",
      "planning",
      "client review",
      "dashboard",
      "kpi",
    ],
    skill: "financial-advisor-shell",
    preset: shellPresets["financial-advisor"],
  },
  {
    id: "trader",
    label: "Trader",
    persona: "Trader / trading desk power user",
    status: "active",
    density: "compact",
    description:
      "High-density frame for trading: blotters, order tickets, dense tables, watchlists, small components. Compact density by default.",
    keywords: [
      "trader",
      "trading",
      "blotter",
      "order",
      "ticket",
      "execution",
      "watchlist",
      "positions",
      "dense",
      "high density",
      "market data",
      "quotes",
    ],
    skill: "trader-shell",
    preset: shellPresets.trader,
  },
  {
    id: "ops",
    label: "Ops",
    persona: "Operations power user",
    status: "inactive",
    density: "compact",
    description:
      "Power-user frame for operations: exception queues, reconciliation, bulk actions, monitoring. Compact density with quick-tool toolbar.",
    keywords: [
      "ops",
      "operations",
      "exception",
      "exceptions",
      "reconciliation",
      "recon",
      "bulk",
      "queue",
      "monitoring",
      "settlement",
      "back office",
      "workflow queue",
    ],
    skill: "ops-shell",
    preset: shellPresets.ops,
  },
  {
    id: "client",
    label: "Client",
    persona: "End client / investor",
    status: "inactive",
    density: "comfortable",
    description:
      "Client-centric frame for portals: account summaries, statements, documents, self-service. Comfortable, approachable density.",
    keywords: [
      "client",
      "client portal",
      "investor",
      "statements",
      "self-service",
      "account summary",
      "documents",
      "client-facing",
      "portal",
    ],
    skill: "client-shell",
    preset: shellPresets.client,
  },
  {
    id: "onboarding",
    label: "Onboarding",
    persona: "New user / account onboarding",
    status: "inactive",
    density: "comfortable",
    description:
      "Focused frame for guided flows and wizards: KYC, account opening, setup. Also embeddable as the OnboardingFlow region inside another shell.",
    keywords: [
      "onboarding",
      "onboard",
      "kyc",
      "wizard",
      "stepper",
      "account opening",
      "setup flow",
      "guided flow",
      "sign up",
      "enrollment",
    ],
    skill: "onboarding-shell",
    preset: shellPresets.onboarding,
  },
  {
    id: "proxy",
    label: "Proxy",
    persona: "Proxy / governance (future paradigm)",
    status: "inactive",
    density: "comfortable",
    description:
      "Placeholder for a future, fundamentally different product paradigm (proxy voting / governance). Documented path only — no wrapper implemented yet.",
    keywords: ["proxy", "governance", "voting", "ballot", "meetings", "resolutions"],
    skill: "proxy-shell",
    // No preset/wrapper this pass — registry placeholder for scalability.
  },
]

const byId = new Map(shellRegistry.map((entry) => [entry.id, entry]))

/** Look up a shell entry by id. */
export function getShell(id: string): ShellRegistryEntry | undefined {
  return byId.get(id as ShellRegistryEntry["id"])
}

/** All shells eligible for router auto-selection. */
export function getActiveShells(): ShellRegistryEntry[] {
  return shellRegistry.filter((entry) => entry.status === "active")
}

/** All shells that have a usable preset+wrapper (excludes pure placeholders). */
export function getImplementedShells(): ShellRegistryEntry[] {
  return shellRegistry.filter((entry) => entry.preset !== undefined)
}

/** The default shell the router falls back to when no signal matches. */
export function getDefaultShell(): ShellRegistryEntry {
  return getShell("financial-advisor") ?? shellRegistry[0]
}

/**
 * Lightweight prompt → shell resolver mirroring the router-skill decision
 * matrix. Scores active shells by keyword hits and returns the best match, or
 * the default shell when nothing scores. (The skill remains the source of truth
 * for v0's reasoning; this is a runtime convenience for app code/tests.)
 */
export function resolveShellFromPrompt(prompt: string): ShellRegistryEntry {
  const text = prompt.toLowerCase()
  let best: ShellRegistryEntry | undefined
  let bestScore = 0
  for (const entry of getActiveShells()) {
    const score = entry.keywords.reduce(
      (acc, kw) => (text.includes(kw.toLowerCase()) ? acc + 1 : acc),
      0,
    )
    if (score > bestScore) {
      bestScore = score
      best = entry
    }
  }
  return best ?? getDefaultShell()
}

export type { ShellPreset }
export type { ShellId as ShellPresetId }
