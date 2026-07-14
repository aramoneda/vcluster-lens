# QA Review: BadgeIcon Component

## 1. Analysis of `BadgeIcon.tsx` ([`src/components/BadgeIcon/BadgeIcon.tsx`](src/components/BadgeIcon/BadgeIcon.tsx:1))

*   **Radix Primitives Usage:**
    *   The component correctly uses `@radix-ui/react-primitive Primitive.span` as its base element, which is appropriate for a simple, non-interactive presentational component as per `ai_rules.md` (Rule II.1.c).
    *   It correctly implements the `asChild` prop using `@radix-ui/react-slot Slot` for polymorphism (Rule II.4).

*   **Props (`BadgeIconProps`):**
    *   The `BadgeIconProps` interface ([`src/components/BadgeIcon/BadgeIcon.tsx:11`](src/components/BadgeIcon/BadgeIcon.tsx:11)) extends `React.HTMLAttributes<HTMLSpanElement>`, which is suitable for a `<span>`-based component.
    *   **`icon: React.ElementType`**: Correctly typed for passing Lucide icon components. This is a required prop.
    *   **`type?: BadgeIconType`**: String literal union (`'Filled' | 'Outline'`). Defaults to `'Filled'`. Matches Figma specification.
    *   **`color?: BadgeIconColor`**: String literal union (`'Default' | 'Sky' | 'Grass' | 'Bored' | 'Negative'`). Defaults to `'Default'`. Matches Figma specification.
    *   **`size?: BadgeIconSize`**: String literal union (`'Default' | 'Large' | 'Small'`). Defaults to `'Large'`. Matches Figma specification.
    *   **`className?: string`**: Allows consumers to pass additional class names.
    *   **`asChild?: boolean`**: Allows polymorphism.
    *   Props are destructured with defaults applied at the beginning of the component function, aligning with `ai_rules.md` (Rule I.4.a).
    *   TSDoc comments are present for props.

*   **`React.forwardRef`:**
    *   The component correctly uses `React.forwardRef` and is typed to forward a ref to an `HTMLSpanElement` ([`src/components/BadgeIcon/BadgeIcon.tsx:41`](src/components/BadgeIcon/BadgeIcon.tsx:41)).

*   **`displayName`:**
    *   The `displayName` is correctly set to `'BadgeIcon'` ([`src/components/BadgeIcon/BadgeIcon.tsx:97`](src/components/BadgeIcon/BadgeIcon.tsx:97)).

*   **`clsx` Utility:**
    *   The `clsx` utility is used for conditionally applying CSS module class names ([`src/components/BadgeIcon/BadgeIcon.tsx:81`](src/components/BadgeIcon/BadgeIcon.tsx:81)).

*   **Icon Rendering:**
    *   The passed `IconComponent` is rendered as `<IconComponent className={styles.iconSvg} aria-hidden="true" />` ([`src/components/BadgeIcon/BadgeIcon.tsx:91`](src/components/BadgeIcon/BadgeIcon.tsx:91)).
    *   The `iconSizeProp` logic ([`src/components/BadgeIcon/BadgeIcon.tsx:63-75`](src/components/BadgeIcon/BadgeIcon.tsx:63)) is defined but not ultimately passed to the `IconComponent`. The comment `// We will rely on CSS to size the SVG via the wrapper.` indicates that CSS is intended to control the icon's visual size within the padded container, which is the preferred method.

*   **Accessibility:**
    *   The root `Comp` element has `aria-hidden={ariaHidden}` which defaults to `true` ([`src/components/BadgeIcon/BadgeIcon.tsx:50`](src/components/BadgeIcon/BadgeIcon.tsx:50), [`src/components/BadgeIcon/BadgeIcon.tsx:88`](src/components/BadgeIcon/BadgeIcon.tsx:88)). This is generally acceptable for a purely decorative badge icon.
    *   The rendered `IconComponent` also has `aria-hidden="true"` ([`src/components/BadgeIcon/BadgeIcon.tsx:91`](src/components/BadgeIcon/BadgeIcon.tsx:91)).
    *   If the `BadgeIcon` were to convey semantic meaning not available otherwise, `aria-hidden` would need to be `false` and an appropriate `aria-label` or other ARIA attributes might be necessary on the root element.

*   **Overall Code Quality:**
    *   The component is clean, well-structured, and follows React best practices as outlined in `ai_rules.md`.

## 2. Analysis of `BadgeIcon.module.css` ([`src/components/BadgeIcon/BadgeIcon.module.css`](src/components/BadgeIcon/BadgeIcon.module.css:1))

*   **Token Imports:**
    *   Imports `../../../globalTokens/figma-color-tokens.css` ([`src/components/BadgeIcon/BadgeIcon.module.css:1`](src/components/BadgeIcon/BadgeIcon.module.css:1)) and `../../../globalTokens/figma-numeric-tokens.css` ([`src/components/BadgeIcon/BadgeIcon.module.css:2`](src/components/BadgeIcon/BadgeIcon.module.css:2)).
    *   `figma-typography-tokens.css` is not imported, which is acceptable as this component does not directly handle text. (Adherence to `ai_rules.md` IV.1 is partial but contextually fine).

*   **Base Styles (`.badgeIcon`):**
    *   `display: inline-flex`, `align-items: center`, `justify-content: center`: Correct for icon centering.
    *   `box-sizing: border-box`: Good practice.
    *   `border-radius: var(--radius-xxl)`: Matches `layout.cornerRadius.token` from Figma JSON.
    *   `flex-shrink: 0`: Prevents shrinking in flex layouts.

*   **Icon SVG Styling (`.badgeIcon .iconSvg`):**
    *   `display: block`: Good for removing extra space.
    *   `width: 100%`, `height: 100%`: Ensures the SVG fills the padded area of its container, allowing CSS to control the effective icon size.

*   **Size Variants (`.sizeDefault`, `.sizeLarge`, `.sizeSmall`):**
    *   `width`, `height`, and `padding` properties correctly map to the Figma JSON `layout` specifications for each size, using the corresponding design tokens (e.g., `.sizeDefault` uses `width: 32px`, `height: 32px`, `padding: var(--spacing-sp-4)`).

*   **Type Variants (`.typeFilled`, `.typeOutline`):**
    *   `.typeOutline`:
        *   `border-style: solid`.
        *   `border-width: var(--border-width-100)`: Matches `layout.strokeWeight.token` from Figma JSON.
        *   `background-color: var(--color-surface-foreground)`: Matches `type=outline,..._fill0.token` from Figma JSON.

*   **Color Variants (Combined with Type):**
    *   Styles for `Filled` types correctly use background color tokens (e.g., `.typeFilled.colorSky` uses `background-color: var(--azure-100)` ([`src/components/BadgeIcon/BadgeIcon.module.css:88`](src/components/BadgeIcon/BadgeIcon.module.css:88))).
    *   Styles for `Outline` types correctly use border color tokens (e.g., `.typeOutline.colorSky` uses `border-color: var(--azure-200)` ([`src/components/BadgeIcon/BadgeIcon.module.css:92`](src/components/BadgeIcon/BadgeIcon.module.css:92])).
    *   The `color` property is used to set the icon color, relying on `currentColor` for the SVG. The chosen color tokens (e.g., `var(--azure-500)` for icon on `var(--azure-100)` background) provide good contrast and are reasonable assumptions given Figma JSON doesn't explicitly state icon glyph colors.
    *   **Discrepancy Noted:** For `.typeOutline.colorNegative` ([`src/components/BadgeIcon/BadgeIcon.module.css:121-130`](src/components/BadgeIcon/BadgeIcon.module.css:121)), the CSS uses `border-color: var(--color-state-error-medium)`. The comment correctly notes that the Figma JSON for this variant specifies `_stroke0.token` as `--warning-light`. This is a deviation.

*   **CSS Comments:**
    *   Comments are used to trace CSS rules back to Figma JSON properties (e.g., `/* variants.colors.type=filled,_color=default,..._fill0.token */`), which is helpful.

*   **`ai_rules.md` Adherence (CSS):**
    *   Follows token usage (Rule I.3, IV.1).
    *   No `!important` (Rule IV.7).
    *   No interactive state styling (e.g. `:hover`) as the component is not interactive itself.

## 3. Analysis of `BadgeIcon.stories.tsx` ([`src/components/BadgeIcon/BadgeIcon.stories.tsx`](src/components/BadgeIcon/BadgeIcon.stories.tsx:1))

*   **Meta Configuration:**
    *   `title: 'Components/BadgeIcon'` and `component: BadgeIcon` are correctly set.

*   **Default Story (`DefaultStory`):**
    *   Renders the component with `icon: Circle`, `type: 'Filled'`, `color: 'Default'`, `size: 'Large'` ([`src/components/BadgeIcon/BadgeIcon.stories.tsx:18`](src/components/BadgeIcon/BadgeIcon.stories.tsx:18)). These align with the component's and Figma's default props for `type`, `color`, and `size`.

*   **Variant Combinations:**
    *   Stories like `FilledSkyLarge`, `OutlineGrassDefault`, `FilledBoredSmall`, `OutlineNegativeLarge`, `FilledDefaultSmall` provide good coverage of different `type`, `color`, and `size` combinations.

*   **Content Configurations:**
    *   `VariousIconsFilledDefault` ([`src/components/BadgeIcon/BadgeIcon.stories.tsx:74`](src/components/BadgeIcon/BadgeIcon.stories.tsx:74)) and `VariousIconsOutlineSky` ([`src/components/BadgeIcon/BadgeIcon.stories.tsx:92`](src/components/BadgeIcon/BadgeIcon.stories.tsx:92)) demonstrate the component with different Lucide icons, showcasing its flexibility.

*   **Controls (Args):**
    *   Storybook's controls addon will automatically generate UI controls for all props defined in `BadgeIconProps`, satisfying Rule V.5.

*   **`ai_rules.md` Adherence (Stories V):**
    *   Default story is present (Rule V.1).
    *   Variant combinations are covered (Rule V.2).
    *   State demonstrations (e.g., `disabled`) are not applicable as `BadgeIcon` has no such interactive states (Rule V.3).
    *   Content configurations (different icons) are shown (Rule V.4).
    *   Interactive states like hover/focus are not manually set, which is correct (Rule V.6).

## 4. Figma JSON Cross-Reference Summary ([`figma-jsons/done/badgeicon.json`](figma-jsons/done/badgeicon.json:1))

*   **Properties Matching:**
    *   Component prop names (`type`, `color`, `size`) and their possible values directly map to the `properties` section in the Figma JSON ([`figma-jsons/done/badgeicon.json:4-41`](figma-jsons/done/badgeicon.json:4)).
    *   Default prop values in the code (`type='Filled'`, `color='Default'`, `size='Large'`) match the `default` values in the Figma JSON `properties`.

*   **Layout Styling:**
    *   `layout.cornerRadius.token: "--radius-xxl"` ([`figma-jsons/done/badgeicon.json:47`](figma-jsons/done/badgeicon.json:47)) is correctly applied in CSS.
    *   `layout.padding.token` values for `Default`, `Large`, and `Small` sizes (e.g., `--spacing-sp-4` for Default ([`figma-jsons/done/badgeicon.json:51`](figma-jsons/done/badgeicon.json:51))) are correctly applied in CSS.
    *   `layout.width` and `layout.height` for each size variant are correctly implemented in CSS.
    *   `layout.strokeWeight.token: "--border-width-100"` ([`figma-jsons/done/badgeicon.json:200`](figma-jsons/done/badgeicon.json:200)) for `Outline` types is correctly applied in CSS.

*   **Variant Styling:**
    *   Background colors (`_fill0.token`) for `Filled` type variants in Figma JSON (e.g., `type=filled,_color=sky,_size=default_fill0` uses `--azure-100` ([`figma-jsons/done/badgeicon.json:74`](figma-jsons/done/badgeicon.json:74))) are correctly mapped in CSS.
    *   Border colors (`_stroke0.token`) for `Outline` type variants in Figma JSON (e.g., `type=outline,_color=sky,_size=default_stroke0` uses `--azure-200` ([`figma-jsons/done/badgeicon.json:184`](figma-jsons/done/badgeicon.json:184))) are generally mapped correctly in CSS.
    *   The background color for `Outline` types (`_fill0.token` = `--color-surface-foreground` ([`figma-jsons/done/badgeicon.json:179`](figma-jsons/done/badgeicon.json:179))) is correctly applied in CSS.
    *   **Discrepancy:** For the variant `Type=Outline, Color=Negative, Size=Default`, the Figma JSON specifies `_stroke0.token` as `--warning-light` ([`figma-jsons/done/badgeicon.json:895`](figma-jsons/done/badgeicon.json:895)). The CSS implementation uses `var(--color-state-error-medium)` ([`src/components/BadgeIcon/BadgeIcon.module.css:128`](src/components/BadgeIcon/BadgeIcon.module.css:128)) for the border. This is a deviation.

*   **Icon Color Specification:**
    *   The Figma JSON does not explicitly define the color token for the *icon glyph* itself within each badge variant. It only defines fill/stroke for the badge container. The component's approach of setting a `color` property on the badge wrapper and relying on `currentColor` for the SVG icon is a practical and common solution.

*   **Typography:**
    *   The Figma JSON has an empty `typography: {}` object ([`figma-jsons/done/badgeicon.json:2075`](figma-jsons/done/badgeicon.json:2075)). The component correctly does not apply any typography styles.

## 5. `ai_rules.md` Adherence Check Summary

*   **I. Core Philosophy:**
    *   **1. Figma JSON is Source of Truth:** Largely adhered to. One discrepancy noted for `Outline Negative` border color. Icon colors are inferred due to lack of explicit spec in Figma JSON for the icon glyph itself. (Mostly Met)
    *   **2. Accessibility First (Leverage Radix):** Uses `Primitive.span`. `aria-hidden="true"` is default and appropriate for a decorative icon. (Met)
    *   **3. Maximum Styling Control with Your Tokens:** Yes, styling is via CSS Modules and global design tokens. (Met)
    *   **4. Clean, Maintainable, Idiomatic React:** Follows guidelines for prop destructuring, defaults, TypeScript, `forwardRef`, `clsx`. (Met)
    *   **5. CSS Purity:** Yes, no JS-driven state classes for styling. (Met)

*   **II. Radix UI Usage:**
    *   **1.c. Simple Presentational Components:** Correctly uses `Primitive.span`. (Met)
    *   **4. Polymorphism with `asChild`:** Implemented using `Slot`. (Met)

*   **III. React Component Implementation (`.tsx`):**
    *   **1. File Naming:** `BadgeIcon.tsx`, `BadgeIcon.module.css`. (Met)
    *   **2. Props:** Interface defined, extends `React.HTMLAttributes<HTMLSpanElement>`, variants from Figma, defaults match. (Met)
    *   **3. `React.forwardRef`:** Used and correctly typed. (Met)
    *   **4. `displayName`:** Set. (Met)
    *   **5. `clsx` Utility:** Used. (Met)
    *   **7. Accessibility Attributes:** `aria-hidden` used appropriately for a decorative element. (Met)

*   **IV. CSS Modules Implementation (`.module.css`):**
    *   **1. Token Imports:** Imports color and numeric tokens. Typography tokens not imported but not strictly needed for this icon-only component. (Mostly Met)
    *   **3. Base Styles:** Applied correctly. (Met)
    *   **4. Variant Styles:** Implemented based on Figma JSON. (Met)
    *   **5. States:** Not applicable as `BadgeIcon` is non-interactive. (N/A)
    *   **6. Internal Parts Styling:** `.iconSvg` is styled. (Met)
    *   **7. NO `!important`:** Confirmed. (Met)
    *   **8. Comments:** Good traceability to Figma JSON. (Met)

*   **V. Storybook Stories (`.stories.tsx`):**
    *   **1. Default Story:** Present. (Met)
    *   **2. Variant Combinations:** Covered. (Met)
    *   **3. State Demonstrations:** N/A (no interactive states like `disabled`). (Met)
    *   **4. Content Configurations:** Different icons shown. (Met)
    *   **5. Controls (Args):** Implicitly handled by Storybook. (Met)
    *   **6. Interactive States:** No manual setting of hover/focus/active. (Met)

## 6. Conclusion and Recommendations

**Conclusion:**

The `BadgeIcon` component is generally well-implemented, adhering closely to both the Figma JSON specification and the guidelines outlined in `ai_rules.md`. It effectively uses Radix Primitives for a presentational role, employs CSS Modules with design tokens for styling, and features comprehensive Storybook stories. The code is clean, typed, and follows React best practices.

**Recommendations:**

1.  **Resolve Border Color Discrepancy for `Outline Negative` Variant:**
    *   **Issue:** The CSS for `Type=Outline, Color=Negative` uses `border-color: var(--color-state-error-medium)` ([`src/components/BadgeIcon/BadgeIcon.module.css:128`](src/components/BadgeIcon/BadgeIcon.module.css:128)), while the Figma JSON specifies the corresponding `_stroke0.token` as `--warning-light` ([`figma-jsons/done/badgeicon.json:895`](figma-jsons/done/badgeicon.json:895)).
    *   **Action:** Clarify the intended token. If `--warning-light` is correct, update the CSS. If `--color-state-error-medium` is correct, the Figma JSON should ideally be updated to reflect this for consistency. The CSS comment already highlights this, which is good.

2.  **Explicit Icon Color Definition in Figma (Optional Enhancement):**
    *   **Observation:** The Figma JSON does not explicitly define the color for the icon glyph itself within each badge variant. The current implementation (using `currentColor` via the `color` CSS property on the badge) is a sensible and common approach.
    *   **Suggestion:** For future components or if pixel-perfect control over icon colors per variant is critical, consider adding explicit token definitions for icon glyph colors in the Figma specifications. This would remove any ambiguity.

3.  **Contextual Accessibility for `aria-hidden` (Consideration):**
    *   **Observation:** The component defaults to `aria-hidden="true"` ([`src/components/BadgeIcon/BadgeIcon.tsx:50`](src/components/BadgeIcon/BadgeIcon.tsx:50)), which is appropriate for purely decorative icons.
    *   **Suggestion:** If there are use cases where `BadgeIcon` might convey information not otherwise available textually, developers should be mindful to set `aria-hidden="false"` and potentially provide an `aria-label` on the `BadgeIcon` instance. The current component implementation is fine for its primary role as a decorative element.

4.  **Typography Token Import (Minor Consistency):**
    *   **Observation:** `figma-typography-tokens.css` is not imported in [`BadgeIcon.module.css`](src/components/BadgeIcon/BadgeIcon.module.css:1).
    *   **Suggestion:** While not strictly necessary for this icon-only component, for overall consistency with `ai_rules.md` (IV.1), consider including all three global token files (`color`, `numeric`, `typography`) in CSS module imports as a standard practice, unless a component definitively has no typographic aspects. This is a minor point for `BadgeIcon`.