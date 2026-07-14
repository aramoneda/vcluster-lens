# QA Review: Tabset Component

## 1. Overview

This document outlines the Quality Assurance (QA) review for the `Tabset` and its associated `Tab` (Trigger/Content) React components. The review process involved cross-referencing the component implementation against its Figma JSON specifications and the `ai_rules.md` guidelines.

**Files Reviewed:**
*   **Component Source:** [`src/components/Tabset/Tabset.tsx`](src/components/Tabset/Tabset.tsx:1)
*   **Component Styles:** [`src/components/Tabset/Tabset.module.css`](src/components/Tabset/Tabset.module.css:1)
*   **Component Stories:** [`src/components/Tabset/Tabset.stories.tsx`](src/components/Tabset/Tabset.stories.tsx:1)
*   **Figma JSON (Tabset):** [`figma-jsons/done/tabset.json`](figma-jsons/done/tabset.json:1)
*   **Figma JSON (Tab):** [`figma-jsons/done/tab.json`](figma-jsons/done/tab.json:1)
*   **Guiding Principles:** [`ai_rules.md`](ai_rules.md:1)

## 2. Analysis of `Tabset.tsx`

The [`Tabset.tsx`](src/components/Tabset/Tabset.tsx:1) file defines the `Tabset` component as a composite component, exposing `Root`, `List`, `Trigger`, and `Content` parts, which aligns well with Radix UI's composition model.

**Key Observations:**

*   **Radix UI Primitives Usage:**
    *   `Tabset.Root` wraps [`RadixTabs.Root`](src/components/Tabset/Tabset.tsx:72).
    *   `Tabset.List` wraps [`RadixTabs.List`](src/components/Tabset/Tabset.tsx:93).
    *   `Tabset.Trigger` wraps [`RadixTabs.Trigger`](src/components/Tabset/Tabset.tsx:116).
    *   `Tabset.Content` wraps [`RadixTabs.Content`](src/components/Tabset/Tabset.tsx:137).
    *   This usage correctly leverages Radix UI for accessibility, keyboard navigation, and state management.

*   **Prop Definitions:**
    *   **`TabsetRootProps`**: Extends [`RadixTabs.TabsProps`](src/components/Tabset/Tabset.tsx:11). Includes `variant` (`title`, `medium`, `small`), `className`, and `children`. Standard Radix props like `defaultValue`, `value`, `onValueChange`, `orientation`, `activationMode` are available through extension.
    *   **`TabsetListProps`**: Extends [`RadixTabs.TabsListProps`](src/components/Tabset/Tabset.tsx:21). Includes `variant` (inheritable), `className`, `children`.
    *   **`TabsetTriggerProps`**: Extends [`RadixTabs.TabsTriggerProps`](src/components/Tabset/Tabset.tsx:32) (omitting `type`). Includes `variant` (inheritable), `className`, `children`. Standard Radix props like `value` and `disabled` are available.
    *   **`TabsetContentProps`**: Extends [`RadixTabs.TabsContentProps`](src/components/Tabset/Tabset.tsx:42). Includes `className`, `children`. Standard Radix prop `value` is available.
    *   Props seem well-defined and cover necessary configurations.

*   **Variant Handling:**
    *   A `TabsetVariantContext` ([`Tabset.tsx:52`](src/components/Tabset/Tabset.tsx:52)) is used to pass the `variant` prop from `Tabset.Root` down to `Tabset.List` and `Tabset.Trigger`. This is a clean way to allow individual tab triggers to inherit the variant or override it.
    *   The `useTabsetVariant` hook ([`Tabset.tsx:56`](src/components/Tabset/Tabset.tsx:56)) correctly consumes this context.

*   **`React.forwardRef` and `displayName`:**
    *   All parts (`Root`, `List`, `Trigger`, `Content`) correctly use [`React.forwardRef`](src/components/Tabset/Tabset.tsx:66) and set a `displayName` ([`Tabset.tsx:82`](src/components/Tabset/Tabset.tsx:82), [`Tabset.tsx:105`](src/components/Tabset/Tabset.tsx:105), [`Tabset.tsx:129`](src/components/Tabset/Tabset.tsx:129), [`Tabset.tsx:144`](src/components/Tabset/Tabset.tsx:144)).

*   **`clsx` Usage:**
    *   [`clsx`](src/components/Tabset/Tabset.tsx:3) is used for conditional class names, which is good practice.

*   **Children in `Tabset.Trigger`:**
    *   The `children` prop of `Tabset.Trigger` is wrapped in a `span` with class `styles.triggerLabel` ([`Tabset.tsx:125`](src/components/Tabset/Tabset.tsx:125)). This is a common pattern for applying specific text styling or pseudo-elements for underlines.

## 3. Analysis of `Tabset.module.css`

The [`Tabset.module.css`](src/components/Tabset/Tabset.module.css:1) file handles the styling for the `Tabset` components.

**Key Observations:**

*   **Token Imports:**
    *   Correctly imports global token files: [`figma-color-tokens.css`](globalTokens/figma-color-tokens.css), [`figma-numeric-tokens.css`](globalTokens/figma-numeric-tokens.css), and [`figma-typography-tokens.css`](globalTokens/figma-typography-tokens.css) ([`Tabset.module.css:1-3`](src/components/Tabset/Tabset.module.css:1)).

*   **Styling Radix Parts:**
    *   `.root`: Minimal styling, acts as a general container ([`Tabset.module.css:6`](src/components/Tabset/Tabset.module.css:6)).
    *   `.list`: Styles for `flex` layout, `border-bottom`, `padding-bottom`, and `gap` based on variants (`.list-title`, `.list-medium`, `.list-small`) ([`Tabset.module.css:11`](src/components/Tabset/Tabset.module.css:11), [`Tabset.module.css:20-29`](src/components/Tabset/Tabset.module.css:20)).
        *   The `small` variant correctly removes the bottom border as per "Feedback 2" ([`Tabset.module.css:28`](src/components/Tabset/Tabset.module.css:28)).
    *   `.trigger`: Base styles for background, border, padding, margin, cursor, position, and outline ([`Tabset.module.css:32`](src/components/Tabset/Tabset.module.css:32)).
        *   Includes `min-width` and `height` per variant (`.trigger-title`, `.trigger-medium`, `.trigger-small`) ([`Tabset.module.css:101-138`](src/components/Tabset/Tabset.module.css:101)).
        *   The `margin-bottom` calculation for `title` and `medium` triggers ([`Tabset.module.css:105`](src/components/Tabset/Tabset.module.css:105), [`Tabset.module.css:119`](src/components/Tabset/Tabset.module.css:119)) is intended to align the trigger's underline with the list's bottom border. This is a complex calculation and should be verified visually.
    *   `.triggerLabel`: Styles for the text within the trigger, including `position: relative` for the `::after` pseudo-element used for the underline ([`Tabset.module.css:55`](src/components/Tabset/Tabset.module.css:55)).
    *   `.triggerLabel::after`: Implements the underline, with its `background-color` changing based on state and `bottom` positioning varying by variant ([`Tabset.module.css:63-90`](src/components/Tabset/Tabset.module.css:63)).
    *   `.content`: Basic padding and outline removal ([`Tabset.module.css:230`](src/components/Tabset/Tabset.module.css:230)).

*   **State Styling (Radix `data-*` attributes):**
    *   `[data-state="active"]`: Styles for active tabs, primarily changing text color and underline color ([`Tabset.module.css:148`](src/components/Tabset/Tabset.module.css:148)).
    *   `[data-state="inactive"]:hover:not([data-disabled])`: Styles for hovered inactive tabs ([`Tabset.module.css:156`](src/components/Tabset/Tabset.module.css:156)).
    *   `[data-state="active"]:hover:not([data-disabled])`: Styles for hovered active tabs (maintains active appearance) ([`Tabset.module.css:163`](src/components/Tabset/Tabset.module.css:163)).
    *   `[data-state="inactive"]:active:not([data-disabled])`: Styles for pressed inactive tabs ([`Tabset.module.css:171`](src/components/Tabset/Tabset.module.css:171)).
    *   `[data-state="active"]:active:not([data-disabled])`: Styles for pressed active tabs (maintains active appearance) ([`Tabset.module.css:178`](src/components/Tabset/Tabset.module.css:178)).
    *   `:focus-visible:not([data-disabled])`: Applies a `box-shadow` for focus indication ([`Tabset.module.css:187`](src/components/Tabset/Tabset.module.css:187)). Specific underline and text colors for focused inactive/active states are also defined.
    *   `[data-disabled]`: Styles for disabled tabs, removing underline, changing text color, and cursor ([`Tabset.module.css:208`](src/components/Tabset/Tabset.module.css:208)). Typography (font-weight) also changes for `medium` and `small` disabled tabs ([`Tabset.module.css:220-225`](src/components/Tabset/Tabset.module.css:220)).
    *   The use of Radix `data-*` attributes for state styling is correct and aligns with `ai_rules.md`.

*   **Typography:**
    *   Typography (font family, size, weight, line-height) is applied to `.triggerLabel` based on the variant (`.trigger-title`, `.trigger-medium`, `.trigger-small`) ([`Tabset.module.css:107-112`](src/components/Tabset/Tabset.module.css:107), [`Tabset.module.css:121-126`](src/components/Tabset/Tabset.module.css:121), [`Tabset.module.css:133-138`](src/components/Tabset/Tabset.module.css:133)).

*   **Orientation:**
    *   The CSS primarily targets horizontal orientation. Vertical orientation styles were noted as "removed as per Feedback 4" ([`Tabset.module.css:227`](src/components/Tabset/Tabset.module.css:227)). Radix's `[data-orientation="vertical"]` would be the target if vertical styling were to be added.

## 4. Analysis of `Tabset.stories.tsx`

The [`Tabset.stories.tsx`](src/components/Tabset/Tabset.stories.tsx:1) file provides stories for showcasing the `Tabset` component in Storybook.

**Key Observations:**

*   **Meta Configuration:**
    *   `title`, `component`, `tags`, `argTypes`, and `parameters` are correctly set up ([`Tabset.stories.tsx:4-34`](src/components/Tabset/Tabset.stories.tsx:4)).
    *   `argTypes` provide controls for `variant`, `defaultValue`, `orientation` (correctly limited to 'horizontal'), and `activationMode`.

*   **Story Coverage:**
    *   `Default`: Shows the 'title' variant ([`Tabset.stories.tsx:71`](src/components/Tabset/Tabset.stories.tsx:71)).
    *   `MediumVariant`: Shows the 'medium' variant ([`Tabset.stories.tsx:85`](src/components/Tabset/Tabset.stories.tsx:85)).
    *   `SmallVariant`: Shows the 'small' variant ([`Tabset.stories.tsx:98`](src/components/Tabset/Tabset.stories.tsx:98)).
    *   `WithManualActivation`: Demonstrates `activationMode="manual"` ([`Tabset.stories.tsx:115`](src/components/Tabset/Tabset.stories.tsx:115)).
    *   Each story includes multiple tabs, including a disabled tab, and corresponding content panels.
    *   The `renderTabs` helper function ([`Tabset.stories.tsx:40`](src/components/Tabset/Tabset.stories.tsx:40)) is a good way to keep stories DRY.
    *   Stories for vertical orientation and RTL have been explicitly removed, aligning with current component capabilities ([`Tabset.stories.tsx:111-113`](src/components/Tabset/Tabset.stories.tsx:111)).

*   **Prop Usage in Stories:**
    *   Stories correctly pass `variant`, `defaultValue`, `orientation`, and `children` (via `renderTabs`) to `Tabset.Root`.
    *   The `renderTabs` function correctly passes the `variant` to individual `Tabset.Trigger` components.

## 5. Figma JSON Cross-Reference Summary

### [`figma-jsons/done/tabset.json`](figma-jsons/done/tabset.json:1) (Tabset Container/List)

*   **Variants (`Type` property):** "Title", "Medium", "Small" are mapped to `TabsetVariant` in TSX and CSS classes like `.list-title`, `.list-medium`, `.list-small`.
*   **Layout:**
    *   `strokeWeightBottom`: [`--border-width-300`](figma-jsons/done/tabset.json:20) is used for `.list`'s `border-bottom-width` ([`Tabset.module.css:16`](src/components/Tabset/Tabset.module.css:16)).
    *   `itemSpacing`:
        *   Title: [`--spacing-sp-24`](figma-jsons/done/tabset.json:388) used for `gap` in `.list-title` ([`Tabset.module.css:21`](src/components/Tabset/Tabset.module.css:21)).
        *   Medium: [`--spacing-sp-24`](figma-jsons/done/tabset.json:535) used for `gap` in `.list-medium` ([`Tabset.module.css:24`](src/components/Tabset/Tabset.module.css:24)).
        *   Small: [`--spacing-sp-12`](figma-jsons/done/tabset.json:679) used for `gap` in `.list-small` ([`Tabset.module.css:27`](src/components/Tabset/Tabset.module.css:27)).
*   **Colors:**
    *   The border color for the list (`type=title_stroke0`, `type=medium_stroke0`, `type=small_stroke0`) is [`--color-stroke-default`](figma-jsons/done/tabset.json:129) which is applied to `.list` as `border-bottom-color` ([`Tabset.module.css:15`](src/components/Tabset/Tabset.module.css:15)).
    *   The `Small` variant in Figma JSON does not show a bottom stroke for the list itself, which is correctly implemented by `border-bottom-style: none;` in `.list-small` ([`Tabset.module.css:28`](src/components/Tabset/Tabset.module.css:28)).
*   **Structure:** The JSON describes a list of tab instances. This is conceptually mapped to `Tabset.List` containing multiple `Tabset.Trigger` components.

### [`figma-jsons/done/tab.json`](figma-jsons/done/tab.json:1) (Individual Tab Trigger)

*   **Variants (`Type` property):** "Title Tab", "Medium Tab", "Small Tab" map to `TabsetVariant` and CSS classes `.trigger-title`, `.trigger-medium`, `.trigger-small`.
*   **Layout (per variant):**
    *   `minWidth` and `height` are generally applied to the corresponding `.trigger-<variant>` classes ([`Tabset.module.css:102-103`](src/components/Tabset/Tabset.module.css:102), [`Tabset.module.css:116-117`](src/components/Tabset/Tabset.module.css:116), [`Tabset.module.css:130-131`](src/components/Tabset/Tabset.module.css:130)).
    *   `strokeWeightBottom`: [`--border-width-300`](figma-jsons/done/tab.json:34) is used for the `height` of the `::after` pseudo-element ([`Tabset.module.css:68`](src/components/Tabset/Tabset.module.css:68)).
*   **Colors & States (`State` property):**
    *   **Active:**
        *   Underline: [`--color-stroke-brand`](figma-jsons/done/tab.json:48) used for `.trigger[data-state="active"] .triggerLabel::after` ([`Tabset.module.css:149`](src/components/Tabset/Tabset.module.css:149)).
        *   Text: [`--color-text-primary`](figma-jsons/done/tab.json:61) used for `.trigger[data-state="active"]` ([`Tabset.module.css:152`](src/components/Tabset/Tabset.module.css:152)).
    *   **Default (Inactive):**
        *   Text: [`--color-text-secondary`](figma-jsons/done/tab.json:174) used for base `.trigger` ([`Tabset.module.css:43`](src/components/Tabset/Tabset.module.css:43)). Underline is transparent.
    *   **Hover (Inactive):**
        *   Underline: [`--color-stroke-dark`](figma-jsons/done/tab.json:198) used for `.trigger[data-state="inactive"]:hover:not([data-disabled]) .triggerLabel::after` ([`Tabset.module.css:157`](src/components/Tabset/Tabset.module.css:157)).
        *   Text: [`--color-text-primary`](figma-jsons/done/tab.json:206) used for `.trigger[data-state="inactive"]:hover:not([data-disabled])` ([`Tabset.module.css:160`](src/components/Tabset/Tabset.module.css:160)).
    *   **Pressed (Inactive):**
        *   Underline: [`--color-stroke-brand`](figma-jsons/done/tab.json:233) used for `.trigger[data-state="inactive"]:active:not([data-disabled]) .triggerLabel::after` ([`Tabset.module.css:172`](src/components/Tabset/Tabset.module.css:172)).
        *   Text: [`--color-text-link-default`](figma-jsons/done/tab.json:242) used for `.trigger[data-state="inactive"]:active:not([data-disabled])` ([`Tabset.module.css:175`](src/components/Tabset/Tabset.module.css:175)).
    *   **Focused (Inactive):**
        *   Underline: [`--color-stroke-default`](figma-jsons/done/tab.json:278) used for `.trigger[data-state="inactive"]:focus-visible:not([data-disabled]) .triggerLabel::after` ([`Tabset.module.css:193`](src/components/Tabset/Tabset.module.css:193)).
        *   Text: [`--color-text-secondary`](figma-jsons/done/tab.json:286) used for `.trigger[data-state="inactive"]:focus-visible:not([data-disabled])` ([`Tabset.module.css:196`](src/components/Tabset/Tabset.module.css:196)).
        *   Focus Ring: The JSON mentions a `.focus_ring_component`. This is implemented as a `box-shadow` with [`--color-stroke-brand-focused`](src/components/Tabset/Tabset.module.css:189) on `.trigger:focus-visible:not([data-disabled])`.
    *   **Disabled:**
        *   Text: [`--color-text-disabled`](figma-jsons/done/tab.json:317) used for `.trigger[data-disabled]` ([`Tabset.module.css:212`](src/components/Tabset/Tabset.module.css:212)). Underline is transparent.
*   **Typography (per variant/state):**
    *   The `typography` section in [`tab.json`](figma-jsons/done/tab.json:1158) specifies font family, size, weight, and line-height for each variant and state.
    *   **Title Tab:** Uses `Headlines/H4` tokens ([`Tabset.module.css:108-111`](src/components/Tabset/Tabset.module.css:108)). Disabled state maintains this weight.
    *   **Medium Tab:** Uses `Body/Medium/SemiBold` tokens ([`Tabset.module.css:122-125`](src/components/Tabset/Tabset.module.css:122)). Disabled state changes to `Body/Medium/Regular` weight ([`--font-body-medium-regular-weight`](src/components/Tabset/Tabset.module.css:221)).
    *   **Small Tab:** Uses `Body/Medium/SemiBold` tokens ([`Tabset.module.css:134-137`](src/components/Tabset/Tabset.module.css:134)). Disabled state changes to `Body/Medium/Regular` weight ([`--font-body-medium-regular-weight`](src/components/Tabset/Tabset.module.css:224)).
    *   This mapping appears correct.

## 6. `ai_rules.md` Adherence Check Summary

*   **I.1 Figma JSON as Source of Truth:** Generally well-adhered to. Styling and variants are derived from the JSONs.
*   **I.2 Accessibility (Leverage Radix):** Excellent. Radix Tabs primitives are used correctly.
*   **I.3 Maximum Styling Control with Your Tokens:** Excellent. Global tokens are imported and used throughout the CSS module. Raw values are not hardcoded where tokens exist.
*   **I.4 Clean, Maintainable, Idiomatic React:**
    *   Prop Destructuring and Defaults: Yes, e.g., `variant = 'title'` in [`Tabset.Root`](src/components/Tabset/Tabset.tsx:69).
    *   Clear Prop Typing: Yes, TypeScript interfaces are used.
    *   Composition and Prop Spreading: Yes, `...props` are spread to Radix components.
    *   Conditional Rendering: Minimal, but appropriate.
    *   No Unnecessary State: Yes, relies on Radix for state.
    *   `React.forwardRef`, `displayName`: Yes.
*   **I.5 CSS Purity:** Excellent. Relies on pseudo-classes and `data-*` attributes.
*   **II. Radix UI Usage:**
    *   II.1 Appropriate Radix Primitives: Yes, `Tabs.Root`, `List`, `Trigger`, `Content` are used.
    *   II.2 Leverage Radix Parts and `data-state`: Yes, CSS targets `data-state` attributes extensively.
    *   II.4 Polymorphism with `asChild`: Not explicitly implemented with `Slot`. While Radix primitives inherently support `asChild`, the components themselves don't expose an `asChild` prop directly or use `Slot`. This could be a minor improvement if desired for consistency, but Radix handles the core functionality.
*   **III. React Component Implementation (`.tsx`):**
    *   File Naming: Correct.
    *   Props: Well-defined, extending Radix props.
    *   `React.forwardRef`, `displayName`, `clsx`: Correctly used.
*   **IV. CSS Modules Implementation (`.module.css`):**
    *   Token Imports: Correct.
    *   Target Radix Parts via `data-*`: Yes, extensively used for states.
    *   Base Styles: Applied to `.root`, `.list`, `.trigger`, `.content`.
    *   Variant Styles: Clear classes for variants.
    *   States: Correctly styled using pseudo-classes and `data-*` attributes.
    *   NO `!important`: Adhered to.
    *   Comments: Some comments trace back to Figma (e.g., "Feedback items"), which is good. More could be added for clarity if needed.
*   **V. Storybook Stories (`.stories.tsx`):**
    *   Default Story, Variant Combinations, State Demonstrations (disabled), Content Configurations: All present and well-structured.
    *   Controls (Args): Yes.
    *   Interactive States: Correctly relies on user interaction for hover/focus/active.

## 7. Conclusion and Recommendations

**Conclusion:**

The `Tabset` component is well-implemented, closely following the Figma JSON specifications and adhering to the vast majority of `ai_rules.md` guidelines. The use of Radix UI primitives is excellent, ensuring good accessibility and state management. Styling is robustly handled via CSS Modules and global design tokens, with proper use of `data-*` attributes for states. Prop definitions are clear, and Storybook stories provide good coverage.

**Recommendations:**

1.  **`asChild` Prop (Minor):** Consider explicitly adding the `asChild` prop and using `@radix-ui/react-slot` in the `Tabset.Root`, `List`, `Trigger`, and `Content` components if consistent `asChild` support across *all* custom components is a strict library-wide requirement (as per `ai_rules.md` II.4). Radix itself will handle `asChild` on its primitives, but exposing it directly on the composed parts might be preferred for API consistency. This is a minor point as the underlying Radix components already support it.
2.  **Vertical Orientation Styling (Future):** The CSS explicitly notes that vertical styles were removed. If vertical orientation becomes a requirement, styles targeting `[data-orientation="vertical"]` on the `.list` and potentially `.trigger` elements will need to be added, referencing the Figma JSON for vertical tab designs if available.
3.  **CSS Comments (Minor):** While some comments exist, consider adding more comments in [`Tabset.module.css`](src/components/Tabset/Tabset.module.css:1) to explicitly link specific style blocks or properties to their corresponding Figma JSON keys or sections, especially for complex calculations like the `margin-bottom` on triggers. This would further improve maintainability.
4.  **Visual Verification of Underline Alignment:** The `margin-bottom` calculation for `.trigger-title` and `.trigger-medium` ([`Tabset.module.css:105`](src/components/Tabset/Tabset.module.css:105), [`Tabset.module.css:119`](src/components/Tabset/Tabset.module.css:119)) to align the trigger underline with the list's bottom border is complex. This should be meticulously verified across different browsers and text lengths to ensure pixel-perfect alignment as intended.

Overall, the component is in excellent shape and demonstrates a strong adherence to the established development practices.