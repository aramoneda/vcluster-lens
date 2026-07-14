import * as React from 'react';
import * as RadixRadioGroup from '@radix-ui/react-radio-group';
import clsx from 'clsx';
import styles from './Radio.module.css';

export interface RadioGroupProps extends RadixRadioGroup.RadioGroupProps {
  // Consumers can style Root via passthrough className or data-attributes
  // asChild?: boolean; // Removed as per review
}

export type RadioGroupItemSize = '18px' | '24px';

export interface RadioGroupItemProps extends Omit<RadixRadioGroup.RadioGroupItemProps, 'children'> {
  // asChild?: boolean; // Removed as per review
  /** The content to display as the label for the radio item. */
  children?: React.ReactNode;
  /**
   * The size of the radio item.
   * @default '18px'
   */
  size?: RadioGroupItemSize;
  /**
   * Optional supporting text to display below the label.
   */
  supportingText?: React.ReactNode;
  /**
   * Whether to show the supporting text.
   * @default false
   */
  showSupportingText?: boolean;
  /**
   * If true, the radio item will be in a locked state.
   * This also implies the item is disabled.
   * @default false
   */
  locked?: boolean;
}

const StyledRadioGroupItem = React.forwardRef<
  React.ComponentRef<typeof RadixRadioGroup.Item>,
  RadioGroupItemProps
>(
  (
    {
      children,
      className,
      size = '18px',
      supportingText,
      showSupportingText = false,
      disabled,
      locked = false,
      // asChild, // Removed as per review
      ...props
    },
    forwardedRef
  ) => {
    const hasLabel = children != null;
    const hasSupportingText = showSupportingText && supportingText != null;
    const isEffectivelyDisabled = disabled || locked;

    return (
      <label
        className={clsx(
          styles.labelWrapper,
          {
            [styles.disabledLabel]: isEffectivelyDisabled, // Apply disabled label style if locked
            [styles.size18pxLabel]: size === '18px',
            [styles.size24pxLabel]: size === '24px',
          }
        )}
        data-disabled={isEffectivelyDisabled ? '' : undefined}
        data-locked={locked ? '' : undefined} // For label styling if needed
      >
        <RadixRadioGroup.Item
          ref={forwardedRef}
          className={clsx(
            styles.radioItem,
            {
              [styles.size18px]: size === '18px',
              [styles.size24px]: size === '24px',
            },
            className
          )}
          disabled={isEffectivelyDisabled} // Radio item is disabled if locked
          data-locked={locked ? '' : undefined} // Pass data-locked for CSS targeting
          // asChild={asChild} // Removed as per review
          {...props}
        >
          <RadixRadioGroup.Indicator className={styles.radioIndicator} />
        </RadixRadioGroup.Item>
        {(hasLabel || hasSupportingText) && (
          <span className={styles.textWrapper}>
            {hasLabel && <span className={styles.labelText}>{children}</span>}
            {hasSupportingText && (
              <span className={styles.supportingText}>{supportingText}</span>
            )}
          </span>
        )}
      </label>
    );
  }
);

StyledRadioGroupItem.displayName = 'RadioGroup.Item';

// Wrap RadixRadioGroup.Root to pass asChild prop
const RadioGroupRoot = React.forwardRef<
  React.ComponentRef<typeof RadixRadioGroup.Root>,
  RadioGroupProps
>(({ /*asChild,*/ ...props }, forwardedRef) => { // Removed asChild from destructuring
  return <RadixRadioGroup.Root {...props} ref={forwardedRef} /*asChild={asChild}*/ />; // Removed asChild prop
});
RadioGroupRoot.displayName = 'RadioGroup.Root';

export const RadioGroup = {
  Root: RadioGroupRoot,
  Item: StyledRadioGroupItem,
};