# QA Review: Tooltip Component

Date: August 5, 2025
Reviewer: Roo (AI Assistant)

## 1. Overview

This document provides a comprehensive QA review of the `Tooltip` React component. The review process involved analyzing the component's source code, CSS module, Storybook stories, and its corresponding Figma JSON specification, cross-referencing against the guidelines outlined in [`ai_rules.md`](ai_rules.md:1).

**Files Reviewed:**
*   [`src/components/Tooltip/Tooltip.tsx`](src/components/Tooltip/Tooltip.tsx:1)
*   [`src/components/Tooltip/Tooltip.module.css`](src/components/Tooltip/Tooltip.module.css:1)
*   [`src/components/Tooltip/Tooltip.stories.tsx`](src/components/Tooltip/Tooltip.stories.tsx:1)
*   [`figma-jsons/done/tooltip.json`](figma-jsons/done/tooltip.json:1)
*   [`ai_rules.md`](ai_rules.md:1)
*   Global Tokens:
    *   [`globalTokens/figma-color-tokens.css`](globalTokens/figma-color-tokens.css)
    *   [`globalTokens/figma-numeric-tokens.css`](globalTokens/figma-numeric-tokens.css)
    *   [`globalTokens/figma-typography-tokens.css`](globalTokens/figma-typography-tokens.css)

## 2. Analysis of `Tooltip.tsx`

The [`Tooltip.tsx`](src/components/Tooltip/Tooltip.tsx:1) file defines the structure and logic of the `Tooltip` component.

### 2.1. Radix UI Primitives Usage
The component correctly utilizes `@radix-ui/react-tooltip` primitives:
*   **`RadixTooltip.Provider`**: Used at the root to scope tooltip context and correctly passes the `delayDuration` prop ([`Tooltip.tsx:63`](src/components/Tooltip/Tooltip.tsx:63)).
*   **`RadixTooltip.Root`**: Serves as the main container for the tooltip instance ([`Tooltip.tsx:64`](src/components/Tooltip/Tooltip.tsx:64)).
*   **`RadixTooltip.Trigger`**: Wraps the `children` prop and correctly implements `asChild` for composability ([`Tooltip.tsx:65`](src/components/Tooltip/Tooltip.tsx:65)).
*   **`RadixTooltip.Portal`**: Used to render the tooltip content in a different DOM tree, ensuring it appears above other elements. Conditionally rendered based on the `!disabled` prop ([`Tooltip.tsx:69`](src/components/Tooltip/Tooltip.tsx:69)).
*   **`RadixTooltip.Content`**: Represents the main body of the tooltip. It correctly:
    *   Forwards the `ref` using `forwardedRef` ([`Tooltip.tsx:71`](src/components/Tooltip/Tooltip.tsx:71)).
    *   Applies CSS module classes using `clsx` and allows `className` passthrough ([`Tooltip.tsx:72`](src/components/Tooltip/Tooltip.tsx:72)).
    *   Spreads `...rest` props, allowing consumers to pass standard `RadixTooltip.TooltipContentProps` (like `side`, `align`, `sideOffset`, etc.) and HTML attributes ([`Tooltip.tsx:74`](src/components/Tooltip/Tooltip.tsx:74)).
*   **`RadixTooltip.Arrow`**: This primitive is **not currently used** in the component.

### 2.2. Prop Definitions (`TooltipProps`)
The `TooltipProps` interface ([`Tooltip.tsx:7`](src/components/Tooltip/Tooltip.tsx:7)) is well-defined:
*   `content: React.ReactNode`: Correctly typed for the tooltip's main content.
*   `children: React.ReactNode`: Correctly typed for the trigger element.
*   `icon?: React.ReactNode`: Allows an optional icon, mapping to Figma's "Icon" boolean property. Rendered conditionally within a styled `<span>` ([`Tooltip.tsx:76`](src/components/Tooltip/Tooltip.tsx:76)).
*   `disabled?: boolean`: Defaults to `false`. Correctly prevents the `RadixTooltip.Portal` (and thus `RadixTooltip.Content`) from rendering if `true` ([`Tooltip.tsx:68`](src/components/Tooltip/Tooltip.tsx:68)). The trigger element's own disabled state is expected to be handled by the consumer.
*   `asChild?: boolean`: Defaults to `false`. Correctly passed to `RadixTooltip.Trigger` ([`Tooltip.tsx:65`](src/components/Tooltip/Tooltip.tsx:65)).
*   `delayDuration?: number`: Passed to `RadixTooltip.Provider` ([`Tooltip.tsx:63`](src/components/Tooltip/Tooltip.tsx:63)). Radix default is 700ms.
*   `sideOffset`: Explicitly destructured with a default value of `5` ([`Tooltip.tsx:52`](src/components/Tooltip/Tooltip.tsx:52)), which is a common practice and aligns with Radix defaults.
*   Other `RadixTooltip.TooltipContentProps` (e.g., `side`, `align`, `alignOffset`, `arrowPadding`, `avoidCollisions`, `collisionBoundary`, `collisionPadding`, `sticky`) are implicitly supported via the `...rest` spread on `RadixTooltip.Content`.
*   The Figma JSON `properties.Type` ("Default") is noted as not being a prop, which is acceptable as there's only one visual style defined.

### 2.3. Component Structure and React Best Practices
*   **`React.forwardRef`**: Correctly used, forwarding the `ref` to the `RadixTooltip.Content` element ([`Tooltip.tsx:39`](src/components/Tooltip/Tooltip.tsx:39)). The ref type is `React.ElementRef<typeof RadixTooltip.Content>`.
*   **`displayName`**: Set to `'Tooltip'` for easier debugging ([`Tooltip.tsx:87`](src/components/Tooltip/Tooltip.tsx:87)).
*   **`clsx`**: Used for constructing `className` on `RadixTooltip.Content` ([`Tooltip.tsx:72`](src/components/Tooltip/Tooltip.tsx:72)).
*   **Conditional Rendering**: The `icon` is rendered conditionally ([`Tooltip.tsx:76`](src/components/Tooltip/Tooltip.tsx:76)), and the entire tooltip portal is conditional on `!disabled` ([`Tooltip.tsx:68`](src/components/Tooltip/Tooltip.tsx:68)).

## 3. Analysis of `Tooltip.module.css`

The [`Tooltip.module.css`](src/components/Tooltip/Tooltip.module.css:1) file handles the styling for the `Tooltip` component.

### 3.1. Token Imports
*   Global design token files (`figma-color-tokens.css`, `figma-numeric-tokens.css`, `figma-typography-tokens.css`) are correctly imported at the top ([`Tooltip.module.css:1-3`](src/components/Tooltip/Tooltip.module.css:1)).

### 3.2. Styling Radix Parts
*   **`.tooltipContent`**: This class ([`Tooltip.module.css:8`](src/components/Tooltip/Tooltip.module.css:8)) styles the `RadixTooltip.Content` part.
    *   It applies layout, color, and typography styles.
    *   It also includes `data-state` selectors for animations (`&[data-state='delayed-open']`, `&[data-state='instant-open']`, `&[data-state='closed']`) ([`Tooltip.module.css:36-51`](src/components/Tooltip/Tooltip.module.css:36)).
    *   *Observation*: Rule IV.2 of [`ai_rules.md`](ai_rules.md:134) prefers targeting Radix parts directly via `data-*` attributes (e.g., `[data-radix-tooltip-content]`) rather than solely custom CSS module classes for the base styles of the part. While the current approach works, direct attribute targeting is considered more robust.
*   **`RadixTooltip.Arrow` Styling**: There are no styles for `[data-radix-tooltip-arrow]` or a custom class for an arrow, as the arrow is not implemented in the TSX.

### 3.3. Figma JSON Property Mapping
*   **Layout Properties (from `figma-jsons/done/tooltip.json:layout`):**
    *   `maxWidth: 250px`: Correctly applied as `max-width: 250px` ([`Tooltip.module.css:10`](src/components/Tooltip/Tooltip.module.css:10)).
    *   `cornerRadius.token: --radius-s`: Correctly applied as `border-radius: var(--radius-s)` ([`Tooltip.module.css:11`](src/components/Tooltip/Tooltip.module.css:11)).
    *   Padding tokens (`paddingTop`, `paddingRight`, `paddingBottom`, `paddingLeft`): Correctly mapped to `var(--spacing-sp-8)` and `var(--spacing-sp-12)` ([`Tooltip.module.css:12-15`](src/components/Tooltip/Tooltip.module.css:12)).
*   **Color Properties (from `figma-jsons/done/tooltip.json:variants[0].colors`):**
    *   `background-color`: Mapped to `var(--color-surface-foreground-dark)` (from Figma's `type=default_fill0`) ([`Tooltip.module.css:19`](src/components/Tooltip/Tooltip.module.css:19)). Correct.
    *   `color` (text color): Mapped to `var(--color-text-inverse)` (from Figma's `here_is_a_tooltip_here_is_a_tooltip_fill0` / `...text_color0`) ([`Tooltip.module.css:22`](src/components/Tooltip/Tooltip.module.css:22)). Correct.
*   **Typography Properties (from `figma-jsons/done/tooltip.json:typography["Type=Default/Here is a tooltip"]`):**
    *   `font-family`: Figma specifies `"--font-family-brand"`. The CSS uses `font-family: "Inter", sans-serif;` ([`Tooltip.module.css:25`](src/components/Tooltip/Tooltip.module.css:25)). **This is a deviation from using the specified design token.**
    *   `font-size`: Mapped to `var(--font-body-medium-size)` ([`Tooltip.module.css:26`](src/components/Tooltip/Tooltip.module.css:26)). Correct.
    *   `font-weight`: Mapped to `var(--font-body-medium-regular-weight)` ([`Tooltip.module.css:27`](src/components/Tooltip/Tooltip.module.css:27)). Correct.
    *   `line-height`: Mapped to `var(--font-body-medium-line-height)` ([`Tooltip.module.css:28`](src/components/Tooltip/Tooltip.module.css:28)). Correct.
    *   `letterSpacing`: `0%` - Addressed ([`Tooltip.module.css:29`](src/components/Tooltip/Tooltip.module.css:29)).
    *   `textCase`: "ORIGINAL" - Correctly noted as default browser behavior ([`Tooltip.module.css:30`](src/components/Tooltip/Tooltip.module.css:30)).
    *   `textDecoration`: "NONE" - Correctly noted as default browser behavior ([`Tooltip.module.css:31`](src/components/Tooltip/Tooltip.module.css:31)).

### 3.4. States and Animations
*   Radix `data-state` attributes (`delayed-open`, `instant-open`, `closed`) are used for applying `fadeIn` and `fadeOut` animations ([`Tooltip.module.css:36-51`](src/components/Tooltip/Tooltip.module.css:36)). This aligns with Rule I.5 and IV.5.
*   Animations (`fadeIn`, `fadeOut`) are defined using `@keyframes` ([`Tooltip.module.css:73-93`](src/components/Tooltip/Tooltip.module.css:73)).

### 3.5. Internal Parts Styling
*   `.iconContainer`: Styles for the optional icon wrapper are defined, including dimensions and `margin-right` for spacing ([`Tooltip.module.css:60-70`](src/components/Tooltip/Tooltip.module.css:60)).

### 3.6. General CSS Practices
*   A `box-shadow`, `user-select: none`, and `z-index` are applied to `.tooltipContent` for common tooltip appearance and behavior ([`Tooltip.module.css:54-56`](src/components/Tooltip/Tooltip.module.css:54)).
*   No `!important` usage is observed, adhering to Rule IV.7.

## 4. Analysis of `Tooltip.stories.tsx`

The [`Tooltip.stories.tsx`](src/components/Tooltip/Tooltip.stories.tsx:1) file provides stories for testing and documenting the `Tooltip` component in Storybook.

### 4.1. Meta Configuration
*   `title`: 'Components/Tooltip'.
*   `component`: `Tooltip`.
*   `parameters`: `layout: 'centered'`.
*   `argTypes`: Defined for `content`, `children` (control: false), `icon` (control: false), `disabled`, `asChild`, `delayDuration`, `side`, `sideOffset`, `align`, `alignOffset`. This provides good control and documentation in Storybook.
*   `tags`: `['autodocs']` for automatic documentation.

### 4.2. Story Coverage
*   **`Default`**: Renders the tooltip with default props and content matching Figma's default text ([`Tooltip.stories.tsx:90`](src/components/Tooltip/Tooltip.stories.tsx:90)).
*   **`WithIcon`**: Demonstrates the tooltip with an icon ([`Tooltip.stories.tsx:110`](src/components/Tooltip/Tooltip.stories.tsx:110)).
*   **`Disabled`**: Shows the behavior when `disabled={true}` ([`Tooltip.stories.tsx:125`](src/components/Tooltip/Tooltip.stories.tsx:125)).
*   **`LongContent`**: Tests the tooltip with longer text content to observe wrapping and `maxWidth` ([`Tooltip.stories.tsx:143`](src/components/Tooltip/Tooltip.stories.tsx:143)).
*   **`AsChildCustomTrigger`**: Demonstrates the `asChild` prop with a custom `<span>` trigger ([`Tooltip.stories.tsx:158`](src/components/Tooltip/Tooltip.stories.tsx:158)).
*   **Positioning Stories (`PositionedRight`, `PositionedBottomStart`):** Demonstrate different `side` and `align` prop configurations ([`Tooltip.stories.tsx:184`](src/components/Tooltip/Tooltip.stories.tsx:184), [`Tooltip.stories.tsx:198`](src/components/Tooltip/Tooltip.stories.tsx:198)).
*   **`WarningTooltip`**: Another example with an icon and different content/position ([`Tooltip.stories.tsx:214`](src/components/Tooltip/Tooltip.stories.tsx:214)).

### 4.3. Adherence to Storybook Guidelines (Rule V)
*   **Default Story**: Provided (Rule V.1).
*   **Variant Combinations**: Stories cover different visual/prop configurations (Rule V.2). (Note: Tooltip has one primary visual "variant" from Figma).
*   **State Demonstrations**: `disabled` state is covered. Radix-controlled states like `open` are not directly set via props in stories, which is correct as they are interaction-driven (Rule V.3, V.6).
*   **Content Configurations**: Different content (text length, with/without icon) is shown (Rule V.4).
*   **Controls (Args)**: Args are well-defined (Rule V.5).
*   **Interactive States**: Correctly avoids manual prop-setting for hover/focus states (Rule V.6).

## 5. Figma JSON Cross-Reference Summary

Comparing the implementation against [`figma-jsons/done/tooltip.json`](figma-jsons/done/tooltip.json:1):

*   **`properties`**:
    *   `Tooltip#26510:0` (default text "Here is a tooltip"): Mapped to the `content` prop. The default value is reflected in the `Default` story.
    *   `Icon#697:0` (default "false"): Mapped to the `icon` prop. The `WithIcon` story demonstrates its usage.
    *   `Type` (default "Default"): As there's only one type, this is handled by the base styling of the component rather than a prop. This is acceptable.
*   **`layout`**:
    *   `maxWidth: 250`: Implemented as `max-width: 250px` in CSS.
    *   `cornerRadius.token: --radius-s`: Implemented as `border-radius: var(--radius-s)` in CSS.
    *   Padding tokens (`--spacing-sp-8`, `--spacing-sp-12`): Correctly implemented in CSS for `paddingTop`, `paddingRight`, `paddingBottom`, `paddingLeft`.
*   **`variants[0].colors` (for "Type=Default")**:
    *   `type=default_fill0` (`--color-surface-foreground-dark`): Used for `background-color`.
    *   `here_is_a_tooltip_here_is_a_tooltip_fill0` / `...text_color0` (`--color-text-inverse`): Used for text `color`.
*   **`typography["Type=Default/Here is a tooltip"]`**:
    *   `fontFamily: --font-family-brand`: **Discrepancy**. CSS uses `"Inter", sans-serif;` instead of `var(--font-family-brand)`.
    *   `fontSize: --font-body-medium-size`: Correctly used.
    *   `fontWeight: --font-body-medium-regular-weight`: Correctly used.
    *   `lineHeight: --font-body-medium-line-height`: Correctly used.
    *   Other typography properties (`letterSpacing`, `textCase`, `textDecoration`) are handled appropriately.

## 6. `ai_rules.md` Adherence Check Summary

The component's adherence to [`ai_rules.md`](ai_rules.md:1) is generally strong:

*   **I.1 Figma JSON is Source of Truth**: Mostly adhered to. The `font-family` in CSS is a deviation.
*   **I.2 Accessibility First (Leverage Radix)**: Yes, Radix Tooltip primitives are used, providing good accessibility foundations.
*   **I.3 Maximum Styling Control with Your Tokens**: Mostly adhered to. The `font-family` deviation is noted.
*   **I.4 Clean, Maintainable, Idiomatic React**: Yes, the component follows React best practices (prop destructuring, typing, `forwardRef`, `displayName`, conditional rendering).
*   **I.5 CSS Purity**: Yes, styling for interactive states relies on Radix `data-state` attributes.
*   **II.1 Use Appropriate Radix Primitives**: Yes, `@radix-ui/react-tooltip` is correctly used.
*   **II.2 Leverage Radix Parts and `data-state` Attributes**: Yes, `data-state` attributes are used for styling states/animations. `RadixTooltip.Content` is styled. `RadixTooltip.Arrow` is not used/styled.
*   **II.4 Polymorphism with `asChild`**: Yes, the `asChild` prop is correctly implemented on `RadixTooltip.Trigger`.
*   **III. React Component Implementation**: Adheres well (file naming, props, `forwardRef`, `displayName`, `clsx`).
*   **IV. CSS Modules Implementation**:
    *   **IV.1 Token Imports**: Correct.
    *   **IV.2 Target Radix Parts via `data-*`**: The primary styling for `Tooltip.Content` uses a class (`.tooltipContent`) rather than directly targeting `[data-radix-tooltip-content]` for its base styles. This is a minor deviation from the preferred method in Rule IV.2.
    *   **IV.3 Base Styles**: Applied correctly.
    *   **IV.4 Variant Styles**: The single "Default" variant's styles are applied. `font-family` is a deviation.
    *   **IV.5 States**: Correctly uses `data-state` attributes.
    *   **IV.6 Internal Parts Styling**: `.iconContainer` is styled. No styles for an arrow.
    *   **IV.7 NO `!important`**: Adhered to.
*   **V. Storybook Stories**: Adheres well, with good coverage of props, states, and content configurations.

## 7. Conclusion and Recommendations

The `Tooltip` component is a well-structured and largely compliant implementation based on Radix UI primitives, Figma specifications, and the `ai_rules.md` guidelines. It effectively provides tooltip functionality with good accessibility and styling derived from design tokens. Storybook stories offer comprehensive coverage for various use cases.

**Key Strengths:**
*   Correct use of Radix UI Tooltip primitives.
*   Clear and well-typed props.
*   Good mapping of most Figma layout, color, and typography specifications to CSS tokens.
*   Effective use of `data-state` for animations.
*   Comprehensive Storybook documentation.

**Areas for Improvement and Recommendations:**

1.  **CSS `font-family` Token Usage (High Priority):**
    *   **Issue:** The CSS in [`Tooltip.module.css`](src/components/Tooltip/Tooltip.module.css:25) uses `font-family: "Inter", sans-serif;` instead of the Figma-specified token `var(--font-family-brand)`.
    *   **Recommendation:** Change the line to `font-family: var(--font-family-brand);` to ensure strict adherence to design tokens as per Rule I.1, I.3, and IV.4 of [`ai_rules.md`](ai_rules.md:1).

2.  **CSS Targeting for Radix Part (Medium Priority):**
    *   **Issue:** The base styles for `RadixTooltip.Content` are applied via the `.tooltipContent` class ([`Tooltip.module.css:8`](src/components/Tooltip/Tooltip.module.css:8)), whereas Rule IV.2 of [`ai_rules.md`](ai_rules.md:134) prefers direct targeting of `[data-radix-tooltip-content]`.
    *   **Recommendation:** For enhanced robustness and clarity, consider refactoring the CSS to use `[data-radix-tooltip-content]` as the primary selector for base styles, and then combine it with variant/state selectors (e.g., `[data-radix-tooltip-content][data-state='delayed-open']`).

3.  **Consider Implementing `RadixTooltip.Arrow` (Medium Priority / Feature Enhancement):**
    *   **Issue:** The component does not currently implement or style `RadixTooltip.Arrow`. While not explicitly detailed in the provided Figma JSON structure beyond basic shape/color, tooltips often feature arrows.
    *   **Recommendation:**
        *   Clarify with the design team if an arrow is desired for the `Tooltip` component.
        *   If yes:
            *   Add `<RadixTooltip.Arrow className={styles.tooltipArrow} />` (or similar) inside `RadixTooltip.Content` in [`Tooltip.tsx`](src/components/Tooltip/Tooltip.tsx:1).
            *   Define styles for this arrow in [`Tooltip.module.css`](src/components/Tooltip/Tooltip.module.css:1) (e.g., targeting `[data-radix-tooltip-arrow]` or `.tooltipArrow`), ensuring its `fill` matches the tooltip background (`var(--color-surface-foreground-dark)`).
            *   Consider if `arrowPadding` prop needs explicit handling or documentation.
            *   Add a Storybook story to demonstrate the tooltip with an arrow.

Overall, the component is in good shape. Addressing the `font-family` token usage is the most critical recommendation for full compliance with the established rules. The other points offer opportunities for further refinement and feature completeness.