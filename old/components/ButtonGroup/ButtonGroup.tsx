import React from 'react';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import clsx from 'clsx';
import styles from './ButtonGroup.module.css';

// Prop Types
export type ButtonGroupSize = 'S' | 'M' | 'L';
export type ButtonGroupSelectionType = 'single' | 'multiple'; // Kept for clarity but Radix uses it directly

// Props that are specific to ButtonGroup's presentation
interface ButtonGroupPresentationProps {
  size?: ButtonGroupSize;
}

// Base Radix ToggleGroup props excluding the discriminated fields,
// to be inherited by our ButtonGroupProps.
type RadixToggleGroupBaseProps = Omit<
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>,
  'type' | 'value' | 'defaultValue' | 'onValueChange'
>;

// Discriminated union for ButtonGroupProps
export type ButtonGroupProps = ButtonGroupPresentationProps & RadixToggleGroupBaseProps & /* { asChild?: boolean } */ ( // Removed asChild
  | {
      type: 'single';
      value?: string;
      defaultValue?: string;
      onValueChange?: (value: string) => void; // Radix: value is "" if all unpressed
    }
  | {
      type: 'multiple';
      value?: string[];
      defaultValue?: string[];
      onValueChange?: (value: string[]) => void;
    }
  // Case for when ButtonGroup user doesn't specify type, defaulting to 'single' behavior
  | {
      type?: undefined; // Implies 'single'
      value?: string;
      defaultValue?: string;
      onValueChange?: (value: string) => void;
    }
);

const ButtonGroup = React.forwardRef<
  React.ComponentRef<typeof ToggleGroupPrimitive.Root>,
  ButtonGroupProps
>(
  (rawProps, forwardedRef) => {
    // Destructure presentation props and establish defaults
    const { size = 'L', className: rawClassName, children: rawChildren, /*asChild,*/ ...restOfRawProps } = rawProps; // Removed asChild

    // Determine effective type for Radix component and for type-safe prop access
    const effectiveType = restOfRawProps.type || 'single';

    // Base props to pass to Radix, common to both single and multiple
    const commonRadixProps = {
      ...restOfRawProps, // Contains disabled, orientation, etc. from RadixToggleGroupBaseProps
      ref: forwardedRef,
      className: clsx(
        styles.buttonGroupContainer,
        styles[`groupSize${size}`],
        rawClassName // User-provided className
      ),
      'data-size': size,
      children: rawChildren, // Pass children explicitly
    };

    if (effectiveType === 'single') {
      // Type assertion to satisfy TypeScript for the specific part of the union
      const singleProps = restOfRawProps as Extract<ButtonGroupProps, { type?: 'single' | undefined }>;
      return (
        <ToggleGroupPrimitive.Root
          {...commonRadixProps}
          type="single"
          value={singleProps.value}
          defaultValue={singleProps.defaultValue}
          onValueChange={singleProps.onValueChange}
          // asChild={asChild} // Removed asChild
        />
      );
    } else { // effectiveType === 'multiple'
      const multipleProps = restOfRawProps as Extract<ButtonGroupProps, { type: 'multiple' }>;
      return (
        <ToggleGroupPrimitive.Root
          {...commonRadixProps}
          type="multiple"
          value={multipleProps.value}
          defaultValue={multipleProps.defaultValue}
          onValueChange={multipleProps.onValueChange}
          // asChild={asChild} // Removed asChild
        />
      );
    }
  }
);

ButtonGroup.displayName = 'ButtonGroup';
export { ButtonGroup };