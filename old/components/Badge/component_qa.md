# QA Review: Badge Component

## 1. Analysis of `Badge.tsx`

**File:** [`src/components/Badge/Badge.tsx`](src/components/Badge/Badge.tsx)

**Overall Assessment:** The `Badge.tsx` file is well-structured and adheres to the guidelines in [`ai_rules.md`](ai_rules.md) for a simple presentational component.

**Key Observations:**

*   **Imports:**
    *   Necessary imports (`React`, `Primitive` from `@radix-ui/react-primitive`, `Slot` from `@radix-ui/react-slot`, `clsx`, `styles`) are present and correctly used.
*   **Prop Definitions:**
    *   `BadgeType`, `BadgeColor`, `BadgeSize` string literal types are correctly defined and align with the Figma JSON `properties`.
    *   `BadgeProps` interface:
        *   Extends `React.HTMLAttributes<HTMLSpanElement>`, which is appropriate for a component based on `Primitive.span` as per [`ai_rules.md`](ai_rules.md) (II.7.a).
        *   Props `badgeType`, `color`, `size` are optional and have default values (`Filled`, `Default`, `Large` respectively) matching the Figma JSON `properties.default`.
        *   `children` prop of type `React.ReactNode` is included.
        *   `asChild` prop of type `boolean` (default `false`) is correctly implemented for Radix UI polymorphism.
        *   TSDoc comments for props are clear and informative.
*   **Component Implementation:**
    *   Uses `React.forwardRef<HTMLSpanElement, BadgeProps>` correctly, forwarding the `ref` to the underlying element.
    *   Props are destructured with default values applied directly in the destructuring, as recommended.
    *   `className` prop is accepted and correctly merged using `clsx`.
    *   Remaining props (`...rest`) are spread to the underlying Radix primitive.
    *   The logic `const Comp = asChild ? Slot : Primitive.span;` correctly implements the `asChild` pattern.
*   **CSS Class Mapping:**
    *   `clsx` is used effectively to apply base and variant-specific CSS module classes:
        *   `styles.badge` (base class)
        *   `styles[badgeType.toLowerCase()]`
        *   `styles[color.toLowerCase()]`
        *   `styles[size.toLowerCase()]`
    *   This mapping aligns with the CSS module class naming convention.
*   **`displayName`:**
    *   `Badge.displayName = 'Badge';` is set, adhering to [`ai_rules.md`](ai_rules.md) (III.11.0).

**Adherence to `ai_rules.md`:**
*   Follows rules for simple presentational components (II.7.a).
*   Uses `Primitive.span` as the base.
*   Props align with Figma JSON and React best practices (prop destructuring, defaults, `...rest` spreading).
*   `asChild` prop is correctly implemented.

## 2. Analysis of `Badge.module.css`

**File:** [`src/components/Badge/Badge.module.css`](src/components/Badge/Badge.module.css)

**Overall Assessment:** The CSS module correctly implements styling based on Figma JSON and global design tokens. One area of concern is the styling for `Outline` type badges with `Neuteral` and `Dark` colors, which are not defined in the Figma JSON.

**Key Observations:**

*   **Token Imports:**
    *   Correctly imports global token files (`figma-color-tokens.css`, `figma-numeric-tokens.css`, `figma-typography-tokens.css`) as per [`ai_rules.md`](ai_rules.md) (IV.1.0).
*   **Base Styles (`.badge`):**
    *   Applies common layout properties (`display: inline-flex`, `align-items`, `justify-content`, `box-sizing`).
    *   `border-radius: var(--radius-xs);` matches Figma JSON `layout.cornerRadius.token`.
    *   Sets base typography (e.g., `font-family`, `white-space`), which is appropriately overridden by size variants.
*   **Type Variants (`.filled`, `.outline`):**
    *   `.filled`: Acts as a marker class, with specific background colors applied by color variants.
    *   `.outline`:
        *   `border-width: var(--border-width-100);` and `border-style: solid;` correctly implement the outline. This border width matches the `strokeWeight.token` specified for outline variants in Figma JSON.
        *   `background-color: var(--color-surface-foreground);` is the default background for outline types, consistent with Figma JSON.
*   **Color Variants (e.g., `.filled.default`, `.outline.sky`):**
    *   **Filled Badges:** Styles like `.filled.default` correctly map `background-color` and `color` to tokens specified in Figma JSON (e.g., `type=filled,_color=default,_size=default_fill0` for background, `label_label_text_color0` for text).
    *   The `.filled.neuteral` variant correctly includes a border (`border: var(--border-width-100) solid var(--color-stroke-default);`) as this specific filled variant has a `stroke0` defined in its Figma JSON.
    *   **Outline Badges:** Styles like `.outline.default` correctly map `border-color` and `color` to tokens from Figma JSON (e.g., `type=outline,_color=default,_size=default_stroke0` for border, `label_label_text_color0` for text).
*   **Size Variants (`.default`, `.large`, `.small`):**
    *   Each size variant correctly defines `padding` (top, bottom, left, right), `font-size`, `font-weight`, `line-height`, and `min-height`.
    *   Padding tokens (e.g., `--spacing-sp-2`, `--spacing-sp-6`, etc.) match the `padding*` values for corresponding size variants in Figma JSON.
    *   Typography tokens (e.g., `--font-body-medium-size`, `--font-body-large-semibold-weight`, etc.) match the `typography` specifications for corresponding size variants in Figma JSON.
    *   `min-height` values (e.g., `24px`, `28px`, `20px`) are derived from and match the `layout.height` in Figma JSON for each size.
*   **CSS Purity:**
    *   No `!important` is used.
    *   Styling relies on class combinations, not JavaScript-driven state classes (Badge is non-interactive).
*   **Non-Figma Derived Styles:**
    *   The styles for `.outline.neuteral` and `.outline.dark` include comments indicating they are not explicitly defined in the Figma JSON for the `Outline` type. This is a deviation from the "Figma JSON is the Absolute Source of Truth" principle.

**Adherence to `ai_rules.md`:**
*   Uses global design tokens (IV.1.0).
*   Maps Figma JSON properties to CSS for most variants (IV.4.0).
*   No `!important` (IV.7.0).
*   **Deviation:** Styles for `outline.neuteral` and `outline.dark` are not derived from Figma JSON, as these specific Type/Color combinations are absent in the provided JSON.

## 3. Analysis of `Badge.stories.tsx`

**File:** [`src/components/Badge/Badge.stories.tsx`](src/components/Badge/Badge.stories.tsx)

**Overall Assessment:** The Storybook file is well-configured for demonstrating the `Badge` component's props and variants. It could be enhanced by adding more explicit stories for all color variants.

**Key Observations:**

*   **Meta Configuration:**
    *   `title`, `component`, `parameters`, and `tags` are correctly set up.
    *   `argTypes` are defined for all props (`badgeType`, `color`, `size`, `children`, `asChild`, `className`), including `control` types (e.g., `select`, `text`, `boolean`) and descriptions.
    *   `options` for selectable props (`badgeType`, `color`, `size`) correctly list the available values from the TypeScript types.
    *   `table.defaultValue.summary` in `argTypes` accurately reflects the component's default prop values.
    *   `args` (global default args for stories) are set to match the component's default prop values (`children: 'Label'`, `badgeType: 'Filled'`, `color: 'Default'`, `size: 'Large'`).
*   **Stories Defined:**
    *   `FilledType`: Demonstrates `badgeType="Filled"` with default color and size.
    *   `OutlineType`: Demonstrates `badgeType="Outline"` with default color and size.
    *   `SizeLargeStory`: Demonstrates `size="Large"` with default type and color.
    *   `SizeDefaultStory`: Demonstrates `size="Default"` with default type and color.
    *   `SizeSmallStory`: Demonstrates `size="Small"` with default type and color.
*   **Adherence to `ai_rules.md` (Section V):**
    *   **V.1 Default Story:** Covered by the combination of `meta.args` and the `FilledType` story.
    *   **V.2 Variant Combinations:**
        *   Primary `badgeType` variants are shown.
        *   Primary `size` variants are shown.
        *   **Minor Gap:** While all `color` options are available via controls, explicit stories for each `color` variant (especially in combination with `badgeType`) are not present. [`ai_rules.md`](ai_rules.md) (V.2) suggests "Stories for all primary visual prop combinations".
    *   **V.3 State Demonstrations:** Not applicable, as `Badge` is non-interactive and has no states like `disabled`.
    *   **V.4 Content Configurations:** Not applicable, as `Badge` primarily uses `children` for content and doesn't have distinct icon/label structures managed by props.
    *   **V.5 Controls (Args):** Correctly implemented; all configurable props are available as controls.
    *   **V.6 Interactive States:** Not applicable.

## 4. Figma JSON Cross-Reference Summary

**File:** [`figma-jsons/done/badge.json`](figma-jsons/done/badge.json)

*   **`properties` (Props & Defaults):**
    *   `String#32280:83` (Label text, default "Label"): Handled by `children` prop.
    *   `Type` (default "Filled"): Matches `badgeType` prop and its default.
    *   `Color` (default "Default"): Matches `color` prop and its default.
    *   `Size` (default "Large"): Matches `size` prop and its default.
    *   All component props and their default values in `Badge.tsx` align with the Figma JSON.
*   **`layout` (Base & Variants):**
    *   **Base `layout` (root level):** Defines `cornerRadius` (`--radius-xs`), `paddingTop`/`Bottom` (`--spacing-sp-2`), `paddingLeft`/`Right` (`--spacing-sp-6`). These are consistent with the "Default" size variant.
    *   **Variant `layout`:**
        *   `cornerRadius` (`--radius-xs`) is consistently applied.
        *   `padding*` tokens for each size variant in Figma JSON (e.g., `Type=Filled, Color=Default, Size=Large` has `paddingLeft/Right: --spacing-sp-8`) are correctly implemented in the corresponding CSS size classes (`.large`, `.default`, `.small`).
        *   `height` values from Figma (e.g., 24, 28, 20) are correctly implemented as `min-height` in CSS size classes.
        *   `strokeWeight` (`--border-width-100`) for outline types is correctly applied in CSS via the `.outline` class.
*   **`colors` (Variants):**
    *   **Filled Type:** Background color (from `..._fill0`) and text color (from `label_label_text_color0`) tokens are correctly mapped in CSS (e.g., `.filled.default`, `.filled.sky`).
    *   The `Type=Filled, Color=Neuteral` variant in Figma JSON includes a `stroke0` property, which is correctly implemented as a border in the `.filled.neuteral` CSS class.
    *   **Outline Type:** Background color (from `..._fill0`, typically `--color-surface-foreground`), border color (from `..._stroke0`), and text color (from `label_label_text_color0`) tokens are correctly mapped in CSS (e.g., `.outline.default`, `.outline.sky`).
*   **`typography` (Variants):**
    *   Figma JSON provides typography styles (font family, size, weight, line height) for each variant combination (e.g., "Type=Filled, Color=Default, Size=Default/Label").
    *   The CSS correctly applies these typography tokens based on the `size` variants (`.default`, `.large`, `.small`), ensuring the text style matches the Figma specification for each size.
*   **Missing Variants in Figma JSON:**
    *   The Figma JSON **does not** contain definitions for `Type=Outline` in combination with `Color=Neuteral` or `Color=Dark`. The component's CSS (`Badge.module.css`) provides styles for these combinations, which are therefore not derived from the "source of truth".

## 5. `ai_rules.md` Adherence Check Summary

*   **I. Core Philosophy & Goals:**
    *   1. **Figma JSON is Absolute Source of Truth:** Largely adhered to. The exception is the CSS styling for `outline.neuteral` and `outline.dark` which are not present in the Figma JSON.
    *   2. **Accessibility First (Leverage Radix):** `Primitive.span` is used, appropriate for this simple, non-interactive component (Rule II.7.a).
    *   3. **Maximum Styling Control with Your Tokens:** Yes, global tokens are used via CSS Modules.
    *   4. **Clean, Maintainable, Idiomatic React:** Yes, `Badge.tsx` follows React best practices.
    *   5. **CSS Purity:** Yes, no JavaScript-driven styling for states.
*   **II. Radix UI Usage:**
    *   1. **Use Appropriate Radix Primitives:** `Primitive.span` is correctly used (Rule II.7.a).
    *   4. **Polymorphism with `asChild`:** Correctly implemented using `Slot`.
*   **III. React Component Implementation (`.tsx`):**
    *   All relevant rules (file naming, props, `React.forwardRef`, `displayName`, `clsx`) are followed.
*   **IV. CSS Modules Implementation (`.module.css`):**
    *   Rules for token imports, base styles, variant styles, and no `!important` are followed.
    *   **Deviation:** Rule IV.4 (Variant Styles mapping *exactly* from Figma JSON) is not met for `outline.neuteral` and `outline.dark` due to their absence in the JSON.
*   **V. Storybook Stories (`.stories.tsx`):**
    *   Most rules are met (default story, controls, argTypes).
    *   Rule V.2 (Variant Combinations) could be more comprehensively met by adding explicit stories for all color variants.

## 6. Conclusion and Recommendations

**Conclusion:**

The `Badge` component is generally well-implemented, aligning closely with the Figma JSON specification and the guidelines outlined in [`ai_rules.md`](ai_rules.md). The React code is clean, props are correctly defined, and styling accurately reflects the Figma design for most variants. Radix UI's `Primitive.span` and `asChild` pattern are used appropriately.

The main area for attention is the handling of `Outline` type badges for `Neuteral` and `Dark` color variants in the CSS, as these are not defined in the current Figma JSON. Storybook coverage is good but could be slightly more exhaustive for color variants.

**Recommendations:**

1.  **CSS & Figma JSON Alignment (`Badge.module.css` & `figma-jsons/done/badge.json`):**
    *   **Clarify Missing Variants:** The styles for `.outline.neuteral` and `.outline.dark` in [`Badge.module.css`](src/components/Badge/Badge.module.css) are not derived from the [`badge.json`](figma-jsons/done/badge.json) as these specific `Type=Outline` combinations for `Color=Neuteral` and `Color=Dark` are missing.
        *   **Option A (Strict Adherence):** Remove these CSS rules if these variants are not intended to be supported. This would ensure 100% adherence to the "Figma JSON as source of truth" principle.
        *   **Option B (Update Figma):** If these variants are desired, update the [`badge.json`](figma-jsons/done/badge.json) to include their specifications. The CSS can then be validated or adjusted to match the official design.
        *   The current implementation (CSS rules with comments) is a temporary workaround but should be resolved for long-term consistency.

2.  **Storybook Enhancements (`Badge.stories.tsx`):**
    *   **Explicit Color Variant Stories:** To better fulfill [`ai_rules.md`](ai_rules.md) (V.2 - Variant Combinations), add explicit stories for each `color` variant, potentially for both `Filled` and `Outline` types. This will improve visual regression testing and documentation.
        *   Example:
            ```typescript
            export const FilledSky: Story = {
              name: 'Filled: Sky',
              args: { badgeType: 'Filled', color: 'Sky', children: 'Sky Badge' },
            };
            export const OutlineGrass: Story = {
              name: 'Outline: Grass',
              args: { badgeType: 'Outline', color: 'Grass', children: 'Grass Badge' },
            };
            // ... and so on for other colors.
            ```

3.  **Minor Observation (Figma JSON):**
    *   The root-level `layout` object in [`badge.json`](figma-jsons/done/badge.json:45-68) specifies padding values that correspond to the "Default" size variant. This is not an issue for the component implementation, as it correctly uses size-specific paddings, but it's a structural note about the JSON.

Addressing these recommendations, particularly the alignment of CSS with Figma JSON for all variants, will ensure the `Badge` component is fully robust and maintainable according to project standards.