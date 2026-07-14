import * as React from 'react';
import { Primitive } from '@radix-ui/react-primitive';
import { MoreVertical } from 'lucide-react';
import clsx from 'clsx';
import IconButton, { IconButtonProps as BaseIconButtonProps, IconButtonSize } from '../IconButton/IconButton';
import styles from './MenuButton.module.css';

export interface MenuButtonProps extends Omit<BaseIconButtonProps, 'children' | 'icon'> {
  // children and icon are handled internally
}

const MenuButton = React.forwardRef<React.ComponentRef<typeof Primitive.button>, MenuButtonProps>(
  (
    {
      size = 'M',
      color = 'Blue',
      disabled = false,
      // tooltipContent, // Removed, IconButton uses ariaLabel
      tooltipSide,
      tooltipSideOffset,
      tooltipDelayDuration,
      className,
      isActive, // Pass isActive through
      // showTooltip, // Removed, IconButton manages its tooltip visibility
      asChild, // Pass asChild through
      ...rest
    },
    ref
  ) => {
    const getIconSize = (buttonSize: IconButtonSize): number => {
      switch (buttonSize) {
        case 'S':
          return 16;
        case 'XS':
          return 12; // Assuming XS might need a smaller icon, adjust if necessary
        case 'M':
        default:
          return 20;
      }
    };

    const iconSize = getIconSize(size);

    return (
      <IconButton
        ref={ref}
        size={size}
        color={color}
        disabled={disabled}
        // tooltipContent={tooltipContent} // Removed
        tooltipSide={tooltipSide}
        tooltipSideOffset={tooltipSideOffset}
        tooltipDelayDuration={tooltipDelayDuration}
        className={clsx(styles.menuButtonCircular, className)}
        isActive={isActive}
        // showTooltip={showTooltip} // Removed
        asChild={asChild}
        {...rest} // ariaLabel will be passed via rest
      >
        <MoreVertical size={iconSize} />
      </IconButton>
    );
  }
);

MenuButton.displayName = 'MenuButton';

export default MenuButton;