# QA Review: Breadcrumbs Component

## 1. Overview

This document outlines the Quality Assurance (QA) review for the `Breadcrumbs` React component. The review process involved cross-referencing the component's implementation against its Figma JSON specification, Storybook stories, and the `ai_rules.md` guidelines.

**Files Reviewed:**
*   `src/components/Breadcrumbs/Breadcrumbs.tsx`
*   `src/components/Breadcrumbs/Breadcrumbs.module.css`
*   `src/components/Breadcrumbs/Breadcrumbs.stories.tsx`
*   `figma-jsons/done/breadcrumbs.json`
*   `ai_rules.md`
*   Global Tokens: `globalTokens/figma-color-tokens.css`, `globalTokens/figma-numeric-tokens.css`, `globalTokens/figma-typography-tokens.css`

## 2. Analysis of `Breadcrumbs.tsx`

The `Breadcrumbs.tsx` file defines the structure and logic for the breadcrumbs component.

**Key Observations:**

*   **Props Definition (`BreadcrumbsProps`):**
    *   `items`: Correctly typed as `BreadcrumbItem[]`, where `BreadcrumbItem` has `text: string` and `href?: string`. This aligns with typical breadcrumb structures.
    *   `'aria-label'`: Included with a default value "Breadcrumb", which is good for accessibility.
    *   `className`: Allows for custom styling.
    *   Extends `React.HTMLAttributes<HTMLElement>`, allowing standard HTML attributes to be passed.
*   **Component Structure:**
    *   Uses a `<nav>` element as the root, which is semantically correct for breadcrumbs.
    *   Uses an `<ol>` (ordered list) for the breadcrumb items, also semantically correct.
    *   Each item is an `<li>`.
*   **Item Rendering:**
    *   Maps through the `items` prop to render each breadcrumb.
    *   **Current Page Handling:** Correctly identifies the last item as the current page (`isCurrentPage`).
        *   Current page is rendered as a `<span>` with specific styling (`styles.breadcrumbCurrentItemText`).
        *   Non-current pages are rendered using the imported `Link` component (`import { Link } from '../Link/Link';`). This is good for consistency.
    *   **`href` Handling:** If `href` is not provided for a non-current item, it defaults to `'#'`.
*   **Separator:**
    *   Uses `ChevronRightIcon` from `lucide-react` as a visual separator.
    *   The separator is not rendered after the last item (current page).
    *   `aria-hidden="true"` is correctly applied to the separator icon, as it's purely presentational.
*   **Accessibility:**
    *   The root `<nav>` element has `aria-label` (defaults to "Breadcrumb").
    *   The current page `<li>` element has `aria-current="page"`.
*   **Radix Primitives:**
    *   The component does not directly use Radix Primitives like `Primitive.nav` or `Primitive.ol`. It uses standard HTML elements (`nav`, `ol`, `li`). While `ai_rules.md` encourages Radix for stateful/interactive components, for a navigational structure like breadcrumbs, standard HTML elements with correct ARIA attributes can be acceptable if Radix doesn't offer a specific breadcrumb primitive. The key is ensuring accessibility and `asChild` if it were a more foundational primitive. Given it's a `nav` structure, this seems reasonable. The `Link` component it uses *should* be Radix-based as per `ai_rules.md` (Rule II.1 for Links).
*   **Ref Forwarding:**
    *   Uses `React.forwardRef<HTMLElement, BreadcrumbsProps>` and correctly passes the `ref` to the root `<nav>` element.
*   **`displayName`:**
    *   `Breadcrumbs.displayName = 'Breadcrumbs';` is set.
*   **`clsx` Usage:**
    *   `clsx` is used for conditional class names, which is good practice.
*   **Error Handling/Edge Cases:**
    *   Returns `null` if `items` is undefined or empty, preventing rendering issues.

**Potential Areas for Minor Review/Improvement (Non-Blocking):**
*   The `Link` component is assumed to be Radix-based (`Primitive.a`). This should be verified as part of the `Link` component's own QA.
*   While not strictly required by Radix for `nav`, if a future design system policy mandates *all* structural elements to be Radix Primitives for `asChild` consistency, this could be revisited (e.g., using `Primitive.nav`, `Primitive.ol`, `Primitive.li`). However, current implementation is semantically sound.

## 3. Analysis of `Breadcrumbs.module.css`

The `Breadcrumbs.module.css` file handles the styling for the component.

**Key Observations:**

*   **Token Imports:**
    *   Correctly imports global token files:
        ```css
        @import '../../../globalTokens/figma-color-tokens.css';
        @import '../../../globalTokens/figma-numeric-tokens.css';
        @import '../../../globalTokens/figma-typography-tokens.css';
        ```
*   **`.breadcrumbsNav`:**
    *   Uses `display: flex` and `align-items: center`.
    *   `height` is set using `var(--font-utility-link-line-height)`, aligning with Figma's link typography.
*   **`.breadcrumbsList`:**
    *   Uses `display: flex`, `align-items: center`, `list-style: none`, `padding: 0`, `margin: 0`. Standard reset for list-based navigation.
*   **`.breadcrumbsItem`:**
    *   Uses `display: flex`, `align-items: center`.
*   **`.breadcrumbLink` (for non-current items):**
    *   **Typography:** Correctly applies font properties from Figma JSON ("Links/Link") using tokens:
        *   `font-family: var(--font-family-brand);`
        *   `font-size: var(--font-utility-link-size);`
        *   `font-weight: var(--font-utility-link-weight);`
        *   `line-height: var(--font-utility-link-line-height);`
        *   `text-decoration: underline;`
    *   **Color:** `color: var(--color-text-link);`.
    *   **Hover State (`.breadcrumbLink:hover`):**
        *   `color: var(--color-text-link-hover);`
        *   `text-decoration: none;` (Common practice, aligns with typical link hover behavior).
*   **`.breadcrumbCurrentItemText` (for current item):**
    *   **Typography:** Correctly applies font properties from Figma JSON ("Body/Medium/Regular" for "Current Level") using tokens:
        *   `font-family: var(--font-family-brand);`
        *   `font-size: var(--font-body-medium-size);`
        *   `font-weight: var(--font-body-medium-regular-weight);`
        *   `line-height: var(--font-body-medium-line-height);`
        *   `text-decoration: none;`
    *   **Color:** `color: var(--color-text-primary);` (Matches `current_level_current_level_text_color0` from Figma JSON).
*   **`.breadcrumbSeparator`:**
    *   **Spacing:** `margin-left` and `margin-right` use `var(--spacing-sp-6)`, matching `itemSpacing` from Figma JSON.
    *   **Color:** `color: var(--color-text-secondary);`. This is a reasonable token choice for a separator. Figma JSON doesn't explicitly list a token for the separator icon color itself, but `color-text-secondary` is a common choice for such UI elements.
    *   **Sizing:** `width` and `height` are set to `var(--px-16)`, matching the 16px icon size indicated in Figma JSON.
    *   Uses `display: flex` and `align-items: center` for proper icon alignment.
*   **`.breadcrumbCurrentItemLi`:**
    *   This class is applied but has no specific styles. The comment indicates it's available for future styling if needed. This is acceptable.
*   **Adherence to `ai_rules.md` (CSS):**
    *   Uses CSS Modules.
    *   Imports global tokens.
    *   Uses pseudo-classes (`:hover`) for interactive states.
    *   No `!important` observed.
    *   Comments are present, linking styles to Figma JSON properties.

## 4. Analysis of `Breadcrumbs.stories.tsx`

The Storybook file provides examples and test cases for the `Breadcrumbs` component.

**Key Observations:**

*   **Meta Configuration:**
    *   `title: 'Components/Breadcrumbs'`
    *   `component: Breadcrumbs`
    *   `parameters: { layout: 'centered' }`
    *   `tags: ['autodocs']`
    *   `argTypes` are defined for `items`, `aria-label`, and `className`, providing descriptions and control types.
*   **Stories:**
    *   **`Default`:** Shows a typical multi-level breadcrumb trail.
    *   **`SingleLevel`:** Tests the component with a single item (which will be the current page).
    *   **`TwoLevels`:** Tests a two-item breadcrumb.
    *   **`LongTrail`:** Tests with a longer sequence of items.
    *   **`WithMissingHrefs`:** Tests items where `href` might be missing (defaults to `#`).
*   **Coverage:**
    *   The stories cover various lengths of breadcrumb trails.
    *   The `Default` story implicitly covers the "current page" state for the last item.
    *   `aria-label` is demonstrated in the `Default` story.
*   **Adherence to `ai_rules.md` (Storybook):**
    *   Includes a `Default` story.
    *   Includes stories for different configurations/variants of `items`.
    *   Uses `args` for props.
    *   Does not attempt to manually set hover/focus states via props, which is correct.

**Potential Areas for Minor Review/Improvement (Non-Blocking):**
*   While different lengths are covered, an explicit story demonstrating an empty `items` array (which should render `null`) could be added for completeness, though the component logic handles this.

## 5. Figma JSON Cross-Reference Summary (`figma-jsons/done/breadcrumbs.json`)

Comparing the implementation with `figma-jsons/done/breadcrumbs.json`:

*   **Structure & Elements:**
    *   The Figma JSON shows "Link" components and "Icons_16px/arrow-right" for separators, and "Current Level" as text. This maps well to the React component's use of the `Link` component, `ChevronRightIcon`, and a `<span>` for the current item.
*   **Item Spacing:**
    *   Figma JSON `boundVariables.itemSpacing` is `"--spacing-sp-6"`.
    *   CSS uses `margin-left: var(--spacing-sp-6);` and `margin-right: var(--spacing-sp-6);` for the `.breadcrumbSeparator`. This correctly implements the specified spacing.
*   **Typography:**
    *   **Link Items (Non-Current):**
        *   Figma JSON `typography` for "Label" (e.g., "Level Counter=One Level/Label") specifies style "Links/Link" with tokens: `--font-family-brand`, `--font-utility-link-size`, `--font-utility-link-weight`, `--font-utility-link-line-height`, and `textDecoration: UNDERLINE`.
        *   CSS `.breadcrumbLink` correctly applies these tokens.
    *   **Current Item:**
        *   Figma JSON `typography` for "Current Level" (e.g., "Level Counter=One Level/Current Level") specifies style "Body/Medium/Regular" with tokens: `--font-family-brand`, `--font-body-medium-size`, `--font-body-medium-regular-weight`, `--font-body-medium-line-height`, and `textDecoration: NONE`.
        *   CSS `.breadcrumbCurrentItemText` correctly applies these tokens.
*   **Colors:**
    *   **Link Items:** The `Link` component is expected to handle its own colors based on its Figma spec (e.g., `--color-text-link`, `--color-text-link-hover`). The `Breadcrumbs` CSS correctly applies these for its `Link` instances.
    *   **Current Item Text:** Figma JSON `colors.current_level_current_level_text_color0` is `"--color-text-primary"`.
        *   CSS `.breadcrumbCurrentItemText` uses `color: var(--color-text-primary);`, which matches.
    *   **Separator Icon Color:** Figma JSON doesn't explicitly define a token for the separator icon's color. The implementation uses `var(--color-text-secondary)`. This is a reasonable choice, often used for secondary UI elements. The icon itself in Figma is `Icons_16px/arrow-right`, which typically inherits color or has a defined fill.
*   **Icon:**
    *   Figma JSON specifies "Icons_16px/arrow-right". The component uses `ChevronRightIcon` from Lucide, which is the designated icon library. The size is handled by CSS (`width/height: var(--px-16)`).
*   **Layout:**
    *   Figma JSON `layout.height` is `20`.
    *   CSS `.breadcrumbsNav` uses `height: var(--font-utility-link-line-height);`. The value of `--font-utility-link-line-height` (typically 20px for a 14px font size) should match this. This seems consistent.

**Overall Figma Adherence:** High. The component accurately translates the visual and structural specifications from the Figma JSON.

## 6. `ai_rules.md` Adherence Check Summary

*   **I. Core Philosophy & Goals:**
    *   **Figma JSON as Source of Truth:** Largely adhered to for styling, props, and structure.
    *   **Accessibility First:** Good use of `nav`, `ol`, `li`, `aria-label`, and `aria-current="page"`.
    *   **Maximum Styling Control with Your Tokens:** Yes, CSS Modules use global tokens.
    *   **Clean, Maintainable, Idiomatic React:** Yes, follows good practices (prop destructuring, typing, `clsx`, `forwardRef`, `displayName`).
    *   **CSS Purity:** Yes, uses pseudo-classes for hover.
*   **II. Radix UI Usage:**
    *   Rule II.1 (Interactive/Stateful): Breadcrumbs are navigational rather than highly interactive in the Radix sense (like a Switch or Dialog). It doesn't use a specific Radix "Breadcrumb" primitive (as one doesn't exist). It uses standard HTML elements (`nav`, `ol`, `li`).
    *   Rule II.1 (Links): It *uses* a `Link` component, which *should* be based on `Primitive.a` as per this rule. This dependency's compliance is key.
    *   Rule II.1 (Simple Presentational): If `Link` is Radix-based, the overall structure is fine. If Radix primitives for `nav`, `ol`, `li` were strictly enforced for `asChild` consistency across *all* components, this could be a point of discussion, but current approach is semantically valid and accessible.
*   **III. React Component Implementation (`.tsx`):**
    *   **File Naming:** Correct (`Breadcrumbs.tsx`, `Breadcrumbs.module.css`).
    *   **Props:** `BreadcrumbsProps` well-defined, extends `React.HTMLAttributes<HTMLElement>`. `items` prop is primary.
    *   **`React.forwardRef`:** Used correctly.
    *   **`displayName`:** Set.
    *   **`clsx` Utility:** Used.
    *   **Icon/Label Rendering:** Handled via `items` prop structure.
    *   **Accessibility Attributes:** `aria-label` and `aria-current` are correctly implemented.
*   **IV. CSS Modules Implementation (`.module.css`):**
    *   **Token Imports:** Correct.
    *   **Target Radix Parts via `data-*` Attributes:** Not directly applicable as it doesn't use complex Radix primitives with distinct parts like `Switch.Thumb`. Styles are applied to standard elements/custom classes.
    *   **Base Styles:** Applied to `.breadcrumbsNav`, `.breadcrumbsList`, etc.
    *   **Variant Styles:** Not applicable in the sense of `sizeSmall` etc., but different states (link vs. current item) are styled.
    *   **States:** `:hover` used. `aria-current` is used for state, styled via `.breadcrumbCurrentItemText` and `.breadcrumbCurrentItemLi`.
    *   **Internal Parts Styling:** Classes for link, current item text, separator.
    *   **NO `!important`:** Adhered to.
    *   **Comments:** Present.
*   **V. Storybook Stories (`.stories.tsx`):**
    *   **Default Story:** Present.
    *   **Variant Combinations:** Different `items` configurations shown.
    *   **State Demonstrations:** Current page state is inherent.
    *   **Content Configurations:** Different lengths of breadcrumbs.
    *   **Controls (Args):** Used.
    *   **Interactive States:** Hover/focus not manually set, which is correct.

**Overall `ai_rules.md` Adherence:** High. The main point of attention is the non-use of Radix Primitives for the `nav`/`ol`/`li` structure itself, which is acceptable given no direct Radix breadcrumb primitive exists and the semantic HTML with ARIA is sound. The reliance on the child `Link` component being Radix-compliant is important.

## 7. Conclusion and Recommendations

The `Breadcrumbs` component is well-implemented, adhering closely to the Figma JSON specification and the `ai_rules.md` guidelines. It is accessible, correctly styled using global design tokens, and has good Storybook coverage.

**Strengths:**
*   Strong adherence to Figma design specifications for typography, spacing, and colors.
*   Good accessibility practices (`nav`, `ol`, `aria-label`, `aria-current`).
*   Clean, readable React code with proper typing and patterns.
*   Effective use of CSS Modules and global design tokens.
*   Comprehensive Storybook stories covering various use cases.

**Recommendations:**
*   **Confirm `Link` Component Compliance:** Ensure the `Link` component (imported from `../Link/Link`) is indeed built using `@radix-ui/react-primitive Primitive.a` and adheres to `ai_rules.md` for links. This is crucial for the overall compliance of the `Breadcrumbs` component regarding link behavior and `asChild` support if needed.
*   **(Minor) Storybook Enhancement:** Consider adding a story for `items={[]}` to explicitly demonstrate the `null` rendering behavior, although this is a very minor point.

The component is considered **Approved** from a QA perspective, pending confirmation of the `Link` component's Radix compliance.