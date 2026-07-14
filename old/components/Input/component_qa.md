# QA Review: Input Component

## 1. Analysis of `src/components/Input/Input.tsx`

The `Input.tsx` component aims to provide a flexible input field that can function as a standard text input or a multi-line textarea, with support for labels, feedback messages, and icons.

**Key Observations:**

*   **Props (`InputProps`):**
    *   The `InputProps` interface is well-defined, extending `CommonInputProps` which cleverly omits conflicting HTML attributes from `InputHTMLAttributes` and `TextareaHTMLAttributes`.
    *   Props like `label`, `feedback`, `icon` (right icon), `leftIcon`, `multiline`, `isInvalid`, `required`, and `labelInfo` are clearly defined and documented.
    *   It correctly includes standard HTML attributes like `type`, `value`, `defaultValue`, `onChange`, `placeholder`, `disabled`, `readOnly`, `name`, `onFocus`, `onBlur`, `min`, `max`, `step`, `rows`, `cols`, `maxLength`, `minLength`, `pattern`, `autoComplete`.
    *   Custom class name props (`className`, `inputClassName`, `labelClassName`, `feedbackClassName`) are provided for styling flexibility.
*   **Structure & Logic:**
    *   Uses `React.forwardRef` to correctly forward refs to the underlying `input` or `textarea` element.
    *   `useId` is employed to generate unique IDs for accessibility (`id` for input, `feedbackId` for `aria-describedby`).
    *   Conditional rendering is used for the label, feedback message, and icons based on prop presence.
    *   The `multiline` prop correctly switches between rendering an `<input>` and a `<textarea>` element.
    *   `commonHtmlProps` object consolidates shared attributes for the input/textarea, which is a good practice.
    *   Value and defaultValue are handled correctly to avoid conflicts: `...(value !== undefined ? { value } : {}), ...(defaultValue !== undefined && value === undefined ? { defaultValue } : {})`.
*   **Accessibility:**
    *   `htmlFor` on the label is correctly associated with the input's `id`.
    *   `aria-invalid` is set based on the `isInvalid` prop.
    *   `aria-describedby` is set to `feedbackId` when a feedback message is present.
    *   `aria-hidden="true"` is used on icon `<div>` wrappers, and the icons themselves, which is appropriate as they are decorative.
    *   `role="alert"` is conditionally applied to the feedback `div` when `isInvalid` is true, which is good for announcing errors.
*   **Radix UI Usage:**
    *   The component does **not** use Radix UI Primitives (e.g., `Primitive.input` or `@radix-ui/react-form` components like `Form.Field`, `Form.Control`). It implements a standard HTML `input` and `textarea`. This is a deviation from `ai_rules.md` (Rule II.1) which mandates using Radix Primitives for interactive components.
*   **Icon Handling:**
    *   Supports `icon` (right) and `leftIcon` props, accepting `ElementType` (e.g., Lucide icon components).
    *   Icons are wrapped in `div` elements with appropriate classes for positioning.
*   **Required Indicator & Label Info:**
    *   A `*` is shown when `required` is true and a `label` is present.
    *   A basic info icon (`&#x24D8;`) is shown when `labelInfo` is provided.
*   **Error Handling:**
    *   `isInvalid` prop controls the `aria-invalid` attribute and styling for error states.
    *   A basic error icon (`!`) is shown in the feedback message when `isInvalid` is true.

**Potential Issues/Deviations:**

*   **No Radix Primitives:** The most significant deviation from `ai_rules.md` is the lack of Radix UI Primitives. This means the component doesn't automatically benefit from Radix's built-in accessibility enhancements, state management (`data-state` attributes for styling), and `asChild` prop for polymorphism.
*   **`data-state` Attributes:** Since Radix is not used, `data-state` attributes (e.g., `data-disabled`, `data-invalid`) are not present on the input element itself for CSS targeting, relying instead on `[aria-invalid="true"]` and `:disabled`. `ai_rules.md` (Rule II.2) emphasizes using these.
*   **`displayName`:** `Input.displayName = 'Input';` is correctly set.

## 2. Analysis of `src/components/Input/Input.module.css`

The CSS module provides styling for the `Input` component and its parts.

**Key Observations:**

*   **Token Usage:**
    *   Correctly imports global tokens: `figma-color-tokens.css`, `figma-numeric-tokens.css`, `figma-typography-tokens.css`.
    *   Tokens are generally used for colors, fonts, spacing, and radii.
*   **Structure & Selectors:**
    *   `.wrapper`: Styles the main container.
    *   `.label`, `.requiredIndicator`, `.infoIcon`: Styles for the label and its addons.
    *   `.inputContainer`: Used for positioning icons relative to the input.
    *   `.input`: Base styles for both input and textarea.
    *   `.inputField`, `.textarea`: Specific styles for single-line and multi-line inputs.
    *   `.inputWithRightIcon`, `.inputWithLeftIcon`: Adjusts padding when icons are present.
    *   `.iconWrapper`, `.leftIconWrapper`, `.rightIconWrapper`, `.icon`: Styles for icon containers and icons.
    *   `.feedback`, `.feedbackError`, `.feedbackIcon`: Styles for the feedback message.
*   **State Styling:**
    *   **Hover:** `:hover:not(:disabled):not([aria-invalid="true"])` is used.
    *   **Focus:** `:focus` and `:focus-visible` are used for focus rings. `box-shadow` is used to create a custom focus ring.
    *   **Disabled:** `:disabled` pseudo-class is used. Styles for `::placeholder` in disabled state are also present.
    *   **Invalid/Error:** `[aria-invalid="true"]` attribute selector is used. Focus styles for invalid state are also defined.
*   **Figma JSON Mapping (General):**
    *   Comments often reference Figma JSON files (e.g., "Styles from figma-jsons/input-label.json").
    *   Typography, colors, and dimensions seem to generally follow the token system.
    *   `height: 36px;` is explicitly set on `.input` for single-line inputs.
    *   `.textarea` has `min-height: 74px;` and `resize: vertical;`.
    *   Padding for icons (`padding-right: 36px`, `padding-left: 36px`) seems to be a fixed value, which should ideally be based on icon wrapper size + spacing token.
*   **Placeholder Styling:**
    *   `::placeholder` pseudo-element is styled for color and typography.
*   **Font Weight Handling:**
    *   The comment `/* Revert to regular weight to prevent layout shift */` and `/* Revert placeholder weight to regular as per Figma spec */` indicates conscious handling of font weights, which is good. The previous rule `/* REMOVED: .input:not(:placeholder-shown) rule for font-weight */` suggests an iterative improvement.

**Potential Issues/Deviations:**

*   **Lack of `data-state` Selectors:** Due to not using Radix, CSS cannot target `data-state` attributes for styling (e.g., `[data-invalid]`). It relies on `[aria-invalid="true"]` and standard pseudo-classes.
*   **Fixed Icon Padding:** The `36px` padding for icons in `.inputWithRightIcon` and `.inputWithLeftIcon` might not be flexible if icon sizes or spacing needs change. Using CSS variables or calculations based on tokens might be more robust.
*   **Focus Ring:** The custom `box-shadow` for focus rings is good, but ensuring it meets accessibility contrast and visibility requirements across themes is important. Radix often provides robust focus handling.

## 3. Analysis of `src/components/Input/Input.stories.tsx`

The Storybook file defines stories to showcase the `Input` component's variations and props.

**Key Observations:**

*   **Metadata & ArgTypes:**
    *   `title`, `component`, and `tags: ['autodocs']` are correctly set.
    *   `argTypes` are well-defined, categorizing props into "HTML Attributes", "HTML Attributes (Input Only)", "HTML Attributes (Textarea Only)", "Events", and "Custom Props".
    *   Controls are appropriately set (e.g., `select` for `type`, `boolean` for toggles, `text` for strings, `number` for `rows`/`cols`).
    *   `if` conditions are used to show/hide props based on `multiline` state (e.g., `type` only for single-line, `rows` only for multiline).
    *   Icon props (`icon`, `leftIcon`) have `control: false` as they are passed as components.
    *   Default `args` are provided.
*   **Stories:**
    *   **`Default`**: Basic input.
    *   **`WithLabel`**: Shows label and `required` indicator.
    *   **`Multiline`**: Demonstrates the textarea functionality with `rows`.
    *   **`Filled`**: Uses `defaultValue` to show pre-filled state.
    *   **`WithIcon`**: Shows right icon (Search).
    *   **`WithLeftIcon`**: Shows left icon (User).
    *   **`WithFeedback`**: Shows feedback message.
    *   **`Disabled`**: Shows disabled state.
    *   **`Invalid`**: Shows error state with feedback.
    *   **`MultilineInvalid`**: Shows error state for textarea.
    *   **`WithLabelAndIcon`**: Combines label and right icon.
    *   **`WithAllAddons`**: A comprehensive story with label, both icons, feedback, `labelInfo`, and `required`.
*   **Accessibility in Stories:**
    *   `id` props are often provided in stories (e.g., `id: 'email-label-example'`), which is good practice.
*   **Icon Usage:**
    *   Lucide icons (`Search`, `Mail`, `User`) are correctly imported and used.

**Potential Issues/Deviations:**

*   **No "Locked" State Story:** The Figma JSON for `input.json` defines a "Locked" state. There isn't a corresponding story or prop to demonstrate this state. The component's `InputProps` also doesn't include a `isLocked` or similar prop. This state seems to be equivalent to `readOnly` in HTML, which is supported. A story demonstrating `readOnly` would be beneficial if "Locked" maps to it.
*   **"Secondary Input" Variant:** The Figma JSON for `input.json` mentions "Variations=Secondary Input". This variant is not represented in the component props or stories. The current component seems to implement the "Primary Input" and "Multi-line Input" variations.
*   **Interactive State Demonstration:** Rule V.6 ("DO NOT create stories that manually set hover/focus/active states via props") is adhered to.

## 4. Figma JSON Cross-Reference Summary

### [`figma-jsons/done/input.json`](figma-jsons/done/input.json)

*   **Properties Mapped:**
    *   `Input Text:` (Placeholder Text) -> `placeholder` prop.
    *   `Right Icon` (boolean) -> `icon` prop (presence of component).
    *   `Left Icon` (boolean) -> `leftIcon` prop (presence of component).
    *   `Feedback` (boolean) -> `feedback` prop (presence of string).
    *   `Variations`:
        *   `Multi-line Input` -> `multiline={true}`.
        *   `Primary Input` -> `multiline={false}` (default).
        *   **Missing:** `Secondary Input` variant is not implemented.
    *   `State`:
        *   `Default` -> Base style.
        *   `Hover` -> CSS `:hover`.
        *   `Focused` -> CSS `:focus` / `:focus-visible`.
        *   `Filled` -> Input has value (styled via default text color, not distinctly different from `Default` unless placeholder is hidden). The Figma JSON suggests `font-weight: --font-body-medium-semibold-weight` for filled state text, while the CSS uses `font-weight: var(--font-body-medium-regular-weight);` for the input text. The placeholder is regular weight. This needs clarification. The `Filled` story uses `defaultValue`.
        *   `Disabled` -> `disabled` prop and CSS `:disabled`.
        *   `Error` -> `isInvalid` prop and CSS `[aria-invalid="true"]`.
        *   **Missing:** `Locked` state. This likely maps to the `readOnly` HTML attribute, which is supported by the component but not explicitly called out as "Locked" or demonstrated in a story under that name.
    *   `Show Label + Tooltip` & `Alternate Label Display`: These seem to relate to the `label` and `labelInfo` props. The component handles label visibility via the `label` prop and info icon via `labelInfo`.
*   **Layout:**
    *   `width: 320` (default) -> Component wrapper is `width: 100%`. Specific width is usually controlled by the consumer.
    *   `height: 36` (for single-line) -> Implemented in CSS (`.input { height: 36px; }`).
    *   `height: 74` (for multi-line default) -> Implemented as `min-height: 74px;` in CSS for `.textarea`.
*   **Colors & Typography:** Generally mapped via CSS tokens. Specific discrepancies (like filled state font weight) noted above.

### [`figma-jsons/done/input-label.json`](figma-jsons/done/input-label.json)

*   **Properties Mapped:**
    *   `Show Info Icon` -> `labelInfo` prop.
    *   `Required` -> `required` prop (renders `*`).
    *   `Label Text:` -> `label` prop.
*   **Styling:**
    *   Typography and color for the label (`--color-text-secondary`, `Body/Medium/Regular`) are generally applied in `Input.module.css`.
    *   The required indicator (`*`) color is `var(--error-accent)` in CSS, while the JSON doesn't specify its color directly but implies it's part of the label. This choice is acceptable for emphasis.

### [`figma-jsons/done/input-feedback.json`](figma-jsons/done/input-feedback.json)

*   **Properties Mapped:**
    *   `Feedback Text` -> `feedback` prop.
    *   `Type`:
        *   `Default` -> Default feedback style.
        *   `Error` -> `isInvalid={true}` along with `feedback` prop, styled with `styles.feedbackError`.
        *   **Missing:** `Success`, `Warning`, `Info` feedback types are not directly supported as distinct visual states in the `Input` component's feedback message beyond the `isInvalid` state. The component only has a binary state for feedback styling (default or error).
*   **Styling:**
    *   Typography and default color (`--color-text-secondary`) are applied.
    *   Error color (`--color-state-error-accent`) is applied for invalid feedback.
    *   The JSON shows icons for different feedback types (success, warning, info, error). The component only implements a basic `!` icon for the error state.

### [`figma-jsons/done/input-righticon.json`](figma-jsons/done/input-righticon.json)

*   This JSON defines various types of right icons (Arrow, Clear, Date picker, Stepper). The `Input` component's `icon` prop is generic and accepts any `ElementType`. It doesn't implement specific behaviors or styles for these different icon *types* (e.g., a "Clear" icon doesn't automatically clear the input). The styling for the icon itself comes from the icon component passed (e.g., Lucide).
*   The `Input.module.css` styles the `.iconWrapper` and `.icon` generically.

## 5. `ai_rules.md` Adherence Check Summary

*   **I. Core Philosophy & Goals:**
    *   1.  **Figma JSON as Source of Truth:** Mostly followed for styling and props. Some discrepancies noted (Secondary Input, Locked state, Filled state font weight, specific feedback types/icons).
    *   2.  **Accessibility First (Leverage Radix):** **Major Deviation.** Radix Primitives are not used. Standard HTML elements are used with manual ARIA attributes.
    *   3.  **Maximum Styling Control with Your Tokens:** Adhered to. Tokens are used via CSS Modules.
    *   4.  **Clean, Maintainable, Idiomatic React:** Generally adhered to (prop destructuring, typing, `forwardRef`, `clsx`).
    *   5.  **CSS Purity:** Mostly adhered to (uses pseudo-classes and attribute selectors like `[aria-invalid]`). `data-state` attributes are not used due to lack of Radix.
*   **II. Radix UI Usage:**
    *   1.  **Use Appropriate Radix Primitives:** **Not Adhered To.** Standard HTML `input`/`textarea` used instead of `Primitive.input` or Form primitives.
    *   2.  **Leverage Radix Parts and `data-state`:** Not applicable as Radix parts/primitives are not used.
    *   3.  **Radix Themes Components:** Not used (which is correct as not specified).
    *   4.  **Polymorphism with `asChild`:** Not implemented as Radix Primitives are not used.
*   **III. React Component Implementation (`.tsx`):**
    *   1.  **File Naming:** Adhered to.
    *   2.  **Props:** Mostly adhered to. `InputProps` extends `HTMLAttributes` indirectly via `CommonInputProps`.
    *   3.  **`React.forwardRef`:** Adhered to.
    *   4.  **`displayName`:** Adhered to.
    *   5.  **`clsx` Utility:** Adhered to.
    *   6.  **Icon/Label Rendering:** Adhered to.
    *   7.  **Accessibility Attributes:** Manual ARIA attributes are used. Radix would provide more.
*   **IV. CSS Modules Implementation (`.module.css`):**
    *   1.  **Token Imports:** Adhered to.
    *   2.  **Target Radix Parts via `data-*`:** Not applicable.
    *   3.  **Base Styles:** Adhered to.
    *   4.  **Variant Styles:** Mostly adhered to, mapping JSON properties.
    *   5.  **States (Pseudo-classes & Radix `data-*`):** Uses pseudo-classes and `[aria-invalid]`. `data-state` not used.
    *   6.  **Internal Parts Styling:** Adhered to for custom parts like `.iconContainer`.
    *   7.  **NO `!important`:** Adhered to.
    *   8.  **Comments:** Adhered to.
*   **V. Storybook Stories (`.stories.tsx`):**
    *   Generally well-adhered to, covering variants and states. Missing "Locked" state story (or `readOnly` equivalent) and "Secondary Input" variant story. Rule V.6 is followed.

## 6. Conclusion and Recommendations

**Conclusion:**

The `Input` component is a well-structured React component that successfully implements most of the core features specified in the Figma JSON, including label, feedback, icons, and multiline functionality. Styling is correctly handled via CSS Modules and global design tokens. Storybook stories provide good coverage for most props and states.

The primary area for improvement and the most significant deviation from the `ai_rules.md` is the **lack of Radix UI Primitive usage**. This means the component misses out on inherent accessibility benefits, `data-state` attribute styling, and `asChild` polymorphism that Radix provides.

There are also minor discrepancies with the Figma JSON regarding specific states ("Locked", "Secondary Input" variant) and detailed feedback types/icons.

**Recommendations:**

1.  **Refactor to use Radix UI Primitives:**
    *   Consider using `@radix-ui/react-form` components (`Form.Field`, `Form.Label`, `Form.Control`, `Form.Message`) as a wrapper for the input, or at least use `Primitive.input` as the base for the input field itself.
    *   This will enhance accessibility, provide `data-state` attributes (e.g., `data-disabled`, `data-invalid`, `data-placeholder-shown`) for more robust CSS styling, and enable the `asChild` prop.
2.  **Address Figma JSON Discrepancies:**
    *   **"Locked" State:** Clarify if this maps to the `readOnly` attribute. If so, add a story for `readOnly` and consider if a specific `isLocked` prop is needed for clarity or distinct styling.
    *   **"Secondary Input" Variant:** Implement this visual variant if it's required, including necessary props and CSS.
    *   **"Filled" State Font Weight:** Verify the intended font weight for filled input text against the Figma JSON (`Body/Medium/SemiBold` vs. current `Regular`) and adjust CSS if needed.
    *   **Feedback Types:** If distinct visual styles and icons for "Success", "Warning", and "Info" feedback types are required (as suggested by `input-feedback.json`), extend the component's `feedback` prop (e.g., an object `{ message: string, type: 'error' | 'success' | ... }`) and update CSS and icon handling accordingly.
3.  **CSS Improvements:**
    *   If Radix is adopted, update CSS to use `data-state` selectors.
    *   Make icon padding in `.inputWithRightIcon` / `.inputWithLeftIcon` token-based or calculated for better maintainability.
4.  **Storybook Enhancements:**
    *   Add stories for the "Locked" (or `readOnly`) state and "Secondary Input" variant once implemented.
    *   If enhanced feedback types are added, create stories for them.
5.  **Prop for `data-testid`:** While `...rest` spreads unknown props, explicitly listing `data-testid?: string;` in `InputProps` can be a good practice for testing.

By addressing these points, particularly the integration of Radix UI Primitives, the `Input` component can become more robust, accessible, and fully aligned with the specified design and development guidelines.