# QA Review: ButtonGroup & ButtonGroupItem Components

## 1. Overview

This document provides a comprehensive Quality Assurance (QA) review of the `ButtonGroup` and `ButtonGroupItem` React components. The review cross-references the component implementation against the provided Figma JSON specifications ([`buttongroup.json`](figma-jsons/done/buttongroup.json:1) and [`buttongroupitem.json`](figma-jsons/done/buttongroupitem.json:1)) and the guidelines outlined in [`ai_rules.md`](ai_rules.md:1).

## 2. File Analysis

### 2.1. `src/components/ButtonGroup/ButtonGroup.tsx`

*   **Radix UI Usage:**
    *   The component uses [`Primitive.div`](src/components/ButtonGroup/ButtonGroup.tsx:2) as its base, which is appropriate for a grouping container that doesn't inherently require complex Radix primitives like `ToggleGroup` if it's primarily for visual grouping or custom selection logic.
    *   It implements its own selection logic for `single` and `multiple` types ([`ButtonGroup.tsx:61-72`](src/components/ButtonGroup/ButtonGroup.tsx:61)).
*   **Props (`ButtonGroupProps`):**
    *   `size`: `ButtonGroupContextSize` ('S', 'M', 'L'), defaults to 'L'. Correctly defined. ([`ButtonGroup.tsx:7`](src/components/ButtonGroup/ButtonGroup.tsx:7), [`ButtonGroup.tsx:21`](src/components/ButtonGroup/ButtonGroup.tsx:21), [`ButtonGroup.tsx:44`](src/components/ButtonGroup/ButtonGroup.tsx:44))
    *   `children`: `React.ReactNode`, intended for `ButtonGroupItem` instances. Correct. ([`ButtonGroup.tsx:22`](src/components/ButtonGroup/ButtonGroup.tsx:22))
    *   `className`: `string`, optional. Correct. ([`ButtonGroup.tsx:23`](src/components/ButtonGroup/ButtonGroup.tsx:23))
    *   `disabled`: `boolean`, defaults to `false`. Disables all items. Correctly implemented by passing down to children. ([`ButtonGroup.tsx:24`](src/components/ButtonGroup/ButtonGroup.tsx:24), [`ButtonGroup.tsx:45`](src/components/ButtonGroup/ButtonGroup.tsx:45), [`ButtonGroup.tsx:114`](src/components/ButtonGroup/ButtonGroup.tsx:114))
    *   `type`: `ButtonGroupSelectionType` ('single', 'multiple'), defaults to 'single'. Used for selection logic. ([`ButtonGroup.tsx:8`](src/components/ButtonGroup/ButtonGroup.tsx:8), [`ButtonGroup.tsx:27`](src/components/ButtonGroup/ButtonGroup.tsx:27), [`ButtonGroup.tsx:46`](src/components/ButtonGroup/ButtonGroup.tsx:46))
    *   `value`: `string | string[]`, controlled active item(s). ([`ButtonGroup.tsx:29`](src/components/ButtonGroup/ButtonGroup.tsx:29))
    *   `defaultValue`: `string | string[]`, uncontrolled active item(s). ([`ButtonGroup.tsx:31`](src/components/ButtonGroup/ButtonGroup.tsx:31))
    *   `onValueChange`: `(value: string | string[]) => void`, callback for value changes. ([`ButtonGroup.tsx:33`](src/components/ButtonGroup/ButtonGroup.tsx:33))
    *   Props are destructured with defaults. ([`ButtonGroup.tsx:41-51`](src/components/ButtonGroup/ButtonGroup.tsx:41))
    *   `...rest` is spread to `Primitive.div`. ([`ButtonGroup.tsx:108`](src/components/ButtonGroup/ButtonGroup.tsx:108))
*   **Context (`ButtonGroupContext`):**
    *   Provides `size`, `activeValue`, `onItemClick`, and `type` to `ButtonGroupItem` children. This is a good pattern for managing shared state and functionality. ([`ButtonGroup.tsx:10-17`](src/components/ButtonGroup/ButtonGroup.tsx:10), [`ButtonGroup.tsx:96`](src/components/ButtonGroup/ButtonGroup.tsx:96))
*   **Accessibility:**
    *   `role="group"` is applied to the container. ([`ButtonGroup.tsx:106`](src/components/ButtonGroup/ButtonGroup.tsx:106))
    *   `aria-disabled={disabled}` is correctly set. ([`ButtonGroup.tsx:107`](src/components/ButtonGroup/ButtonGroup.tsx:107))
*   **Styling:**
    *   Uses `clsx` for conditional class names. ([`ButtonGroup.tsx:3`](src/components/ButtonGroup/ButtonGroup.tsx:3), [`ButtonGroup.tsx:99-104`](src/components/ButtonGroup/ButtonGroup.tsx:99))
    *   Applies dynamic `gap` style based on `size`. ([`ButtonGroup.tsx:91-93`](src/components/ButtonGroup/ButtonGroup.tsx:91), [`ButtonGroup.tsx:105`](src/components/ButtonGroup/ButtonGroup.tsx:105))
*   **Other:**
    *   `React.forwardRef` is used. ([`ButtonGroup.tsx:36`](src/components/ButtonGroup/ButtonGroup.tsx:36))
    *   `displayName` is set. ([`ButtonGroup.tsx:125`](src/components/ButtonGroup/ButtonGroup.tsx:125))

### 2.2. `src/components/ButtonGroup/ButtonGroupItem.tsx`

*   **Radix UI Usage:**
    *   Uses [`Primitive.button`](src/components/ButtonGroup/ButtonGroupItem.tsx:2) as its base, which is appropriate for interactive button items.
*   **Props (`ButtonGroupItemProps`):**
    *   `children`: `React.ReactNode`. Correct. ([`ButtonGroupItem.tsx:8`](src/components/ButtonGroup/ButtonGroupItem.tsx:8))
    *   `icon`: `React.ReactNode`. Correct. ([`ButtonGroupItem.tsx:9`](src/components/ButtonGroup/ButtonGroupItem.tsx:9))
    *   `iconOnly`: `boolean`, defaults to `false`. Correct. ([`ButtonGroupItem.tsx:10`](src/components/ButtonGroup/ButtonGroupItem.tsx:10))
    *   `className`: `string`, optional. Correct. ([`ButtonGroupItem.tsx:11`](src/components/ButtonGroup/ButtonGroupItem.tsx:11))
    *   `value`: `string`, unique value for selection. Required. Correct. ([`ButtonGroupItem.tsx:13`](src/components/ButtonGroup/ButtonGroupItem.tsx:13))
    *   Props are destructured with defaults. ([`ButtonGroupItem.tsx:19`](src/components/ButtonGroup/ButtonGroupItem.tsx:19))
    *   `...props` (includes `disabled`) is spread to `Primitive.button`. ([`ButtonGroupItem.tsx:83`](src/components/ButtonGroup/ButtonGroupItem.tsx:83))
*   **Context Usage:**
    *   Consumes `ButtonGroupContext` to get `size`, `activeValue`, `onItemClick`, and `groupType`. ([`ButtonGroupItem.tsx:20`](src/components/ButtonGroup/ButtonGroupItem.tsx:20), [`ButtonGroupItem.tsx:32`](src/components/ButtonGroup/ButtonGroupItem.tsx:32))
    *   Includes a console warning if used outside of context, which is good for development. ([`ButtonGroupItem.tsx:21-29`](src/components/ButtonGroup/ButtonGroupItem.tsx:21))
*   **State Handling:**
    *   `isActive` is determined based on `activeValue` from context and the item's `value`. ([`ButtonGroupItem.tsx:37-44`](src/components/ButtonGroup/ButtonGroupItem.tsx:37))
    *   `data-state` is set to 'active' or 'inactive'. ([`ButtonGroupItem.tsx:80`](src/components/ButtonGroup/ButtonGroupItem.tsx:80))
*   **Event Handling:**
    *   `handleClick` calls `onItemClick(value)` from context and any passed `onClick` prop. ([`ButtonGroupItem.tsx:47-53`](src/components/ButtonGroup/ButtonGroupItem.tsx:47))
*   **Accessibility:**
    *   `aria-pressed={isActive}` is correctly set for toggle behavior. ([`ButtonGroupItem.tsx:82`](src/components/ButtonGroup/ButtonGroupItem.tsx:82))
*   **Styling & Content:**
    *   Uses `clsx` for conditional class names. ([`ButtonGroupItem.tsx:3`](src/components/ButtonGroup/ButtonGroupItem.tsx:3), [`ButtonGroupItem.tsx:74-79`](src/components/ButtonGroup/ButtonGroupItem.tsx:74))
    *   Handles rendering of `icon`, `children`, or both, with appropriate wrappers. ([`ButtonGroupItem.tsx:55-69`](src/components/ButtonGroup/ButtonGroupItem.tsx:55))
*   **Other:**
    *   `React.forwardRef` is used. ([`ButtonGroupItem.tsx:16`](src/components/ButtonGroup/ButtonGroupItem.tsx:16))
    *   `displayName` is set. ([`ButtonGroupItem.tsx:90`](src/components/ButtonGroup/ButtonGroupItem.tsx:90))

### 2.3. `src/components/ButtonGroup/ButtonGroup.module.css`

*   **Token Imports:** Correctly imports global token files. ([`ButtonGroup.module.css:2-4`](src/components/ButtonGroup/ButtonGroup.module.css:2))
*   **`.buttonGroupContainer`:**
    *   `display: inline-flex`. Correct. ([`ButtonGroup.module.css:8`](src/components/ButtonGroup/ButtonGroup.module.css:8))
    *   `border-radius`: Uses `var(--radius-s)`. Matches `buttongroup.json` `layout.cornerRadius.token`. ([`ButtonGroup.module.css:11`](src/components/ButtonGroup/ButtonGroup.module.css:11))
    *   `padding`: Uses `var(--spacing-sp-4)`. Matches `buttongroup.json` `layout.padding.token`. ([`ButtonGroup.module.css:14`](src/components/ButtonGroup/ButtonGroup.module.css:14))
    *   `background-color`: Uses `var(--color-surface-button-button-group-background)`. Matches `buttongroup.json` `variants[*].colors.type=text..._fill0.token`. ([`ButtonGroup.module.css:17`](src/components/ButtonGroup/ButtonGroup.module.css:17))
    *   Gap is handled dynamically in `.tsx` file, as noted in comments. ([`ButtonGroup.module.css:18-19`](src/components/ButtonGroup/ButtonGroup.module.css:18))
*   **Group Size Variants (`.groupSizeS`, `.groupSizeM`, `.groupSizeL`):**
    *   Defined but currently empty, as Figma JSON indicates consistent padding and background for all group sizes. This is acceptable as placeholders. ([`ButtonGroup.module.css:25-33`](src/components/ButtonGroup/ButtonGroup.module.css:25))
*   **`.disabled`:**
    *   Defined but empty. The `disabled` state is primarily handled by individual items and `aria-disabled` on the group. ([`ButtonGroup.module.css:35-39`](src/components/ButtonGroup/ButtonGroup.module.css:35))
*   **Comments:** Good comments explaining that item-specific styles are handled in `ButtonGroupItem.module.css`. ([`ButtonGroup.module.css:41-46`](src/components/ButtonGroup/ButtonGroup.module.css:41))

### 2.4. `src/components/ButtonGroup/ButtonGroupItem.module.css`

*   **Token Imports:** Correctly imports global token files. ([`ButtonGroupItem.module.css:2-4`](src/components/ButtonGroup/ButtonGroupItem.module.css:2))
*   **`.buttonGroupItem` (Base Styles):**
    *   `all: unset;`: Good reset for `Primitive.button`. ([`ButtonGroupItem.module.css:7`](src/components/ButtonGroup/ButtonGroupItem.module.css:7))
    *   `display: inline-flex`, `align-items: center`, `justify-content: center`. Correct. ([`ButtonGroupItem.module.css:9-11`](src/components/ButtonGroup/ButtonGroupItem.module.css:9))
    *   `cursor: pointer`. Correct. ([`ButtonGroupItem.module.css:12`](src/components/ButtonGroup/ButtonGroupItem.module.css:12))
    *   `border-radius: var(--radius-xs)`. Matches `buttongroupitem.json` `layout.cornerRadius.token`. ([`ButtonGroupItem.module.css:16`](src/components/ButtonGroup/ButtonGroupItem.module.css:16))
    *   `border: 1px solid transparent;`. Good base for focus state. ([`ButtonGroupItem.module.css:18`](src/components/ButtonGroup/ButtonGroupItem.module.css:18))
    *   `color: var(--color-text-primary)`. Matches `buttongroupitem.json` default text color. ([`ButtonGroupItem.module.css:20`](src/components/ButtonGroup/ButtonGroupItem.module.css:20))
    *   `background-color: transparent;`. Default items are transparent against the group background. ([`ButtonGroupItem.module.css:21`](src/components/ButtonGroup/ButtonGroupItem.module.css:21))
    *   Typography: `font-family`, `text-decoration`, `letter-spacing`. Correct. ([`ButtonGroupItem.module.css:23-25`](src/components/ButtonGroup/ButtonGroupItem.module.css:23))
    *   `transition`: Applied for smooth state changes. ([`ButtonGroupItem.module.css:26`](src/components/ButtonGroup/ButtonGroupItem.module.css:26))
*   **Size Variants (`.itemSize-S`, `.itemSize-M`, `.itemSize-L`):**
    *   **Height:** Matches `buttongroupitem.json` `layout.height` for each size.
        *   S: `28px` ([`ButtonGroupItem.module.css:31`](src/components/ButtonGroup/ButtonGroupItem.module.css:31))
        *   M: `32px` ([`ButtonGroupItem.module.css:45`](src/components/ButtonGroup/ButtonGroupItem.module.css:45))
        *   L: `48px` ([`ButtonGroupItem.module.css:59`](src/components/ButtonGroup/ButtonGroupItem.module.css:59))
    *   **Padding:** Matches `buttongroupitem.json` `layout.paddingLeft/paddingRight` or `layout.padding` for each size.
        *   S: `var(--spacing-sp-6)` ([`ButtonGroupItem.module.css:32-33`](src/components/ButtonGroup/ButtonGroupItem.module.css:32))
        *   M: `var(--spacing-sp-4)` ([`ButtonGroupItem.module.css:46-47`](src/components/ButtonGroup/ButtonGroupItem.module.css:46))
        *   L: `var(--spacing-sp-8)` ([`ButtonGroupItem.module.css:60`](src/components/ButtonGroup/ButtonGroupItem.module.css:60))
    *   **Typography (font-size, font-weight, line-height):** Matches `buttongroupitem.json` `typography` for each size.
        *   S: `var(--font-body-small-...)` ([`ButtonGroupItem.module.css:34-36`](src/components/ButtonGroup/ButtonGroupItem.module.css:34))
        *   M: `var(--font-body-medium-...)` ([`ButtonGroupItem.module.css:48-50`](src/components/ButtonGroup/ButtonGroupItem.module.css:48))
        *   L: `var(--font-body-large-...)` ([`ButtonGroupItem.module.css:61-63`](src/components/ButtonGroup/ButtonGroupItem.module.css:61))
    *   **IconOnly Styles:** Correctly sets `width` and resets `padding`. ([`ButtonGroupItem.module.css:38-41`](src/components/ButtonGroup/ButtonGroupItem.module.css:38), [`ButtonGroupItem.module.css:52-55`](src/components/ButtonGroup/ButtonGroupItem.module.css:52), [`ButtonGroupItem.module.css:65-68`](src/components/ButtonGroup/ButtonGroupItem.module.css:65))
*   **State Styles:**
    *   **Hover:** `background-color: var(--color-surface-button-button-group-hover)`. Matches `buttongroupitem.json` `variants[State=Hover].colors.state=hover..._fill0.token`. ([`ButtonGroupItem.module.css:72-76`](src/components/ButtonGroup/ButtonGroupItem.module.css:72))
    *   **Active (Selected):** `background-color: var(--color-surface-button-button-group-active)`, `color: var(--color-text-link-default)`. Matches `buttongroupitem.json` `variants[State=Active].colors`. ([`ButtonGroupItem.module.css:79-83`](src/components/ButtonGroup/ButtonGroupItem.module.css:79))
        *   Correctly maintains active style on hover. ([`ButtonGroupItem.module.css:85-89`](src/components/ButtonGroup/ButtonGroupItem.module.css:85))
    *   **Pressed (`:active`):** Uses hover style for non-active, maintains active style for active items. Reasonable. ([`ButtonGroupItem.module.css:93-100`](src/components/ButtonGroup/ButtonGroupItem.module.css:93))
    *   **Focus-visible:** `border-color: var(--color-border-focus)`, `box-shadow: 0 0 0 2px var(--color-border-focus-shadow)`. Standard focus ring. ([`ButtonGroupItem.module.css:104-108`](src/components/ButtonGroup/ButtonGroupItem.module.css:104))
        *   Correctly maintains active style on focus. ([`ButtonGroupItem.module.css:110-116`](src/components/ButtonGroup/ButtonGroupItem.module.css:110))
    *   **Disabled:** `color: var(--color-text-disabled)`, `cursor: not-allowed`. Correctly targets `[data-disabled]` and `[aria-disabled='true']`. ([`ButtonGroupItem.module.css:120-127`](src/components/ButtonGroup/ButtonGroupItem.module.css:120))
*   **Icon and Label Wrappers:**
    *   `.iconWrapper`, `.labelWrapper` defined. ([`ButtonGroupItem.module.css:130-137`](src/components/ButtonGroup/ButtonGroupItem.module.css:130))
    *   Spacing between icon and label (`margin-left`) uses appropriate tokens and size-specific adjustments. ([`ButtonGroupItem.module.css:141-150`](src/components/ButtonGroup/ButtonGroupItem.module.css:141))
    *   SVG icon sizing is handled. ([`ButtonGroupItem.module.css:151-157`](src/components/ButtonGroup/ButtonGroupItem.module.css:151))

### 2.5. `src/components/ButtonGroup/ButtonGroup.stories.tsx`

*   **Meta Configuration:**
    *   `title`, `component`, `parameters`, `tags` are correctly set. ([`ButtonGroup.stories.tsx:7-13`](src/components/ButtonGroup/ButtonGroup.stories.tsx:7))
    *   `argTypes` for `size`, `disabled`, `className` are well-defined. ([`ButtonGroup.stories.tsx:14-50`](src/components/ButtonGroup/ButtonGroup.stories.tsx:14))
    *   `children` control is set to `false`, which is appropriate. ([`ButtonGroup.stories.tsx:35`](src/components/ButtonGroup/ButtonGroup.stories.tsx:35))
    *   `args` provide default values. ([`ButtonGroup.stories.tsx:51-55`](src/components/ButtonGroup/ButtonGroup.stories.tsx:51))
*   **Stories:**
    *   `Default`: Shows basic usage with one item marked `data-state="active"`. ([`ButtonGroup.stories.tsx:61-71`](src/components/ButtonGroup/ButtonGroup.stories.tsx:61))
    *   `Small`, `Medium`, `Large`: Demonstrate different sizes. ([`ButtonGroup.stories.tsx:73-110`](src/components/ButtonGroup/ButtonGroup.stories.tsx:73))
    *   `TwoItems`: Shows a group with two items. ([`ButtonGroup.stories.tsx:112-121`](src/components/ButtonGroup/ButtonGroup.stories.tsx:112))
    *   `WithIcons`: Shows items with icons and text. ([`ButtonGroup.stories.tsx:123-134`](src/components/ButtonGroup/ButtonGroup.stories.tsx:123))
    *   `IconOnly`, `IconOnlySmall`, `IconOnlyLarge`: Demonstrate icon-only items with `aria-label`. ([`ButtonGroup.stories.tsx:136-173`](src/components/ButtonGroup/ButtonGroup.stories.tsx:136))
    *   `DisabledGroup`: Shows the entire group disabled. ([`ButtonGroup.stories.tsx:175-185`](src/components/ButtonGroup/ButtonGroup.stories.tsx:175))
    *   `IndividuallyDisabledItem`: Shows one item disabled within the group. ([`ButtonGroup.stories.tsx:187-197`](src/components/ButtonGroup/ButtonGroup.stories.tsx:187))
*   **Coverage:** The stories cover a good range of props, variants, and states.

## 3. Figma JSON Cross-Reference Summary

### 3.1. `figma-jsons/done/buttongroup.json`

*   **`properties.layout.cornerRadius`**: `var(--radius-s)` - Implemented in [`ButtonGroup.module.css`](src/components/ButtonGroup/ButtonGroup.module.css:11).
*   **`properties.layout.padding`**: `var(--spacing-sp-4)` - Implemented in [`ButtonGroup.module.css`](src/components/ButtonGroup/ButtonGroup.module.css:14).
*   **`variants[*].colors.type=text..._fill0` (Background Color)**: `var(--color-surface-button-button-group-background)` - Implemented in [`ButtonGroup.module.css`](src/components/ButtonGroup/ButtonGroup.module.css:17).
*   **`structure.children[*].boundVariables.itemSpacing` (Gap):**
    *   Size S: `var(--spacing-sp-4)` - Implemented dynamically in [`ButtonGroup.tsx`](src/components/ButtonGroup/ButtonGroup.tsx:92).
    *   Size M & L: `var(--spacing-sp-8)` - Implemented dynamically in [`ButtonGroup.tsx`](src/components/ButtonGroup/ButtonGroup.tsx:92).
*   **Overall:** The `ButtonGroup` container styles (padding, border-radius, background-color, item spacing/gap) are correctly derived from `buttongroup.json`.

### 3.2. `figma-jsons/done/buttongroupitem.json` (as `.ButtonGroupElement`)

*   **`layout.cornerRadius`**: `var(--radius-xs)` - Implemented in [`ButtonGroupItem.module.css`](src/components/ButtonGroup/ButtonGroupItem.module.css:16).
*   **Layout (Height & Padding per Size):**
    *   **Size S:** Height `28px`, Padding `var(--spacing-sp-6)` - Implemented in [`ButtonGroupItem.module.css`](src/components/ButtonGroup/ButtonGroupItem.module.css:31-33).
    *   **Size M:** Height `32px`, Padding `var(--spacing-sp-4)` - Implemented in [`ButtonGroupItem.module.css`](src/components/ButtonGroup/ButtonGroupItem.module.css:45-47).
    *   **Size L:** Height `48px`, Padding `var(--spacing-sp-8)` - Implemented in [`ButtonGroupItem.module.css`](src/components/ButtonGroup/ButtonGroupItem.module.css:59-60).
*   **Typography (per Size):** Font family, size, weight, line-height tokens are correctly applied per size in [`ButtonGroupItem.module.css`](src/components/ButtonGroup/ButtonGroupItem.module.css:34-36), [`ButtonGroupItem.module.css:48-50`](src/components/ButtonGroup/ButtonGroupItem.module.css:48), [`ButtonGroupItem.module.css:61-63`](src/components/ButtonGroup/ButtonGroupItem.module.css:61).
*   **Colors (States):**
    *   **Default Text Color:** `var(--color-text-primary)` - Implemented in [`ButtonGroupItem.module.css`](src/components/ButtonGroup/ButtonGroupItem.module.css:20).
    *   **Hover Background:** `var(--color-surface-button-button-group-hover)` - Implemented in [`ButtonGroupItem.module.css`](src/components/ButtonGroup/ButtonGroupItem.module.css:73).
    *   **Active Background:** `var(--color-surface-button-button-group-active)` (maps to `neutral-50` or specific active token) - Implemented in [`ButtonGroupItem.module.css`](src/components/ButtonGroup/ButtonGroupItem.module.css:80).
    *   **Active Text Color:** `var(--color-text-link-default)` - Implemented in [`ButtonGroupItem.module.css`](src/components/ButtonGroup/ButtonGroupItem.module.css:81).
*   **Overall:** `ButtonGroupItem` styles (dimensions, padding, typography, state colors) are correctly derived from `buttongroupitem.json`. The JSON uses `neutral-50` for active background in M/L sizes, while the CSS uses a semantic token `var(--color-surface-button-button-group-active)`. This is acceptable if the semantic token maps to the correct raw value.

## 4. `ai_rules.md` Adherence Check Summary

*   **I.1. Figma JSON as Source of Truth:** Largely adhered to. Styles and props are derived from JSON.
*   **I.2. Accessibility First (Leverage Radix):**
    *   `ButtonGroup` uses `Primitive.div` with `role="group"` and `aria-disabled`.
    *   `ButtonGroupItem` uses `Primitive.button` with `data-state` and `aria-pressed`.
    *   This is good. If this component were to behave like a Radix `ToggleGroup` or `RadioGroup`, those primitives would be more semantically correct for managing selection state and keyboard navigation automatically. However, the custom implementation with context is also valid.
*   **I.3. Maximum Styling Control with Your Tokens:** Adhered to. Styles use global tokens via CSS Modules.
*   **I.4. Clean, Maintainable, Idiomatic React:**
    *   Prop destructuring and defaults: Yes. ([`ButtonGroup.tsx:41-51`](src/components/ButtonGroup/ButtonGroup.tsx:41), [`ButtonGroupItem.tsx:19`](src/components/ButtonGroup/ButtonGroupItem.tsx:19))
    *   Clear prop typing: Yes, TypeScript interfaces are used.
    *   Composition and prop spreading (`...rest`): Yes. ([`ButtonGroup.tsx:108`](src/components/ButtonGroup/ButtonGroup.tsx:108), [`ButtonGroupItem.tsx:83`](src/components/ButtonGroup/ButtonGroupItem.tsx:83))
    *   Conditional rendering: Yes, for icons/labels. ([`ButtonGroupItem.tsx:55-69`](src/components/ButtonGroup/ButtonGroupItem.tsx:55))
    *   No unnecessary state: `ButtonGroup` uses `useState` for uncontrolled behavior, which is correct.
    *   Readability: Code is generally readable.
*   **I.5. CSS Purity:** Adhered to. States are styled using pseudo-classes and `data-state`.
*   **II.1. Use Appropriate Radix Primitives:**
    *   `ButtonGroup`: `Primitive.div`. Acceptable for a container with custom logic.
    *   `ButtonGroupItem`: `Primitive.button`. Correct.
*   **II.2. Leverage Radix Parts and `data-state` Attributes:** `data-state` is used for `ButtonGroupItem`. Correct.
*   **II.4. Polymorphism with `asChild`:** Not explicitly implemented with `Slot`. This could be an enhancement if required by the design system, but `Primitive.div` and `Primitive.button` inherently support `asChild`.
*   **III. React Component Implementation (`.tsx`):**
    *   File Naming: Correct.
    *   Props: Mostly correct. `asChild` prop is missing if full polymorphism is desired.
    *   `React.forwardRef`: Yes.
    *   `displayName`: Yes.
    *   `clsx`: Yes.
    *   Icon/Label Rendering: Yes.
    *   Accessibility Attributes: Yes, `aria-disabled`, `aria-pressed`, `role="group"`.
*   **IV. CSS Modules Implementation (`.module.css`):**
    *   Token Imports: Yes.
    *   Target Radix Parts: Not applicable as not using complex multi-part Radix primitives. `data-state` is used on the item itself.
    *   Base Styles: Yes.
    *   Variant Styles: Yes.
    *   States (Pseudo-classes & Radix `data-*`): Yes.
    *   Internal Parts Styling: Yes, for icon/label wrappers.
    *   NO `!important`: Adhered to.
    *   Comments: Good comments tracing to JSON.
*   **V. Storybook Stories (`.stories.tsx`):**
    *   Adheres well to guidelines. Covers variants, states, and content configurations.
    *   Does not manually set hover/focus/active states via props, which is correct.

## 5. Conclusion and Recommendations

The `ButtonGroup` and `ButtonGroupItem` components are well-implemented and largely adhere to the Figma specifications and `ai_rules.md`.

**Strengths:**

*   Clear separation of concerns between `ButtonGroup` (container, context provider, selection logic) and `ButtonGroupItem` (individual button, state display).
*   Good use of React Context for managing shared state and interactions.
*   Styling is correctly derived from Figma JSON and uses global design tokens via CSS Modules.
*   Props and states are well-defined and handled.
*   Accessibility basics (`role`, `aria-disabled`, `aria-pressed`, `data-state`) are in place.
*   Storybook stories provide good coverage.

**Potential Areas for Minor Improvement/Consideration:**

1.  **Radix Primitives for Selection:**
    *   While the custom selection logic works, if the `ButtonGroup` is intended to function as a standard `ToggleGroup` (for single/multiple selection) or `RadioGroup` (for single selection from a set), using `@radix-ui/react-toggle-group` or `@radix-ui/react-radio-group` primitives could simplify the selection logic and provide more built-in accessibility features (like keyboard navigation between items). This would involve refactoring the `ButtonGroup` to wrap the Radix group primitive and `ButtonGroupItem` to wrap the Radix item primitive.
    *   **Recommendation:** Evaluate if the current custom logic meets all accessibility and behavioral requirements (especially keyboard navigation). If not, or if a more standard Radix pattern is preferred, consider refactoring to use Radix selection primitives. If the current custom control is intentional and fully covers needs, it's acceptable.

2.  **`asChild` Prop for Polymorphism:**
    *   The components use Radix `Primitive.div` and `Primitive.button` which inherently support `asChild`. However, explicitly adding the `asChild?: boolean` prop and using `<Slot>` as per `ai_rules.md` (Rule II.4) would make this capability more discoverable and consistent with other components if that's a strict library-wide pattern.
    *   **Recommendation:** Add `asChild` prop and `Slot` if strict adherence to Rule II.4 is required for all components.

3.  **`onValueChange` for Single Type Deselection:**
    *   In [`ButtonGroup.tsx`](src/components/ButtonGroup/ButtonGroup.tsx:81-86), `onValueChange` for `type="single"` is only called if `newValue` is a string (i.e., an item is selected). It's not called when an item is deselected (newValue becomes `undefined`).
    *   **Recommendation:** Review if `onValueChange` should also be called with `undefined` (or an empty string, depending on API preference) when a single-select item is deselected. The current comment acknowledges this. This depends on the desired API contract.

**Overall Assessment:** **Good.** The components are functional, well-styled according to spec, and follow most of the development rules. The recommendations are mostly for minor enhancements or deeper alignment with Radix patterns if desired.