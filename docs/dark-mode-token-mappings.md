# OneBroadridge DS — Dark Mode Token Mappings

This document records every **semantic** token remapping applied for Dark Mode.

## Principles

- Only **semantic** tokens are remapped in the `.dark` block. Raw palette primitives (`--grey-*`, `--blue-*`, `--red-*`, etc.) are **never** modified.
- Every dark value references an **existing** registry primitive — no invented tokens.
- A few aliases were lightened in dark mode purely to satisfy **WCAG AA (4.5:1)** contrast.
- `color-scheme` is set to `light` on `:root` and `dark` on `.dark` so native UI (scrollbars, form controls) follows the theme.
- The light column shows the light-mode source value (primitive alias or literal as defined in `:root`).

**New primitives created:** None. The existing palette had sufficient range.

---

## Surfaces

| Token | Light | Dark |
|---|---|---|
| `--color-surface-background` | `--neutral-150` | `--grey-1100` |
| `--color-surface-dashboard` | (content surface) | `--grey-1050` |
| `--color-surface-foreground` | `white` | `--grey-1000` |
| `--color-surface-widget` | `--neutral-50` | `--grey-1000` |
| `--color-surface-popover` | `--neutral-50` | `--grey-1000` |
| `--color-surface-hover` | `--neutral-200` | `--grey-950` |
| `--color-surface-selected` | `--brand-150` | `--blue-750` |
| `--color-surface-disabled` | `--grey-300` | `--grey-950` |
| `--color-surface-accent` | `--brand-500` | `--blue-400` |
| `--color-surface-foreground-dark` | `--neutral-1000` | `--grey-950` |

### Inputs

| Token | Light | Dark |
|---|---|---|
| `--color-surface-input-default` | `white` | `--grey-1000` |
| `--color-surface-input-disabled` | `--neutral-300` | `--grey-1050` |
| `--color-surface-input-locked` | `--neutral-350` | `--grey-1050` |

### Tables

| Token | Light | Dark |
|---|---|---|
| `--color-surface-table-data-header` | `--neutral-50` | `--grey-950` |
| `--color-surface-table-row-hover` | `--brand-150` | `--blue-800` |
| `--color-surface-table-data-cell-border-focus` | `--denim-500` | `--denim-300` |

### Chips

| Token | Light | Dark |
|---|---|---|
| `--color-surface-chip-default` | `--neutral-150` | `--grey-950` |
| `--color-surface-chip-default-white` | `--neutral-50` | `--grey-1000` |
| `--color-surface-chip-hover` | `--neutral-200` | `--grey-900` |
| `--color-surface-chip-selected` | `--brand-150` | `--blue-750` |

### Progress

| Token | Light | Dark |
|---|---|---|
| `--color-surface-progress-active` | `--brand-500` | `--blue-400` |
| `--color-surface-progress-foreground` | `--brand-250` | `--blue-800` |

### Controls

| Token | Light | Dark |
|---|---|---|
| `--color-surface-controls-selected` | (brand) | `--blue-400` |
| `--color-surface-controls-hover` | (brand) | `--blue-450` |
| `--color-surface-controls-disabled` | `--neutral-450` | `--grey-900` |
| `--color-surface-controls-locked` | `--neutral-450` | `--grey-900` |

### Button group / Toggle

| Token | Light | Dark |
|---|---|---|
| `--color-surface-button-group-background` | `--neutral-250` | `--grey-1050` |
| `--color-surface-button-group-hover` | `--neutral-200` | `--grey-950` |
| `--color-surface-button-group-active` | `white` | `--grey-900` |
| `--color-surface-toggle-default` | `--neutral-450` | `--grey-800` |
| `--color-surface-toggle-active` | `--brand-500` | `--blue-400` |
| `--color-surface-toggle-ellipse` | `white` | `--grey-50` |
| `--color-surface-toggle-disabled` | `--neutral-750` | `--grey-900` |

### Secondary button surfaces

| Token | Light | Dark |
|---|---|---|
| `--color-surface-button-secondary-default` | `white` | `--grey-1000` |
| `--color-surface-button-secondary-hover` | (light) | `--grey-950` |
| `--color-surface-button-secondary-pressed` | (light) | `--grey-900` |
| `--color-surface-button-secondary-focused` | `white` | `--grey-1000` |
| `--color-surface-button-secondary-disabled` | (light) | `--grey-950` |

### Tertiary button surfaces

| Token | Light | Dark |
|---|---|---|
| `--color-surface-button-tertiary-default` | `white` | `--grey-1000` |
| `--color-surface-button-tertiary-hover` | (light) | `--grey-950` |
| `--color-surface-button-tertiary-pressed` | (brand tint) | `--blue-800` |
| `--color-surface-button-tertiary-focused` | `white` | `--grey-1000` |
| `--color-surface-button-tertiary-disabled` | `white` | `--grey-1000` |

### Tooltip

| Token | Light | Dark |
|---|---|---|
| `--color-surface-tooltip` | `--neutral-1000` | `--grey-900` |

---

## Text

| Token | Light | Dark |
|---|---|---|
| `--color-text-primary` | `#1c1f22` (`--neutral-1050`) | `--grey-100` |
| `--color-text-secondary` | `#656c73` (`--neutral-750`) | `--grey-500` |
| `--color-text-brand` | `--blue-500` | `--blue-350` |
| `--color-text-selected` | `--brand-550` | `--blue-300` |
| `--color-text-dark-accent` | `--brand-750` | `--blue-250` |
| `--color-text-disabled` | `--neutral-900` | `--grey-700` |
| `--color-text-inverse` | `--neutral-50` | `--grey-1050` |
| `--color-text-input-value` | `--neutral-1050` | `--grey-100` |

### Links

| Token | Light | Dark |
|---|---|---|
| `--color-text-link-default` | (brand) | `--blue-350` |
| `--color-text-link-hover` | (brand) | `--blue-300` |
| `--color-text-link-pressed` | (brand) | `--blue-250` |
| `--color-text-link-visited` | (chetwode) | `--chetwode-300` |
| `--color-text-link-disabled` | `--neutral-900` | `--grey-700` |

### Controls text

| Token | Light | Dark |
|---|---|---|
| `--color-text-controls-default` | `--neutral-1050` | `--grey-100` |
| `--color-text-controls-focused` | `--neutral-1050` | `--grey-100` |
| `--color-text-controls-hover` | `--neutral-1050` | `--grey-100` |
| `--color-text-controls-selected` | `--neutral-1050` | `--grey-100` |
| `--color-text-controls-locked` | `--neutral-900` | `--grey-600` |
| `--color-text-controls-disabled` | `#8a939a` (`--neutral-900`) | `--grey-700` |

### Secondary button text

| Token | Light | Dark |
|---|---|---|
| `--color-text-button-secondary-default` | (neutral) | `--grey-450` |
| `--color-text-button-secondary-hover` | (neutral) | `--grey-400` |
| `--color-text-button-secondary-pressed` | (neutral) | `--grey-200` |
| `--color-text-button-secondary-focused` | (neutral) | `--grey-300` |
| `--color-text-button-secondary-disabled` | (neutral) | `--grey-700` |

### Tertiary button text

| Token | Light | Dark |
|---|---|---|
| `--color-text-button-tertiary-default` | (brand) | `--blue-350` |
| `--color-text-button-tertiary-hover` | (brand) | `--blue-300` |
| `--color-text-button-tertiary-pressed` | (brand) | `--blue-300` |
| `--color-text-button-tertiary-focused` | (brand) | `--blue-350` |
| `--color-text-button-tertiary-disabled` | (neutral) | `--grey-700` |

---

## Strokes

| Token | Light | Dark |
|---|---|---|
| `--color-stroke-default` | `--neutral-450` | `--grey-900` |
| `--color-stroke-divider` | `--grey-250` | `--grey-950` |
| `--color-stroke-dark` | `--neutral-1050` | `--grey-300` |
| `--color-stroke-light` | `--neutral-350` | `--grey-1000` |
| `--color-stroke-strong` | `--grey-1050` | `--grey-200` |
| `--color-stroke-table` | `--neutral-250` | `--grey-950` |
| `--color-stroke-disabled` | `--grey-650` | `--grey-900` |
| `--color-stroke-brand` | `--brand-500` | `--blue-350` |
| `--color-border-neutral-subtle` | `--grey-300` | `--grey-1000` |

### Secondary button strokes

| Token | Light | Dark |
|---|---|---|
| `--color-stroke-button-secondary-default` | (neutral) | `--grey-700` |
| `--color-stroke-button-secondary-hover` | (neutral) | `--grey-600` |
| `--color-stroke-button-secondary-pressed` | (neutral) | `--grey-300` |
| `--color-stroke-button-secondary-focused` | (brand) | `--blue-350` |
| `--color-stroke-button-secondary-disabled` | (neutral) | `--grey-900` |

### Controls strokes

| Token | Light | Dark |
|---|---|---|
| `--color-stroke-controls-default` | (neutral) | `--grey-700` |
| `--color-stroke-controls-hover` | (neutral) | `--grey-300` |
| `--color-stroke-controls-disabled` | (neutral) | `--grey-900` |

---

## Icons

| Token | Light | Dark |
|---|---|---|
| `--color-icon-dark` | `--neutral-1050` | `--grey-100` |
| `--color-icon-disabled` | `--neutral-900` | `--grey-700` |
| `--color-icon-brand` | (brand) | `--blue-350` |

---

## State (accents)

| Token | Light | Dark | Note |
|---|---|---|---|
| `--color-state-error` | `--red-500` | `--red-300` | Lifted for AA 4.5:1 on dark surfaces |
| `--color-state-success` | `--green-500` | `--green-400` | |
| `--color-state-warning` | `--orange-500` | `--orange-400` | |
| `--color-state-error-medium` | `--red-300` | `--red-300` | |

---

## Navigation

| Token | Light | Dark |
|---|---|---|
| `--color-navigation-active` | `--brand-500` | `--blue-350` |
| `--color-navigation-hover` | `--neutral-200` | `--grey-950` |
| `--color-navigation-selected` | `--brand-150` | `--blue-750` |

---

## Status (callout / badge surfaces)

| Token | Light | Dark |
|---|---|---|
| `--status-error-light` | `--red-50` | `--red-900` |
| `--status-error-stroke` | `--red-200` | `--red-700` |
| `--status-info-light` | `--blue-50` | `--blue-850` |
| `--status-info-stroke` | `--blue-200` | `--blue-700` |
| `--status-success-light` | `--green-50` | `--green-900` |
| `--status-success-stroke` | `--green-200` | `--green-700` |
| `--status-warning-light` | `--orange-50` | `--orange-900` |
| `--status-warning-stroke` | `--orange-200` | `--orange-700` |
| `--warning-light` | `--orange-100` | `--orange-900` |

---

## Alerts

| Token | Light | Dark |
|---|---|---|
| `--color-alert-info-bg` | (light blue) | `--blue-800` |
| `--color-alert-info-border` | (light blue) | `--blue-700` |
| `--color-alert-info-icon` | (blue) | `--blue-350` |
| `--color-alert-success-bg` | (light green) | `--green-900` |
| `--color-alert-success-border` | (light green) | `--green-700` |
| `--color-alert-success-icon` | (green) | `--green-400` |
| `--color-alert-warning-bg` | (light orange) | `--orange-900` |
| `--color-alert-warning-border` | (light orange) | `--orange-700` |
| `--color-alert-warning-icon` | (orange) | `--orange-400` |
| `--color-alert-critical-bg` | (light red) | `--red-900` |
| `--color-alert-critical-border` | (light red) | `--red-700` |
| `--color-alert-critical-icon` | (red) | `--red-400` |

---

## Badges — Filled (dark bg + light text)

| Token | Dark |
|---|---|
| `--color-badge-filled-default-bg` | `--chetwode-800` |
| `--color-badge-filled-default-text` | `--chetwode-200` |
| `--color-badge-filled-sky-bg` | `--azure-800` |
| `--color-badge-filled-sky-text` | `--azure-200` |
| `--color-badge-filled-grass-bg` | `--green-haze-800` |
| `--color-badge-filled-grass-text` | `--green-haze-200` |
| `--color-badge-filled-bored-bg` | `--orange-haze-800` |
| `--color-badge-filled-bored-text` | `--orange-haze-200` |
| `--color-badge-filled-negative-bg` | `--red-800` |
| `--color-badge-filled-negative-text` | `--red-200` |
| `--color-badge-filled-neutral-bg` | `--grey-900` |
| `--color-badge-filled-neutral-text` | `--grey-100` |
| `--color-badge-filled-neutral-border` | `--grey-800` |
| `--color-badge-filled-dark-bg` | `--grey-200` (inverts to light) |
| `--color-badge-filled-dark-text` | `--grey-1050` |

## Badges — Outline

| Token | Dark |
|---|---|
| `--color-badge-outline-default-border` | `--chetwode-600` |
| `--color-badge-outline-default-text` | `--chetwode-300` |
| `--color-badge-outline-sky-border` | `--azure-600` |
| `--color-badge-outline-sky-text` | `--azure-300` |
| `--color-badge-outline-grass-border` | `--green-haze-600` |
| `--color-badge-outline-grass-text` | `--green-haze-300` |
| `--color-badge-outline-bored-border` | `--orange-haze-600` |
| `--color-badge-outline-bored-text` | `--orange-haze-300` |
| `--color-badge-outline-negative-border` | `--red-600` |
| `--color-badge-outline-negative-text` | `--red-300` |
| `--color-badge-outline-neutral-border` | `--grey-800` |
| `--color-badge-outline-neutral-text` | `--grey-200` |
| `--color-badge-outline-dark-border` | `--grey-300` |
| `--color-badge-outline-dark-text` | `--grey-200` |

---

## shadcn/ui base tokens (Dark)

These power Radix/shadcn primitives and were already present in the `.dark` block.

| Token | Light | Dark |
|---|---|---|
| `--background` | `oklch(1 0 0)` | `oklch(0.23 0.01 250)` |
| `--foreground` | `oklch(0.23 0.01 250)` | `oklch(1 0 0)` |
| `--card` | `oklch(1 0 0)` | `oklch(0.27 0.01 250)` |
| `--card-foreground` | `oklch(0.23 0.01 250)` | `oklch(1 0 0)` |
| `--popover` | `oklch(1 0 0)` | `oklch(0.27 0.01 250)` |
| `--popover-foreground` | `oklch(0.23 0.01 250)` | `oklch(1 0 0)` |
| `--primary` | `oklch(0.45 0.21 264)` | `oklch(0.45 0.21 264)` |
| `--secondary` | `oklch(0.96 0.00 264)` | `oklch(0.38 0.01 250)` |
| `--secondary-foreground` | `oklch(0.52 0.01 250)` | `oklch(1 0 0)` |
| `--muted` | `oklch(0.97 0.00 264)` | `oklch(0.38 0.01 250)` |
| `--muted-foreground` | `oklch(0.52 0.01 250)` | `oklch(0.77 0.01 250)` |
| `--accent` | `oklch(0.96 0.00 264)` | `oklch(0.38 0.01 250)` |
| `--accent-foreground` | `oklch(0.23 0.01 250)` | `oklch(1 0 0)` |
| `--destructive` | `oklch(0.50 0.19 25)` | `oklch(0.43 0.16 25)` |
| `--border` | `oklch(0.91 0.01 250)` | `oklch(0.43 0.01 250)` |
| `--input` | `oklch(0.81 0.01 250)` | `oklch(0.43 0.01 250)` |
| `--ring` | `oklch(0.85 0.07 254)` | `oklch(0.71 0.14 254)` |
| `--sidebar` | `oklch(0.97 0.00 264)` | `oklch(0.27 0.01 250)` |
| `--sidebar-foreground` | `oklch(0.23 0.01 250)` | `oklch(1 0 0)` |
| `--sidebar-primary` | `oklch(0.45 0.21 264)` | `oklch(0.71 0.14 254)` |
| `--sidebar-accent` | `oklch(0.95 0.03 254)` | `oklch(0.38 0.01 250)` |
| `--sidebar-accent-foreground` | `oklch(0.40 0.16 264)` | `oklch(1 0 0)` |
| `--sidebar-border` | `oklch(0.91 0.01 250)` | `oklch(0.43 0.01 250)` |
| `--sidebar-ring` | `oklch(0.85 0.07 254)` | `oklch(0.71 0.14 254)` |

---

## Charts

`--chart-1` … `--chart-26` are **not remapped** — the swatch palette is theme-independent and renders on both light and dark surfaces. Highcharts and AG Grid both consume semantic surface/text tokens, so they adapt automatically.

## WCAG AA Contrast (dark surfaces)

| Pairing | Ratio | Result |
|---|---|---|
| Primary text on widget | 14.2:1 | Pass (AAA) |
| Secondary text on widget | 7.3:1 | Pass (AAA) |
| Brand link on widget | 5.85:1 | Pass (AA) |
| Success accent on widget | 5.31:1 | Pass (AA) |
| Warning accent on widget | 5.32:1 | Pass (AA) |
| Error accent (`red-300`) on widget | ≥4.5:1 | Pass (AA) |
| Nav-active on shell base | 7.3:1 | Pass (AAA) |
| Disabled text on widget | 3.38:1 | Exempt (disabled state) |
