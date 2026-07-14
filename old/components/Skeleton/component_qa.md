# QA Review: Skeleton Component

## 1. Analysis of `src/components/Skeleton/Skeleton.tsx`

*   **Radix Primitive Usage:**
    *   The component correctly uses `Primitive.div` from `@radix-ui/react-primitive` as its base element ([`Skeleton.tsx:2`](src/components/Skeleton/Skeleton.tsx:2), [`Skeleton.tsx:25`](src/components/Skeleton/Skeleton.tsx:25)). This aligns with `ai_rules.md` (Rule II.1.c) for simple presentational components.
*   **Props Definition (`SkeletonProps`):**
    *   The `SkeletonProps` interface ([`Skeleton.tsx:8-20`](src/components/Skeleton/Skeleton.tsx:8)) extends `React.ComponentPropsWithoutRef<typeof Primitive.div>`, which is correct.
    *   `state?: SkeletonState`: Defines `'1' | '2'` for variants, with a default of `'1'` ([`Skeleton.tsx:6`](src/components/Skeleton/Skeleton.tsx:6), [`Skeleton.tsx:14`](src/components/Skeleton/Skeleton.tsx:14), [`Skeleton.tsx:23`](src/components/Skeleton/Skeleton.tsx:23)). This maps to Figma's `state` property.
    *   `animated?: boolean`: Defines a boolean prop for animation, defaulting to `false` ([`Skeleton.tsx:19`](src/components/Skeleton/Skeleton.tsx:19), [`Skeleton.tsx:23`](src/components/Skeleton/Skeleton.tsx:23)).
    *   `className`: Included for custom styling.
    *   Props are destructured with defaults as per `ai_rules.md` (Rule I.4.a) ([`Skeleton.tsx:23`](src/components/Skeleton/Skeleton.tsx:23)).
*   **Accessibility:**
    *   `aria-hidden="true"` is applied ([`Skeleton.tsx:36`](src/components/Skeleton/Skeleton.tsx:36)), which is appropriate for a purely presentational skeleton loader. This aligns with general accessibility practices for such elements. `ai_rules.md` (Rule II.1.d) mentions `aria-busy` on a parent, which is a contextual consideration for the consumer of this component.
*   **`React.forwardRef`:**
    *   Correctly uses `React.forwardRef` with appropriate typing ([`Skeleton.tsx:22`](src/components/Skeleton/Skeleton.tsx:22)). (Rule III.3)
*   **`displayName`:**
    *   `Skeleton.displayName = 'Skeleton';` is set. ([`Skeleton.tsx:43`](src/components/Skeleton/Skeleton.tsx:43)) (Rule III.4)
*   **`clsx` Utility:**
    *   `clsx` is used for conditional class application. ([`Skeleton.tsx:3`](src/components/Skeleton/Skeleton.tsx:3), [`Skeleton.tsx:27-34`](src/components/Skeleton/Skeleton.tsx:27)) (Rule III.5)
*   **Prop Spreading:**
    *   `{...rest}` is correctly spread onto `Primitive.div`. ([`Skeleton.tsx:37`](src/components/Skeleton/Skeleton.tsx:37)) (Rule I.4.c)

**Overall `Skeleton.tsx`:** The component adheres well to the `ai_rules.md` and correctly implements the specified props.

## 2. Analysis of `src/components/Skeleton/Skeleton.module.css`

*   **Token Imports:**
    *   Imports `figma-color-tokens.css` and `figma-numeric-tokens.css` ([`Skeleton.module.css:1-2`](src/components/Skeleton/Skeleton.module.css:1-2)). `figma-typography-tokens.css` is not imported, which is acceptable as Skeletons typically don't involve text. (Rule IV.1)
*   **Base Styles (`.skeleton`):**
    *   `width`: `200px` (matches [`figma-jsons/done/skeleton.json:16`](figma-jsons/done/skeleton.json:16) `layout.width`).
    *   `height`: `24px` (matches [`figma-jsons/done/skeleton.json:17`](figma-jsons/done/skeleton.json:17) `layout.height`).
    *   `border-radius`: `var(--radius-xs)` (matches [`figma-jsons/done/skeleton.json:19`](figma-jsons/done/skeleton.json:19) `layout.cornerRadius.token`).
    *   `background-color`: `var(--brand-200)` (default, matches `state="1"` fill).
    *   `display: block`, `overflow: hidden`, `position: relative` are appropriate for the element and its animation.
*   **Variant Styles:**
    *   `.state1`: `background-color: var(--brand-200)` (matches [`figma-jsons/done/skeleton.json:32`](figma-jsons/done/skeleton.json:32) `variants[name="state=1"].colors.state=1_fill0.token`). ([`Skeleton.module.css:18-21`](src/components/Skeleton/Skeleton.module.css:18-21))
    *   `.state2`: `background-color: var(--brand-300)` (matches [`figma-jsons/done/skeleton.json:53`](figma-jsons/done/skeleton.json:53) `variants[name="state=2"].colors.state=2_fill0.token`). ([`Skeleton.module.css:25-28`](src/components/Skeleton/Skeleton.module.css:25-28))
*   **Animation Styles (`.animated`):**
    *   A shimmer animation (`shimmer`) is defined using a pseudo-element (`::after`) and `keyframes`. ([`Skeleton.module.css:30-54`](src/components/Skeleton/Skeleton.module.css:30-54))
    *   The animation uses `linear-gradient` for the shimmer effect.
*   **Comments:**
    *   Comments trace CSS rules to Figma JSON sections. (Rule IV.8)
*   **No `!important`:**
    *   No `!important` usage observed. (Rule IV.7)

**Overall `Skeleton.module.css`:** Styles are correctly derived from Figma JSON and design tokens. The animation is implemented as a standard shimmer. The structure adheres to `ai_rules.md`.

## 3. Analysis of `src/components/Skeleton/Skeleton.stories.tsx`

*   **Meta Configuration:**
    *   `title`, `component`, `tags: ['autodocs']` are correctly set. ([`Skeleton.stories.tsx:5-8`](src/components/Skeleton/Skeleton.stories.tsx:5-8))
    *   `argTypes` are defined for `state`, `animated`, and `className`, providing descriptions and table information. ([`Skeleton.stories.tsx:9-36`](src/components/Skeleton/Skeleton.stories.tsx:9-36))
*   **Stories:**
    *   `Default`: Renders with `state: '1'`, `animated: false`. ([`Skeleton.stories.tsx:52-65`](src/components/Skeleton/Skeleton.stories.tsx:52-65)) (Rule V.1)
    *   `State1`: Explicitly shows `state: '1'`. ([`Skeleton.stories.tsx:67-81`](src/components/Skeleton/Skeleton.stories.tsx:67-81)) (Rule V.2)
    *   `State2`: Shows `state: '2'`. ([`Skeleton.stories.tsx:83-97`](src/components/Skeleton/Skeleton.stories.tsx:83-97)) (Rule V.2)
    *   `AnimatedState1`: Shows `state: '1'`, `animated: true`. ([`Skeleton.stories.tsx:99-113`](src/components/Skeleton/Skeleton.stories.tsx:99-113)) (Rule V.2)
    *   `AnimatedState2`: Shows `state: '2'`, `animated: true`. ([`Skeleton.stories.tsx:115-129`](src/components/Skeleton/Skeleton.stories.tsx:115-129)) (Rule V.2)
    *   `CustomWidth`: Demonstrates applying custom `width` and `height` via the `style` prop, which is a valid way to override default dimensions if needed by the consumer. ([`Skeleton.stories.tsx:132-149`](src/components/Skeleton/Skeleton.stories.tsx:132-149))
*   **Controls (Args):**
    *   Props are controllable via Storybook's controls panel. (Rule V.5)
*   **Interactive States:**
    *   Not applicable for Skeleton as it's non-interactive. (Rule V.6)

**Overall `Skeleton.stories.tsx`:** The stories cover the defined variants and animation states. `argTypes` are well-documented. The stories adhere to `ai_rules.md`.

## 4. Figma JSON Cross-Reference Summary (`figma-jsons/done/skeleton.json`)

*   **`properties`:**
    *   `state` property with values `"1"`, `"2"` and default `"1"` ([`figma-jsons/done/skeleton.json:4-14`](figma-jsons/done/skeleton.json:4-14)) is correctly mapped to the `state` prop in `Skeleton.tsx` and corresponding CSS classes.
*   **`layout` (Base):**
    *   `width: 200` ([`figma-jsons/done/skeleton.json:16`](figma-jsons/done/skeleton.json:16)) is used as default in `Skeleton.module.css`.
    *   `height: 24` ([`figma-jsons/done/skeleton.json:17`](figma-jsons/done/skeleton.json:17)) is used as default in `Skeleton.module.css`.
    *   `cornerRadius.token: "--radius-xs"` ([`figma-jsons/done/skeleton.json:19`](figma-jsons/done/skeleton.json:19)) is used as default `border-radius` in `Skeleton.module.css`.
*   **`variants`:**
    *   `state=1`:
        *   `colors.state=1_fill0.token: "--brand-200"` ([`figma-jsons/done/skeleton.json:32`](figma-jsons/done/skeleton.json:32)) is mapped to `background-color` for `.state1` in CSS.
        *   Layout properties match the base layout.
    *   `state=2`:
        *   `colors.state=2_fill0.token: "--brand-300"` ([`figma-jsons/done/skeleton.json:53`](figma-jsons/done/skeleton.json:53)) is mapped to `background-color` for `.state2` in CSS.
        *   Layout properties match the base layout.
*   **Missing/Deviations:**
    *   The Figma JSON does not explicitly define an "animation" property. The `animated` prop and its shimmer effect are an enhancement added to the component implementation, which is a common feature for skeleton loaders.
    *   The Figma JSON implies fixed dimensions. The component's CSS sets these as defaults. The `SkeletonProps` does not include `width` or `height` as direct props, meaning consumers would override these via `className` or `style` prop, as demonstrated in the `CustomWidth` story. This is an acceptable approach.
    *   The Figma JSON does not specify different shapes (e.g., 'text', 'rect', 'circle'). The current implementation produces a rectangular skeleton based on the `cornerRadius`. If different shapes were required, the `SkeletonProps` and CSS would need to be extended (e.g., a `variant` prop for shape).

**Figma JSON Adherence:** The component correctly implements the visual styles and variants defined in the Figma JSON for `state="1"` and `state="2"`. The fixed dimensions and corner radius are also correctly applied as defaults.

## 5. `ai_rules.md` Adherence Check Summary

*   **Rule I.1 (Figma JSON as Source of Truth):** Largely followed for visual styling and variants. Dimensions and colors are derived from JSON.
*   **Rule I.2 (Accessibility First - Radix):** `Primitive.div` is used. `aria-hidden="true"` is appropriate.
*   **Rule I.3 (Styling Control with Tokens):** Global tokens are used via CSS Modules.
*   **Rule I.4 (Clean React):**
    *   Prop destructuring and defaults: Yes ([`Skeleton.tsx:23`](src/components/Skeleton/Skeleton.tsx:23)).
    *   Prop typing: Yes, `SkeletonProps` ([`Skeleton.tsx:8`](src/components/Skeleton/Skeleton.tsx:8)).
    *   Prop spreading (`...rest`): Yes ([`Skeleton.tsx:37`](src/components/Skeleton/Skeleton.tsx:37)).
    *   No unnecessary state: Yes.
*   **Rule I.5 (CSS Purity):** Yes, no JS-driven state classes for styling.
*   **Rule II.1 (Radix Primitives):** `Primitive.div` used correctly for a simple presentational component. (Rule II.1.c)
*   **Rule II.2 (Radix Parts / `data-state`):** Not applicable as `Primitive.div` is used directly and has no specific parts or `data-state` attributes relevant here beyond global ones like `data-disabled` (which isn't a primary feature of Skeleton).
*   **Rule II.4 (`asChild`):** `Primitive.div` inherently supports `asChild` if a consumer passes it. The component itself doesn't need to explicitly implement `Slot` unless it were composing multiple Radix parts and needed to pass `asChild` down.
*   **Rule III (React Component Implementation):**
    *   File Naming: Yes.
    *   Props: Yes, matches requirements.
    *   `React.forwardRef`: Yes.
    *   `displayName`: Yes.
    *   `clsx`: Yes.
*   **Rule IV (CSS Modules Implementation):**
    *   Token Imports: Yes.
    *   Base Styles: Yes.
    *   Variant Styles: Yes.
    *   States: Not applicable for interactive states, but animation is handled.
    *   No `!important`: Yes.
    *   Comments: Yes.
*   **Rule V (Storybook Stories):**
    *   Default Story: Yes.
    *   Variant Combinations: Yes.
    *   State Demonstrations: `animated` prop covers this.
    *   Controls: Yes.

**`ai_rules.md` Adherence:** The component demonstrates strong adherence to the specified rules.

## 6. Conclusion and Recommendations

**Conclusion:**

The `Skeleton` component is well-implemented according to the provided Figma JSON specification and `ai_rules.md`.
*   It correctly uses `Primitive.div` for its base.
*   Props are well-defined and map to Figma variants (`state`) and an added `animated` feature.
*   CSS styling is derived from global tokens and Figma JSON values.
*   Accessibility is addressed with `aria-hidden="true"`.
*   Storybook stories provide good coverage of variants and animation.

**Recommendations:**

1.  **Consider Prop for Shape Variants:** The current implementation produces a single rectangular shape defined by `border-radius` and dimensions. If the design system requires skeletons of different shapes (e.g., "circle", "text-line" with different height/radius), consider adding a `variant` or `shape` prop (e.g., `shape?: 'rect' | 'circle' | 'text'`). This would involve:
    *   Updating `SkeletonProps`.
    *   Adding corresponding CSS classes in `Skeleton.module.css` to adjust `border-radius` (e.g., 50% for circle) and potentially default `height` for a 'text' variant.
    *   Updating Storybook to showcase these shapes.
    *   This would align it more closely with common skeleton component APIs that offer shape variations.

2.  **Explicit Width/Height Props:** While `style` and `className` can be used for sizing, consider adding optional `width` and `height` props directly to `SkeletonProps`. This can make common sizing adjustments more straightforward for consumers. If added, these props would override the default CSS dimensions.
    *   Example: `width?: string | number; height?: string | number;`
    *   These would then be applied via the `style` prop internally: `<Primitive.div style={{ width, height, ...style }} ... />`.

3.  **Animation Customization:** The current "shimmer" animation is hardcoded. For more flexibility, consider if different animation types (e.g., "pulse") or the ability to disable/configure the animation speed might be needed in the future. For now, the single shimmer animation is acceptable.

The component is robust and meets the current requirements. The recommendations are for potential future enhancements to increase its flexibility.