# QA Review: SplitButton Component

## 1. Overview

This document outlines the Quality Assurance (QA) review for the `SplitButton` React component. The review process involved analyzing the component's source code, CSS module, Storybook stories, its Figma JSON specification, and adherence to the `ai_rules.md` guidelines.

**Files Reviewed:**

*   **Component Source:** [`src/components/SplitButton/SplitButton.tsx`](src/components/SplitButton/SplitButton.tsx)
*   **CSS Module:** [`src/components/SplitButton/SplitButton.module.css`](src/components/SplitButton/SplitButton.module.css)
*   **Storybook Stories:** [`src/components/SplitButton/SplitButton.stories.tsx`](src/components/SplitButton/SplitButton.stories.tsx)
*   **Figma JSON:** [`figma-jsons/done/splitbutton.json`](figma-jsons/done/splitbutton.json)
*   **Guiding Principles:** [`ai_rules.md`](ai_rules.md)

## 2. Analysis of `SplitButton.tsx`

The [`SplitButton.tsx`](src/components/SplitButton/SplitButton.tsx) file defines the structure, props, and logic for the `SplitButton` component.

**Key Observations:**

*   **Composition:**
    *   The component correctly composes a main action button and a dropdown trigger button.
    *   It utilizes the existing `Button` component ([`src/components/Button/Button.tsx`](src/components/Button/Button.tsx)) for both the main action and the trigger.
    *   It uses the `DropdownMenu` component ([`src/components/DropdownMenu/DropdownMenu.tsx`](src/components/DropdownMenu/DropdownMenu.tsx), aliased as `DM`) for the dropdown functionality, specifically `DM.Root`, `DM.Trigger`, `DM.Portal`, and `DM.Content`.
    *   The dropdown trigger uses the `ChevronDown` icon from `lucide-react`.
*   **Props (`SplitButtonProps`):**
    *   `variant`: Maps to `ButtonStyle` (`primary`, `secondary`, `tertiary`, `error`), default `secondary`. Correctly typed as `SplitButtonVariant`.
    *   `size`: Maps to `ActualButtonSize` (`default`, `small`), default `default`. Correctly typed as `SplitButtonSize`.
    *   `mainActionLabel`: `ReactNode` for the main button's content. This is a required prop.
    *   `onMainActionClick`: Optional event handler for the main button.
    *   `dropdownItems`: `ReactNode` for the content of the `DropdownMenu.Content`. This is a required prop.
    *   `disabled`: Boolean, defaults to `false`. Correctly disables both the main `Button` and the `DM.Trigger` (which wraps another `Button`).
    *   `className`: Optional `string` for custom styling of the root `div` container.
    *   `dropdownContentProps`: Allows passing props to `DM.Content` (e.g., `sideOffset`, `align`).
    *   `mainButtonProps`: Allows passing additional props to the main `Button` component.
    *   `triggerButtonProps`: Allows passing additional props to the trigger `Button` component.
    *   Props are destructured with defaults as per `ai_rules.md`.
    *   `...rest` props are spread to the root `div` container.
*   **Refs:**
    *   Uses `React.forwardRef` to forward refs to the root `div` container. Typed as `HTMLDivElement`.
*   **Accessibility:**
    *   The trigger button has a default `aria-label="More options"`. This can be overridden via `triggerButtonProps`.
    *   The `disabled` prop correctly sets `disabled` on the underlying `Button` components, which should handle `aria-disabled`.
    *   Leverages Radix `DropdownMenu` for accessibility of the dropdown part (keyboard navigation, ARIA attributes).
*   **Logic:**
    *   The `variant` and `size` props of `SplitButton` are correctly cast and passed as `buttonStyle` and `size` to the underlying `Button` components.
    *   `clsx` is used for conditional class names on the container, main button, trigger button, and dropdown content.
    *   The `ChevronDown` icon size is adjusted based on the `SplitButton`'s `size` prop (14 for `small`, 16 for `default`).
*   **`displayName`:**
    *   `SplitButton.displayName = 'SplitButton';` is correctly set.

**Potential Areas for Minor Improvement/Consideration:**

*   The `buttonStyle` and `buttonSize` variables created via casting could be directly used from the destructured `variant` and `size` if the `ButtonProps` types were more directly compatible or if an intermediate mapping type was used. However, the current approach is clear.
*   The `SplitButtonProps` extends `HTMLAttributes<HTMLDivElement>`. This is appropriate for the root `div`.

## 3. Analysis of `SplitButton.module.css`

The [`SplitButton.module.css`](src/components/SplitButton/SplitButton.module.css) file handles the specific styling for the `SplitButton` group.

**Key Observations:**

*   **Token Imports:**
    *   Correctly imports global token files: `figma-color-tokens.css`, `figma-numeric-tokens.css`, `figma-typography-tokens.css`.
*   **Container Styling (`.splitButtonContainer`):**
    *   Uses `display: inline-flex` to group the buttons.
    *   `align-items: stretch` ensures buttons have the same height.
    *   `gap: 0` makes buttons adjacent.
    *   `border-radius: var(--border-radius-medium)` is applied to the container, and `overflow: hidden` ensures child button radii don't interfere with the group's rounded corners. This aligns with typical `Button` styling.
    *   A transparent border is set on the container, likely as a placeholder or for consistent box-sizing, as individual buttons have their own borders.
*   **Individual Button Adjustments:**
    *   `.mainButton`: `border-top-right-radius: 0; border-bottom-right-radius: 0;`
    *   `.triggerButton`: `border-top-left-radius: 0; border-bottom-left-radius: 0;`
    *   These rules correctly create the appearance of a single, unified component by removing the border radius on the adjacent sides of the two buttons.
*   **Trigger Button Styling (`.triggerButton`):**
    *   Styled to be square-like for the icon: `display: inline-flex`, `align-items: center`, `justify-content: center`, `padding: 0`, `min-width: unset`.
    *   Width is explicitly set based on size:
        *   `.size-default .triggerButton { width: 36px; }`
        *   `.size-small .triggerButton { width: 24px; }`
        *   These dimensions seem to correspond to the height of the `Button` component for those sizes, achieving a square trigger.
*   **Separator Logic (Border Handling):**
    *   **Secondary & Error Variants:**
        *   `.variant-secondary .mainButton, .variant-error .mainButton { border-right-width: 0; }`
        *   The main button's right border is removed, and the trigger button's left border (from the `Button` component itself) acts as the separator. This is a common pattern for these variants.
    *   **Primary & Tertiary Variants:**
        *   `.variant-primary .mainButton, .variant-tertiary .mainButton { border-right-width: 1px; border-right-style: solid; border-right-color: var(--border-neutral-default); }`
        *   `.variant-primary .triggerButton, .variant-tertiary .triggerButton { border-left-width: 0; }`
        *   Here, the main button explicitly draws a right border (using `var(--border-neutral-default)`), and the trigger button's left border is removed to prevent a double border. The choice of `var(--border-neutral-default)` is noted with a comment for verification. This is appropriate if the default button borders for these variants are not distinct enough or are the same color as the background.
*   **Disabled State (`.splitButtonContainer.disabled`):**
    *   A class exists but is currently empty. The comment correctly notes that individual buttons handle their own disabled visual state. This class could be used for container-level opacity or `pointer-events` if needed.
*   **Focus State (`.splitButtonContainer:focus-within`):**
    *   A `:focus-within` style is present but commented out. The comments correctly state that individual buttons (main action and Radix trigger) will handle their own focus rings, and a group-level focus ring might conflict. This aligns with `ai_rules.md` (Rule IV.5, V.125-126) to rely on primitive focus styling.
*   **Dropdown Content (`.dropdownContent`):**
    *   A class exists but is empty. Styling is primarily inherited from `DropdownMenu.module.css`. This class allows for overrides if necessary.
*   **Comments:**
    *   Comments are used to explain styling decisions, especially the separator logic and references to Figma.

**Conformity to `ai_rules.md` (CSS):**

*   Uses global tokens (Rule IV.1).
*   Relies on `Button` component styles for variants and states, with specific overrides for grouping (Rule I.3, IV.4, IV.5).
*   No `!important` (Rule IV.7).
*   The separator logic is complex but aims to achieve the Figma appearance. The use of `var(--border-neutral-default)` should be verified against the token list and its intended use.

## 4. Analysis of `SplitButton.stories.tsx`

The [`SplitButton.stories.tsx`](src/components/SplitButton/SplitButton.stories.tsx) file provides examples and test cases for the `SplitButton` component.

**Key Observations:**

*   **Meta Configuration:**
    *   `title: 'Components/SplitButton'`.
    *   `component: SplitButton`.
    *   `parameters.layout: 'centered'`.
    *   Includes a component description.
*   **ArgTypes:**
    *   Comprehensive `argTypes` are defined for all major props (`variant`, `size`, `mainActionLabel`, `onMainActionClick`, `disabled`, `className`, `dropdownContentProps`, `mainButtonProps`, `triggerButtonProps`).
    *   `dropdownItems` has `control: false` as it's complex and handled per story.
    *   Controls are appropriate (e.g., `select` for `variant` and `size`, `boolean` for `disabled`, `text` for `mainActionLabel`).
    *   Default values are documented in the table.
*   **Default Args:**
    *   `variant: 'secondary'`, `size: 'default'`, `mainActionLabel: 'Primary Action'`, `disabled: false`.
*   **Stories:**
    *   `Default`: Basic usage with comprehensive `defaultDropdownItems`.
    *   Variant Stories (`Primary`, `Secondary`, `Tertiary`, `Error`): Demonstrate each visual variant with appropriate labels and simple/default dropdown items.
    *   Size Stories (`SmallSize`, `PrimarySmall`): Demonstrate different sizes, including a combination.
    *   `Disabled`: Shows the disabled state.
    *   `WithCheckboxItems` and `WithRadioItems`: Showcase integration with `DropdownMenu.CheckboxItem` and `DropdownMenu.RadioGroup/RadioItem`, demonstrating the flexibility of `dropdownItems`.
    *   `CustomTriggerButtonProps` and `CustomMainButtonProps`: Demonstrate passing custom props (like `data-testid` or inline styles) to the internal buttons.
    *   Dropdown items (`defaultDropdownItems`, `simpleDropdownItems`, etc.) are well-defined, including separators, icons, sub-menus, and destructive items.
*   **Interactivity:**
    *   `onMainActionClick` and `DropdownMenu.Item onSelect` use `alert()` for demonstrating interaction, which is standard for Storybook.
*   **Conformity to `ai_rules.md` (Storybook):**
    *   Default story with default props (Rule V.1 - partially, as `dropdownItems` is custom).
    *   Stories for variant combinations (Rule V.2).
    *   Story for `disabled` state (Rule V.3).
    *   Stories for different content configurations (Rule V.4 - via `dropdownItems`).
    *   Controls for configurable props (Rule V.5).
    *   Interactive states (hover, focus) are left to user interaction, not manually set by props, which is correct (Rule V.6). Radix-controlled states like `checked` for `CheckboxItem` are set.

## 5. Figma JSON Cross-Reference Summary

Comparing with [`figma-jsons/done/splitbutton.json`](figma-jsons/done/splitbutton.json):

*   **Properties:**
    *   `Type`: Maps to `variant` prop (`Primary`, `Secondary`, `Tertiary`, `Error`). Default in JSON is `Error`, but component defaults to `secondary`. This is a common deviation where component default is more practical.
    *   `State`: (`Default`, `Hover`, `Pressed`, `Focused`, `Disabled`). These are handled by the underlying `Button` component's states and CSS pseudo-classes/Radix `data-attributes`. The `SplitButton` `disabled` prop correctly maps.
    *   `Size`: (`Default`, `Small`). Maps to `size` prop.
*   **Layout:**
    *   The Figma JSON specifies overall `width` and `height` for the group (e.g., `width: 164`, `height: 36` for Default size). The component achieves this by the sum of its parts (main button + trigger button). The trigger button's fixed width (`36px` or `24px`) contributes to this.
    *   The visual grouping (shared border, outer border-radius) is implemented in `SplitButton.module.css` by manipulating `border-radius` and `border-width` of the child buttons.
*   **Structure & Variants:**
    *   The JSON indicates that `SplitButton` is composed of a `button_component` (main action) and a `split_component` (trigger). Both reference the `Button` component with matching styles and states. This is correctly implemented.
    *   The `split_component` in Figma visually appears as an icon button, which is achieved in code by making the trigger `Button` square and placing an icon in it.
    *   Focus state in Figma shows a focus ring around the entire component. The current implementation relies on individual button focus rings. `ai_rules.md` prefers primitive focus styling, so this is acceptable. A `:focus-within` style on the container is possible but commented out due to potential conflicts.
*   **Typography:**
    *   Typography is primarily handled by the underlying `Button` component, which should be using typography tokens based on its own Figma JSON. The `SplitButton` itself doesn't directly apply typography but ensures the correct `Button` variants are used.

**Discrepancies/Notes:**

*   **Default Variant:** Figma JSON defaults `Type` to "Error", while the component defaults `variant` to "secondary". This is acceptable if "secondary" is a more common default use case.
*   **Focus Ring:** Figma shows a group focus ring. The component uses individual focus rings on the buttons. This is generally preferred for accessibility clarity and per `ai_rules.md`.

## 6. `ai_rules.md` Adherence Check Summary

*   **I.1 Figma JSON as Source of Truth:** Largely followed. Styling and variants are derived from the concept of using two `Button` components as specified. Dimensions and grouping are achieved.
*   **I.2 Accessibility First (Leverage Radix):** Yes, `DropdownMenuPrimitive` is used for the dropdown part. `Button` component (assumed to be Radix-based or accessible) is used for actions. `aria-label` is present.
*   **I.3 Maximum Styling Control with Your Tokens:** Yes, CSS Modules use global tokens. Styling is applied to the container and modifies button appearances for grouping.
*   **I.4 Clean, Maintainable, Idiomatic React:**
    *   Prop destructuring and defaults: Yes.
    *   Clear prop typing: Yes, `SplitButtonProps` is well-defined.
    *   Composition and Prop Spreading: Yes, `...rest` on container, `mainButtonProps` and `triggerButtonProps` spread to respective buttons.
    *   Conditional rendering: `ChevronDown` icon size is conditional.
    *   No unnecessary state: Yes.
    *   `displayName`: Yes.
*   **I.5 CSS Purity:** Yes, relies on `Button` states and CSS for grouping. No JS-driven state classes for styling the group itself.
*   **II. Radix UI Usage:**
    *   `DropdownMenuPrimitive` is correctly used. `Button` component is used (assumed to be based on `Primitive.button`).
    *   Leverages Radix parts (`DM.Trigger`, `DM.Content`, etc.).
*   **III. React Component Implementation:**
    *   File naming: Correct.
    *   Props: Match guidelines.
    *   `React.forwardRef`: Yes.
    *   `clsx`: Yes.
*   **IV. CSS Modules Implementation:**
    *   Token imports: Yes.
    *   Targeting: Uses custom classes for `mainButton` and `triggerButton` modifications, and container variants. This is acceptable for achieving the grouped appearance.
    *   Base styles, Variant styles, States: Handled by CSS, respecting the structure.
    *   No `!important`: Yes.
    *   Comments: Good usage.

## 7. Conclusion and Recommendations

The `SplitButton` component is well-implemented, adhering closely to the provided Figma JSON specifications and `ai_rules.md`. It effectively combines the `Button` and `DropdownMenu` components to create a functional and stylistically correct UI element.

**Strengths:**

*   Clear and robust component composition.
*   Comprehensive props allowing for good customization.
*   Correct handling of variants, sizes, and disabled states.
*   Good adherence to accessibility best practices by leveraging Radix UI for the dropdown.
*   Well-structured CSS that achieves the desired grouped appearance.
*   Thorough Storybook stories covering various use cases.

**Recommendations:**

*   **Verify Separator Token:** Double-check that `var(--border-neutral-default)` used in [`SplitButton.module.css`](src/components/SplitButton/SplitButton.module.css:100) for the separator in `primary` and `tertiary` variants is the intended token from `globalTokens/figma-color-tokens.css` for this purpose. If not, update to the correct token.
*   **Default Variant Consistency (Minor):** Consider aligning the component's default `variant` prop (`secondary`) with the Figma JSON's default `Type` (`Error`) if strict consistency is paramount, or document this intentional difference. The current "secondary" default is likely more practical.

Overall, the component is in excellent shape and meets the specified requirements.