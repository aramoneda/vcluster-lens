# QA Review: Popover Component

## 1. Overview

This document outlines the Quality Assurance (QA) review for the `Popover` React component. The review process involved analyzing the component's source code ([`Popover.tsx`](src/components/Popover/Popover.tsx:1)), its CSS module ([`Popover.module.css`](src/components/Popover/Popover.module.css:1)), Storybook stories ([`Popover.stories.tsx`](src/components/Popover/Popover.stories.tsx:1)), the Figma JSON specification ([`figma-jsons/done/popover.json`](figma-jsons/done/popover.json:1)), and adherence to the guidelines in [`ai_rules.md`](ai_rules.md:1).

## 2. Analysis of `Popover.tsx`

The [`Popover.tsx`](src/components/Popover/Popover.tsx:1) file defines the `Popover` component, which is a composite component built using Radix UI's Popover primitives.

**Key Observations:**

*   **Radix UI Primitives Usage:**
    *   The component correctly utilizes `@radix-ui/react-popover` primitives.
    *   `RadixPopover.Root`: Used as `Popover.Root` for the main context provider.
    *   `RadixPopover.Trigger`: Used as `Popover.Trigger` for the element that opens the popover.
    *   `RadixPopover.Portal`: Used as `Popover.Portal` (and internally within `PopoverContent`) to render the popover content into a React Portal, ensuring it's rendered at the top of the DOM tree.
    *   `RadixPopover.Content`: Wrapped by a custom `PopoverContent` component to apply styling and custom props.
    *   `RadixPopover.Close`: Exported as `Popover.Close` for declarative closing of the popover.
    *   `RadixPopover.Arrow`: Initially considered but correctly removed as the Figma JSON ([`figma-jsons/done/popover.json`](figma-jsons/done/popover.json:1)) does not specify an arrow. This aligns with [`ai_rules.md`](ai_rules.md:70) (II.1) which states "Popover.Close and Popover.Arrow should be included if their presence and styling are defined in the Figma JSON".

*   **`PopoverContentProps` Interface:**
    *   Extends `RadixPopover.PopoverContentProps`, allowing all standard Radix props to be passed through.
    *   Defines a custom `size` prop (`'M' | 'S' | 'XS'`) with a default of `'M'`, which aligns with the Figma JSON's default variant.
    *   Includes `children` and `className` props as expected.

*   **`PopoverContent` Component:**
    *   `React.forwardRef` is correctly used to forward refs to the underlying `RadixPopover.Content` element.
    *   `displayName` is set to `'PopoverContent'`.
    *   `clsx` is used for conditional class application, combining base styles, size-specific styles, and any passed `className`.
    *   The `size` prop is mapped to CSS module classes (`styles.contentM`, `styles.contentS`, `styles.contentXS`).
    *   A `sideOffset` default of `8` is applied, which corresponds to `--spacing-sp-8` as per common token usage. This is a sensible default if not explicitly defined for all cases in Figma.
    *   All other `...props` are spread to `RadixPopover.Content`, ensuring Radix functionality is preserved (e.g., `side`, `align`, `alignOffset`, `avoidCollisions`, etc.).

*   **Exports:**
    *   The component exports `Popover` as an object containing `Root`, `Trigger`, `Portal`, `Content`, and `Close`.
    *   Relevant Radix Popover types (`RadixPopoverRootProps`, `RadixPopoverTriggerProps`, `RadixPopoverPortalProps`, `RadixPopoverCloseProps`) are re-exported for consumer convenience.

**Adherence to `ai_rules.md`:**

*   **I.1 (Figma JSON as Source of Truth):** The `size` prop and its default directly map to Figma JSON.
*   **I.2 (Accessibility First - Radix):** Correctly uses Radix primitives, inheriting accessibility features.
*   **I.4 (Clean React):**
    *   Props are destructured, and defaults are applied ([`Popover.tsx:31`](src/components/Popover/Popover.tsx:31), [`Popover.tsx:33`](src/components/Popover/Popover.tsx:33)).
    *   Props are strongly typed with TypeScript ([`Popover.tsx:8`](src/components/Popover/Popover.tsx:8)).
    *   `...props` are spread to the underlying Radix component ([`Popover.tsx:52`](src/components/Popover/Popover.tsx:52)).
    *   `React.forwardRef` is used ([`Popover.tsx:24`](src/components/Popover/Popover.tsx:24)).
    *   `displayName` is set ([`Popover.tsx:61`](src/components/Popover/Popover.tsx:61)).
*   **II.1 (Use Appropriate Radix Primitives):** Correctly uses `@radix-ui/react-popover` parts.
*   **III. (React Component Implementation):** Follows general structure guidelines.

## 3. Analysis of `Popover.module.css`

The [`Popover.module.css`](src/components/Popover/Popover.module.css:1) file handles the styling for the `Popover.Content` part.

**Key Observations:**

*   **Token Imports:**
    *   Correctly imports global design tokens: `figma-color-tokens.css`, `figma-numeric-tokens.css`, `figma-typography-tokens.css` ([`Popover.module.css:2-4`](src/components/Popover/Popover.module.css:2)).

*   **`.content` Base Styles:**
    *   `background-color`: Uses `var(--color-surface-foreground)` which maps to `size=m_fill0.token` from Figma JSON ([`figma-jsons/done/popover.json`](figma-jsons/done/popover.json:43)).
    *   `border-radius`: Uses `var(--radius-s)` which maps to `layout.cornerRadius.token` from Figma JSON ([`figma-jsons/done/popover.json`](figma-jsons/done/popover.json:19)).
    *   `z-index`: Set to `50`, a common practice for popovers.
    *   `box-shadow`: A placeholder shadow `0px 2px 8px rgba(0, 0, 0, 0.15)` is used. The Figma JSON does not explicitly define a shadow for the popover content itself. This is a reasonable addition for usability but should be confirmed against design intent if a specific shadow is required.
    *   `animation-duration` and `animation-timing-function`: Basic animation properties are set. Radix handles the open/close states, so these provide a subtle transition.

*   **Radix Data State Styling:**
    *   Selectors for `[data-state='open']` ([`Popover.module.css:37`](src/components/Popover/Popover.module.css:37)) and `[data-state='closed']` ([`Popover.module.css:42`](src/components/Popover/Popover.module.css:42)) are present, though currently empty. This is good practice for future animation enhancements.

*   **Size-Specific Styles (`.contentM`, `.contentS`, `.contentXS`):**
    *   `.contentM`: `padding: var(--spacing-sp-24)` (maps to `variants[Size=M].layout.padding.token` in Figma JSON ([`figma-jsons/done/popover.json`](figma-jsons/done/popover.json:56))).
    *   `.contentS`: `padding: var(--spacing-sp-16)` (maps to `variants[Size=S].layout.padding.token` in Figma JSON ([`figma-jsons/done/popover.json`](figma-jsons/done/popover.json:89))).
    *   `.contentXS`: `padding: var(--spacing-sp-12)` (maps to `variants[Size=XS].layout.padding.token` in Figma JSON ([`figma-jsons/done/popover.json`](figma-jsons/done/popover.json:122))).
    *   The CSS correctly notes that Figma JSON specifies fixed `width`/`height` for variants, but for a generic popover, using padding and allowing content to determine dimensions is more flexible. This is a good practical decision.

*   **Arrow Styles:**
    *   Comments indicate arrow styles were removed as `Popover.Arrow` is not used, which is consistent with the component implementation and Figma JSON.

**Adherence to `ai_rules.md`:**

*   **I.1 (Figma JSON as Source of Truth):** Styles for background, border-radius, and padding for different sizes are directly derived from Figma JSON tokens.
*   **I.3 (Maximum Styling Control with Your Tokens):** Global tokens are imported and used.
*   **I.5 (CSS Purity):** Relies on Radix `data-state` attributes for state styling.
*   **IV.1 (Token Imports):** Correctly imports token files.
*   **IV.2 (Target Radix Parts via `data-*` Attributes):** While the main content styling is via a custom class (`.content`), the `data-state` attributes are correctly targeted on this class, which is applied to the Radix `Content` part.
*   **IV.3 (Base Styles):** Base styles are applied to `.content`.
*   **IV.4 (Variant Styles):** Size variants are implemented with correct token mapping.
*   **IV.5 (States):** `data-state` attributes are targeted.
*   **IV.8 (Comments):** Comments trace CSS rules to Figma JSON sections.

## 4. Analysis of `Popover.stories.tsx`

The [`Popover.stories.tsx`](src/components/Popover/Popover.stories.tsx:1) file provides stories for testing and documenting the `Popover` component.

**Key Observations:**

*   **Meta Configuration:**
    *   `title`: 'Components/Popover'.
    *   `component`: `Popover.Content` (focuses on the part with most configurable props).
    *   `tags`: `['autodocs']`.
    *   `argTypes`: Defined for `size`, `children`, `side`, `align`, `sideOffset`, `alignOffset`. Defaults are specified and match Radix defaults or component-defined defaults (e.g., `sideOffset: 8`).
    *   `parameters.layout`: 'centered'.
    *   `parameters.backgrounds`: Defined with a 'dashboard' default.

*   **Template Story:**
    *   A generic template renders `Popover.Root`, `Popover.Trigger` (with a placeholder HTML button), and `Popover.Content`.
    *   Includes a `Popover.Close` button within the content.
    *   Placeholder `div` with background color is used for content to make it visible.

*   **Stories:**
    *   `Default`: Demonstrates the default 'M' size.
    *   `SizeS`: Demonstrates 'S' size.
    *   `SizeXS`: Demonstrates 'XS' size.
    *   `SideAndAlign`: Demonstrates `side: 'left'`, `align: 'start'`, and `sideOffset`.
    *   `ControlledPopover`: Shows how to control the `open` state externally using `useState`, `Popover.Root open` prop, and `onOpenChange` callback.
    *   `CustomTrigger`: Shows usage with a custom `<span>` element as a trigger.
    *   A story for `WithArrow` is correctly commented out/removed as the arrow is not part of the component.

*   **Placeholders:**
    *   Uses HTML `<button>` elements as triggers and close buttons with "TODO: Replace with actual Button component" comments. This is acceptable for isolated component development if a shared `Button` component isn't immediately available or in scope.

**Adherence to `ai_rules.md`:**

*   **V.1 (Default Story):** `Default` story uses default props.
*   **V.2 (Variant Combinations):** Stories for different `size` props are provided. Stories for `side` and `align` demonstrate these Radix props.
*   **V.3 (State Demonstrations):** `ControlledPopover` demonstrates managing the `open` state. No explicit `disabled` state story for the popover itself, as `disabled` is typically on the trigger.
*   **V.4 (Content Configurations):** Different content examples are shown within stories.
*   **V.5 (Controls):** `argTypes` are well-defined.
*   **V.6 (Interactive States):** Correctly avoids manual hover/focus state stories. Radix-controlled `open` state is demonstrated.

## 5. Figma JSON Cross-Reference Summary ([`figma-jsons/done/popover.json`](figma-jsons/done/popover.json:1))

*   **`properties.Size` (M, S, XS, default M):**
    *   Implemented as `size` prop in [`Popover.tsx`](src/components/Popover/Popover.tsx:13) with type `PopoverSize` and default `'M'`.
    *   CSS classes `.contentM`, `.contentS`, `.contentXS` in [`Popover.module.css`](src/components/Popover/Popover.module.css:1) correctly map to these sizes.
*   **`layout.cornerRadius.token: --radius-s`:**
    *   Applied as `border-radius: var(--radius-s)` in [`.content`](src/components/Popover/Popover.module.css:14) class.
*   **`layout.padding.token: --spacing-sp-24` (for default/Size M):**
    *   Applied as `padding: var(--spacing-sp-24)` in [`.contentM`](src/components/Popover/Popover.module.css:55) class.
*   **`variants[Size=M].colors.size=m_fill0.token: --color-surface-foreground`:**
    *   Applied as `background-color: var(--color-surface-foreground)` in [`.content`](src/components/Popover/Popover.module.css:12) class.
*   **`variants[Size=S].layout.padding.token: --spacing-sp-16`:**
    *   Applied as `padding: var(--spacing-sp-16)` in [`.contentS`](src/components/Popover/Popover.module.css:67) class.
*   **`variants[Size=XS].layout.padding.token: --spacing-sp-12`:**
    *   Applied as `padding: var(--spacing-sp-12)` in [`.contentXS`](src/components/Popover/Popover.module.css:73) class.
*   **Typography:** The Figma JSON ([`figma-jsons/done/popover.json`](figma-jsons/done/popover.json:215)) specifies typography for a "Content Placeholder" (e.g., `Headlines/H4`). The `Popover` component itself is a container and does not enforce specific typography on its children. This is appropriate, as the content within the popover will determine its own typography. The stories use `<h4>`, `<p>`, etc., which would inherit global styles or be styled by their own components.
*   **Arrow:** The Figma JSON does not define an arrow. The component correctly omits `Popover.Arrow`.
*   **Shadow/Border:** The Figma JSON does not explicitly define a `box-shadow` or `border` for the popover content. The CSS includes a placeholder shadow and comments on the absence of a border definition.

**Overall, the component's styling and props align well with the provided Figma JSON specifications for the aspects defined (size, padding, background color, corner radius).**

## 6. `ai_rules.md` Adherence Check Summary

The component generally adheres well to the [`ai_rules.md`](ai_rules.md:1) guidelines.

*   **Section I (Core Philosophy):**
    *   Figma JSON is largely the source of truth for defined properties (I.1).
    *   Accessibility is handled by Radix (I.2).
    *   Styling uses global tokens and CSS Modules (I.3).
    *   React best practices are followed (I.4).
    *   CSS Purity: Relies on `data-state` (I.5).
*   **Section II (Radix UI Usage):**
    *   Appropriate Radix Popover primitives are used (II.1).
    *   Radix `data-state` attributes are targeted for styling (II.2).
    *   No Radix Themes components are used (II.3 not applicable).
    *   `asChild` is implicitly supported by Radix primitives, though not explicitly added as a prop to `PopoverContent` itself (which is fine as Radix parts like `Trigger` handle it).
*   **Section III (React Component Implementation):**
    *   File naming is correct.
    *   Props are well-defined.
    *   `React.forwardRef` and `displayName` are used.
    *   `clsx` is used.
*   **Section IV (CSS Modules Implementation):**
    *   Token imports are correct.
    *   Radix `data-state` attributes are targeted.
    *   Base and variant styles are structured correctly.
    *   No `!important`.
    *   Comments link styles to Figma JSON.
*   **Section V (Storybook Stories):**
    *   Stories cover defaults, variants, and states appropriately.
    *   Controls are used.

## 7. Conclusion and Recommendations

The `Popover` component is well-implemented, effectively leveraging Radix UI primitives for core functionality and accessibility. Styling is correctly derived from the Figma JSON for specified properties and uses the established design token system. The Storybook documentation provides good coverage of its features.

**Recommendations:**

1.  **Confirm Shadow: (Minor)** The placeholder `box-shadow` in [`Popover.module.css`](src/components/Popover/Popover.module.css:23) should be reviewed with the design team. If a specific shadow is intended, it should be added to the Figma JSON and implemented using a token if available, or as a defined value. If no shadow is intended, the placeholder should be removed.
2.  **Confirm Border: (Minor)** Similarly, the absence of a border is noted in the CSS. If a border is required by design, it should be specified in Figma JSON and implemented.
3.  **Button Component Integration: (Enhancement)** In [`Popover.stories.tsx`](src/components/Popover/Popover.stories.tsx:1), replace placeholder HTML `<button>` elements with the actual shared `Button` component once available, for consistency and to showcase integration.
4.  **Typography of Popover Content: (Documentation/Clarification)** While the popover itself shouldn't enforce typography, it might be beneficial to add a note in the Storybook documentation or component TSDoc that the content placed inside the `Popover.Content` is responsible for its own typography, adhering to global styles or its own component styles. This is implicitly understood but could be explicitly stated.

Overall, the component is robust, adheres to specifications and guidelines, and is ready for use. The recommendations are minor and mostly relate to design clarifications or future enhancements.