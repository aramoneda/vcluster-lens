import React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import clsx from 'clsx';
import styles from './Drawer.module.css';
import { Button } from '../Button/Button';
import IconButton from '../IconButton/IconButton';
// Assuming a generic icon for close, replace with actual icon if available
import { X, ChevronLeft } from 'lucide-react'; // Import X and ChevronLeft

// --- PROPS ---
interface DrawerContentProps extends Omit<DialogPrimitive.DialogContentProps, 'asChild'> { // Removed asChild
  headerTitle?: React.ReactNode; // For the title in the fixed header
  onBack?: () => void; // Optional prop for the back button
  footerContent?: React.ReactNode; // For flexible footer content
}

// --- STYLED COMPONENTS ---

const StyledOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  Omit<React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>, 'asChild'> // Removed asChild
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={clsx(styles.drawerOverlay, className)}
    {...props}
  />
));
StyledOverlay.displayName = 'Drawer.Overlay';

// Define StyledTitle first as it's used by StyledContent
const StyledTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, children, ...props }, ref) => ( // Added children to props
  <DialogPrimitive.Title
    ref={ref}
    className={clsx(styles.drawerTitle, className)}
    {...props}
  >
    {children}
  </DialogPrimitive.Title>
));
StyledTitle.displayName = 'Drawer.Title';

const StyledContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  DrawerContentProps
>(({ className, children, headerTitle, onBack, footerContent, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <StyledOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={clsx(styles.drawerContent, styles.right, className)}
      data-side="right"
      {...props}
    >
      <div className={styles.drawerHeader}>
        {onBack && (
          <IconButton
            size="M"
            color="Blue"
            ariaLabel="Back"
            onClick={onBack}
            className={styles.drawerBackButton}
          >
            <ChevronLeft />
          </IconButton>
        )}
        {headerTitle && <StyledTitle>{headerTitle}</StyledTitle>}
        <DialogPrimitive.Close asChild className={styles.drawerCloseButton}>
          <IconButton
            size="M" // From figma-json
            color="Blue" // From figma-json
            ariaLabel="Close"
          >
            <X />
          </IconButton>
        </DialogPrimitive.Close>
      </div>
      <div className={styles.drawerBody}>{children}</div>
      {footerContent && (
        <div className={styles.drawerFooter}>
          {footerContent}
        </div>
      )}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
StyledContent.displayName = 'Drawer.Content';

const StyledDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, children, ...props }, ref) => ( // Added children
  <DialogPrimitive.Description
    ref={ref}
    className={clsx(styles.drawerDescription, className)}
    {...props}
  >
    {children}
  </DialogPrimitive.Description>
));
StyledDescription.displayName = 'Drawer.Description';

// --- COMPOSITE COMPONENT ---

// --- WRAPPERS FOR RADIX PRIMITIVES TO STABILIZE HMR ---
const DrawerRoot: React.FC<DialogPrimitive.DialogProps> = (props) => (
  <DialogPrimitive.Root {...props} />
);
DrawerRoot.displayName = 'Drawer.Root';

const DrawerTrigger: React.FC<DialogPrimitive.DialogTriggerProps> = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Trigger>,
  DialogPrimitive.DialogTriggerProps
>((props, ref) => <DialogPrimitive.Trigger {...props} ref={ref} />);
DrawerTrigger.displayName = 'Drawer.Trigger';

const DrawerPortal: React.FC<DialogPrimitive.DialogPortalProps> = (props) => (
  <DialogPrimitive.Portal {...props} />
);
DrawerPortal.displayName = 'Drawer.Portal';

const DrawerClose: React.FC<DialogPrimitive.DialogCloseProps> = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Close>,
  DialogPrimitive.DialogCloseProps
>((props, ref) => <DialogPrimitive.Close {...props} ref={ref} />);
DrawerClose.displayName = 'Drawer.Close';


export const Drawer = {
  Root: DrawerRoot,
  Trigger: DrawerTrigger,
  Portal: DrawerPortal,
  Overlay: StyledOverlay,
  Content: StyledContent,
  Title: StyledTitle,
  Description: StyledDescription,
  Close: DrawerClose,
};

// --- EXPORTS ---
export type { DrawerContentProps };