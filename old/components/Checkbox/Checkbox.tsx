import React, { forwardRef, useId } from 'react';
import * as RadixCheckbox from '@radix-ui/react-checkbox';
import clsx from 'clsx';
import { Check, Minus } from 'lucide-react';
import styles from './Checkbox.module.css';

export type CheckboxSize = '18px' | '24px';

export interface CheckboxProps extends Omit<React.ComponentPropsWithoutRef<typeof RadixCheckbox.Root>, 'asChild'> {
  /**
   * Render the component as a child, passing all props to the first child.
   * @see https://www.radix-ui.com/primitives/docs/guides/composition#aschild
   */
  // asChild?: boolean; // Removed as per review
  /**
   * A label to be displayed next to the checkbox.
   * Corresponds to the "Checkbox Label" property in Figma.
   */
  label?: React.ReactNode;
  /**
   * Additional supporting text to be displayed.
   * Corresponds to the "Supporting Text" property in Figma.
   */
  supportingText?: React.ReactNode;
  /**
   * The size of the checkbox.
   * Defaults to '18px' as per Figma.
   */
  size?: CheckboxSize;
  /**
   * The id of the checkbox. Auto-generated if not provided.
   */
  id?: string;
  /**
   * Optional class name to be applied to the root wrapper of the component.
   */
  className?: string;
}

const Checkbox = forwardRef<React.ComponentRef<typeof RadixCheckbox.Root>, CheckboxProps>(
  (
    {
      label,
      supportingText,
      size = '18px', // Default from Figma JSON
      id: providedId,
      className,
      checked,
      defaultChecked,
      onCheckedChange,
      disabled,
      required,
      name,
      value,
      // asChild, // Removed as per review
      ...rest
    },
    ref
  ) => {
    const generatedId = useId();
    const checkboxId = providedId || generatedId;

    const hasTextContent = label || supportingText;

    return (
      <div
        data-checkbox-wrapper // Added stable data attribute
        className={clsx(
          styles.wrapper,
          styles[`size-${size.replace('px', '')}`], // e.g., styles['size-18']
          { [styles.disabled]: disabled },
          className
        )}
      >
        <RadixCheckbox.Root
          ref={ref}
          id={checkboxId}
          className={clsx(styles.root)}
          // asChild={asChild} // Removed as per review
          checked={checked}
          defaultChecked={defaultChecked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          required={required}
          name={name}
          value={value}
          {...rest}
        >
          <RadixCheckbox.Indicator className={styles.indicator}>
            <Check className={clsx(styles.icon, styles.checkIcon)} aria-hidden />
            <Minus className={clsx(styles.icon, styles.minusIcon)} aria-hidden />
          </RadixCheckbox.Indicator>
        </RadixCheckbox.Root>
        {hasTextContent && (
          <div className={styles.textContainer}>
            {label && (
              <label htmlFor={checkboxId} className={styles.label}>
                {label}
              </label>
            )}
            {supportingText && (
              <span className={styles.supportingText}>{supportingText}</span>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;