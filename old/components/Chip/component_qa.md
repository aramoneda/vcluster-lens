# QA Review: Chip Component

**Date:** 2025-08-05
**Reviewer:** Roo

## 1. Overview

This document outlines the Quality Assurance (QA) review for the `Chip` React component. The review process involved analyzing the component's source code ([`Chip.tsx`](src/components/Chip/Chip.tsx:1)), CSS module ([`Chip.module.css`](src/components/Chip/Chip.module.css:1)), Storybook stories ([`Chip.stories.tsx`](src/components/Chip/Chip.stories.tsx:1)), and cross-referencing them against the Figma JSON specification ([`figma-jsons/done/chip.json`](figma-jsons/done/chip.json:1)) and the development guidelines ([`ai_rules.md`](ai_rules.md:1)).

## 2. Analysis of `Chip.tsx`

Filename: [`src/components/Chip/Chip.tsx`](src/components/Chip/Chip.tsx:1)

### 2.1. Radix Primitives Usage
*   **Base Element:** The component correctly uses [`Primitive.button`](src/components/Chip/Chip.tsx:84) from `@radix-ui/react-primitive` as its base. This is appropriate as the chip can be interactive (clickable, selectable) and dismissible, aligning with Rule II.1 of [`ai_rules.md`](ai_rules.md:75) for interactive components.
*   **`asChild` Prop:** The component does not explicitly implement the `asChild` prop. While [`Primitive.button`](src/components/Chip/Chip.tsx:84) supports it, it's not exposed. Rule II.4 of [`ai_rules.md`](ai_rules.md:94) states `asChild` should be implemented consistently.
*   **Ref Forwarding:** Correctly uses [`React.forwardRef`](src/components/Chip/Chip.tsx:56) and types the ref for `HTMLButtonElement`.

### 2.2. Prop Definitions (`ChipProps`)
*   **Interface:** [`ChipProps`](src/components/Chip/Chip.tsx:11) extends `React.ButtonHTMLAttributes<HTMLButtonElement>`.
*   **`label`:** ([`ChipProps.label`](src/components/Chip/Chip.tsx:15)) - Optional `string` for chip content. Default value "Chip Label" is provided ([`Chip.tsx L59`](src/components/Chip/Chip.tsx:59)).
*   **`removable`:** ([`ChipProps.removable`](src/components/Chip/Chip.tsx:20)) - Optional `boolean`, defaults to `true` ([`Chip.tsx L60`](src/components/Chip/Chip.tsx:60)). Controls visibility of the remove button.
*   **`onRemove`:** ([`ChipProps.onRemove`](src/components/Chip/Chip.tsx:24)) - Optional callback for remove button click. Event propagation is correctly stopped ([`Chip.tsx L75`](src/components/Chip/Chip.tsx:75)).
*   **`showIcon`:** ([`ChipProps.showIcon`](src/components/Chip/Chip.tsx:29)) - Optional `boolean`, defaults to `true` ([`Chip.tsx L62`](src/components/Chip/Chip.tsx:62)). Controls visibility of the leading icon.
*   **`leadingIcon`:** ([`ChipProps.leadingIcon`](src/components/Chip/Chip.tsx:33)) - Optional `ReactNode` for the icon.
*   **`size`:** ([`ChipProps.size`](src/components/Chip/Chip.tsx:38)) - Optional `ChipSize` ('default' | 'small'), defaults to 'default' ([`Chip.tsx L64`](src/components/Chip/Chip.tsx:64)).
*   **`color`:** ([`ChipProps.color`](src/components/Chip/Chip.tsx:43)) - Optional `ChipColor` ('grey' | 'white'), defaults to 'grey' ([`Chip.tsx L65`](src/components/Chip/Chip.tsx:65)).
*   **`selected`:** ([`ChipProps.selected`](src/components/Chip/Chip.tsx:48)) - Optional `boolean`, defaults to `false` ([`Chip.tsx L66`](src/components/Chip/Chip.tsx:66)).
*   **`disabled`:** ([`ChipProps.disabled`](src/components/Chip/Chip.tsx:53)) - Optional `boolean`, defaults to `false` ([`Chip.tsx L67`](src/components/Chip/Chip.tsx:67)).
*   **`className`:** Standard prop for additional classes.
*   **`...rest`:** Props are correctly spread to the [`Primitive.button`](src/components/Chip/Chip.tsx:102).
*   **Defaults:** Default prop values align with Figma JSON defaults (e.g., `label`, `removable`, `showIcon`, `size`, `color`).

### 2.3. Accessibility
*   **`aria-pressed`:** Correctly set to `selected` state ([`Chip.tsx L98`](src/components/Chip/Chip.tsx:98)) for selectable chips.
*   **`disabled` attribute:** Passed to the [`Primitive.button`](src/components/Chip/Chip.tsx:97).
*   **`data-disabled`:** Set to `''` when `disabled` is true, `undefined` otherwise ([`Chip.tsx L99`](src/components/Chip/Chip.tsx:99)), as per Radix conventions and [`ai_rules.md`](ai_rules.md:51).
*   **`data-state`:** Set to `'on'` or `'off'` based on `selected` prop ([`Chip.tsx L100`](src/components/Chip/Chip.tsx:100]), aligning with Radix conventions for toggle states.
*   **Remove Button:** Uses an `IconButton` component which should handle its own accessibility. The `aria-label` for the remove button is dynamically generated ([`Chip.tsx L118`](src/components/Chip/Chip.tsx:118)).
*   **Type:** Explicitly `type="button"` is set on [`Primitive.button`](src/components/Chip/Chip.tsx:86).

### 2.4. Internal Structure & Logic
*   **Leading Icon:** Rendered conditionally based on `showIcon` and `leadingIcon` presence, wrapped in a `<span>` with class [`styles.leadingIcon`](src/components/Chip/Chip.tsx:105).
*   **Label:** Rendered conditionally if `label` is provided, wrapped in spans with classes [`styles.textContainer`](src/components/Chip/Chip.tsx:108) and [`styles.label`](src/components/Chip/Chip.tsx:109).
*   **Remove Button:** Uses `IconButton` component.
    *   Size mapping: `size={size === 'small' ? 'XS' : 'S'}` ([`Chip.tsx L114`](src/components/Chip/Chip.tsx:114)) - this seems correct based on typical IconButton sizing.
    *   Color: `color="Blue"` ([`Chip.tsx L115`](src/components/Chip/Chip.tsx:115)) - this should be verified against Figma JSON for the icon button *within* the chip.
    *   Icon: `XIcon` from `lucide-react` with explicit size 16px ([`Chip.tsx L123`](src/components/Chip/Chip.tsx:123)).
    *   `tooltipContent` prop is passed to `IconButton` ([`Chip.tsx L119`](src/components/Chip/Chip.tsx:119)).
*   **Interactivity:** `isInteractive` flag ([`Chip.tsx L81`](src/components/Chip/Chip.tsx:81)) correctly determines if chip has `onClick` or `selected` prop, used to apply [`styles.interactive`](src/components/Chip/Chip.tsx:93).
*   **`clsx`:** Used for dynamic class names ([`Chip.tsx L87`](src/components/Chip/Chip.tsx:87)).
*   **`displayName`:** Set to `'Chip'` ([`Chip.tsx L131`](src/components/Chip/Chip.tsx:131)).

### 2.5. Adherence to `ai_rules.md` (for `.tsx`)
*   **Rule I.4 (React Best Practices):**
    *   Prop destructuring and defaults: Yes ([`Chip.tsx L58-L70`](src/components/Chip/Chip.tsx:58)).
    *   TypeScript typing: Yes, `ChipProps` is defined ([`Chip.tsx L11`](src/components/Chip/Chip.tsx:11)).
    *   Composition and prop spreading: Yes ([`Chip.tsx L102`](src/components/Chip/Chip.tsx:102)).
    *   Conditional rendering: Yes ([`Chip.tsx L104`](src/components/Chip/Chip.tsx:104), [`Chip.tsx L107`](src/components/Chip/Chip.tsx:107), [`Chip.tsx L112`](src/components/Chip/Chip.tsx:112)).
    *   No unnecessary state: Yes.
*   **Rule III.1 (File Naming):** Yes.
*   **Rule III.2 (Props):** Mostly yes. `asChild` is missing.
*   **Rule III.3 (forwardRef):** Yes ([`Chip.tsx L56`](src/components/Chip/Chip.tsx:56)).
*   **Rule III.4 (displayName):** Yes ([`Chip.tsx L131`](src/components/Chip/Chip.tsx:131)).
*   **Rule III.5 (clsx):** Yes ([`Chip.tsx L87`](src/components/Chip/Chip.tsx:87)).
*   **Rule III.7 (Accessibility Attributes):** Yes, `aria-pressed`, `disabled`, `data-disabled`, `data-state` are used.

## 3. Analysis of `Chip.module.css`

Filename: [`src/components/Chip/Chip.module.css`](src/components/Chip/Chip.module.css:1)

### 3.1. Token Usage
*   Global tokens are imported: [`figma-color-tokens.css`](globalTokens/figma-color-tokens.css:1), [`figma-numeric-tokens.css`](globalTokens/figma-numeric-tokens.css:1), [`figma-typography-tokens.css`](globalTokens/figma-typography-tokens.css:1) ([`Chip.module.css L1-L3`](src/components/Chip/Chip.module.css:1)).
*   Tokens are used for colors, spacing, typography, border-radius, etc., as per Figma JSON references in comments.

### 3.2. Base Styles (`.chip`)
*   Basic layout: `display: inline-flex`, `align-items`, `justify-content`, `box-sizing` ([`Chip.module.css L6-L10`](src/components/Chip/Chip.module.css:6)).
*   `border: 1px solid transparent` (default, overridden by variants) ([`Chip.module.css L11`](src/components/Chip/Chip.module.css:11)).
*   `cursor: default` (overridden by `.interactive`) ([`Chip.module.css L12`](src/components/Chip/Chip.module.css:12)).
*   `gap: var(--spacing-sp-2)` (default, adjusted for small size) ([`Chip.module.css L15`](src/components/Chip/Chip.module.css:15)).
*   `transition` properties are defined ([`Chip.module.css L16`](src/components/Chip/Chip.module.css:16)).
*   `border-radius: var(--radius-s)` (from Figma JSON `layout.cornerRadius`) ([`Chip.module.css L17`](src/components/Chip/Chip.module.css:17)).
*   `padding-left` and `padding-right`: `var(--spacing-sp-4)` (from Figma JSON `layout.padding`) ([`Chip.module.css L42-L43`](src/components/Chip/Chip.module.css:42)). The comments indicate careful consideration of how this interacts with `textContainer` padding.

### 3.3. Variant Styles
*   **Size (`.default`, `.small`):**
    *   `.default`: `height: 32px`, typography tokens for Body/Medium/SemiBold ([`Chip.module.css L52-L58`](src/components/Chip/Chip.module.css:52)).
    *   `.small`: `height: 24px`, `gap: var(--spacing-sp-1)`, typography tokens for Body/Small/SemiBold ([`Chip.module.css L62-L69`](src/components/Chip/Chip.module.css:62)).
*   **Color (`.grey`, `.white`):**
    *   `.grey`: `background-color: var(--color-surface-chip-default)`, `border-color: var(--color-stroke-light)`, `color: var(--color-text-dark-accent)` ([`Chip.module.css L74-L78`](src/components/Chip/Chip.module.css:74)).
    *   `.white`: `background-color: var(--color-surface-chip-default-white)`, `border-color: var(--color-stroke-light)`, `color: var(--color-text-dark-accent)` ([`Chip.module.css L81-L85`](src/components/Chip/Chip.module.css:81)).

### 3.4. State Styling
*   **Interactive (`.interactive`):** Sets `cursor: pointer` ([`Chip.module.css L46`](src/components/Chip/Chip.module.css:46)).
*   **Hover/Focus-Visible (for `.grey` and `.white`):**
    *   Selectors: `.chip.grey:not([data-disabled]):not([aria-disabled='true']):hover`, `.chip.grey:not([data-disabled]):not([aria-disabled='true']):focus-visible` (and similar for `.white`) ([`Chip.module.css L89-L90`](src/components/Chip/Chip.module.css:89), [`Chip.module.css L97-L98`](src/components/Chip/Chip.module.css:97)).
    *   Styles: `background-color: var(--color-surface-chip-hover)`, `border-color: var(--brand-400)` ([`Chip.module.css L91-L92`](src/components/Chip/Chip.module.css:91), [`Chip.module.css L99-L100`](src/components/Chip/Chip.module.css:99)). Text color remains unchanged as per Figma.
*   **Selected (`.selected`, `[data-state='on']`):**
    *   Selectors: `.chip.selected:not([data-disabled]):not([aria-disabled='true'])`, `.chip[data-state='on']:not([data-disabled]):not([aria-disabled='true'])` ([`Chip.module.css L106-L107`](src/components/Chip/Chip.module.css:106)).
    *   Styles: `background-color: var(--color-surface-chip-selected)`, `border-color: var(--color-stroke-brand)`, `color: var(--color-text-selected)` ([`Chip.module.css L108-L110`](src/components/Chip/Chip.module.css:108)).
    *   Border weight for selected:
        *   Default size: `border-width: var(--border-width-200)` ([`Chip.module.css L113-L116`](src/components/Chip/Chip.module.css:113)).
        *   Small size: `border-width: var(--border-width-100)` ([`Chip.module.css L125-L128`](src/components/Chip/Chip.module.css:125)). This difference is noted and seems to align with Figma JSON.
*   **Focus Visible (General):**
    *   `.chip:focus-visible:not([data-disabled]):not([aria-disabled='true'])` provides a generic focus ring ([`Chip.module.css L133-L136`](src/components/Chip/Chip.module.css:133)). This might overlap or be overridden by the variant-specific focus-visible styles if they are more specific. The Figma JSON mentions a `.focus_ring_component` which is not directly implemented here as a separate element, but the outline serves a similar purpose.
*   **Disabled (`[data-disabled]`, `[aria-disabled='true']`):**
    *   Selectors: `.chip[data-disabled]`, `.chip[aria-disabled='true']` ([`Chip.module.css L141-L142`](src/components/Chip/Chip.module.css:141)).
    *   Styles: `cursor: not-allowed`, `opacity: 0.6`, `background-color: var(--color-surface-disabled)`, `border-color: var(--color-stroke-disabled)`, `color: var(--color-text-disabled)` ([`Chip.module.css L143-L152`](src/components/Chip/Chip.module.css:143)). Comments note that Figma JSON doesn't explicitly define disabled colors for Chip, so generic disabled tokens are used.
    *   Disabled icon color: `color: var(--color-icon-disabled)` for `.leadingIcon` and `.removeIcon` (though `.removeIcon` is legacy) ([`Chip.module.css L155-L160`](src/components/Chip/Chip.module.css:155)).

### 3.5. Internal Element Styling
*   **`.leadingIcon`:** `display: flex`, `align-items`, `justify-content`, `color: inherit` ([`Chip.module.css L164-L169`](src/components/Chip/Chip.module.css:164)).
    *   Selected state icon color: `.chip.selected:not([data-disabled]):not([aria-disabled='true']) .leadingIcon` sets `color: var(--color-icon-selected)` ([`Chip.module.css L199-L202`](src/components/Chip/Chip.module.css:199)).
*   **`.textContainer`:** `padding-left: var(--spacing-sp-4)`, `padding-right: var(--spacing-sp-4)`, `display: inline-flex`, `align-items: center` ([`Chip.module.css L178-L182`](src/components/Chip/Chip.module.css:178)). These paddings are from Figma JSON `structure.children[...].children (text-container).boundVariables`.
*   **`.label`:** `white-space: nowrap`, `overflow: hidden`, `text-overflow: ellipsis` ([`Chip.module.css L186-L189`](src/components/Chip/Chip.module.css:186)).
*   **Remove Button:** Comments indicate styles for `.removeButton` and `.removeIcon` are removed as `IconButton` is used ([`Chip.module.css L192`](src/components/Chip/Chip.module.css:192)).

### 3.6. Adherence to `ai_rules.md` (for `.css`)
*   **Rule I.5 (CSS Purity):** Yes, uses pseudo-classes and `data-*` attributes.
*   **Rule IV.1 (Token Imports):** Yes ([`Chip.module.css L1-L3`](src/components/Chip/Chip.module.css:1)).
*   **Rule IV.2 (Target Radix Parts):** Not directly applicable as `Chip` uses `Primitive.button`, not a multi-part Radix component like Switch or Checkbox. Styling is applied to the main `.chip` class and its variants.
*   **Rule IV.3 (Base Styles):** Yes, applied to `.chip`.
*   **Rule IV.4 (Variant Styles):** Yes, distinct classes for size and color.
*   **Rule IV.5 (States):** Yes, uses `:hover`, `:focus-visible`, `[data-disabled]`, `[aria-disabled='true']`, `[data-state='on']`.
*   **Rule IV.6 (Internal Parts Styling):** Yes, `.leadingIcon`, `.textContainer`, `.label` are styled.
*   **Rule IV.7 (NO `!important`):** No `!important` found.
*   **Rule IV.8 (Comments):** Yes, comments trace styles to Figma JSON.

## 4. Analysis of `Chip.stories.tsx`

Filename: [`src/components/Chip/Chip.stories.tsx`](src/components/Chip/Chip.stories.tsx:1)

### 4.1. Story Coverage
*   **Default:** `Default` story with `label: 'Default Chip'` ([`Chip.stories.tsx L54`](src/components/Chip/Chip.stories.tsx:54)).
*   **Size Variants:** `SmallSize` ([`Chip.stories.tsx L60`](src/components/Chip/Chip.stories.tsx:60)).
*   **Color Variants:** `WhiteColor` ([`Chip.stories.tsx L67`](src/components/Chip/Chip.stories.tsx:67)).
*   **Selected State:** `Selected`, `SelectedWhite`, `SmallSelected`, `SmallSelectedWhite` ([`Chip.stories.tsx L74-L87`](src/components/Chip/Chip.stories.tsx:74), [`Chip.stories.tsx L119-L134`](src/components/Chip/Chip.stories.tsx:119)).
*   **Disabled State:** `Disabled`, `SmallDisabled` ([`Chip.stories.tsx L90-L95`](src/components/Chip/Chip.stories.tsx:90), [`Chip.stories.tsx L136-L142`](src/components/Chip/Chip.stories.tsx:136)).
*   **Removable Prop:** `NotRemovable`, `SmallNotRemovable` ([`Chip.stories.tsx L97-L102`](src/components/Chip/Chip.stories.tsx:97), [`Chip.stories.tsx L144-L150`](src/components/Chip/Chip.stories.tsx:144)).
*   **Icon Prop:** `NoIcon`, `CustomIcon` (with `AlertCircleIcon`), `SmallNoIcon` ([`Chip.stories.tsx L104-L117`](src/components/Chip/Chip.stories.tsx:104), [`Chip.stories.tsx L152-L158`](src/components/Chip/Chip.stories.tsx:152)). Default leading icon is `StarIcon`.
*   **Interactive States:**
    *   `InteractiveChip` and `InteractiveSelectedChip` demonstrate `onClick` behavior ([`Chip.stories.tsx L160-L176`](src/components/Chip/Chip.stories.tsx:160)).
    *   `HoverFocusStates` story is provided to allow manual testing of hover/focus ([`Chip.stories.tsx L181`](src/components/Chip/Chip.stories.tsx:181)).
*   **Complex Example:** `FilterChipGroup` demonstrates a set of interactive chips with state management for selection and removal ([`Chip.stories.tsx L196-L258`](src/components/Chip/Chip.stories.tsx:196)).

### 4.2. Args and Controls
*   `meta.argTypes` correctly defines controls for props like `label`, `removable`, `size`, `color`, `selected`, `disabled` ([`Chip.stories.tsx L11-L28`](src/components/Chip/Chip.stories.tsx:11)).
*   `meta.args` provides default arguments for stories ([`Chip.stories.tsx L29-L38`](src/components/Chip/Chip.stories.tsx:29)).
*   `leadingIcon` control is `object`, which is not ideal for Storybook UI but acceptable. Icons are typically passed as JSX.
*   Actions are logged for `onRemove` and `onClick`.

### 4.3. Adherence to `ai_rules.md` (for `.stories.tsx`)
*   **Rule V.1 (Default Story):** Yes ([`Chip.stories.tsx L54`](src/components/Chip/Chip.stories.tsx:54)).
*   **Rule V.2 (Variant Combinations):** Yes, good coverage of size, color, selected, disabled, removable, icon presence.
*   **Rule V.3 (State Demonstrations):** Yes, for `disabled` and `selected` (which is a prop-controlled state).
*   **Rule V.4 (Content Configurations):** Yes, stories for no icon, custom icon.
*   **Rule V.5 (Controls):** Yes ([`Chip.stories.tsx L11`](src/components/Chip/Chip.stories.tsx:11)).
*   **Rule V.6 (Interactive States):** Yes, hover/focus are not set by props. The `HoverFocusStates` story correctly notes these are for user interaction. `selected` is a prop, so stories setting it are fine.

## 5. Figma JSON Cross-Reference Summary ([`figma-jsons/done/chip.json`](figma-jsons/done/chip.json:1))

### 5.1. Properties Mapping
*   **`Show Icon#30509:0` (boolean, default true):** Maps to `showIcon` prop.
*   **`Show Focus#30495:0` (boolean, default false):** This seems to relate to an explicit focus ring component instance in Figma (`.Focus_Ring`). The CSS implements a standard `outline` for `:focus-visible` ([`Chip.module.css L133`](src/components/Chip/Chip.module.css:133)). The component itself doesn't have a `showFocus` prop; focus is handled by browser behavior and CSS.
*   **`Label#31398:0` (text, default "Chip Label"):** Maps to `label` prop.
*   **`Removable#31398:1` (boolean, default true):** Maps to `removable` prop.
*   **`Size` (variant: "Default", "Small"):** Maps to `size` prop.
*   **`State` (variant: "Default", "Hover", "Selected"):**
    *   "Default": Base styles.
    *   "Hover": Mapped to `:hover` and `:focus-visible` CSS pseudo-classes.
    *   "Selected": Mapped to `selected` prop and `[data-state='on']` / `.selected` CSS class.
*   **`Color` (variant: "Grey", "White"):** Maps to `color` prop.

### 5.2. Layout and Styling
*   **`layout.cornerRadius` (`--radius-s`):** Applied via `border-radius: var(--radius-s)` in [`.chip`](src/components/Chip/Chip.module.css:17).
*   **`layout.padding` (`--spacing-sp-4`):** Applied as `padding-left` and `padding-right` on [`.chip`](src/components/Chip/Chip.module.css:42-43).
*   **Variant Layouts (height, strokeWidth):**
    *   `height`: Correctly applied for `Size=Default` (32px) and `Size=Small` (24px) in [`.default`](src/components/Chip/Chip.module.css:53) and [`.small`](src/components/Chip/Chip.module.css:63).
    *   `strokeWeight`:
        *   Default/Hover states use `border: 1px solid ...` (implicitly `var(--border-width-100)` if tokens are 1px).
        *   Selected state for `Size=Default`: `border-width: var(--border-width-200)` (JSON `strokeWeight: --border-width-200`). Correctly applied in [`.chip.default.selected`](src/components/Chip/Chip.module.css:115).
        *   Selected state for `Size=Small`: `border-width: var(--border-width-100)` (JSON `strokeWeight: --border-width-100`). Correctly applied in [`.chip.small.selected`](src/components/Chip/Chip.module.css:127).
*   **Variant Colors (background, border, text):**
    *   Colors for `Default`, `Hover`, `Selected` states for both `Grey` and `White` variants are generally mapped correctly using the specified tokens in [`Chip.module.css`](src/components/Chip/Chip.module.css:1) (e.g., `--color-surface-chip-default`, `--color-surface-chip-hover`, `--color-surface-chip-selected`, `--color-stroke-light`, `--brand-400`, `--color-stroke-brand`, `--color-text-dark-accent`, `--color-text-selected`).
*   **Typography:**
    *   Mapped from `typography` section of JSON to corresponding size classes (`.default`, `.small`) in [`Chip.module.css`](src/components/Chip/Chip.module.css:1) (e.g., `font-family`, `font-size`, `font-weight`, `line-height`).
*   **Internal Structure (from `structure` in JSON):**
    *   `Icons/star` (leading icon): Handled by `leadingIcon` prop.
    *   `text-container`: Mapped to [`.textContainer`](src/components/Chip/Chip.module.css:178) class with its own padding (`--spacing-sp-4` left/right) as per JSON `boundVariables`.
    *   `Icon Button` (remove button): Implemented using the `IconButton` component.
        *   Figma JSON for `Size=Default, State=Default, Color=Grey` specifies `Icon Button` variant `State=Default, Size=S, Color=Blue` ([`chip.json L92`](figma-jsons/done/chip.json:92)). Component uses `size='S'` ([`Chip.tsx L114`](src/components/Chip/Chip.tsx:114)) and `color="Blue"` ([`Chip.tsx L115`](src/components/Chip/Chip.tsx:115)).
        *   Figma JSON for `Size=Small, State=Default, Color=Grey` specifies `Icon Button` variant `State=Default, Size=XS, Color=Blue` ([`chip.json L166`](figma-jsons/done/chip.json:166)). Component uses `size='XS'` ([`Chip.tsx L114`](src/components/Chip/Chip.tsx:114)) and `color="Blue"` ([`Chip.tsx L115`](src/components/Chip/Chip.tsx:115)). This seems consistent.
*   **Disabled State:** Figma JSON does not explicitly define a "Disabled" state variant with specific colors. The implementation uses generic disabled tokens ([`Chip.module.css L149-L152`](src/components/Chip/Chip.module.css:149)), which is a reasonable approach in the absence of specific design specs for this state.

### 5.3. Discrepancies/Notes
*   **`Show Focus` Property:** As noted, this Figma property seems tied to a specific focus ring component instance in Figma, not directly translated as a prop. CSS `:focus-visible` is used instead.
*   **Icon Color in Selected State:** The CSS ([`Chip.module.css L199-L202`](src/components/Chip/Chip.module.css:199)) sets `.leadingIcon` color to `var(--color-icon-selected)` when the chip is selected. The Figma JSON for selected states (e.g., `Size=Default, State=Selected, Color=Grey`) shows the `text-container_name_name_fill0` (text color) as `var(--color-text-selected)`. It does not explicitly list a separate color for the leading icon in the selected state's `colors` block. If the icon should inherit the text color, `color: inherit` would suffice, or the `var(--color-text-selected)` could be used directly. Using `var(--color-icon-selected)` implies a specific token for selected icons, which should be verified if it exists and is intended here. If `var(--color-icon-selected)` is the same as `var(--color-text-selected)`, then it's fine.

## 6. `ai_rules.md` Adherence Check Summary

*   **I.1 Figma JSON as Source of Truth:** Generally well-adhered to for styling, props, and variants.
*   **I.2 Accessibility First (Leverage Radix):** Good. Uses [`Primitive.button`](src/components/Chip/Chip.tsx:84), `data-state`, `data-disabled`, `aria-pressed`.
*   **I.3 Maximum Styling Control with Your Tokens:** Yes, global tokens are used via CSS Modules.
*   **I.4 Clean, Maintainable, Idiomatic React:** Mostly yes. Prop destructuring, defaults, typing, conditional rendering are good.
*   **I.5 CSS Purity:** Yes, relies on pseudo-classes and `data-*` attributes.
*   **II.1 Appropriate Radix Primitives:** Yes, [`Primitive.button`](src/components/Chip/Chip.tsx:84) is suitable.
*   **II.2 Leverage Radix Parts and `data-state`:** Yes, `data-state` and `data-disabled` are used for styling.
*   **II.4 Polymorphism with `asChild`:** Missing. The `asChild` prop is not implemented.
*   **III. React Component Implementation:** Mostly followed. `asChild` prop missing.
*   **IV. CSS Modules Implementation:** Well-adhered to. Tokens imported, variants and states styled correctly.
*   **V. Storybook Stories:** Good coverage and adherence to rules for interactive state demonstration.

## 7. Conclusion and Recommendations

The `Chip` component is well-implemented and largely adheres to the Figma JSON specification and the `ai_rules.md` guidelines. It demonstrates good use of Radix Primitives for accessibility and state management, and proper use of CSS Modules with global design tokens for styling. Storybook coverage is comprehensive.

**Recommendations:**

1.  **Implement `asChild` Prop:** Add the `asChild?: boolean` prop to [`ChipProps`](src/components/Chip/Chip.tsx:11) and use `@radix-ui/react-slot` (or `Primitive.Slot`) to allow consumers to change the underlying rendered element, as per Rule II.4 of [`ai_rules.md`](ai_rules.md:94).
    ```tsx
    // In Chip.tsx
    import { Slot } from '@radix-ui/react-slot';
    // ...
    // export interface ChipProps ... {
    //   asChild?: boolean;
    // }
    // ...
    // const Comp = asChild ? Slot : Primitive.button;
    // return <Comp ... >
    ```
2.  **Verify Icon Color in Selected State:** Clarify if the leading icon in the selected state should use `var(--color-icon-selected)` or inherit the text color (`var(--color-text-selected)`). Adjust [`Chip.module.css L201`](src/components/Chip/Chip.module.css:201) if necessary. If `var(--color-icon-selected)` is indeed the correct distinct token, ensure it's defined and intended. // Comment - We dont have --color-icon-selected token. Check JSON
3.  **Figma's `Show Focus` Property:** Document or clarify the purpose of Figma's "Show Focus" property if it's intended to have a behavior beyond the standard browser/CSS `:focus-visible` handling. Currently, it's not used as a prop.

Overall, the component is in good shape. The recommendations are minor and aim for full adherence and clarity.