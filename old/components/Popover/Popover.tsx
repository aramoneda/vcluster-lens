import * as React from 'react';
import * as RadixPopover from '@radix-ui/react-popover';
import clsx from 'clsx';
import styles from './Popover.module.css';

type PopoverSize = 'M' | 'S' | 'XS';

export interface PopoverContentProps extends Omit<RadixPopover.PopoverContentProps, 'asChild'> { // Removed asChild
  /**
   * The size of the popover content area, affecting padding and max-width.
   * @default 'M'
   */
  size?: PopoverSize;
  /**
   * The content to be rendered inside the popover.
   */
  children?: React.ReactNode;
  /**
   * Optional custom CSS class name to apply to the popover content.
   */
  className?: string;
}

const PopoverContent = React.forwardRef<
  React.ComponentRef<typeof RadixPopover.Content>,
  PopoverContentProps
>(
  (
    {
      className,
      size = 'M', // Default size from Figma JSON (implicitly, as 'M' is listed first and often default)
      children,
      sideOffset = 8, // Default sideOffset to 8px (equivalent to --spacing-sp-8)
      // Radix props like align, side, alignOffset etc., are captured by ...props
      ...props
    },
    forwardedRef
  ) => {
    const sizeClass = {
      M: styles.contentM,
      S: styles.contentS,
      XS: styles.contentXS,
    }[size];

    return (
      <RadixPopover.Portal>
        <RadixPopover.Content
          ref={forwardedRef}
          className={clsx(styles.content, sizeClass, className)}
          sideOffset={sideOffset} // Ensure custom default is passed
          // Pass all other Radix PopoverContentProps through
          {...props}
        >
          {children}
        </RadixPopover.Content>
      </RadixPopover.Portal>
    );
  }
);

PopoverContent.displayName = 'PopoverContent';

export const Popover = {
  Root: RadixPopover.Root,
  Trigger: RadixPopover.Trigger,
  Portal: RadixPopover.Portal,
  Content: PopoverContent,
  Close: RadixPopover.Close, // Including Close as it's a common part, even if not explicitly styled by Figma JSON
  // Arrow removed as per user feedback.
  // As per ai_rules.md II.1: "Popover.Close and Popover.Arrow should be included if their
  // presence and styling are defined in the Figma JSON".
  // Figma JSON for Popover does not define an arrow.
};

// Re-export common Radix Popover types if needed by consumers, though props are defined above.
export type {
  PopoverProps as RadixPopoverRootProps, // RadixPopover.PopoverProps is for the Root
  PopoverTriggerProps as RadixPopoverTriggerProps,
  PopoverPortalProps as RadixPopoverPortalProps,
  PopoverCloseProps as RadixPopoverCloseProps,
  // PopoverArrowProps removed
} from '@radix-ui/react-popover';