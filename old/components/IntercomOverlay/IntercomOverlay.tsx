import * as React from 'react';
import { Primitive } from '@radix-ui/react-primitive';
import { clsx } from 'clsx';
import { Info, CheckCircle2, AlertTriangle, AlertCircle, ChevronUp, ChevronDown, X } from 'lucide-react';
import { Link } from '../Link/Link';
import IconButton from '../IconButton/IconButton';
import styles from './IntercomOverlay.module.css';

// Type definitions based on Figma JSON properties
export type IntercomOverlayType = 'Info' | 'Warning' | 'Critical' | 'Success';

export interface IntercomOverlayProps extends React.ComponentPropsWithoutRef<typeof Primitive.div> {
  /**
   * The type/variant of the intercom overlay, determining its color scheme and icon.
   * Corresponds to 'Info', 'Warning', 'Critical', 'Success' from Figma JSON.
   * @default 'Info'
   */
  type?: IntercomOverlayType;
  /**
   * Whether to show the expand button/link.
   * Maps to Figma property "Expand#31362:10" with default false.
   * @default false
   */
  expand?: boolean;
  /**
   * Whether to show the collapse button/link.
   * Maps to Figma property "Collapse#31362:15" with default false.
   * @default false
   */
  collapse?: boolean;
  /**
   * Whether to show the link.
   * Maps to Figma property "Link#31362:20" with default true.
   * @default true
   */
  link?: boolean;
  /**
   * The main notification message content.
   */
  children: React.ReactNode;
  /**
   * Optional link content. If not provided and link is true, defaults to "Label".
   */
  linkContent?: React.ReactNode;
  /**
   * Optional link href for the action link.
   */
  linkHref?: string;
  /**
   * Callback when the expand button is clicked.
   */
  onExpand?: () => void;
  /**
   * Callback when the collapse button is clicked.
   */
  onCollapse?: () => void;
  /**
   * Callback when the dismiss button is clicked.
   */
  onDismiss?: () => void;
  /**
   * Additional CSS class names to apply.
   */
  className?: string;
}

// Function to get icon component based on type variant
// Maps to Figma component references:
// - Info/Warning/Critical: "Status Icons/attention" component
// - Success: "Status Icons/success" component
const getIconForType = (type: IntercomOverlayType): React.ReactNode => {
  switch (type) {
    case 'Info':
      return <Info size={16} />; // Maps to "Status Icons/attention" in Figma
    case 'Success':
      return <CheckCircle2 size={16} />; // Maps to "Status Icons/success" in Figma
    case 'Warning':
      return <AlertTriangle size={16} />; // Maps to "Status Icons/attention" in Figma
    case 'Critical':
      return <AlertCircle size={16} />; // Maps to "Status Icons/attention" in Figma
    default:
      return <Info size={16} />;
  }
};

/**
 * IntercomOverlay component for displaying notification overlays.
 * Based on Figma JSON specification: figma-jsons/intercom-overlay.json
 * 
 * Features:
 * - Type variants: Info, Warning, Critical, Success
 * - Optional expand/collapse functionality
 * - Optional action link
 * - Dismiss button
 * - Proper accessibility with ARIA attributes
 */
const IntercomOverlay = React.forwardRef<React.ComponentRef<typeof Primitive.div>, IntercomOverlayProps>(
  (
    {
      type = 'Info', // Default from Figma JSON
      expand = false, // Default from Figma JSON
      collapse = false, // Default from Figma JSON
      link = true, // Default from Figma JSON
      children,
      linkContent = 'Label', // Default text from Figma JSON
      linkHref,
      onExpand,
      onCollapse,
      onDismiss,
      className,
      ...rest
    },
    ref
  ) => {
    const overlayClasses = clsx(
      styles.intercomOverlay,
      styles[`type${type}`], // e.g., styles.typeInfo
      className
    );

    const statusIcon = getIconForType(type);

    // Render expand/collapse link if either expand or collapse is true
    const renderExpandCollapseLink = () => {
      if (!expand && !collapse) return null;

      const isExpand = expand && !collapse;
      const linkText = isExpand ? 'Expand' : 'Collapse';
      const icon = isExpand ? <ChevronDown size={16} /> : <ChevronUp size={16} />;
      const onClick = isExpand ? onExpand : onCollapse;

      return (
        <Link
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onClick?.();
          }}
          icon={icon}
          trailingIcon={true}
          className={styles.expandCollapseLink}
        >
          {linkText}
        </Link>
      );
    };

    // Render action link if link is true
    const renderActionLink = () => {
      if (!link) return null;

      return (
        <Link
          href={linkHref || '#'}
          className={styles.actionLink}
        >
          {linkContent}
        </Link>
      );
    };

    return (
      <Primitive.div
        ref={ref}
        className={overlayClasses}
        role="alert" // Appropriate for notification overlays
        {...rest}
      >
        {/* Left container: icon + text content (inline) */}
        <div className={styles.leftContainer}>
          <div className={styles.statusIcon}>
            {statusIcon}
          </div>
          <div className={styles.textContent}>
            {children}
            {renderActionLink()}
          </div>
        </div>

        {/* Right container: expand/collapse links + dismiss button */}
        <div className={styles.rightContainer}>
          {renderExpandCollapseLink()}
          {onDismiss && (
            <IconButton
              ariaLabel="Dismiss notification"
              onClick={onDismiss}
              size="M"
              color="Blue"
            >
              <X size={16} />
            </IconButton>
          )}
        </div>
      </Primitive.div>
    );
  }
);

IntercomOverlay.displayName = 'IntercomOverlay';

export { IntercomOverlay };
