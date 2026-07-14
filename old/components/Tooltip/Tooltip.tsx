import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import clsx from 'clsx';

import styles from './Tooltip.module.css';

/**
 * Props for the Tooltip component.
 * Props for the Tooltip component.
 * Extends Radix Tooltip Root props and picks relevant Content props.
 */
/**
 * Props for the Tooltip component.
 * Extends Radix Tooltip Root props and adds specific props for content and behavior.
 */
// Define props more explicitly, separating concerns
export interface TooltipProps
  extends Pick< // Pick Provider props
      React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider>,
      'delayDuration' | 'skipDelayDuration' | 'disableHoverableContent'
    >,
    Pick< // Pick Root props
      React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>,
      'open' | 'defaultOpen' | 'onOpenChange'
    >,
    Pick< // Pick Content props
      React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>,
      | 'side'
      | 'sideOffset'
      | 'align'
      | 'alignOffset'
      | 'arrowPadding'
      | 'sticky'
      | 'hideWhenDetached'
      | 'onEscapeKeyDown'
      // | 'onPointerDownOutside' // Removed: Handled internally by Radix
      // | 'onFocusOutside'       // Removed: Handled internally by Radix
      // | 'onInteractOutside'    // Removed: Handled internally by Radix
      | 'forceMount'
    > {
  /** The trigger element for the tooltip. */
  children: React.ReactNode;
  /** The content to display within the tooltip. */
  content: React.ReactNode;
  /**
   * Whether the TooltipPrimitive.Trigger should merge its props onto its immediate child.
   * @default false
   */
  triggerAsChild?: boolean;
  /**
   * Whether to display the arrow pointing to the trigger.
   * @default true
   */
  hasArrow?: boolean;
  /** Optional class name to apply to the TooltipPrimitive.Content element */
  contentClassName?: string;
  /** Optional class name to apply to the TooltipPrimitive.Arrow element */
  arrowClassName?: string;
  /** Optional class name to apply to the root TooltipPrimitive.Root element */
  className?: string; // Explicitly add className for the root
}

/**
 * Tooltip component based on Radix UI Tooltip Primitive.
 * Displays information related to an element when the element receives keyboard focus or the mouse hovers over it.
 *
 * Styling is primarily handled via CSS Modules targeting Radix data attributes,
 * based on figma-jsons/done/tooltip.json.
 *
 * @example
 * <Tooltip content="This is a tooltip">
 *   <button>Hover me</button>
 * </Tooltip>
 */
const TooltipComponent = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Content>, // Forward ref to Content for positioning
  TooltipProps
>(
  (
    {
      // Provider Props
      delayDuration,
      skipDelayDuration,
      disableHoverableContent,
      // Root Props
      open,
      defaultOpen,
      onOpenChange,
      // Trigger Props
      children,
      triggerAsChild = true,
      // Content Props
      content,
      side,
      sideOffset = 4, // Default applied here
      align,
      alignOffset,
      arrowPadding,
      sticky,
      hideWhenDetached,
      onEscapeKeyDown,
      // onPointerDownOutside, // Removed
      // onFocusOutside,       // Removed
      // onInteractOutside,    // Removed
      forceMount,
      // Arrow Props
      hasArrow = true,
      // Styling & Customization
      className, // Root className
      contentClassName,
      arrowClassName,
    },
    forwardedRef // Ref is now forwarded to Content
  ) => {
    return (
      <TooltipPrimitive.Provider
        delayDuration={delayDuration}
        skipDelayDuration={skipDelayDuration}
        disableHoverableContent={disableHoverableContent}
      >
        {/* Root now only handles open state */}
        <TooltipPrimitive.Root
          open={open}
          defaultOpen={defaultOpen}
          onOpenChange={onOpenChange}
          // className for Root is applied here if needed, but often not necessary
          // className={className}
        >
          {/* Trigger gets children and asChild prop */}
          <TooltipPrimitive.Trigger asChild={triggerAsChild} className={className}>
            {children}
          </TooltipPrimitive.Trigger>
          {/* Portal ensures the tooltip content is rendered at the end of the document body */}
          <TooltipPrimitive.Portal forceMount={forceMount}>
            <TooltipPrimitive.Content
              ref={forwardedRef} // Forward ref here
              side={side}
              sideOffset={sideOffset}
              align={align}
              alignOffset={alignOffset}
              arrowPadding={arrowPadding}
              sticky={sticky}
              hideWhenDetached={hideWhenDetached}
              onEscapeKeyDown={onEscapeKeyDown}
              // onPointerDownOutside={onPointerDownOutside} // Removed
              // onFocusOutside={onFocusOutside}             // Removed
              // onInteractOutside={onInteractOutside}       // Removed
              className={clsx(styles.tooltipContent, contentClassName)} // Combine base style with custom class
            >
              {content}
              {hasArrow && (
                <TooltipPrimitive.Arrow
                  className={clsx(styles.tooltipArrow, arrowClassName)} // Combine base style with custom class
                />
              )}
            </TooltipPrimitive.Content>
          </TooltipPrimitive.Portal>
        </TooltipPrimitive.Root>
      </TooltipPrimitive.Provider>
    );
  }
);

// Standard export using forwardRef
export const Tooltip = TooltipComponent;

Tooltip.displayName = 'Tooltip';