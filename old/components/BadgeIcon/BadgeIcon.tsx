import React from 'react';
import { Primitive } from '@radix-ui/react-primitive';
import clsx from 'clsx';
import styles from './BadgeIcon.module.css';

export type BadgeIconType = 'Filled' | 'Outline';
export type BadgeIconColor = 'Default' | 'Sky' | 'Grass' | 'Bored' | 'Negative';
export type BadgeIconSize = 'Default' | 'Large' | 'Small';

/**
 * BadgeIconProps defines the properties for the BadgeIcon component.
 *
 * @remarks
 * - Icon Color: The rendered icon's color is determined by the CSS `currentColor` property.
 *   This means it inherits the text color of its context, allowing for flexible styling.
 * - Accessibility: By default, `BadgeIcon` is treated as decorative (the component sets `aria-hidden="true"` internally if not specified via props).
 *   If the icon conveys meaning, consumers should pass `aria-hidden={false}` (or ensure it's not `true`) and provide an `aria-label`.
 *   Other ARIA attributes like `role` and `id` can also be passed to enhance accessibility.
 */
export interface BadgeIconProps extends React.ComponentPropsWithoutRef<typeof Primitive.span> {
  /**
   * The type of the badge icon, controlling its fill or outline style.
   * @default "Filled"
   */
  type?: BadgeIconType;
  /**
   * The color scheme of the badge icon.
   * @default "Default"
   */
  color?: BadgeIconColor;
  /**
   * The size of the badge icon.
   * @default "Large"
   */
  size?: BadgeIconSize;
  /**
   * The Lucide icon component to render.
   */
  icon: React.ElementType;
  /**
   * Optional: Allows consumers to pass a custom class name.
   */
  className?: string;
  /**
   * Optional: Allows consumers to render the component as a different HTML element or React component.
   */
  // asChild?: boolean; // Removed as per review

  /**
   * Controls whether the badge icon is hidden from assistive technologies.
   * When set to `false` (or not `true`), an `aria-label` should be provided if the icon conveys meaningful information
   * not available through other text.
   * If this prop is not provided, the component defaults `aria-hidden` to `true`, marking the icon as decorative.
   * Providing this prop overrides the component's internal default.
   * @see aria-label
   */
  'aria-hidden'?: boolean;

  /**
   * Provides an accessible name for the badge icon.
   * This is crucial if the icon is not purely decorative (i.e., when `aria-hidden` is `false` or not set to `true`).
   * The label should describe the icon's meaning or action.
   */
  'aria-label'?: string;

  /**
   * Defines an ARIA role for the badge icon, if applicable.
   * For example, use `role="img"` if the icon represents an image and is accompanied by an `aria-label`.
   * Avoid roles like "button" or "link" directly on `BadgeIcon` if it's not inherently interactive;
   * interactivity should typically come from a wrapping element or by using `asChild` with an interactive component.
   * This prop is part of `React.HTMLAttributes` and is documented here for clarity in the context of `BadgeIcon`.
   */
  role?: string;

  /**
   * Optional: Assigns an ID to the badge icon element for specific targeting or linking.
   * This prop is part of `React.HTMLAttributes` and is documented here for clarity.
   */
  id?: string;
}

const BadgeIcon = React.forwardRef<React.ComponentRef<typeof Primitive.span>, BadgeIconProps>(
  (
    {
      type = 'Filled',
      color = 'Default',
      size = 'Large',
      icon: IconComponent,
      className,
      // asChild, // Removed as per review
      'aria-hidden': ariaHidden = true,
      ...rest
    },
    ref
  ) => {
    const Comp = Primitive.span; // Always use Primitive.span as asChild is removed

    // Determine icon size for Lucide component based on BadgeIconSize
    // These are example mappings and might need adjustment based on visual requirements
    // or if CSS fully controls the SVG size within the padded wrapper.
    // For now, we let CSS handle the wrapper size and padding, and the icon should fill the padded area.
    // Lucide icons default to 24px if no size prop is given.
    // We will rely on CSS to size the SVG via the wrapper.
    let iconSizeProp;
    switch (size) {
      case 'Small':
        iconSizeProp = 16; // Example: if padding is 2px, icon area is 28-4=24. This is an estimate.
        break;
      case 'Default':
        iconSizeProp = 20; // Example: if padding is 4px, icon area is 32-8=24.
        break;
      case 'Large':
      default:
        iconSizeProp = 24; // Example: if padding is 8px, icon area is 40-16=24.
        break;
    }


    return (
      <Comp
        ref={ref}
        className={clsx(
          styles.badgeIcon,
          styles[`type${type}`],
          styles[`color${color}`],
          styles[`size${size}`],
          className
        )}
        aria-hidden={ariaHidden}
        {...rest}
      >
        <IconComponent className={styles.iconSvg} />
      </Comp>
    );
  }
);

BadgeIcon.displayName = 'BadgeIcon';

export default BadgeIcon;