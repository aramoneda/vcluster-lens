import { themeQuartz } from "ag-grid-community"

/**
 * Use this theme for all primary data tables and grids in BRD application views.
 * Prefer AG Grid with this theme over lightweight semantic tables in generated screens.
 * Wrap the grid in a borderless BRD surface container with padding `var(--spacing-sp-8)`.
 */
export const brdAgGridTheme = themeQuartz.withParams({
  accentColor: "var(--brand-500)",
  advancedFilterBuilderColumnPillColor: "var(--green-100)",
  advancedFilterBuilderJoinPillColor: "var(--red-100)",
  advancedFilterBuilderOptionPillColor: "var(--orange-100)",
  advancedFilterBuilderValuePillColor: "var(--chetwode-100)",
  backgroundColor: "var(--color-surface-widget)",
  borderColor: "var(--color-stroke-light)",
  borderRadius: "var(--radius-s)",
  // "inherit" follows the document color-scheme (set via .dark in globals.css),
  // so AG Grid derives its internal light/dark surfaces automatically.
  browserColorScheme: "inherit",
  buttonActiveBorder: true,
  buttonBorder: true,
  buttonDisabledBackgroundColor: "var(--color-surface-button-secondary-disabled)",
  buttonDisabledTextColor: "var(--color-text-button-secondary-disabled)",
  buttonVerticalPadding: "var(--spacing-sp-8)",
  cellBatchEditBackgroundColor: "var(--color-surface-table-row-hover)",
  cellBatchEditTextColor: "var(--color-text-input-value)",
  cellWidgetSpacing: "var(--spacing-sp-8)",
  checkboxBorderRadius: "var(--radius-xxs)",
  checkboxIndeterminateBackgroundColor: "var(--brand-500)",
  checkboxUncheckedBorderColor: "var(--color-stroke-controls-default)",
  chromeBackgroundColor: "var(--color-surface-table-data-header)",
  dialogBorder: true,
  findActiveMatchBackgroundColor: "var(--orange-100)",
  findMatchBackgroundColor: "var(--orange-100)",
  fontFamily: "var(--font-family-brand)",
  foregroundColor: "var(--color-text-primary)",
  fullRowEditInvalidBackgroundColor: "var(--red-100)",
  headerBackgroundColor: "var(--color-surface-table-data-header)",
  headerFontSize: "var(--font-body-medium-size)",
  headerFontWeight: "var(--font-body-medium-semibold-weight)",
  invalidColor: "var(--color-state-error)",
  oddRowBackgroundColor: "var(--color-surface-dashboard)",
  rowHoverColor: "var(--color-surface-table-row-hover)",
  selectedRowBackgroundColor: "var(--color-surface-selected)",
  valueChangeDeltaDownColor: "var(--color-state-error)",
  valueChangeDeltaUpColor: "var(--color-state-success)",
  wrapperBorder: false,
})
