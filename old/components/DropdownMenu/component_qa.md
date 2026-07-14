# QA Review: DropdownMenu Component

## 1. Overview

This document provides a comprehensive Quality Assurance (QA) review of the `DropdownMenu` React component, its associated sub-components, CSS module, and Storybook stories. The review focuses on adherence to Figma specifications, correct implementation of Radix UI primitives, and compliance with the guidelines outlined in `ai_rules.md`.

**Files Reviewed:**
*   Component Source: [`src/components/DropdownMenu/DropdownMenu.tsx`](src/components/DropdownMenu/DropdownMenu.tsx:1)
*   CSS Module: [`src/components/DropdownMenu/DropdownMenu.module.css`](src/components/DropdownMenu/DropdownMenu.module.css:1)
*   Storybook Stories: [`src/components/DropdownMenu/DropdownMenu.stories.tsx`](src/components/DropdownMenu/DropdownMenu.stories.tsx:1)
*   Figma JSON (Menu): [`figma-jsons/done/dropdownmenu.json`](figma-jsons/done/dropdownmenu.json:1)
*   Figma JSON (Item): [`figma-jsons/done/dropdownItem.json`](figma-jsons/done/dropdownItem.json:1)
*   Guiding Principles: [`ai_rules.md`](ai_rules.md:1)

## 2. Analysis of `DropdownMenu.tsx`

The [`DropdownMenu.tsx`](src/components/DropdownMenu/DropdownMenu.tsx:1) file defines the `DropdownMenu` component and its various parts, leveraging Radix UI primitives.

**Key Observations:**

*   **Radix UI Primitives Usage:**
    *   The component correctly uses `@radix-ui/react-dropdown-menu` for its core functionality.
    *   Exports include `Root`, `Trigger`, `Content`, `Item`, `CheckboxItem`, `RadioGroup`, `RadioItem`, `Label`, `Separator`, `Arrow`, `Portal`, `Sub`, `SubContent`, `SubTrigger`, `Group`, and `ItemIndicator`.
    *   Most interactive parts (`Content`, `Item`, `CheckboxItem`, `RadioItem`, `Label`, `Separator`, `Arrow`, `SubContent`, `SubTrigger`) are wrapped with `React.forwardRef` and allow `asChild` polymorphism via `Slot` from `@radix-ui/react-slot`.
    *   `DropdownMenuArrowProps` correctly notes the removal of `asChild` due to ref type incompatibility with `Slot` for `SVGElements` ([`DropdownMenu.tsx:47`](src/components/DropdownMenu/DropdownMenu.tsx:47)). This is a good detail.
    *   `@ts-expect-error` comments ([`DropdownMenu.tsx:87`](src/components/DropdownMenu/DropdownMenu.tsx:87), [`DropdownMenu.tsx:108`](src/components/DropdownMenu/DropdownMenu.tsx:108), [`DropdownMenu.tsx:138`](src/components/DropdownMenu/DropdownMenu.tsx:138)) are present for `onSelect` event type mismatches when `Comp` is `Slot`. This is a known issue with Radix and `asChild` in some cases.

*   **Prop Definitions:**
    *   Each exported component part has a corresponding props interface (e.g., `DropdownMenuContentProps`, `DropdownMenuItemProps`).
    *   Props generally extend `React.ComponentPropsWithoutRef` from the respective Radix primitive.
    *   `asChild?: boolean` is consistently included for polymorphism.
    *   `DropdownMenuItemProps` includes `inset?: boolean` and a new `isSelected?: boolean` prop ([`DropdownMenu.tsx:21`](src/components/DropdownMenu/DropdownMenu.tsx:21)) for styling selected states, which is applied via `data-selected={isSelected}` ([`DropdownMenu.tsx:91`](src/components/DropdownMenu/DropdownMenu.tsx:91)).
    *   `DropdownMenuLabelProps` and `DropdownMenuSubTriggerProps` also include `inset?: boolean`.

*   **Component Implementation Details:**
    *   **`DropdownMenuContent`**: Uses `RadixDropdownMenu.Portal` by default. `sideOffset` defaults to `4`.
    *   **`DropdownMenuItem`**:
        *   The `isSelected` prop is used to apply `data-selected`.
        *   Comment indicates automatic `Check` icon was removed, and styling for selected state is handled by CSS ([`DropdownMenu.tsx:94-95`](src/components/DropdownMenu/DropdownMenu.tsx:94-95)). This aligns with flexibility.
    *   **`DropdownMenuCheckboxItem`**:
        *   Integrates a custom `CheckboxComponent` from `../Checkbox/Checkbox` ([`DropdownMenu.tsx:7`](src/components/DropdownMenu/DropdownMenu.tsx:7), [`DropdownMenu.tsx:117`](src/components/DropdownMenu/DropdownMenu.tsx:117)).
        *   The custom checkbox is `aria-hidden` as the parent item handles accessibility.
        *   The label for the checkbox item is the `children` prop of `DropdownMenuCheckboxItem`.
    *   **`DropdownMenuRadioItem`**:
        *   Reverted to using `RadixDropdownMenu.ItemIndicator` ([`DropdownMenu.tsx:144`](src/components/DropdownMenu/DropdownMenu.tsx:144)).
        *   A `span` with `className={styles.itemIndicatorContainer}` ([`DropdownMenu.tsx:145`](src/components/DropdownMenu/DropdownMenu.tsx:145)) wraps the `ItemIndicator` for styling purposes.
        *   The radio icon (dot) is intended to be styled via CSS.
    *   **`DropdownMenuSubTrigger`**:
        *   Includes a `ChevronRight` icon from `lucide-react` ([`DropdownMenu.tsx:5`](src/components/DropdownMenu/DropdownMenu.tsx:5), [`DropdownMenu.tsx:229`](src/components/DropdownMenu/DropdownMenu.tsx:229)) with `className={styles.subTriggerIcon}`.
    *   **`DropdownMenuArrow`**: Directly uses `RadixDropdownMenu.Arrow` and applies `styles.arrow`.
    *   `displayName` is correctly set for all forwarded components.
    *   `clsx` is used for conditional class names.

*   **Imports:**
    *   Necessary Radix parts, `Slot`, `clsx`, `lucide-react` icons (`ChevronRight`, `Check`) are imported.
    *   `CheckboxComponent` is imported. A comment notes removal of `CustomRadioGroup` import ([`DropdownMenu.tsx:8`](src/components/DropdownMenu/DropdownMenu.tsx:8)).

## 3. Analysis of `DropdownMenu.module.css`

The [`DropdownMenu.module.css`](src/components/DropdownMenu/DropdownMenu.module.css:1) file handles the styling for the `DropdownMenu` components.

**Key Observations:**

*   **Token Imports:** Correctly imports global token files:
    *   [`../../../globalTokens/figma-color-tokens.css`](../../../globalTokens/figma-color-tokens.css)
    *   [`../../../globalTokens/figma-numeric-tokens.css`](../../../globalTokens/figma-numeric-tokens.css)
    *   [`../../../globalTokens/figma-typography-tokens.css`](../../../globalTokens/figma-typography-tokens.css)

*   **Styling of Radix Parts & Data Attributes:**
    *   **`.content` and `.subContent`**: Styles for background, border, padding, radius, shadow are derived from [`dropdownmenu.json`](figma-jsons/done/dropdownmenu.json:1). `min-width` is set. `overflow: hidden` is good for border-radius clipping.
    *   **`.arrow`**: Styled with `fill`, `stroke`, `stroke-width`. Size is also defined.
    *   **Base Item Styling (`.item`, `.checkboxItem`, `.radioItem`, `.subTrigger`)**:
        *   Common styles (flex, alignment, padding, radius, font, color, outline, cursor, gap) are applied.
        *   Padding and font properties seem to map to [`dropdownItem.json`](figma-jsons/done/dropdownItem.json:1).
        *   `gap: var(--spacing-sp-12)` ([`DropdownMenu.module.css:61`](src/components/DropdownMenu/DropdownMenu.module.css:61)) is noted as corrected from `sp-8` based on `dropdownItem.json`'s `itemSpacing`.
    *   **Inset Styling (`.itemInset`, `.labelInset`)**: `padding-left` is calculated to align text for items/labels that don't have leading icons/controls ([`DropdownMenu.module.css:76`](src/components/DropdownMenu/DropdownMenu.module.css:76)). This is a thoughtful addition for visual consistency.
    *   **Item States (`[data-highlighted]`, `[data-focus-visible]`, `[data-disabled]`)**:
        *   Styles for hover/focus/disabled states are applied using Radix data attributes.
        *   `[data-focus-visible]` includes an outline based on `dropdownItem.json`'s `State=Focused` which uses `.Focus_Ring`.
    *   **`.item[data-selected='true']`**: New style for the `isSelected` prop on `DropdownMenuItem`. Maps to `dropdownItem.json` `State=Selected` variant for background, color, and font-weight.
    *   **`.checkboxItem[data-state='checked']`, `.radioItem[data-state='checked']`**: Styles for checked states, including background, color, and font-weight, aligning with `dropdownItem.json` `State=Selected`.
    *   **Checkbox/Radio Item Indicators:**
        *   `.checkboxItem > .Checkbox_wrapper__Jk5p8` ([`DropdownMenu.module.css:133`](src/components/DropdownMenu/DropdownMenu.module.css:133), [`DropdownMenu.module.css:198`](src/components/DropdownMenu/DropdownMenu.module.css:198)): Targets the wrapper of the custom `CheckboxComponent`. The comment about class name stability is important.
        *   `.radioItem > .itemIndicatorContainer` ([`DropdownMenu.module.css:134`](src/components/DropdownMenu/DropdownMenu.module.css:134)): Styles the container for the Radix radio indicator.
        *   `.radioItem .itemIndicator` and `::after`: Detailed styling to mimic a custom radio button appearance (border, background, inner dot) for the Radix `ItemIndicator`. This includes default, hover, checked, and disabled states.
    *   **`.label`**: Styled with padding, font, and color. Color is `var(--color-text-secondary)`, which is appropriate for labels.
    *   **`.separator`**: Styled with height, background color, and margin. The margin `calc(-1 * var(--spacing-sp-4))` ([`DropdownMenu.module.css:219`](src/components/DropdownMenu/DropdownMenu.module.css:219)) makes it full-width within the padded content.
    *   **`.subTriggerIcon`**: Styles for the `ChevronRight` icon, including `margin-left: auto` to push it to the right, and color changes for `[data-highlighted]`, `[data-focus-visible]`, and `[data-state='open']`.

*   **Comments:** Comments are present, often tracing styles back to Figma JSON properties (e.g., "Derived from figma-jsons/dropdownmenu.json...").

## 4. Analysis of `DropdownMenu.stories.tsx`

The [`DropdownMenu.stories.tsx`](src/components/DropdownMenu/DropdownMenu.stories.tsx:1) file provides examples and visual testing scenarios for the `DropdownMenu` component.

**Key Observations:**

*   **Structure:**
    *   Standard Storybook `meta` and `Story` types are used.
    *   `title` is 'Components/DropdownMenu'.
    *   `component` is `DropdownMenu.Root`.
    *   `parameters.layout` is 'centered'.
    *   A `DefaultTrigger` using the `Button` component is defined for convenience.
    *   `IconWrapper` helper component is used for consistent icon spacing. Lucide icons are used directly.

*   **Stories Coverage:**
    *   **`Default`**: Basic menu with items, one with an icon, one disabled.
    *   **`WithArrow`**: Demonstrates the `DropdownMenu.Arrow`.
    *   **`ItemTypes`**:
        *   Showcases `DropdownMenu.Label`, `DropdownMenu.CheckboxItem` (with state), `DropdownMenu.RadioGroup` with `DropdownMenu.RadioItem` (with state and a disabled option).
        *   Demonstrates `DropdownMenu.Item` with `isSelected` prop and an item with a "shortcut" text aligned to the right.
        *   Includes an `inset` item with an icon.
    *   **`WithSubmenu`**:
        *   Demonstrates nested submenus using `DropdownMenu.Sub`, `DropdownMenu.SubTrigger`, and `DropdownMenu.SubContent`.
        *   Includes items with icons and one with a shortcut.
        *   `DropdownMenu.Portal` is used for sub-content.
    *   **`AllItemStates`**:
        *   A comprehensive story designed for visual testing of various states:
            *   Standard items: default, not selected, selected, selected & highlighted (simulated), highlighted (simulated), focused (simulated), disabled, selected disabled.
            *   Checkbox items: unchecked, checked, unchecked highlighted, checked highlighted, unchecked disabled, checked disabled. (Comment notes custom Checkbox is internal).
            *   Radio items: unselected, selected, unselected highlighted, unselected disabled. (Comment notes custom Radio is internal). Also a separate group for selected disabled radio.
            *   SubTriggers: default, disabled.
        *   Uses `defaultOpen` and `position: 'static'` on `DropdownMenu.Content` for easier visual inspection in Storybook.

*   **Interactivity:**
    *   State for `CheckboxItem` and `RadioGroup` is managed using `React.useState` within the story render function, allowing interactive testing.
    *   `onSelect` is used with `isSelected` on `DropdownMenu.Item` to manage a `selectedFile` state.

*   **Props Usage:**
    *   Demonstrates usage of `asChild` on `DropdownMenu.Trigger`.
    *   `sideOffset` and `alignOffset` are shown for `DropdownMenu.SubContent`.
    *   `disabled` prop is used on various items and triggers.
    *   `inset` prop is demonstrated.
    *   `isSelected` prop is demonstrated.

## 5. Figma JSON Cross-Reference Summary

**[`figma-jsons/done/dropdownmenu.json`](figma-jsons/done/dropdownmenu.json:1) (Menu Panel - `.content`, `.subContent`):**

*   **Layout:**
    *   `layout.width` (256px): Used as `min-width` for `.content` ([`DropdownMenu.module.css:8`](src/components/DropdownMenu/DropdownMenu.module.css:8)).
    *   `layout.cornerRadius` (`--radius-s`): Applied to `border-radius` ([`DropdownMenu.module.css:10`](src/components/DropdownMenu/DropdownMenu.module.css:10)).
    *   `layout.padding` (`--spacing-sp-4`): Applied to `padding` ([`DropdownMenu.module.css:11`](src/components/DropdownMenu/DropdownMenu.module.css:11)).
    *   `layout.strokeWeight` (`--border-width-100`): Applied to `border` width ([`DropdownMenu.module.css:12`](src/components/DropdownMenu/DropdownMenu.module.css:12)).
*   **Colors:**
    *   `variants[0].colors.droplist_fill0` (`--color-surface-foreground`): Used for `background-color` ([`DropdownMenu.module.css:9`](src/components/DropdownMenu/DropdownMenu.module.css:9)).
    *   `variants[0].colors.droplist_stroke0` (`--color-stroke-default`): Used for `border` color ([`DropdownMenu.module.css:12`](src/components/DropdownMenu/DropdownMenu.module.css:12)) and `stroke` for `.arrow` ([`DropdownMenu.module.css:35`](src/components/DropdownMenu/DropdownMenu.module.css:35)).
*   **Typography (`DropList/Label`):**
    *   Font properties (`--font-family-brand`, `--font-body-medium-size`, etc.) are used for `.label` styling ([`DropdownMenu.module.css:207-210`](src/components/DropdownMenu/DropdownMenu.module.css:207-210)).

**[`figma-jsons/done/dropdownItem.json`](figma-jsons/done/dropdownItem.json:1) (Items - `.item`, `.checkboxItem`, `.radioItem`, `.subTrigger`):**

*   **Layout:**
    *   `layout.cornerRadius` (`--radius-xs`): Applied to `border-radius` of items ([`DropdownMenu.module.css:52`](src/components/DropdownMenu/DropdownMenu.module.css:52)).
    *   `layout.paddingTop/Bottom` (`--spacing-sp-12`), `layout.paddingLeft/Right` (`--spacing-sp-16`): Applied to item `padding` ([`DropdownMenu.module.css:51`](src/components/DropdownMenu/DropdownMenu.module.css:51)).
    *   `structure.children[0].boundVariables.itemSpacing` (`--spacing-sp-12`): Used for `gap` in items ([`DropdownMenu.module.css:61`](src/components/DropdownMenu/DropdownMenu.module.css:61)).
*   **Variants & Colors:**
    *   **`State=Default`**:
        *   `colors.state=default_fill0` (`--color-surface-foreground`): Implicitly the base background for items (though not explicitly set, items are on `.content` background).
        *   `colors.label_label_text_color0` (`--color-text-primary`): Used for item `color` ([`DropdownMenu.module.css:57`](src/components/DropdownMenu/DropdownMenu.module.css:57)).
    *   **`State=Hover`**:
        *   `colors.state=hover_fill0` (`--color-surface-hover`): Used for `background-color` on `[data-highlighted]` ([`DropdownMenu.module.css:85`](src/components/DropdownMenu/DropdownMenu.module.css:85)).
        *   `colors.label_label_text_color0` (`--color-text-primary`): Used for `color` on `[data-highlighted]` ([`DropdownMenu.module.css:86`](src/components/DropdownMenu/DropdownMenu.module.css:86)).
    *   **`State=Selected`**:
        *   `colors.state=selected_fill0` (`--color-surface-selected`): Used for `background-color` for `.item[data-selected='true']` ([`DropdownMenu.module.css:111`](src/components/DropdownMenu/DropdownMenu.module.css:111)) and `[data-state='checked']` items ([`DropdownMenu.module.css:126`](src/components/DropdownMenu/DropdownMenu.module.css:126)).
        *   `colors.label_label_text_color0` (`--color-text-selected`): Used for `color` for selected/checked items ([`DropdownMenu.module.css:112`](src/components/DropdownMenu/DropdownMenu.module.css:112), [`DropdownMenu.module.css:127`](src/components/DropdownMenu/DropdownMenu.module.css:127)).
    *   **`State=Focused`**:
        *   The `.Focus_Ring` component reference implies focus ring styling, which is implemented with `outline: 2px solid var(--color-stroke-focus);` ([`DropdownMenu.module.css:94`](src/components/DropdownMenu/DropdownMenu.module.css:94)).
*   **Typography:**
    *   **`State=Default/Label`**: Font properties used for base item text styling ([`DropdownMenu.module.css:53-56`](src/components/DropdownMenu/DropdownMenu.module.css:53-56)).
    *   **`State=Selected/Label`**: `fontWeight` (`--font-body-medium-semibold-weight`) used for selected/checked items ([`DropdownMenu.module.css:113`](src/components/DropdownMenu/DropdownMenu.module.css:113), [`DropdownMenu.module.css:128`](src/components/DropdownMenu/DropdownMenu.module.css:128)).
*   **Control Elements (Checkbox/Radio):**
    *   The JSON references specific Checkbox/Radio components (e.g., `Checkbox/18px/Unchecked`). The implementation uses a custom `CheckboxComponent` and styles the Radix `RadioItem`'s `ItemIndicator` to match.
    *   `dropdownmenu.json` also contains color definitions for checkbox/radio parts (e.g., `dropdown_item_radio_button_ellipse_3_ellipse_3_stroke0` (`--color-surface-controls-selected`)) which are generally consistent with the tokens used in `.radioItem .itemIndicator` styling.

**General Adherence:**
The mapping from Figma JSON to CSS appears thorough. Tokens are used correctly. Dimensions, padding, colors, and typography generally align with the specifications. The introduction of `data-selected` for `DropdownMenuItem` is a good way to represent the "Selected" state from `dropdownItem.json` for generic items.

## 6. `ai_rules.md` Adherence Check Summary

*   **I. Core Philosophy & Goals:**
    *   1.  **Figma JSON as Source of Truth:** Generally well-adhered to. Styles are derived from JSON.
    *   2.  **Accessibility First (Leverage Radix):** Excellent. Radix primitives are used extensively.
    *   3.  **Maximum Styling Control with Your Tokens:** Excellent. Global tokens are imported and used. No custom tokens observed.
    *   4.  **Clean, Maintainable, Idiomatic React:**
        *   Prop destructuring and defaults: Yes, in `DropdownMenuContent` (`sideOffset = 4`). Other components primarily pass props down.
        *   Clear Prop Typing: Yes, TypeScript interfaces are used.
        *   Composition and Prop Spreading: Yes, `...props` is spread to Radix components.
        *   Conditional Rendering: Yes, for `asChild`.
        *   No Unnecessary State: Yes, state is managed by Radix or Storybook for demos.
        *   Readability: Good.
        *   Icon/Label Rendering: Icons and labels are handled as children or dedicated components.
    *   5.  **CSS Purity:** Excellent. Styling relies on pseudo-classes and `data-*` attributes.

*   **II. Radix UI Usage:**
    *   1.  **Use Appropriate Radix Primitives:** Excellent. Specific Radix DropdownMenu primitives are used.
    *   2.  **Leverage Radix Parts and `data-state` Attributes:** Excellent. `data-state`, `data-highlighted`, `data-disabled` are used for styling.
    *   3.  **Consider Radix Themes Components Strategically:** N/A, primitives used.
    *   4.  **Polymorphism with `asChild`:** Excellent. `asChild` and `Slot` are implemented for most parts.

*   **III. React Component Implementation (`.tsx`):**
    *   1.  **File Naming:** Correct (`DropdownMenu.tsx`, `DropdownMenu.module.css`).
    *   2.  **Props:**
        *   `ComponentNameProps` extending Radix props: Yes.
        *   Variant props from Figma: N/A directly as variants, but states are handled. `isSelected` is a good addition.
        *   `children`, `disabled`, `asChild`: Yes.
    *   3.  **`React.forwardRef`:** Yes, correctly typed.
    *   4.  **`displayName`:** Yes, correctly set.
    *   5.  **`clsx` Utility:** Yes.
    *   6.  **Icon/Label Rendering:** Handled via children and specific icon components.
    *   7.  **Accessibility Attributes:** Radix handles core attributes. `disabled` prop is used.

*   **IV. CSS Modules Implementation (`.module.css`):**
    *   1.  **Token Imports:** Yes.
    *   2.  **Target Radix Parts via `data-*` Attributes:** Yes, extensively used (e.g., `[data-highlighted]`, `[data-state='checked']`).
    *   3.  **Base Styles:** Yes, on `.content`, `.item`, etc.
    *   4.  **Variant Styles:** States are treated as variants (e.g., `[data-selected]`).
    *   5.  **States (Pseudo-classes & Radix `data-*` attributes):** Yes, correctly implemented.
    *   6.  **Internal Parts Styling:** Yes (e.g., `.subTriggerIcon`, `.itemIndicatorContainer`).
    *   7.  **NO `!important`:** None observed.
    *   8.  **Comments:** Yes, tracing styles to Figma.

*   **V. Storybook Stories (`.stories.tsx`):**
    *   1.  **Default Story:** Yes.
    *   2.  **Variant Combinations:** Yes, through `ItemTypes` and `AllItemStates`.
    *   3.  **State Demonstrations:** Yes, `disabled`, `checked`, `isSelected`.
    *   4.  **Content Configurations:** Yes, items with/without icons, labels, submenus.
    *   5.  **Controls (Args):** Basic args on root, state managed internally for demos.
    *   6.  **Interactive States:** Hover/focus are user-interactive. Radix-controlled states (`checked`, `value` for radio) are set via props for demos.

**Overall Adherence:** The component suite demonstrates a very high level of adherence to `ai_rules.md`.

## 7. Conclusion and Recommendations

**Conclusion:**

The `DropdownMenu` component and its sub-components are well-implemented, robust, and highly flexible.
*   The use of Radix UI primitives ensures excellent accessibility and state management.
*   Styling is clean, correctly uses CSS Modules, and faithfully applies design tokens derived from the Figma JSON specifications.
*   Prop definitions are clear and TypeScript is used effectively.
*   Storybook stories provide comprehensive coverage of different item types, states, and configurations, making it easy to test and understand the component's capabilities.
*   The implementation adheres closely to the guidelines in `ai_rules.md`.
*   Specific considerations, like the `isSelected` prop for `DropdownMenuItem` and the detailed styling for the radio item indicator, show attention to detail in matching Figma intent.
*   The handling of `CheckboxItem` with a custom `CheckboxComponent` and `RadioItem` by styling the Radix `ItemIndicator` are good solutions.

**Recommendations:**

*   **`DropdownMenuItem` `isSelected` Icon:** The comment ([`DropdownMenu.tsx:94-95`](src/components/DropdownMenu/DropdownMenu.tsx:94-95)) states "Styling for selected state (bg, color, font-weight) is handled by CSS. If a user wants a leading icon for a selected item, they should pass it as children." While this provides flexibility, consider if a common use case is to show a `Check` icon for `isSelected={true}` items (similar to how `CheckboxItem` or `RadioItem` indicate selection). If so, this could be an optional built-in feature toggled by another prop, or the `isSelected` prop could automatically render a `Check` icon if no other leading content is provided. However, the current approach is also valid and leans towards user-controlled content.
*   **CSS Class Name Stability for `CheckboxComponent`:** The comment in [`DropdownMenu.module.css:198`](src/components/DropdownMenu/DropdownMenu.module.css:198) (`.checkboxItem > .Checkbox_wrapper__Jk5p8`) regarding the stability of the `Checkbox_wrapper__Jk5p8` class name is crucial. If this class name (from `Checkbox.module.css`) changes, the style will break. Using a `data-attribute` on the `CheckboxComponent`'s wrapper, as suggested by the comment, would be a more robust solution for targeting.
*   **Token for Hover-Selected State:** In [`DropdownMenu.module.css:117-118`](src/components/DropdownMenu/DropdownMenu.module.css:117-118), comments suggest `--color-surface-hover-selected` and `--color-text-selected-hover` might be needed. If these combined states are common and have specific design definitions, adding these tokens to the global token set would be beneficial. Otherwise, the current approach of relying on hover styles potentially overriding selected ones (or vice-versa depending on specificity) is acceptable.
*   **Storybook `AllItemStates` Simulation:** The `AllItemStates` story simulates `data-highlighted` and `data-focus-visible` by directly applying the attributes. This is fine for visual regression testing of the styles themselves. Ensure manual interaction testing in other stories confirms the actual hover/focus behaviors.

The `DropdownMenu` component is in excellent shape and serves as a strong example of a well-crafted UI component following the established guidelines.