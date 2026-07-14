import React, { forwardRef, ReactNode, ComponentRef, ComponentPropsWithoutRef } from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { Primitive } from '@radix-ui/react-primitive';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import { Button, ButtonProps, ButtonStyle, ButtonSize as ActualButtonSize } from '../Button/Button';
import { DropdownMenu as DM } from '../DropdownMenu/DropdownMenu';
import styles from './SplitButton.module.css';

export type SplitButtonVariant = ButtonStyle;
export type SplitButtonSize = ActualButtonSize;

export interface SplitButtonProps extends ComponentPropsWithoutRef<typeof Primitive.div> {
  /**
   * The visual style of the split button group.
   * Maps to Figma 'Type' property.
   * @default 'secondary'
   */
  variant?: SplitButtonVariant;
  /**
   * The size of the split button group.
   * Maps to Figma 'Size' property.
   * @default 'default'
   */
  size?: SplitButtonSize;
  /**
   * Label for the main action button.
   */
  mainActionLabel: ReactNode;
  /**
   * Handler for the main action button click.
   */
  onMainActionClick?: React.MouseEventHandler<HTMLButtonElement>;
  /**
   * Content for the dropdown menu (e.g., DropdownMenu.Item components).
   */
  dropdownItems: ReactNode;
  /**
   * If true, both buttons in the split button group will be disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Optional class name to apply to the container element.
   */
  className?: string;
  /**
   * Props to pass to the DropdownMenu.Content component.
   */
  dropdownContentProps?: Partial<DropdownMenuPrimitive.DropdownMenuContentProps>;
  /**
   * Props to pass to the main action Button component.
   */
  mainButtonProps?: Partial<ButtonProps>;
  /**
   * Props to pass to the trigger Button component.
   */
  triggerButtonProps?: Partial<ButtonProps>;
}

const SplitButton = forwardRef<ComponentRef<typeof Primitive.div>, SplitButtonProps>(
  (
    {
      variant = 'secondary',
      size = 'default',
      mainActionLabel,
      onMainActionClick,
      dropdownItems,
      disabled = false,
      className,
      dropdownContentProps,
      mainButtonProps,
      triggerButtonProps,
      ...rest
    },
    ref
  ) => {
    const buttonStyle = variant as ButtonProps['buttonStyle'];
    const buttonSize = size as ButtonProps['size'];

    return (
      <Primitive.div
        ref={ref}
        className={clsx(
          styles.splitButtonContainer,
          styles[`variant-${variant}`],
          styles[`size-${size}`],
          { [styles.disabled]: disabled },
          className
        )}
        {...rest}
      >
        <Button
          buttonStyle={buttonStyle}
          size={buttonSize}
          onClick={onMainActionClick}
          disabled={disabled}
          {...mainButtonProps}
          // Ensure Button's own className prop is merged if provided in mainButtonProps
          className={clsx(styles.mainButton, mainButtonProps?.className)}
        >
          {mainActionLabel}
        </Button>
        <DM.Root>
          <DM.Trigger asChild disabled={disabled}>
            <Button
              buttonStyle={buttonStyle}
              size={buttonSize}
              aria-label="More options"
              disabled={disabled}
              {...triggerButtonProps}
              // Ensure Button's own className prop is merged if provided in triggerButtonProps
              className={clsx(styles.triggerButton, triggerButtonProps?.className)}
            >
              <ChevronDown size={size === 'small' ? 14 : 16} />
            </Button>
          </DM.Trigger>
          <DM.Portal>
            <DM.Content
              sideOffset={4}
              align="end" // Align to the end of the trigger, which is the end of the SplitButton
              {...dropdownContentProps}
              // Apply size-specific styling to content if needed, or pass via dropdownContentProps
              className={clsx(styles.dropdownContent, dropdownContentProps?.className)}
            >
              {dropdownItems}
            </DM.Content>
          </DM.Portal>
        </DM.Root>
      </Primitive.div>
    );
  }
);

SplitButton.displayName = 'SplitButton';

export { SplitButton };