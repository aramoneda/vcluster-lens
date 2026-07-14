# QA Review: Radio Component

## 1. Overview

This document outlines the Quality Assurance (QA) review for the `Radio` component, which includes `RadioGroup.Root` and `RadioGroup.Item`. The review process involved analyzing the component's source code ([`Radio.tsx`](src/components/Radio/Radio.tsx:1)), CSS module ([`Radio.module.css`](src/components/Radio/Radio.module.css:1)), Storybook stories ([`Radio.stories.tsx`](src/components/Radio/Radio.stories.tsx:1)), and cross-referencing them against the Figma JSON specification ([`figma-jsons/done/radio.json`](figma-jsons/done/radio.json:1)) and the guidelines in [`ai_rules.md`](ai_rules.md:1).

## 2. Analysis of `Radio.tsx`

The [`Radio.tsx`](src/components/Radio/Radio.tsx:1) file defines the `RadioGroup` and `RadioGroupItem` components.

**Key Observations:**

*   **Radix UI Primitives:**
    *   `RadioGroup.Root`: Uses `RadixRadioGroup.Root` directly from [`@radix-ui/react-radio-group`](https://www.radix-ui.com/primitives/docs/components/radio-group:0) ([`Radio.tsx:103`](src/components/Radio/Radio.tsx:103)). This is correct as per [`ai_rules.md#II.1`](ai_rules.md:74).
    *   `RadioGroup.Item`: Wraps `RadixRadioGroup.Item` ([`Radio.tsx:71`](src/components/Radio/Radio.tsx:71)) and `RadixRadioGroup.Indicator` ([`Radio.tsx:85`](src/components/Radio/Radio.tsx:85)). This structure correctly utilizes Radix parts.
*   **Props Definition:**
    *   `RadioGroupProps` ([`Radio.tsx:6`](src/components/Radio/Radio.tsx:6)): Extends `RadixRadioGroup.RadioGroupProps`, allowing passthrough of all standard Radix props like `value`, `defaultValue`, `onValueChange`, `disabled`, `required`, `orientation`, `loop`, and `name`. This aligns with [`ai_rules.md#III.2`](ai_rules.md:100).
    *   `RadioGroupItemProps` ([`Radio.tsx:12`](src/components/Radio/Radio.tsx:12)):
        *   Correctly omits `children` from `RadixRadioGroup.RadioGroupItemProps` and redefines it for the label content ([`Radio.tsx:14`](src/components/Radio/Radio.tsx:14)).
        *   Includes `size` prop (`'18px'`, `'24px'`) with a default of `'18px'` ([`Radio.tsx:19`](src/components/Radio/Radio.tsx:19), [`Radio.tsx:45`](src/components/Radio/Radio.tsx:45)). This matches the Figma JSON `Size` property.
        *   Includes `supportingText` and `showSupportingText` props ([`Radio.tsx:23-28`](src/components/Radio/Radio.tsx:23-28)) for optional secondary text.
        *   Includes a `locked` prop ([`Radio.tsx:34`](src/components/Radio/Radio.tsx:34)) which also implies `disabled`.
        *   Props like `value`, `disabled`, and `id` are passed through to the underlying `RadixRadioGroup.Item` via `{...props}` ([`Radio.tsx:83`](src/components/Radio/Radio.tsx:83)).
*   **Label Handling:**
    *   A `<label>` element wraps the `RadixRadioGroup.Item` and text elements ([`Radio.tsx:59`](src/components/Radio/Radio.tsx:59)). This is a common and accessible pattern. The `htmlFor` attribute is not explicitly used, as the input is nested within the label.
    *   `labelText` and `supportingText` are rendered within `<span>` elements ([`Radio.tsx:89-92`](src/components/Radio/Radio.tsx:89-92)).
*   **`React.forwardRef`:**
    *   `StyledRadioGroupItem` uses `React.forwardRef` correctly, typed to `HTMLButtonElement` ([`Radio.tsx:37`](src/components/Radio/Radio.tsx:37)), which is the underlying element type for `RadixRadioGroup.Item`. This adheres to [`ai_rules.md#III.3`](ai_rules.md:107).
*   **`displayName`:**
    *   `StyledRadioGroupItem.displayName = 'RadioGroup.Item';` is set ([`Radio.tsx:100`](src/components/Radio/Radio.tsx:100)), which is good practice as per [`ai_rules.md#III.4`](ai_rules.md:110).
*   **`clsx` Utility:**
    *   Used for conditional class names ([`Radio.tsx:60`](src/components/Radio/Radio.tsx:60), [`Radio.tsx:73`](src/components/Radio/Radio.tsx:73)), following [`ai_rules.md#III.5`](ai_rules.md:113).
*   **State Handling:**
    *   `isEffectivelyDisabled` correctly combines `disabled` and `locked` props ([`Radio.tsx:56`](src/components/Radio/Radio.tsx:56)).
    *   `data-disabled` and `data-locked` attributes are applied to the label wrapper and radio item for styling purposes ([`Radio.tsx:68-69`](src/components/Radio/Radio.tsx:68-69), [`Radio.tsx:82`](src/components/Radio/Radio.tsx:82)).

**Recommendations for `Radio.tsx`:**

*   Consider if `asChild` prop is needed for `RadioGroup.Root` or `RadioGroup.Item` as per [`ai_rules.md#II.4`](ai_rules.md:93). Currently, it's not implemented. While `RadioGroup.Root` is a `div` and `RadioGroup.Item` is a `button` by default in Radix, `asChild` would offer more flexibility if consumers need to change these underlying elements.
*   The `RadioGroupProps` interface ([`Radio.tsx:6`](src/components/Radio/Radio.tsx:6)) is minimal. While it extends Radix props, explicitly listing common props like `orientation` or `className` with TSDoc could improve developer experience, though not strictly required.

## 3. Analysis of `Radio.module.css`

The [`Radio.module.css`](src/components/Radio/Radio.module.css:1) file handles the styling for the radio group and items.

**Key Observations:**

*   **Token Imports:**
    *   Global token files (`figma-color-tokens.css`, `figma-numeric-tokens.css`, `figma-typography-tokens.css`) are correctly imported at the top ([`Radio.module.css:1-3`](src/components/Radio/Radio.module.css:1-3)) as per [`ai_rules.md#IV.1`](ai_rules.md:126).
*   **Styling Radix Parts:**
    *   `RadioGroup.Root`: Styled using the attribute selector `[data-radix-radio-group-root]` ([`Radio.module.css:247`](src/components/Radio/Radio.module.css:247)). Styles for `data-orientation` are also applied using attribute selectors ([`Radio.module.css:251`](src/components/Radio/Radio.module.css:251), [`Radio.module.css:256`](src/components/Radio/Radio.module.css:256)). This aligns with [`ai_rules.md#IV.2`](ai_rules.md:134).
    *   `RadioGroup.Item`: Styled via the `.radioItem` class ([`Radio.module.css:26`](src/components/Radio/Radio.module.css:26)).
    *   `RadioGroup.Indicator`: Styled via the `.radioIndicator` class and its `::after` pseudo-element ([`Radio.module.css:106`](src/components/Radio/Radio.module.css:106), [`Radio.module.css:115`](src/components/Radio/Radio.module.css:115)).
*   **State Styling:**
    *   Radix `data-*` attributes are used for state styling:
        *   `[data-state="unchecked"]` ([`Radio.module.css:55`](src/components/Radio/Radio.module.css:55), [`Radio.module.css:62`](src/components/Radio/Radio.module.css:62))
        *   `[data-state="checked"]` ([`Radio.module.css:73`](src/components/Radio/Radio.module.css:73), [`Radio.module.css:85`](src/components/Radio/Radio.module.css:85), [`Radio.module.css:160`](src/components/Radio/Radio.module.css:160))
        *   `[data-disabled]` ([`Radio.module.css:62`](src/components/Radio/Radio.module.css:62), [`Radio.module.css:95`](src/components/Radio/Radio.module.css:95))
    *   Pseudo-classes like `:hover` ([`Radio.module.css:62`](src/components/Radio/Radio.module.css:62)) and `:focus-visible` ([`Radio.module.css:72`](src/components/Radio/Radio.module.css:72)) are used correctly.
    *   The `:has()` pseudo-class is used to style labels based on the state of the nested radio item (e.g., [`Radio.module.css:55`](src/components/Radio/Radio.module.css:55)). This is a modern CSS feature and generally acceptable.
*   **Figma JSON Mapping:**
    *   **Sizes:** `.size18px` and `.size24px` classes are used for radio items ([`Radio.module.css:41-49`](src/components/Radio/Radio.module.css:41-49)). Label typography also changes based on size classes on the `labelWrapper` ([`Radio.module.css:204-216`](src/components/Radio/Radio.module.css:204-216), [`Radio.module.css:224-236`](src/components/Radio/Radio.module.css:224-236)).
    *   **Colors:** Color tokens from Figma JSON are used for different states (e.g., `border-color: var(--color-stroke-controls-default)` for unselected ([`Radio.module.css:53`](src/components/Radio/Radio.module.css:53)), `border-color: var(--color-surface-controls-selected)` for selected ([`Radio.module.css:86`](src/components/Radio/Radio.module.css:86))).
    *   **Typography:** Font properties for `labelText` and `supportingText` are mapped from Figma typography tokens based on size ([`Radio.module.css:204-236`](src/components/Radio/Radio.module.css:204-236)).
    *   **Focus Ring:** The focus ring style ([`Radio.module.css:75`](src/components/Radio/Radio.module.css:75)) uses `box-shadow` with `var(--color-surface-primary-default)` and `var(--color-stroke-brand)`, which seems to align with the Figma JSON's "Focused" state description (e.g., `Size=24px, State=Focused` refers to `focus_focus_stroke0` as `--color-stroke-brand`).
    *   **Locked State:** Styles for `[data-locked='true']` are implemented ([`Radio.module.css:175-185`](src/components/Radio/Radio.module.css:175-185)), mapping to Figma's "Locked" state colors like `var(--color-surface-controls-locked)`.
*   **Indicator Styling:**
    *   The indicator's size is relative to the item size ([`Radio.module.css:147-157`](src/components/Radio/Radio.module.css:147-157)).
    *   The indicator color for the selected state uses `var(--color-surface-controls-selected)` ([`Radio.module.css:161`](src/components/Radio/Radio.module.css:161)), which matches `selected_ellipse_4_ellipse_4_fill0` from Figma. This means the inner dot is the same color as the item's border when selected, effectively making it look like a solid filled circle. This is a direct interpretation of the Figma JSON.
*   **Spacing:**
    *   Gap between radio circle and text is `var(--spacing-sp-12)` ([`Radio.module.css:9`](src/components/Radio/Radio.module.css:9)).
    *   Gap for `RadioGroup.Root` orientation is `var(--spacing-sp-24)` ([`Radio.module.css:253`](src/components/Radio/Radio.module.css:253), [`Radio.module.css:258`](src/components/Radio/Radio.module.css:258)). This seems to be a sensible default, though not explicitly defined for the group itself in the provided Figma JSON (which focuses on the item).

**Recommendations for `Radio.module.css`:**

*   The comments regarding indicator styling ([`Radio.module.css:122-145`](src/components/Radio/Radio.module.css:122-145)) show some initial confusion but ultimately settle on directly mapping the Figma JSON. This is correct. The chosen implementation (inner dot having the same color as the selected border) is a valid interpretation of the Figma tokens.
*   Ensure all color tokens used (e.g., `--color-text-controls-focused`, `--color-surface-controls-locked-icon`) are correctly defined in [`globalTokens/figma-color-tokens.css`](globalTokens/figma-color-tokens.css:1) and match the Figma JSON. A quick check of the JSON shows these tokens are indeed specified.

## 4. Analysis of `Radio.stories.tsx`

The [`Radio.stories.tsx`](src/components/Radio/Radio.stories.tsx:1) file provides stories for testing and documenting the `RadioGroup` component.

**Key Observations:**

*   **Meta Configuration:**
    *   `title`, `component`, `tags`, `argTypes`, and `parameters` are correctly set up ([`Radio.stories.tsx:5-29`](src/components/Radio/Radio.stories.tsx:5-29)).
    *   `argTypes` cover common `RadioGroup.Root` props like `orientation`, `disabled`, `value`, `defaultValue`, etc.
*   **Story Coverage:**
    *   **Default:** A basic vertical radio group ([`Radio.stories.tsx:54`](src/components/Radio/Radio.stories.tsx:54)).
    *   **Orientation:** `Horizontal` story ([`Radio.stories.tsx:63`](src/components/Radio/Radio.stories.tsx:63)).
    *   **Sizes:** `Size18px` and `Size24px` stories, including disabled items within these sizes ([`Radio.stories.tsx:71`](src/components/Radio/Radio.stories.tsx:71), [`Radio.stories.tsx:84`](src/components/Radio/Radio.stories.tsx:84)).
    *   **Supporting Text:** `WithSupportingText` story demonstrates labels with main and supporting text, including a disabled item ([`Radio.stories.tsx:97`](src/components/Radio/Radio.stories.tsx:97)).
    *   **No Labels:** `NoLabels` story shows radio items without any text content ([`Radio.stories.tsx:129`](src/components/Radio/Radio.stories.tsx:129)).
    *   **Disabled States:**
        *   `DisabledGroup` story for when the entire group is disabled ([`Radio.stories.tsx:142`](src/components/Radio/Radio.stories.tsx:142)).
        *   Individual items are shown as disabled in `Size18px`, `Size24px`, `WithSupportingText`, and `NoLabels` stories.
        *   `PreSelectedAndDisabledItem` story correctly shows an item that is both checked and disabled ([`Radio.stories.tsx:156`](src/components/Radio/Radio.stories.tsx:156)).
    *   **Focused State:** `FocusedItem` story ([`Radio.stories.tsx:169`](src/components/Radio/Radio.stories.tsx:169)). It attempts to auto-focus, but correctly notes that focus is primarily user-driven and the story helps visualize the style. This adheres to [`ai_rules.md#V.6`](ai_rules.md:183) by not setting focus via props.
    *   **Locked State:** There isn't a specific story to demonstrate the "Locked" visual state. While `locked` is a prop on `RadioGroupItemProps`, its visual distinction (especially if different from just "selected" or "disabled") isn't explicitly showcased in a dedicated story.
*   **Template:** A `Template` function ([`Radio.stories.tsx:43`](src/components/Radio/Radio.stories.tsx:43)) is used to render stories, which is a good pattern for reusability.
*   **Props for Items:** The `items` prop in stories is an array of `StoryItem` ([`Radio.stories.tsx:35`](src/components/Radio/Radio.stories.tsx:35)), allowing easy configuration of multiple radio items with their individual props.

**Recommendations for `Radio.stories.tsx`:**

*   Add a specific story for the "Locked" state to visually verify its styling as defined in the Figma JSON and CSS. This story should demonstrate an item that is `locked={true}` and potentially `value` (checked).
    ```typescript
    // Example for a new "LockedItem" story
    export const LockedItem: Story = {
      render: Template,
      args: {
        defaultValue: 'item1', // This item will be checked and locked
        items: [
          { value: 'item1', children: 'Option A (Locked & Selected)', size: '18px', locked: true },
          { value: 'item2', children: 'Option B', size: '18px' },
        ],
        orientation: 'vertical',
      },
    };
    ```
*   The `FocusedItem` story's `useEffect` for auto-focusing ([`Radio.stories.tsx:174-182`](src/components/Radio/Radio.stories.tsx:174-182)) is commented out or noted as tricky. This is fine, as manual tabbing should demonstrate the focus style. The description for this story is good.

## 5. Figma JSON Cross-Reference Summary

The component implementation generally aligns well with the [`figma-jsons/done/radio.json`](figma-jsons/done/radio.json:1) specification.

*   **Properties:**
    *   `Label Content`, `Radio Label`, `Supporting Text` (visibility) are handled by the `children`, `supportingText`, and `showSupportingText` props in `Radio.tsx`.
    *   `Size` (`18px`, `24px`) is implemented as a `size` prop.
    *   `State` (Unselected, Hover, Focused, Selected, Disabled, Locked) are mapped to CSS states using `data-state`, `data-disabled`, `data-locked`, and pseudo-classes.
*   **Colors:**
    *   Color tokens specified in the JSON for various states (e.g., `unselected_unselected_stroke0`, `selected_ellipse_3_ellipse_3_stroke0`, `text_radio_label_radio_label_fill0`) are used in [`Radio.module.css`](src/components/Radio/Radio.module.css:1).
    *   The focus ring color (`--color-stroke-brand`) matches the `Size=24px, State=Focused` variant's `focus_focus_stroke0`. For `Size=18px, State=Focused`, the JSON specifies `focus_focus_stroke0` as `--color-stroke-controls-default`, but the CSS uses a consistent focus ring style for both sizes. This is a reasonable simplification, as focus rings are often consistent.
*   **Typography:**
    *   Typography tokens for "Radio Label" and "Supporting Text" for different sizes are correctly applied in [`Radio.module.css`](src/components/Radio/Radio.module.css:1) (e.g., `Body/Medium/SemiBold` for 18px label, `Body/Large/Regular` for 24px supporting text).
*   **Structure & Layout:**
    *   The item structure (ellipse for radio, text for label/supporting text) is conceptually matched.
    *   `itemSpacing` from Figma (`--spacing-sp-12`) is used as `gap` between the radio item and its text wrapper ([`Radio.module.css:9`](src/components/Radio/Radio.module.css:9)).
    *   `border-width` (`--border-width-200`) is applied to the radio item ([`Radio.module.css:35`](src/components/Radio/Radio.module.css:35)).
*   **Indicator:** The interpretation of `selected_ellipse_4_ellipse_4_fill0` as the color of the indicator dot itself (making it the same color as the selected item's border) is a direct mapping of the provided token.

**Discrepancies/Points to Note:**

*   **Focus Ring for 18px:** As noted, the Figma JSON for `Size=18px, State=Focused` specifies `focus_focus_stroke0` as `--color-stroke-controls-default` for the outer ring and refers to the `.Focus_Ring` component. The CSS implements a consistent `box-shadow` based on `--color-stroke-brand` for both sizes. This is a minor deviation but likely a sensible design consolidation. If strict adherence to different focus rings per size is required, this would need adjustment. Given the `.Focus_Ring` component reference in Figma, the current `box-shadow` implementation is a direct styling approach.
*   **RadioGroup Spacing:** The Figma JSON primarily details the individual radio *item*. Spacing for the `RadioGroup.Root` (e.g., `gap: var(--spacing-sp-24)`) is a reasonable default added in the CSS, not directly from this specific JSON's top-level layout properties.

## 6. `ai_rules.md` Adherence Check Summary

The component generally adheres well to the guidelines in [`ai_rules.md`](ai_rules.md:1).

*   **Figma as Source of Truth ([`ai_rules.md#I.1`](ai_rules.md:6)):** Largely followed for styling, props, and variants.
*   **Accessibility & Radix ([`ai_rules.md#I.2`](ai_rules.md:10), [`ai_rules.md#II`](ai_rules.md:72)): Correct Radix primitives (`RadioGroup.Root`, `RadioGroup.Item`, `RadioGroup.Indicator`) are used. `data-state` attributes are leveraged.
*   **Styling with Tokens ([`ai_rules.md#I.3`](ai_rules.md:14)):** Global design tokens are imported and used in CSS Modules.
*   **React Best Practices ([`ai_rules.md#I.4`](ai_rules.md:18)):
    *   Prop destructuring and defaults are used ([`Radio.tsx:42-51`](src/components/Radio/Radio.tsx:42-51)).
    *   Strong typing with TypeScript is used.
    *   `...rest` props are spread to `RadixRadioGroup.Item` ([`Radio.tsx:83`](src/components/Radio/Radio.tsx:83)).
    *   Conditional rendering for labels/supporting text is clear ([`Radio.tsx:87-94`](src/components/Radio/Radio.tsx:87-94)).
    *   `React.forwardRef` and `displayName` are correctly implemented.
*   **CSS Purity ([`ai_rules.md#I.5`](ai_rules.md:68)):** CSS pseudo-classes and Radix `data-*` attributes are used for states.
*   **Radix Parts Styling ([`ai_rules.md#IV.2`](ai_rules.md:134)): `[data-radix-radio-group-root]` is used. `.radioItem` and `.radioIndicator` are custom classes but target the conceptual Radix parts.
*   **`asChild` Prop ([`ai_rules.md#II.4`](ai_rules.md:93)):** Not currently implemented. Could be a future enhancement if polymorphism is needed for the root or item elements.
*   **Storybook ([`ai_rules.md#V`](ai_rules.md:170)):** Good coverage of variants and states. Interactive states are user-driven.

## 7. Conclusion and Recommendations

The `Radio` component (comprising `RadioGroup.Root` and `RadioGroup.Item`) is well-implemented, adhering closely to the Figma JSON specification and the `ai_rules.md` development guidelines. It correctly utilizes Radix UI primitives for core functionality and accessibility. Styling is managed effectively through CSS Modules and global design tokens.

**Key Strengths:**

*   Correct use of Radix UI primitives and their parts.
*   Clear and well-typed props.
*   Comprehensive state styling using `data-*` attributes and pseudo-classes.
*   Good mapping of Figma JSON properties (colors, typography, sizes) to CSS.
*   Good Storybook coverage for most states and variants.

**Recommendations Summary:**

1.  **`Radio.tsx`:**
    *   Consider adding the `asChild` prop to `RadioGroup.Root` and `StyledRadioGroupItem` for enhanced flexibility, if deemed necessary for future use cases.
2.  **`Radio.stories.tsx`:**
    *   Add a specific Storybook story to demonstrate the "Locked" state of a `RadioGroup.Item` to ensure its visual styling is correctly implemented and easily verifiable.
3.  **Figma JSON vs. CSS (Focus Ring):**
    *   Acknowledge the minor deviation in the 18px focus ring (using `--color-stroke-brand` like the 24px version, instead of `--color-stroke-controls-default` as per its specific Figma variant). This is likely acceptable as a design consolidation for consistency. If strict adherence is paramount, the CSS for the 18px focus state would need adjustment.

Overall, the component is robust and aligns well with the project's standards. The recommendations are minor and aimed at further refinement and completeness.