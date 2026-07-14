# QA Review: MenuButton Component

## 1. Introduction

This document provides a comprehensive Quality Assurance (QA) review of the `MenuButton` React component. The review process involved analyzing the component's source code ([`MenuButton.tsx`](src/components/MenuButton/MenuButton.tsx:1)), its CSS module ([`MenuButton.module.css`](src/components/MenuButton/MenuButton.module.css:1)), its Storybook stories ([`MenuButton.stories.tsx`](src/components/MenuButton/MenuButton.stories.tsx:1)), the Figma JSON specification ([`figma-jsons/done/menubutton.json`](figma-jsons/done/menubutton.json:1)), and ensuring adherence to the guidelines outlined in [`ai_rules.md`](ai_rules.md:1).

The `MenuButton` is designed to act as a trigger, typically for a dropdown menu, presenting a compact, icon-only interface.

## 2. Analysis of `MenuButton.tsx`

**File:** [`src/components/MenuButton/MenuButton.tsx`](src/components/MenuButton/MenuButton.tsx:1)

*   **Composition:**
    *   The `MenuButton` component is a wrapper around the `IconButton` component. It hardcodes the icon to be `<MoreVertical />` from `lucide-react`.
    *   It does not directly integrate Radix UI's `DropdownMenu` primitives within its own file. Instead, it's designed to be used *as* the `DropdownMenu.Trigger`, as demonstrated in its Storybook stories (e.g., [`MenuButton.stories.tsx:78-79`](src/components/MenuButton/MenuButton.stories.tsx:78-79)). This separation of concerns is appropriate: `MenuButton` is the trigger, and `DropdownMenu` handles the menu itself.
*   **Props (`MenuButtonProps`):**
    *   The [`MenuButtonProps`](src/components/MenuButton/MenuButton.tsx:7) interface correctly extends `BaseIconButtonProps` (from `IconButton`) and omits `children` and `icon`, as these are managed internally by `MenuButton`.
    *   Props such as `size` (defaulting to `'M'`), `color` (defaulting to `'Blue'`), `disabled`, `tooltipContent`, `isActive`, `showTooltip`, and `asChild` are correctly passed through to the underlying `IconButton`.
    *   A helper function [`getIconSize`](src/components/MenuButton/MenuButton.tsx:29) dynamically determines the pixel size of the `MoreVertical` icon based on the `MenuButton`'s `size` prop (`S`, `XS`, `M`).
*   **Radix UI Usage:**
    *   While `MenuButton.tsx` itself doesn't directly import Radix UI primitives, its intended use as `DropdownMenu.Trigger asChild` leverages Radix UI's patterns for composition and accessibility. The underlying `IconButton` is assumed to be built upon a Radix primitive (e.g., `Primitive.button`).
*   **Accessibility:**
    *   Accessibility largely depends on the `IconButton` component. `MenuButton` passes `tooltipContent`, which `IconButton` should use for `aria-label` or similar, enhancing accessibility.
    *   The `disabled` prop is passed, which `IconButton` should map to `aria-disabled="true"` and `data-disabled`.
*   **`ai_rules.md` Adherence (Key Points):**
    *   **React Best Practices (I.4, III):** Adheres well. Uses `React.forwardRef`, `displayName`, prop destructuring with defaults, TypeScript for props, and `clsx` for conditional classes. `...rest` props are spread to `IconButton`.
    *   **Radix Primitives (II.1):** Correctly acts as a composable part for Radix `DropdownMenu`, relying on `IconButton` as its base.
    *   **Props (III.2):** `children` and `icon` are correctly handled internally.

## 3. Analysis of `MenuButton.module.css`

**File:** [`src/components/MenuButton/MenuButton.module.css`](src/components/MenuButton/MenuButton.module.css:1)

*   **Styling:**
    *   The CSS module is minimal, containing a single class:
        ```css
        .menuButtonCircular {
          border-radius: 50%; /* Or var(--radius-full) if available and preferred */
        }
        ```
    *   This class is applied to the `IconButton` within `MenuButton` to give it a circular shape, which is typical for icon-only menu triggers.
    *   The comment "No global token imports needed as this primarily overrides IconButton styles" ([`src/components/MenuButton/MenuButton.module.css:1`](src/components/MenuButton/MenuButton.module.css:1)) is accurate, indicating that color, size, and state-specific styles are expected to be handled by the `IconButton` component's own CSS and design tokens.
*   **`ai_rules.md` Adherence (Key Points):**
    *   **Styling with Tokens (I.3):** While this specific CSS doesn't import tokens, it relies on `IconButton` to do so. The `border-radius: 50%` could potentially use a design token (e.g., `var(--radius-full)`) if available and specified.
    *   **CSS Purity (I.5):** Adhered to. No JS-driven style classes.
    *   **No `!important` (IV.7):** Adhered to.

## 4. Analysis of `MenuButton.stories.tsx`

**File:** [`src/components/MenuButton/MenuButton.stories.tsx`](src/components/MenuButton/MenuButton.stories.tsx:1)

*   **Story Coverage:**
    *   The `Default` story ([`src/components/MenuButton/MenuButton.stories.tsx:75`](src/components/MenuButton/MenuButton.stories.tsx:75)) excellently demonstrates the primary use case: `MenuButton` wrapped within `DropdownMenu.Trigger asChild`, paired with `DropdownMenu.Root` and `DropdownMenu.Content`.
    *   A utility function `renderMenuContent` ([`src/components/MenuButton/MenuButton.stories.tsx:57`](src/components/MenuButton/MenuButton.stories.tsx:57)) provides sample menu items, including items with icons, a separator, and custom styling for a "danger" item, showcasing realistic dropdown content.
    *   Additional stories cover variants for `size` (`SizeSmall`, `SizeExtraSmall`), `color` (`ColorBlack`), `disabled` state (`Disabled`), `isActive` state (`Active`), and an option without a tooltip (`WithoutTooltip`).
*   **Args and Controls:**
    *   `argTypes` ([`src/components/MenuButton/MenuButton.stories.tsx:13`](src/components/MenuButton/MenuButton.stories.tsx:13)) are well-defined for key props, allowing interactive exploration in Storybook.
    *   Default `args` ([`src/components/MenuButton/MenuButton.stories.tsx:43`](src/components/MenuButton/MenuButton.stories.tsx:43)) are provided.
*   **`ai_rules.md` Adherence (Key Points):**
    *   **Comprehensive Stories (V):** Good coverage of default usage, variants, and states.
    *   **Interactive States (V.6):** Correctly avoids manually setting hover/focus states via props. `isActive` is a valid prop of the underlying `IconButton`.

## 5. Figma JSON Cross-Reference Summary

**File:** [`figma-jsons/done/menubutton.json`](figma-jsons/done/menubutton.json:1)

*   **Component Name & ID:** "Menu Button", ID "13362:16277".
*   **Properties & Variants:**
    *   **`State`:** Defines "Default", "Hover", "Pressed", "Focused" ([`figma-jsons/done/menubutton.json:7-12`](figma-jsons/done/menubutton.json:7-12)). These visual states are expected to be handled by the underlying `IconButton` component's CSS, using tokens specified in the Figma JSON (e.g., `"--color-surface-hover"` for Hover state, `"--color-surface-selected"` for Pressed, `"--color-stroke-brand"` for Focus ring). `MenuButton.module.css` itself does not implement these, which is acceptable given its role.
    *   The Figma JSON does not explicitly define `size` or `color` variants for the `MenuButton` itself. The component's implementation, by inheriting from `IconButton`, offers more flexibility here. This is generally an improvement.
*   **Layout:**
    *   Specifies `width: 32`, `height: 32` ([`figma-jsons/done/menubutton.json:18-19`](figma-jsons/done/menubutton.json:18-19)). This corresponds to the `MenuButton`'s default `size='M'`. The `IconButton` component would be responsible for applying these dimensions.
*   **Icon Discrepancy:**
    *   The Figma JSON consistently refers to an icon named `"Icons/menu dots horizontal"` (e.g., [`figma-jsons/done/menubutton.json:28`](figma-jsons/done/menubutton.json:28)).
    *   The `MenuButton.tsx` implementation uses `<MoreVertical />` from `lucide-react` ([`src/components/MenuButton/MenuButton.tsx:59`](src/components/MenuButton/MenuButton.tsx:59)). `MoreVertical` is typically three vertical dots, whereas "menu dots horizontal" implies three horizontal dots. **This is a notable discrepancy.**
*   **`DropList` Reference:**
    *   The "Pressed" state in Figma shows a `droplist_component` ([`figma-jsons/done/menubutton.json:106`](figma-jsons/done/menubutton.json:106)). This is a visual representation in Figma of the menu appearing. The React implementation correctly uses Radix `DropdownMenu.Content` for the actual menu, which is separate from the trigger.
*   **Adherence to Figma JSON:**
    *   The core concept of a compact, icon-based trigger is met.
    *   The primary visual styling (circular shape) is achieved.
    *   State-based styling (hover, focus, pressed) is reliant on the `IconButton` component adhering to the tokens in the `menubutton.json` variants.
    *   **The icon used is the main point of divergence from the Figma specification.**

## 6. `ai_rules.md` Adherence Check Summary (Overall Component)

*   **I.1 Figma JSON as Source of Truth:** Generally good, but the icon choice deviates. State styling and detailed token application are deferred to the `IconButton` component, which is assumed to follow its own Figma specs and `ai_rules.md`.
*   **I.2 Accessibility First (Leverage Radix):** The `MenuButton` itself is simple. Its use in conjunction with `DropdownMenu` (as shown in stories) correctly leverages Radix UI for the accessibility of the entire menu interaction. The trigger's own accessibility (e.g., `aria-label`) depends on the `IconButton`'s implementation and proper use of `tooltipContent`.
*   **I.3 Maximum Styling Control with Your Tokens:** `MenuButton.module.css` is minimal. The overall component relies heavily on `IconButton` for applying design tokens for colors, states, and potentially sizing. The `border-radius` in `MenuButton.module.css` could use a token if available.
*   **I.4 Clean, Maintainable, Idiomatic React:** `MenuButton.tsx` adheres well to these principles.
*   **I.5 CSS Purity:** `MenuButton.module.css` is pure. State styling relies on `IconButton`'s CSS.
*   **II. Radix UI Usage:** The pattern of using `MenuButton` as `DropdownMenu.Trigger asChild` is correct and aligns with Radix UI best practices. It correctly composes by wrapping `IconButton`.
*   **III. React Component Implementation (`.tsx`):** Largely met by `MenuButton.tsx`.
*   **IV. CSS Modules Implementation (`.module.css`):** `MenuButton.module.css` is very specific to the circular override. The broader application of tokens and state styling is delegated.
*   **V. Storybook Stories (`.stories.tsx`):** Adherence is strong, with good coverage and correct patterns.

## 7. Conclusion and Recommendations

**Conclusion:**

The `MenuButton` component is well-structured as a specialized, circular `IconButton` designed to serve as a trigger for dropdown menus. Its own implementation is clean and adheres to many of the `ai_rules.md` guidelines. The Storybook examples effectively demonstrate its intended integration with Radix UI's `DropdownMenu`. The component's functionality and styling largely depend on the underlying `IconButton` component.

The most significant finding is the mismatch between the icon specified in the Figma JSON ("Icons/menu dots horizontal") and the icon implemented in the code (`<MoreVertical />`).

**Recommendations:**

1.  **Critical: Align Icon with Figma Specification:**
    *   **Action:** Replace the `<MoreVertical />` icon ([`src/components/MenuButton/MenuButton.tsx:59`](src/components/MenuButton/MenuButton.tsx:59)) with an icon that matches "Icons/menu dots horizontal" from the Figma JSON. This might be `<MoreHorizontal />` from `lucide-react` or a custom SVG if "Icons/menu dots horizontal" is a specific asset.
    *   **Reason:** To ensure visual consistency with the design specification ([`figma-jsons/done/menubutton.json:28`](figma-jsons/done/menubutton.json:28)).

2.  **Minor: Consider Token for `border-radius`:**
    *   **Action:** In [`MenuButton.module.css`](src/components/MenuButton/MenuButton.module.css:4), investigate if a global token like `var(--radius-full)` exists and is appropriate for `border-radius: 50%;`. If so, use it.
    *   **Reason:** Enhances consistency with the design token system, as suggested by the comment in the CSS file.

3.  **Dependency Check: Verify `IconButton` Compliance:**
    *   **Action:** Ensure that the `IconButton` component (which `MenuButton` wraps) is fully QA'd and compliant with its own Figma specifications and `ai_rules.md`, especially regarding:
        *   Correct application of color, size, and state (hover, focus, active, disabled) styling using design tokens from `globalTokens/`.
        *   Proper ARIA attributes and accessibility features (e.g., using `tooltipContent` for `aria-label`).
        *   Radix UI primitive base (e.g., `Primitive.button`).
    *   **Reason:** The `MenuButton`'s overall correctness and adherence heavily rely on the `IconButton`.

4.  **Documentation/Clarity: Figma JSON `size`/`color` vs. Component Props:**
    *   **Action:** No immediate code change needed, but it's worth noting that the `MenuButton` component is more flexible (offering `size` and `color` props inherited from `IconButton`) than its current Figma JSON specification (which implies a single default appearance).
    *   **Reason:** This flexibility is generally positive. If the design intent is strictly for one `MenuButton` appearance, the component still supports it via default props. If designers intend other `MenuButton` visual variants, the Figma JSON might need expansion in the future.