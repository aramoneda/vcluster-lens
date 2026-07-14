# QA Review: Switch Component

## 1. Analysis of `Switch.tsx` ([`src/components/Switch/Switch.tsx`](src/components/Switch/Switch.tsx:1))

*   **Radix UI Primitives Usage:**
    *   The component correctly uses `@radix-ui/react-switch` primitives:
        *   [`RadixSwitch.Root`](src/components/Switch/Switch.tsx:63) is used as the main interactive element.
        *   [`RadixSwitch.Thumb`](src/components/Switch/Switch.tsx:81) is used for the sliding part of the switch.
    *   This aligns with `ai_rules.md` (II.1) for using appropriate Radix primitives for interactive components.

*   **Props Definition (`SwitchProps`):**
    *   The [`SwitchProps`](src/components/Switch/Switch.tsx:37) type correctly combines custom `AppSwitchProps` with `RadixSwitch.SwitchProps`.
    *   `AppSwitchProps` ([`src/components/Switch/Switch.tsx:9`](src/components/Switch/Switch.tsx:9)) include:
        *   `size`: `'Default' | 'Small'` (matches Figma JSON `properties.Size`). Default is `'Default'`.
        *   `'aria-label'`: string (for accessibility).
        *   `'aria-labelledby'`: string (for accessibility).
        *   `className`: string (for custom styling).
    *   Radix props like `checked`, `defaultChecked`, `onCheckedChange`, `disabled`, `required`, `name`, `value` are correctly inherited and passed via `...radixRestProps` ([`src/components/Switch/Switch.tsx:52`](src/components/Switch/Switch.tsx:52)).
    *   Prop destructuring and default for `size` ([`src/components/Switch/Switch.tsx:46`](src/components/Switch/Switch.tsx:46)) are correctly implemented as per `ai_rules.md` (I.4).
    *   A console warning ([`src/components/Switch/Switch.tsx:57`](src/components/Switch/Switch.tsx:57)) is implemented if neither `aria-label` nor `aria-labelledby` is provided, which is good for accessibility.

*   **Ref Forwarding:**
    *   The component correctly uses `React.forwardRef` ([`src/components/Switch/Switch.tsx:39`](src/components/Switch/Switch.tsx:39)) and forwards the `ref` to [`RadixSwitch.Root`](src/components/Switch/Switch.tsx:64). This aligns with `ai_rules.md` (III.3).

*   **`displayName`:**
    *   `Switch.displayName = 'Switch'` ([`src/components/Switch/Switch.tsx:87`](src/components/Switch/Switch.tsx:87)) is correctly set as per `ai_rules.md` (III.4).

*   **`clsx` Usage:**
    *   [`clsx`](src/components/Switch/Switch.tsx:3) is used for conditional class names on [`RadixSwitch.Root`](src/components/Switch/Switch.tsx:65), which is good practice (`ai_rules.md` III.5).

*   **Accessibility:**
    *   The component encourages accessibility by requiring `aria-label` or `aria-labelledby`.
    *   Radix primitives handle core ARIA attributes and keyboard navigation.

*   **Label Handling:**
    *   The component itself does not render a visible label. It relies on `aria-label` or an external label referenced by `aria-labelledby`, as documented in the prop description ([`src/components/Switch/Switch.tsx:17`](src/components/Switch/Switch.tsx:17)). This is an acceptable pattern. The Figma JSON does not specify a label as part of the component structure itself.

## 2. Analysis of `Switch.module.css` ([`src/components/Switch/Switch.module.css`](src/components/Switch/Switch.module.css:1))

*   **Token Imports:**
    *   Correctly imports global token files ([`src/components/Switch/Switch.module.css:1-3`](src/components/Switch/Switch.module.css:1)):
        *   `../../../globalTokens/figma-color-tokens.css`
        *   `../../../globalTokens/figma-numeric-tokens.css`
        *   `../../../globalTokens/figma-typography-tokens.css`
    *   This adheres to `ai_rules.md` (IV.1).

*   **Styling of Radix Parts:**
    *   Styles are applied to `.switchRoot` ([`src/components/Switch/Switch.module.css:5`](src/components/Switch/Switch.module.css:5)) (corresponding to `RadixSwitch.Root`) and `.switchThumb` ([`src/components/Switch/Switch.module.css:35`](src/components/Switch/Switch.module.css:35)) (corresponding to `RadixSwitch.Thumb`).
    *   While `ai_rules.md` (IV.2) prefers targeting `data-*` attributes for Radix parts, using dedicated classes for the primary root and thumb elements is acceptable if consistently applied and combined with `data-state` selectors. The current implementation uses classes like `.switchRoot` and then qualifies them with `data-state` attributes (e.g., `.switchRoot[data-state='checked']`).

*   **`data-*` Attribute Usage for States:**
    *   Correctly uses Radix `data-*` attributes for styling states:
        *   `[data-state='unchecked']` ([`src/components/Switch/Switch.module.css:65`](src/components/Switch/Switch.module.css:65))
        *   `[data-state='checked']` ([`src/components/Switch/Switch.module.css:69`](src/components/Switch/Switch.module.css:69))
        *   `[data-disabled]` ([`src/components/Switch/Switch.module.css:89`](src/components/Switch/Switch.module.css:89))
    *   This aligns with `ai_rules.md` (I.5, II.2, IV.5).

*   **Figma JSON Property Mapping (Variants & Layout):**
    *   **Size Variants:**
        *   `.sizeDefault` ([`src/components/Switch/Switch.module.css:22`](src/components/Switch/Switch.module.css:22)):
            *   `width: 40px` (matches Figma `layout.width` for Default size).
            *   `height: 24px` (matches Figma `layout.height` for Default size).
            *   `padding: var(--spacing-sp-4)` (matches Figma `layout.padding.token` for Default size).
        *   `.sizeSmall` ([`src/components/Switch/Switch.module.css:29`](src/components/Switch/Switch.module.css:29)):
            *   `width: 28px` (matches Figma `layout.width` for Small size).
            *   `height: 16px` (matches Figma `layout.height` for Small size).
            *   `padding: var(--spacing-sp-2)` (matches Figma `layout.padding.token` for Small size).
    *   **Thumb Sizing:**
        *   Thumb dimensions are calculated based on root size and padding (e.g., [`src/components/Switch/Switch.module.css:47-50`](src/components/Switch/Switch.module.css:47) for Default, [`src/components/Switch/Switch.module.css:56-59`](src/components/Switch/Switch.module.css:56) for Small). This is a robust way to ensure the thumb fits correctly within the track.
            *   Default thumb: `width: calc(24px - (2 * var(--spacing-sp-4)))` (16px), `height: calc(24px - (2 * var(--spacing-sp-4)))` (16px).
            *   Small thumb: `width: calc(16px - (2 * var(--spacing-sp-2)))` (12px), `height: calc(16px - (2 * var(--spacing-sp-2)))` (12px).
    *   **Colors:**
        *   `.switchRoot[data-state='unchecked']`: `background-color: var(--color-surface-toggle-Default)` ([`src/components/Switch/Switch.module.css:66`](src/components/Switch/Switch.module.css:66)) (matches Figma `state=default,_on=false..._fill0.token`).
        *   `.switchRoot[data-state='checked']`: `background-color: var(--color-surface-toggle-Active)` ([`src/components/Switch/Switch.module.css:70`](src/components/Switch/Switch.module.css:70)) (matches Figma `state=default,_on=true..._fill0.token`).
        *   `.switchThumb`: `background-color: var(--color-surface-toggle-Ellipse)` ([`src/components/Switch/Switch.module.css:38`](src/components/Switch/Switch.module.css:38)) (matches Figma `thumb-container_thumb_thumb_fill0.token`).
        *   `.switchRoot[data-disabled]`: `background-color: var(--color-surface-toggle-Disabled)` ([`src/components/Switch/Switch.module.css:90`](src/components/Switch/Switch.module.css:90)) (matches Figma `state=disabled..._fill0.token`).
        *   `.switchRoot[data-disabled] .switchThumb`: `opacity: 0.6` ([`src/components/Switch/Switch.module.css:97`](src/components/Switch/Switch.module.css:97)). Figma JSON specifies `boundVariables.opacity.tokenName == "--opacity-60"` for the thumb in disabled state. The CSS notes this token isn't in global CSS and uses the raw value. This is acceptable per `ai_rules.md` (I.3) "if you see raw values in JSON - use raw values" (implicitly, if token is missing).
    *   **Thumb Position (`transform: translateX`):**
        *   Calculations for `translateX` on checked state appear correct based on root width, padding, and thumb width.
            *   Default: [`src/components/Switch/Switch.module.css:78`](src/components/Switch/Switch.module.css:78) `transform: translateX(calc(40px - (2 * var(--spacing-sp-4)) - (24px - (2 * var(--spacing-sp-4)))));` (evaluates to `translateX(16px)`).
            *   Small: [`src/components/Switch/Switch.module.css:85`](src/components/Switch/Switch.module.css:85) `transform: translateX(calc(28px - (2 * var(--spacing-sp-2)) - (16px - (2 * var(--spacing-sp-2)))));` (evaluates to `translateX(12px)`).

*   **Focus State (`:focus-visible`):**
    *   `.switchRoot:focus-visible` ([`src/components/Switch/Switch.module.css:101`](src/components/Switch/Switch.module.css:101)) correctly applies a `box-shadow` using design tokens (`--color-surface-background`, `--color-surface-focused`).
    *   The comment correctly references `ai_rules.md` (IV.5) regarding focus style. The rule specifies `:focus-visible:not([data-disabled])`. The CSS does not include `:not([data-disabled])`. This is a minor deviation; Radix typically handles focus on disabled elements correctly by not allowing focus, but explicitly adding it would be more robust.

*   **Typography:**
    *   The Figma JSON for "Toggle" does not have a `typography` section, which is appropriate as a switch itself doesn't typically contain text. Labels are handled externally.

*   **No `!important`:**
    *   No `!important` found, adhering to `ai_rules.md` (IV.7).

## 3. Analysis of `Switch.stories.tsx` ([`src/components/Switch/Switch.stories.tsx`](src/components/Switch/Switch.stories.tsx:1))

*   **Meta Configuration:**
    *   `title: 'Components/Switch'` ([`src/components/Switch/Switch.stories.tsx:6`](src/components/Switch/Switch.stories.tsx:6)).
    *   `component: Switch` ([`src/components/Switch/Switch.stories.tsx:7`](src/components/Switch/Switch.stories.tsx:7)).
    *   `tags: ['autodocs']` ([`src/components/Switch/Switch.stories.tsx:8`](src/components/Switch/Switch.stories.tsx:8)).

*   **ArgTypes:**
    *   Comprehensive `argTypes` are defined for all relevant props ([`src/components/Switch/Switch.stories.tsx:9-90`](src/components/Switch/Switch.stories.tsx:9)), including `size`, `checked`, `defaultChecked`, `onCheckedChange`, `disabled`, `required`, `name`, `value`, `aria-label`, `aria-labelledby`, and `className`.
    *   Controls, descriptions, and table information are well-defined.
    *   `onCheckedChange` correctly uses `action: 'onCheckedChange'`.

*   **Stories Coverage:**
    *   **Default State (Unchecked):** `DefaultUnchecked` ([`src/components/Switch/Switch.stories.tsx:102`](src/components/Switch/Switch.stories.tsx:102)).
    *   **Variant Combinations & States:**
        *   `DefaultChecked` ([`src/components/Switch/Switch.stories.tsx:112`](src/components/Switch/Switch.stories.tsx:112))
        *   `DefaultDisabledUnchecked` ([`src/components/Switch/Switch.stories.tsx:122`](src/components/Switch/Switch.stories.tsx:122))
        *   `DefaultDisabledChecked` ([`src/components/Switch/Switch.stories.tsx:132`](src/components/Switch/Switch.stories.tsx:132))
        *   `SmallUnchecked` ([`src/components/Switch/Switch.stories.tsx:142`](src/components/Switch/Switch.stories.tsx:142))
        *   `SmallChecked` ([`src/components/Switch/Switch.stories.tsx:152`](src/components/Switch/Switch.stories.tsx:152))
        *   `SmallDisabledUnchecked` ([`src/components/Switch/Switch.stories.tsx:162`](src/components/Switch/Switch.stories.tsx:162))
        *   `SmallDisabledChecked` ([`src/components/Switch/Switch.stories.tsx:172`](src/components/Switch/Switch.stories.tsx:172))
    *   All stories provide appropriate `aria-label` for accessibility in Storybook.
    *   This covers different states (checked, unchecked, disabled) and variants (sizes) as required.

*   **Content Configurations:**
    *   `WithVisibleLabel` story ([`src/components/Switch/Switch.stories.tsx:182`](src/components/Switch/Switch.stories.tsx:182)) demonstrates usage with an external label and `aria-labelledby`, which is good.

*   **Interactive Playground:**
    *   `Interactive` story ([`src/components/Switch/Switch.stories.tsx:198`](src/components/Switch/Switch.stories.tsx:198)) allows users to play with props.

*   **Adherence to `ai_rules.md` (V):**
    *   Stories cover default props, variant combinations, and disabled state.
    *   Initial checked state is demonstrated.
    *   Controls are used for props.
    *   No stories manually set hover/focus/active states.

## 4. Figma JSON Cross-Reference Summary ([`figma-jsons/done/switch.json`](figma-jsons/done/switch.json:1))

*   **Component Name:** Figma JSON `name: "Toggle"` ([`figma-jsons/done/switch.json:2`](figma-jsons/done/switch.json:2)). The React component is named `Switch`. This is a common mapping.
*   **Properties:**
    *   `State`: "Disabled", "Default", "Focused".
        *   "Default" and "Disabled" states are handled by `[data-state]` and `[data-disabled]` CSS selectors.
        *   "Focused" state is handled by `:focus-visible` CSS selector.
    *   `On`: "False", "True".
        *   Handled by `checked` prop and `[data-state="checked/unchecked"]` CSS selectors.
    *   `Size`: "Default", "Small".
        *   Handled by `size` prop and `.sizeDefault`/`.sizeSmall` CSS classes.
*   **Layout:**
    *   Root `layout` (width, height, padding) for "Default" size is correctly mapped to `.sizeDefault` CSS.
    *   Variant-specific `layout` properties for "Small" size are correctly mapped to `.sizeSmall` CSS.
*   **Colors:**
    *   Color tokens from `variants[*].colors` are correctly mapped to CSS for different states (`--color-surface-toggle-Default`, `--color-surface-toggle-Active`, `--color-surface-toggle-Disabled`, `--color-surface-toggle-Ellipse`).
*   **Structure:**
    *   The Figma structure shows a `thumb-container` and `thumb`. The React component uses `RadixSwitch.Root` and `RadixSwitch.Thumb`. The CSS styles `.switchRoot` and `.switchThumb`. This is a direct and correct mapping.
    *   The `opacity` for the disabled thumb (`--opacity-60`) is noted in CSS and applied directly as the token was missing from global files.
*   **Typography:**
    *   No `typography` section in Figma JSON, which is appropriate.

## 5. `ai_rules.md` Adherence Check Summary

*   **I. Core Philosophy & Goals:**
    *   1. Figma JSON as Source of Truth: Largely adhered to for styling, dimensions, and variants.
    *   2. Accessibility First (Leverage Radix): Adhered to by using Radix primitives and `aria-*` props.
    *   3. Maximum Styling Control with Your Tokens: Adhered to; styles use global tokens via CSS Modules. Raw value for opacity used where token was missing, which is acceptable.
    *   4. Clean, Maintainable, Idiomatic React: Adhered to (prop destructuring, typing, `clsx`, `forwardRef`, `displayName`).
    *   5. CSS Purity: Adhered to (uses pseudo-classes and `data-state` attributes).

*   **II. Radix UI Usage:**
    *   1. Appropriate Radix Primitives: Adhered to (`Switch.Root`, `Switch.Thumb`).
    *   2. Leverage Radix Parts and `data-state`: Adhered to.
    *   3. Radix Themes Components: Not used, which is correct as not specified.
    *   4. Polymorphism with `asChild`: The `SwitchProps` type does not explicitly include `asChild`, and `React.forwardRef` is typed for `RadixSwitch.Root` which itself supports `asChild`. While not explicitly implemented with `<Slot>`, Radix's `Root` often handles this. For full compliance with "apply this consistently to *all* components built with Radix Primitives" (II.4), explicitly adding `asChild?: boolean` to `AppSwitchProps` and wrapping `RadixSwitch.Root` with `Slot` if `asChild` is true would be more explicit, though Radix's own primitives usually manage this well. Given `RadixSwitch.Root` is the outermost element, its `asChild` prop should function as expected.

*   **III. React Component Implementation:**
    *   1. File Naming: Adhered to.
    *   2. Props: Adhered to.
    *   3. `React.forwardRef`: Adhered to.
    *   4. `displayName`: Adhered to.
    *   5. `clsx`: Adhered to.
    *   6. Icon/Label Rendering: N/A for Switch itself, label handled externally.
    *   7. Accessibility Attributes: Adhered to.

*   **IV. CSS Modules Implementation:**
    *   1. Token Imports: Adhered to.
    *   2. Target Radix Parts via `data-*` Attributes: Minor deviation. Uses class selectors (`.switchRoot`, `.switchThumb`) qualified by `data-state` attributes, rather than directly targeting `[data-radix-switch-root]` or `[data-radix-switch-thumb]` as the primary selector for base styles of these parts. This is acceptable but direct attribute targeting is preferred by the rule.
    *   3. Base Styles: Adhered to.
    *   4. Variant Styles: Adhered to.
    *   5. States (Pseudo-classes & Radix `data-*`): Mostly adhered to. The `:focus-visible` rule ([`src/components/Switch/Switch.module.css:101`](src/components/Switch/Switch.module.css:101)) is missing `:not([data-disabled])` as per `ai_rules.md` (IV.5).
    *   6. Internal Parts Styling: Adhered to for `.switchThumb`.
    *   7. NO `!important`: Adhered to.
    *   8. Comments: Good comments tracing to Figma.

*   **V. Storybook Stories:**
    *   Adhered to all points.

## 6. Conclusion and Recommendations

The `Switch` component is well-implemented, closely following the Figma JSON specification and adhering to most of the `ai_rules.md`. It correctly utilizes Radix UI Switch primitives for core functionality and accessibility. Styling is managed effectively through CSS Modules and design tokens. Storybook stories provide good coverage.

**Key Strengths:**
*   Correct use of Radix UI `Switch.Root` and `Switch.Thumb`.
*   Accurate mapping of Figma JSON properties (sizes, colors, states) to CSS.
*   Strong adherence to accessibility best practices through Radix and `aria-*` props.
*   Clean and well-structured React code.
*   Comprehensive Storybook stories.

**Minor Recommendations for Enhancement (Optional):**
1.  **CSS Targeting for Radix Parts (Rule IV.2):** Consider changing the base selectors for Radix parts in `Switch.module.css` from `.switchRoot` and `.switchThumb` to `[data-radix-switch-root]` and `[data-radix-switch-thumb]` respectively, and then qualifying these with size/state classes (e.g., `.sizeDefault[data-radix-switch-root]`). This would align more strictly with `ai_rules.md` IV.2 for robustness. Current approach is functional.
2.  **CSS Focus-Visible State (Rule IV.5):** Add `:not([data-disabled])` to the `.switchRoot:focus-visible` selector in [`Switch.module.css`](src/components/Switch/Switch.module.css:101) for stricter adherence:
    ```css
    .switchRoot:focus-visible:not([data-disabled]) { /* ... */ }
    ```
3.  **`asChild` Prop (Rule II.4):** While `RadixSwitch.Root` inherently supports `asChild`, to be fully explicit as per `ai_rules.md` general guidance for all components, `asChild?: boolean` could be added to `AppSwitchProps` and `Slot` from `@radix-ui/react-slot` could be used if `asChild` is true. However, for a component like Switch where the root is almost always intended to be its specific Radix element, this is a low-priority enhancement.

Overall, the component is of high quality and ready for use. The recommendations are minor and aimed at even stricter alignment with the provided guidelines.