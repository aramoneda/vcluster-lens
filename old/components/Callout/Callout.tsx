import React, { forwardRef, ReactNode } from 'react';
import clsx from 'clsx';
import { Icons, CrossIcon, type IconName } from '../Icons/Icons'; // Updated to use Icons component and import IconName
import IconButton from '../IconButton/IconButton';
import styles from './Callout.module.css';

export type CalloutVariant = 'Info' | 'Success' | 'Warning' | 'Critical';

export interface CalloutProps extends React.ComponentPropsWithoutRef<'div'> {
  /**
   * The variant of the callout, determining its color scheme and icon.
   * Corresponds to 'Info', 'Success', 'Warning', 'Critical' from Figma.
   */
  variant?: CalloutVariant;
  /**
   * Optional title for the callout.
   */
  title?: string;
  /**
   * The main content/description of the callout.
   */
  children: React.ReactNode;
  /**
   * Optional custom icon. If a ReactNode, it's rendered directly.
   * Defaults to a variant-specific icon.
   */
  icon?: React.ReactNode;
  /**
   * If true, a close button is rendered.
   * Maps to Figma property "CloseButtonVisibility#31362:5" with default true.
   * @deprecated Use closeButtonVisible for better alignment with Figma naming
   */
  isDismissible?: boolean;
  /**
   * If true, a close button is rendered.
   * Maps to Figma property "CloseButtonVisibility#31362:5" with default true.
   */
  closeButtonVisible?: boolean;
  /**
   * Callback for when the close button is clicked.
   */
  onDismiss?: () => void;
  /**
   * Optional actions to be rendered in the callout, typically a Link component.
   * Maps to Figma property "LinkVisibility#31362:0" - when provided, link is visible.
   * @deprecated Use linkVisible and linkContent for better alignment with Figma naming
   */
  actions?: React.ReactNode;
  /**
   * If true and linkContent is provided, the link is visible.
   * Maps to Figma property "LinkVisibility#31362:0" with default true.
   */
  linkVisible?: boolean;
  /**
   * Content for the link component when linkVisible is true.
   * Maps to Figma property "LinkVisibility#31362:0".
   */
  linkContent?: React.ReactNode;
}

// Function to get icon name based on variant
// Maps to Figma component references:
// - Info/Warning/Critical: "Status Icons/attention" component
// - Success: "Status Icons/success" component
const getIconNameForVariant = (currentVariant: CalloutVariant): IconName | undefined => {
  switch (currentVariant) {
    case 'Info':
      return 'Info'; // Maps to "Status Icons/attention" in Figma
    case 'Success':
      return 'CheckCircle2'; // Maps to "Status Icons/success" in Figma
    case 'Warning':
      return 'AlertTriangle'; // Maps to "Status Icons/attention" in Figma
    case 'Critical':
      return 'AlertCircle'; // Maps to "Status Icons/attention" in Figma
    default:
      // Optionally, log a warning or return a default icon name
      return undefined;
  }
};

const Callout = forwardRef<HTMLDivElement, CalloutProps>(
  (
    {
      variant = 'Info',
      title,
      children,
      icon,
      isDismissible = true, // Backward compatibility
      closeButtonVisible, // New Figma-aligned prop
      onDismiss,
      className,
      actions, // Backward compatibility
      linkVisible = true, // New Figma-aligned prop, default true per Figma JSON
      linkContent, // New Figma-aligned prop
      ...rest
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = React.useState(true);

    // Determine if close button should be visible (backward compatibility + new prop)
    const isCloseButtonVisible = closeButtonVisible !== undefined ? closeButtonVisible : isDismissible;

    // Determine link content to render (backward compatibility + new props)
    const linkToRender = linkContent && linkVisible ? linkContent : actions;

    const handleDismiss = () => {
      if (onDismiss) {
        onDismiss();
      }
      setIsVisible(false);
    };

    if (!isVisible && isCloseButtonVisible) {
      return null;
    }

    const role = variant === 'Warning' || variant === 'Critical' ? 'alert' : 'status';
    const ariaLive = variant === 'Critical' ? 'assertive' : undefined;

    const renderIcon = () => {
      if (React.isValidElement(icon)) {
        // If a custom icon is provided, render it directly.
        // The consumer is responsible for styling their custom icon.
        // The .iconContainer can provide alignment/spacing.
        return <span className={styles.iconContainer}>{icon}</span>;
      }
      const iconName = getIconNameForVariant(variant);
      if (!iconName) {
        // Fallback if no icon name is found, though getIconNameForVariant should handle all variants
        return null;
      }
      // Apply .icon class for consistent styling
      return <span className={styles.iconContainer}><Icons name={iconName} className={styles.icon} aria-hidden="true" /></span>;
    };

    return (
      <div
        ref={ref}
        className={clsx(styles.callout, styles[variant], className)}
        role={role}
        aria-live={ariaLive}
        {...rest}
      >
        <div className={styles.mainContainer}>
          {renderIcon()}
          <div className={styles.textContainer}>
            {title && <h3 className={styles.title}>{title}</h3>}
            <div className={styles.description}>{children}</div>
            {linkToRender && <div className={styles.actionsArea}>{linkToRender}</div>}
          </div>
        </div>
        {isCloseButtonVisible && (
          <IconButton
            ariaLabel="Dismiss message" // Corrected prop name from aria-label to ariaLabel
            onClick={handleDismiss}
            className={styles.dismissButton}
            size="M" // Figma JSON specifies "Size=M, Color=Blue" for Icon Button component
            color="Blue"
          >
            <CrossIcon /> {/* Pass icon as children */}
          </IconButton>
        )}
      </div>
    );
  }
);

Callout.displayName = 'Callout';

export { Callout };