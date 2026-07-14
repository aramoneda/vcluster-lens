import React from 'react';

import * as RadixDialog from '@radix-ui/react-dialog';
// import { Slot } from '@radix-ui/react-slot'; // Removed as asChild is removed
import clsx from 'clsx';
import { XIcon } from 'lucide-react'; // Using lucide-react as per ai_rules.md

import { Button, ButtonProps } from '../Button/Button';
import IconButton, { IconButtonProps } from '../IconButton/IconButton'; // Changed to default import

import styles from './Modal.module.css';

// --- Prop Types ---

export type ModalSizeType = 'xs' | 'sm' | 'md' | 'lg';

export interface ModalRootProps extends RadixDialog.DialogProps {}
export interface ModalTriggerProps extends RadixDialog.DialogTriggerProps {}
export interface ModalPortalProps extends RadixDialog.DialogPortalProps {}

export interface ModalOverlayProps extends Omit<RadixDialog.DialogOverlayProps, 'asChild'> { // Removed asChild
  // asChild?: boolean; // Removed as per review
  className?: string;
}

export interface ModalContentProps extends Omit<RadixDialog.DialogContentProps, 'title' | 'asChild'> { // Removed asChild
  // asChild?: boolean; // Removed as per review
  size?: ModalSizeType;
  titleText?: string; // To be rendered by StyledTitle within StyledContent
  descriptionText?: string; // To be rendered by StyledDescription
  hideCloseButton?: boolean;
  headerActions?: React.ReactNode; // Additional elements for the header

  // Footer related props
  footerContent?: React.ReactNode; // Custom footer content
  hideFooter?: boolean;
  // Default footer button props (if footerContent is not provided)
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  primaryActionProps?: Partial<ButtonProps>;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  secondaryActionProps?: Partial<ButtonProps>;
}

export interface ModalTitleProps extends Omit<RadixDialog.DialogTitleProps, 'asChild'> { // Removed asChild
  // asChild?: boolean; // Removed as per review
  className?: string;
  children?: React.ReactNode; // Added children
}

export interface ModalDescriptionProps extends Omit<RadixDialog.DialogDescriptionProps, 'asChild'> { // Removed asChild
  // asChild?: boolean; // Removed as per review
  className?: string;
  children?: React.ReactNode; // Added children
}

export interface ModalCloseProps extends Omit<RadixDialog.DialogCloseProps, 'asChild'> { // Removed asChild
  // asChild?: boolean; // Removed as per review
  className?: string;
  children?: React.ReactNode;
}

// --- Styled Components ---

const StyledOverlay = React.forwardRef<
  React.ComponentRef<typeof RadixDialog.Overlay>,
  ModalOverlayProps
>(({ className, /*asChild,*/ ...props }, forwardedRef) => { // Removed asChild from destructuring
  // const Comp = asChild ? Slot : 'div'; // Comp will always be 'div' or Radix default
  return (
    <RadixDialog.Overlay
      ref={forwardedRef}
      className={clsx(styles.overlay, className)}
      {...props}
      // asChild={asChild} // Removed asChild prop
    />
  );
});
StyledOverlay.displayName = 'Modal.Overlay';

const StyledContent = React.forwardRef<
  React.ComponentRef<typeof RadixDialog.Content>,
  ModalContentProps
>(
  (
    {
      className,
      // asChild, // Removed asChild from destructuring
      size = 'xs',
      children,
      titleText,
      descriptionText,
      hideCloseButton = false,
      headerActions,
      footerContent,
      hideFooter = false,
      primaryActionLabel = 'Confirm',
      onPrimaryAction,
      primaryActionProps,
      secondaryActionLabel = 'Cancel',
      onSecondaryAction,
      secondaryActionProps,
      ...props
    },
    forwardedRef
  ) => {
    // const Comp = asChild ? Slot : 'div'; // Comp will always be 'div' or Radix default

    const sizeClass = {
      xs: styles.sizeXs,
      sm: styles.sizeSm,
      md: styles.sizeMd,
      lg: styles.sizeLg,
    }[size as ModalSizeType]; // Explicit cast to ModalSizeType

    return (
      <RadixDialog.Content
        ref={forwardedRef}
        className={clsx(styles.content, sizeClass, className)}
        {...props}
        // asChild={asChild} // Removed asChild prop
      >
        <div className={styles.modalHeader}>
          {titleText && <StyledTitle>{titleText}</StyledTitle>}
          {headerActions}
          {!hideCloseButton && (
            <RadixDialog.Close asChild className={styles.closeButtonWrapper}>
              <IconButton
                // color="Blue" prop removed as it's redundant; color is inherited from Modal.module.css styles.closeButtonWrapper
                size="M"
                ariaLabel="Close modal"
              >
                <XIcon size={20} />
              </IconButton>
            </RadixDialog.Close>
          )}
        </div>

        <div className={styles.modalBody}>
          {descriptionText && <StyledDescription>{descriptionText}</StyledDescription>}
          {children}
        </div>

        {!hideFooter && (
          <div className={styles.modalFooter}>
            {footerContent !== undefined ? (
              footerContent
            ) : (
              <>
                {onSecondaryAction && (
                  <Button
                    buttonStyle="secondary" // Changed from variant to buttonStyle
                    onClick={onSecondaryAction}
                    {...secondaryActionProps}
                  >
                    {secondaryActionLabel}
                  </Button>
                )}
                {onPrimaryAction && (
                  <Button
                    buttonStyle="primary" // Changed from variant to buttonStyle
                    onClick={onPrimaryAction}
                    {...primaryActionProps}
                  >
                    {primaryActionLabel}
                  </Button>
                )}
              </>
            )}
          </div>
        )}
        {/* If Comp is Slot, RadixDialog.Content will project its children here */}
        {/* {asChild && children} */} {/* Removed conditional rendering based on asChild */}
      </RadixDialog.Content>
    );
  }
);
StyledContent.displayName = 'Modal.Content';

const StyledTitle = React.forwardRef<
  React.ComponentRef<typeof RadixDialog.Title>,
  ModalTitleProps
>(({ className, /*asChild,*/ children, ...props }, forwardedRef) => { // Destructure children, removed asChild
  // const Comp = 'h2'; // Default to h2 for semantic modal titles. Radix default or direct use.
  return (
    <RadixDialog.Title
      ref={forwardedRef}
      className={clsx(styles.title, className)}
      {...props}
      // asChild={asChild} // Removed asChild prop
    >
      {children}
    </RadixDialog.Title>
  );
});
StyledTitle.displayName = 'Modal.Title';

const StyledDescription = React.forwardRef<
  React.ComponentRef<typeof RadixDialog.Description>,
  ModalDescriptionProps
>(({ className, /*asChild,*/ children, ...props }, forwardedRef) => { // Destructure children, removed asChild
  // const Comp = 'p'; // Default to p. Radix default or direct use.
  return (
    <RadixDialog.Description
      ref={forwardedRef}
      className={clsx(styles.description, className)}
      {...props}
      // asChild={asChild} // Removed asChild prop
    >
      {children}
    </RadixDialog.Description>
  );
});
StyledDescription.displayName = 'Modal.Description';

const StyledClose = React.forwardRef<
  React.ComponentRef<typeof RadixDialog.Close>,
  ModalCloseProps
>(({ className, /*asChild,*/ children, ...props }, forwardedRef) => { // Removed asChild from destructuring
  // const Comp = 'button'; // Default to button. Radix default or direct use.
  return (
    <RadixDialog.Close
      ref={forwardedRef}
      className={className} // Consumers can pass their own classes
      {...props}
      // asChild={asChild} // Removed asChild prop
    >
      {children}
    </RadixDialog.Close>
  );
});
StyledClose.displayName = 'Modal.Close';

// --- Composite Export ---

export const Modal = {
  Root: RadixDialog.Root,
  Trigger: RadixDialog.Trigger,
  Portal: RadixDialog.Portal,
  Overlay: StyledOverlay,
  Content: StyledContent,
  Title: StyledTitle,
  Description: StyledDescription,
  Close: StyledClose,
};