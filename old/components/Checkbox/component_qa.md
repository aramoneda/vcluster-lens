# QA Review: Checkbox Component

## 1. Analysis of `src/components/Checkbox/Checkbox.tsx`

**Overall:** The component is well-structured, uses Radix UI's `Checkbox` primitive, and generally follows the guidelines in `ai_rules.md`.

**Key Observations & Adherence:**

*   **Radix UI Usage:**
    *   Correctly uses [`@radix-ui/react-checkbox`](src/components/Checkbox/Checkbox.tsx:2) as `RadixCheckbox`.
    *   Implements [`RadixCheckbox.Root`](src/components/Checkbox/Checkbox.tsx:68) and [`RadixCheckbox.Indicator`](src/components/Checkbox/Checkbox.tsx:81).
*   **Props:**
    *   `CheckboxProps` interface ([`src/components/Checkbox/Checkbox.tsx:9`](src/components/Checkbox/Checkbox.tsx:9)) correctly extends `RadixCheckbox.CheckboxProps` and omits `asChild` (though `asChild` is not implemented, which is a deviation from `ai_rules.md` Rule II.4).
    *   Props like `label`, `supportingText`, `size`, `id`, `className`, `checked`, `defaultChecked`, `onCheckedChange`, `disabled`, `required`, `name`, `value` are defined.
    *   `size` prop defaults to `'18px'` ([`src/components/Checkbox/Checkbox.tsx:40`](src/components/Checkbox/Checkbox.tsx:40)) as per Figma JSON.
    *   `id` is auto-generated using `useId` if not provided ([`src/components/Checkbox/Checkbox.tsx:54-55`](src/components/Checkbox/Checkbox.tsx:54-55)).
    *   Props are destructured, and `...rest` is spread to [`RadixCheckbox.Root`](src/components/Checkbox/Checkbox.tsx:79).
*   **Structure & Styling:**
    *   Uses `clsx` for conditional class names ([`src/components/Checkbox/Checkbox.tsx:3`](src/components/Checkbox/Checkbox.tsx:3), [`src/components/Checkbox/Checkbox.tsx:61`](src/components/Checkbox/Checkbox.tsx:61), [`src/components/Checkbox/Checkbox.tsx:71`](src/components/Checkbox/Checkbox.tsx:71), [`src/components/Checkbox/Checkbox.tsx:82`](src/components/Checkbox/Checkbox.tsx:82), [`src/components/Checkbox/Checkbox.tsx:83`](src/components/Checkbox/Checkbox.tsx:83)).
    *   Applies size-specific classes (e.g., `styles['size-18']`) ([`src/components/Checkbox/Checkbox.tsx:63`](src/components/Checkbox/Checkbox.tsx:63)).
    *   Conditionally renders `label` and `supportingText` within a `textContainer` ([`src/components/Checkbox/Checkbox.tsx:86-97`](src/components/Checkbox/Checkbox.tsx:86-97)).
    *   The `label` element correctly uses `htmlFor` attribute linked to the `checkboxId` ([`src/components/Checkbox/Checkbox.tsx:89`](src/components/Checkbox/Checkbox.tsx:89)).
*   **Icons:**
    *   Uses `lucide-react` for `Check` and `Minus` icons ([`src/components/Checkbox/Checkbox.tsx:4`](src/components/Checkbox/Checkbox.tsx:4)).
    *   Icons are conditionally displayed via CSS based on `data-state` on the root.
*   **Ref Forwarding:**
    *   Correctly uses `React.forwardRef` ([`src/components/Checkbox/Checkbox.tsx:35`](src/components/Checkbox/Checkbox.tsx:35)) and types the ref as `HTMLButtonElement`.
*   **Display Name:**
    *   Sets `Checkbox.displayName = 'Checkbox';` ([`src/components/Checkbox/Checkbox.tsx:103`](src/components/Checkbox/Checkbox.tsx:103)).

**Potential Issues/Improvements:**

*   **`asChild` Prop:** The `asChild` prop is omitted from `CheckboxProps` and not implemented. Rule II.4 in `ai_rules.md` states: "Implement the `asChild` prop using `@radix-ui/react-slot Slot` ... Apply this consistently to *all* components built with Radix Primitives." This should be added for consistency.
*   **`aria-disabled`:** The component relies on Radix to handle `aria-disabled` via its `disabled` prop. This is generally fine, but `ai_rules.md` (Rule III.7) mentions ensuring `disabled` also sets `aria-disabled={disabled}`. Radix primitives usually handle this, so it's likely covered.

## 2. Analysis of `src/components/Checkbox/Checkbox.module.css`

**Overall:** The CSS module is well-organized, uses design tokens, and correctly styles different states and variants based on Radix `data-*` attributes.

**Key Observations & Adherence:**

*   **Token Imports:**
    *   Correctly imports global token files ([`src/components/Checkbox/Checkbox.module.css:1-3`](src/components/Checkbox/Checkbox.module.css:1-3)).
*   **Selectors & Styling:**
    *   Uses `data-state` attributes for styling (e.g., `[data-state='unchecked']`, `[data-state='checked']`, `[data-state='indeterminate']`) ([`src/components/Checkbox/Checkbox.module.css:44`](src/components/Checkbox/Checkbox.module.css:44), [`src/components/Checkbox/Checkbox.module.css:53`](src/components/Checkbox/Checkbox.module.css:53), [`src/components/Checkbox/Checkbox.module.css:64`](src/components/Checkbox/Checkbox.module.css:64)).
    *   Uses `[data-disabled]` for disabled states ([`src/components/Checkbox/Checkbox.module.css:82`](src/components/Checkbox/Checkbox.module.css:82)).
    *   Styles for `hover` and `focus-visible` pseudo-classes are present and correctly exclude disabled states (e.g., `:hover:not([data-disabled])`) ([`src/components/Checkbox/Checkbox.module.css:48`](src/components/Checkbox/Checkbox.module.css:48), [`src/components/Checkbox/Checkbox.module.css:75`](src/components/Checkbox/Checkbox.module.css:75)).
    *   Size variants (`.size-18`, `.size-24`) are applied to the `.wrapper` and used to adjust dimensions of `.root` and icons ([`src/components/Checkbox/Checkbox.module.css:33`](src/components/Checkbox/Checkbox.module.css:33), [`src/components/Checkbox/Checkbox.module.css:38`](src/components/Checkbox/Checkbox.module.css:38), [`src/components/Checkbox/Checkbox.module.css:135`](src/components/Checkbox/Checkbox.module.css:135), [`src/components/Checkbox/Checkbox.module.css:146`](src/components/Checkbox/Checkbox.module.css:146)).
    *   Typography and color tokens are used extensively as per Figma specs.
    *   Icon visibility is controlled by `display: none` by default and `display: block` based on parent's `data-state` ([`src/components/Checkbox/Checkbox.module.css:111`](src/components/Checkbox/Checkbox.module.css:111), [`src/components/Checkbox/Checkbox.module.css:127`](src/components/Checkbox/Checkbox.module.css:127), [`src/components/Checkbox/Checkbox.module.css:130`](src/components/Checkbox/Checkbox.module.css:130)).
    *   Label and supporting text styles are defined, including disabled states.
*   **Comments:**
    *   Comments trace CSS rules to Figma properties (e.g., `/* Figma: Size=18px, State=Unchecked -> checkbox_checkbox_stroke0 */`) ([`src/components/Checkbox/Checkbox.module.css:45`](src/components/Checkbox/Checkbox.module.css:45)).

**Potential Issues/Improvements:**

*   **Hover State for Checked/Indeterminate:** The hover state for checked ([`src/components/Checkbox/Checkbox.module.css:58-61`](src/components/Checkbox/Checkbox.module.css:58-61)) and indeterminate ([`src/components/Checkbox/Checkbox.module.css:69-72`](src/components/Checkbox/Checkbox.module.css:69-72)) sets `border-color: var(--brand-600);`. However, the base checked/indeterminate states have `border-width: 0px;` ([`src/components/Checkbox/Checkbox.module.css:55`](src/components/Checkbox/Checkbox.module.css:55), [`src/components/Checkbox/Checkbox.module.css:66`](src/components/Checkbox/Checkbox.module.css:66)). This means the border will only appear on hover. This might be intentional for a subtle effect, but if the Figma spec implies no border even on hover for these states, this is a slight deviation. The Figma JSON for "Checked" and "Some Checked" states does not specify a border, only a fill. The "Hover" state in Figma JSON applies to the "Unchecked" state.
*   **Disabled Supporting Text Color:** The CSS comment for disabled supporting text ([`src/components/Checkbox/Checkbox.module.css:183-186`](src/components/Checkbox/Checkbox.module.css:183-186)) notes it matches Figma's spec using `--color-text-secondary`. This seems correct based on the Figma JSON (`Size=18px, State=Disabled` -> `text_supporting_text_supporting_text_fill0` maps to `--color-text-secondary`).

## 3. Analysis of `src/components/Checkbox/Checkbox.stories.tsx`

**Overall:** The Storybook file provides a good range of stories covering different props, states, and combinations.

**Key Observations & Adherence:**

*   **Meta Configuration:**
    *   `title`, `component`, `tags: ['autodocs']` are correctly set ([`src/components/Checkbox/Checkbox.stories.tsx:5-8`](src/components/Checkbox/Checkbox.stories.tsx:5-8)).
    *   `argTypes` are defined for all relevant props with descriptions and control types ([`src/components/Checkbox/Checkbox.stories.tsx:9-57`](src/components/Checkbox/Checkbox.stories.tsx:9-57)).
    *   `args` provide default values, aligning with Figma where specified (e.g., `size: '18px'`) ([`src/components/Checkbox/Checkbox.stories.tsx:58-65`](src/components/Checkbox/Checkbox.stories.tsx:58-65)).
*   **Stories:**
    *   `Default` story is present ([`src/components/Checkbox/Checkbox.stories.tsx:81`](src/components/Checkbox/Checkbox.stories.tsx:81)).
    *   Stories for `Checked` ([`src/components/Checkbox/Checkbox.stories.tsx:88`](src/components/Checkbox/Checkbox.stories.tsx:88)) and `Indeterminate` ([`src/components/Checkbox/Checkbox.stories.tsx:95`](src/components/Checkbox/Checkbox.stories.tsx:95)) states are included. The indeterminate story correctly uses `checked: 'indeterminate'` and a custom render function.
    *   Size variants (`Size24px`, `Size24pxChecked`, `Size24pxIndeterminate`) are covered ([`src/components/Checkbox/Checkbox.stories.tsx:104-127`](src/components/Checkbox/Checkbox.stories.tsx:104-127)).
    *   Stories with `supportingText` in various states are present ([`src/components/Checkbox/Checkbox.stories.tsx:129-152`](src/components/Checkbox/Checkbox.stories.tsx:129-152)).
    *   Stories for `NoLabel` (with `aria-label`) are included for accessibility ([`src/components/Checkbox/Checkbox.stories.tsx:155-172`](src/components/Checkbox/Checkbox.stories.tsx:155-172)).
    *   Comprehensive disabled state stories (`DisabledUnchecked`, `DisabledChecked`, `DisabledIndeterminate`, and versions with supporting text) are provided ([`src/components/Checkbox/Checkbox.stories.tsx:175-226`](src/components/Checkbox/Checkbox.stories.tsx:175-226)).
*   **Best Practices:**
    *   Follows rule V.6: "DO NOT create stories that manually set hover/focus/active states via props." Hover/focus are correctly left for user interaction ([`src/components/Checkbox/Checkbox.stories.tsx:228-229`](src/components/Checkbox/Checkbox.stories.tsx:228-229)).

**Potential Issues/Improvements:**

*   None apparent; the stories are comprehensive and well-structured.

## 4. Figma JSON (`figma-jsons/done/checkbox.json`) Cross-Reference Summary

*   **Props Mapping:**
    *   `label` prop in React maps to `"Checkbox Label#33238:0"` (boolean for visibility) in Figma.
    *   `supportingText` prop in React maps to `"Supporting Text#33238:17"` (boolean for visibility) in Figma.
    *   `size` prop (`'18px'`, `'24px'`) maps directly to Figma's `Size` property. Default `'18px'` matches.
    *   Component states (`checked`, `indeterminate`, `disabled`) map to Figma's `State` property values (`Unchecked`, `Checked`, `Some Checked`, `Disabled`, `Locked Checked`, `Locked Some Checked`).
*   **Styling & Tokens:**
    *   **Unchecked State:**
        *   Border color: `checkbox_checkbox_stroke0` (`--color-stroke-controls-default`) is correctly used in [`Checkbox.module.css:45`](src/components/Checkbox/Checkbox.module.css:45).
    *   **Hover (Unchecked) State:**
        *   Border color: `checkbox_checkbox_stroke0` (`--color-stroke-controls-hover`) for `State=Hover` in Figma is used in [`Checkbox.module.css:49`](src/components/Checkbox/Checkbox.module.css:49).
    *   **Checked State:**
        *   Background color: `checkbox_checkbox_checkbox_fill0` (`--color-surface-controls-selected`) is correctly used in [`Checkbox.module.css:54`](src/components/Checkbox/Checkbox.module.css:54).
        *   Figma shows no border; CSS has `border-width: 0px;` ([`src/components/Checkbox/Checkbox.module.css:55`](src/components/Checkbox/Checkbox.module.css:55)).
    *   **Indeterminate (Some Checked) State:**
        *   Background color: `checkbox_checkbox_checkbox_fill0` (`--color-surface-controls-selected`) is correctly used in [`Checkbox.module.css:65`](src/components/Checkbox/Checkbox.module.css:65).
        *   Figma shows no border; CSS has `border-width: 0px;` ([`src/components/Checkbox/Checkbox.module.css:66`](src/components/Checkbox/Checkbox.module.css:66)).
    *   **Disabled (Unchecked) State:**
        *   Background: `checkbox_checkbox_fill0` (`--color-surface-controls-disabled`) used in [`Checkbox.module.css:83`](src/components/Checkbox/Checkbox.module.css:83).
        *   Border: `checkbox_checkbox_stroke0` (`--color-stroke-controls-disabled`) used in [`Checkbox.module.css:84`](src/components/Checkbox/Checkbox.module.css:84).
    *   **Disabled Checked (Locked Checked) State:**
        *   Background: `checkbox_checkbox_checkbox_fill0` (`--color-surface-controls-locked`) used in [`Checkbox.module.css:90`](src/components/Checkbox/Checkbox.module.css:90).
        *   Figma shows no border; CSS has `border-width: 0px;` ([`src/components/Checkbox/Checkbox.module.css:91`](src/components/Checkbox/Checkbox.module.css:91)).
    *   **Disabled Indeterminate (Locked Some Checked) State:**
        *   Background: `checkbox_checkbox_checkbox_fill0` (`--color-surface-controls-locked`) used in [`Checkbox.module.css:96`](src/components/Checkbox/Checkbox.module.css:96).
        *   Figma shows no border; CSS has `border-width: 0px;` ([`src/components/Checkbox/Checkbox.module.css:97`](src/components/Checkbox/Checkbox.module.css:97)).
    *   **Text Colors:**
        *   Label (default): `text_checkbox_label_checkbox_label_fill0` (`--color-text-primary`) used in [`Checkbox.module.css:195`](src/components/Checkbox/Checkbox.module.css:195), [`Checkbox.module.css:212`](src/components/Checkbox/Checkbox.module.css:212).
        *   Supporting Text (default): `text_supporting_text_supporting_text_fill0` (`--color-text-secondary`) used in [`Checkbox.module.css:180`](src/components/Checkbox/Checkbox.module.css:180).
        *   Label (disabled): `text_checkbox_label_checkbox_label_fill0` (`--color-text-controls-disabled`) for `State=Disabled` used in [`Checkbox.module.css:175`](src/components/Checkbox/Checkbox.module.css:175).
        *   Supporting Text (disabled): `text_supporting_text_supporting_text_fill0` (`--color-text-secondary`) for `State=Disabled` used in [`Checkbox.module.css:186`](src/components/Checkbox/Checkbox.module.css:186).
    *   **Layout & Structure:**
        *   `border-radius: var(--radius-xxs)` ([`src/components/Checkbox/Checkbox.module.css:20`](src/components/Checkbox/Checkbox.module.css:20)) matches Figma structure `cornerRadius` token.
        *   `border-width: var(--border-width-200)` ([`src/components/Checkbox/Checkbox.module.css:21`](src/components/Checkbox/Checkbox.module.css:21)) matches Figma structure `strokeWeight` token.
        *   `gap: var(--spacing-sp-12)` for wrapper ([`src/components/Checkbox/Checkbox.module.css:8`](src/components/Checkbox/Checkbox.module.css:8)) matches Figma structure `itemSpacing` token.
    *   **Typography:**
        *   Typography tokens for label and supporting text for both 18px and 24px sizes are correctly applied in CSS, matching the `typography` section of the Figma JSON.
        *   E.g., `Size=18px, State=Unchecked/Checkbox Label` uses `Body/Medium/SemiBold` tokens ([`src/components/Checkbox/Checkbox.module.css:190-195`](src/components/Checkbox/Checkbox.module.css:190-195)).
        *   E.g., `Size=18px, State=Unchecked/Supporting Text` uses `Body/Medium/Regular` tokens ([`src/components/Checkbox/Checkbox.module.css:199-204`](src/components/Checkbox/Checkbox.module.css:199-204)).
        *   Similar matches for 24px size.

**Discrepancies/Notes:**

*   **Focus State:** Figma JSON specifies a `.focus_ring_component` for `State=Focused`. The implementation uses a standard CSS outline: `outline: 2px solid var(--color-surface-focused); outline-offset: 2px;` ([`src/components/Checkbox/Checkbox.module.css:76-77`](src/components/Checkbox/Checkbox.module.css:76-77)). This is a common and acceptable way to implement focus rings if a dedicated component isn't mandated or if the token `--color-surface-focused` is designed for this purpose. The `ai_rules.md` (Rule IV.5) also shows examples of styling `:focus-visible`.
*   **Icon Colors:**
    *   Default icon color for active states: `color: var(--neutral-50);` ([`src/components/Checkbox/Checkbox.module.css:106`](src/components/Checkbox/Checkbox.module.css:106)).
    *   Disabled icon color: `color: var(--color-text-controls-disabled);` ([`src/components/Checkbox/Checkbox.module.css:158`](src/components/Checkbox/Checkbox.module.css:158)).
    *   The Figma JSON doesn't explicitly list icon color tokens for each state directly under the `colors` for `Checkbox` variants, but rather references icon components (`.Icons/check`, `.Icons/dash`). The chosen icon colors (`--neutral-50` for active, `--color-text-controls-disabled` for disabled) are conventional and likely align with the design system's intent for icon colors within selected/disabled controls.

## 5. `ai_rules.md` Adherence Check Summary

*   **I. Core Philosophy & Goals:**
    *   1. Figma JSON as Source of Truth: **Largely Adherent.** Styling and props are derived from JSON.
    *   2. Accessibility First (Leverage Radix): **Adherent.** Uses Radix Checkbox primitive.
    *   3. Maximum Styling Control with Your Tokens: **Adherent.** Uses global tokens via CSS Modules.
    *   4. Clean, Maintainable, Idiomatic React: **Largely Adherent.**
        *   Prop Destructuring and Defaults: Yes.
        *   Clear Prop Typing: Yes.
        *   Composition and Prop Spreading: Yes.
        *   Conditional Rendering: Yes.
        *   No Unnecessary State: Yes.
        *   Icon/Label Rendering: Yes.
    *   5. CSS Purity: **Adherent.** Uses pseudo-classes and `data-state`.
*   **II. Radix UI Usage:**
    *   1. Use Appropriate Radix Primitives: **Adherent.** Uses `@radix-ui/react-checkbox Checkbox.Root`.
    *   2. Leverage Radix Parts and `data-state`: **Adherent.**
    *   3. Radix Themes Components: N/A (Primitives used).
    *   4. Polymorphism with `asChild`: **Not Adherent.** `asChild` prop is missing.
*   **III. React Component Implementation (`.tsx`):**
    *   1. File Naming: **Adherent.** (`Checkbox.tsx`, `Checkbox.module.css`).
    *   2. Props: **Largely Adherent.** (Missing `asChild`). Extends `RadixCheckbox.CheckboxProps`.
    *   3. `React.forwardRef`: **Adherent.**
    *   4. `displayName`: **Adherent.**
    *   5. `clsx` Utility: **Adherent.**
    *   6. Icon/Label Rendering: **Adherent.**
    *   7. Accessibility Attributes: **Adherent.** Relies on Radix for `aria-disabled` from `disabled` prop.
*   **IV. CSS Modules Implementation (`.module.css`):**
    *   1. Token Imports: **Adherent.**
    *   2. Target Radix Parts via `data-*` Attributes: **Adherent.** Styles target `[data-state]` and other attributes on `.root` and `.indicator`.
    *   3. Base Styles: **Adherent.**
    *   4. Variant Styles: **Adherent.**
    *   5. States (Pseudo-classes & Radix `data-*`): **Adherent.**
    *   6. Internal Parts Styling: **Adherent.**
    *   7. NO `!important`: **Adherent.** (Checked manually, none found).
    *   8. Comments: **Adherent.**
*   **V. Storybook Stories (`.stories.tsx`):**
    *   1. Default Story: **Adherent.**
    *   2. Variant Combinations: **Adherent.**
    *   3. State Demonstrations: **Adherent.**
    *   4. Content Configurations: **Adherent.**
    *   5. Controls (Args): **Adherent.**
    *   6. Interactive States: **Adherent.**

**Primary Deviation from `ai_rules.md`:**

*   Rule II.4: Missing `asChild` prop implementation.

## 6. Conclusion and Recommendations

The `Checkbox` component is a robust and well-implemented component that largely adheres to the Figma specifications and the `ai_rules.md` guidelines. The use of Radix UI primitives ensures good accessibility and state management. Styling is correctly handled via CSS Modules and global design tokens. Storybook coverage is comprehensive.

**Recommendations:**

1.  **Implement `asChild` Prop:** Add the `asChild` prop and integrate `@radix-ui/react-slot` as per Rule II.4 in `ai_rules.md`. This will enhance the component's flexibility and ensure consistency with other Radix-based components in the library.
    *   Modify `CheckboxProps` in [`Checkbox.tsx`](src/components/Checkbox/Checkbox.tsx:9) to include `asChild?: boolean;`.
    *   Import `Slot` from `@radix-ui/react-slot`.
    *   Conditionally render `RadixCheckbox.Root` as `Slot` if `asChild` is true.
2.  **Verify Hover Border for Checked/Indeterminate States:** Double-check the design specification or consult with the design team regarding the border appearing on hover for `checked` and `indeterminate` states ([`Checkbox.module.css:58-61`](src/components/Checkbox/Checkbox.module.css:58-61) and [`Checkbox.module.css:69-72`](src/components/Checkbox/Checkbox.module.css:69-72)). If no border should appear, remove the `border-color` property from these hover styles. The Figma JSON for these states does not show a border, and the "Hover" state in Figma JSON seems to apply only to the "Unchecked" state. // Comment - No border on hover for checked/indeterminate states is correct.

Overall, the component is of high quality. Addressing the `asChild` prop will bring it into full compliance with the established rules.