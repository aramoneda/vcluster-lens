import React, { forwardRef, ReactNode } from 'react';
import { Primitive } from '@radix-ui/react-primitive';
import { X as XIcon, Icon as LucideIcon } from 'lucide-react'; // XIcon for IconButton
import clsx from 'clsx';
import IconButton from '../IconButton/IconButton';
import styles from './Chip.module.css';

export type ChipSize = 'default' | 'small';
export type ChipColor = 'grey' | 'white';

export interface ChipProps extends React.ComponentPropsWithoutRef<typeof Primitive.button> {
  asChild?: boolean;
  /**
   * The content to display inside the chip.
   */
  label?: string;
  /**
   * If `true`, the chip will display a remove button.
   * @default true
   */
  removable?: boolean;
  /**
   * Callback fired when the remove button is clicked.
   */
  onRemove?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * If `true`, shows the leading icon.
   * @default true
   */
  showIcon?: boolean;
  /**
   * Optional icon to display at the start of the chip.
   */
  leadingIcon?: ReactNode;
  /**
   * The size of the chip.
   * @default 'default'
   */
  size?: ChipSize;
  /**
   * The color variant of the chip.
   * @default 'grey'
   */
  color?: ChipColor;
  /**
   * If `true`, the chip will be in a selected state.
   * @default false
   */
  selected?: boolean;
  /**
   * If `true`, the chip will be disabled.
   * @default false
   */
  disabled?: boolean;
}

const Chip = forwardRef<React.ComponentRef<typeof Primitive.button>, ChipProps>(
  (
    {
      label = 'Chip Label',
      removable = true,
      onRemove,
      showIcon = true,
      leadingIcon,
      size = 'default',
      color = 'grey',
      selected = false,
      disabled = false,
      className,
      onClick,
      asChild,
      ...rest
    },
    ref
  ) => {
    const handleRemoveClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation(); // Prevent chip's onClick if remove is clicked
      if (onRemove) {
        onRemove(event);
      }
    };

    const isInteractive = !!onClick || selected !== undefined; // Chip is interactive if it has an onClick or can be selected
    const chipClassName = clsx(
      styles.chip,
      styles[size],
      styles[color],
      {
        [styles.selected]: selected,
        [styles.interactive]: isInteractive, // For cursor and potential base styles
      },
      className
    );

    const commonProps = {
      ref,
      className: chipClassName,
      'aria-pressed': selected,
      'data-disabled': disabled ? '' : undefined,
      'data-state': selected ? 'on' : 'off',
      onClick,
      ...rest,
    };

    const chipContent = (
      <>
        {showIcon && leadingIcon && (
          <span className={styles.leadingIcon}>{leadingIcon}</span>
        )}
        {label && (
          <span className={styles.textContainer}>
            <span className={styles.label}>{label}</span>
          </span>
        )}
        {removable && (
          <IconButton
            size={size === 'small' ? 'XS' : 'S'}
            color="Blue"
            onClick={handleRemoveClick}
            disabled={disabled}
            ariaLabel={`Remove ${label}`}
          >
            <XIcon size={16} />
          </IconButton>
        )}
      </>
    );

    if (asChild) {
      return (
        <Primitive.span {...commonProps}>
          {chipContent}
        </Primitive.span>
      );
    }

    return (
      <Primitive.button
        {...commonProps}
        type="button"
        disabled={disabled}
      >
        {chipContent}
      </Primitive.button>
    );
  }
);

Chip.displayName = 'Chip';

export default Chip;