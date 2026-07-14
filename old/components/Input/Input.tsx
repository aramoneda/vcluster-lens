import React, { forwardRef, useId, ElementType, InputHTMLAttributes, TextareaHTMLAttributes, ComponentRef, useContext } from 'react';
import cn from 'clsx';
import * as Form from '@radix-ui/react-form';
import { Primitive } from '@radix-ui/react-primitive';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import styles from './Input.module.css';

/**
 * Context to track if we're inside a Form.Root
 * This enables the "Input must be used within Form.Root" error
 */
const FormRootContext = React.createContext<boolean>(false);

/**
 * Hook to check if component is inside Form.Root context
 * Throws a helpful error message if not
 */
const useFormRootContext = (componentName: string) => {
  const isInsideForm = useContext(FormRootContext);
  if (!isInsideForm) {
    throw new Error(
      `${componentName} must be used within a <Form.Root> component. ` +
      `Wrap your form fields with <Form.Root> to enable form functionality.`
    );
  }
  return isInsideForm;
};

/**
 * FormRoot wrapper that provides context for form field validation
 * Use this instead of Form.Root directly to enable context checking
 */
export const FormRoot: React.FC<React.ComponentProps<typeof Form.Root>> = ({ children, ...props }) => {
  return (
    <FormRootContext.Provider value={true}>
      <Form.Root {...props}>{children}</Form.Root>
    </FormRootContext.Provider>
  );
};

export type FeedbackType = 'error' | 'success' | 'info' | 'warning';

export interface Feedback {
  message: string;
  type: FeedbackType;
  icon?: ElementType; // Optional custom icon for feedback
}

// Define common props shared between input and textarea
type CommonInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement> & TextareaHTMLAttributes<HTMLTextAreaElement>,
  'type' | 'className' | 'style' | 'onChange' | 'ref' | 'value' | 'defaultValue' | 'rows' | 'cols' | 'wrap' | 'children' | 'name'
>;

export interface InputProps extends CommonInputProps {
  /**
   * The name for the form field, submitted with the form data.
   */
  name: string; // Required by Radix Form.Field
  /**
   * Optional label text to display above the input.
   */
  label?: string;
  /**
   * Optional feedback object with message, type, and optional icon.
   */
  feedback?: Feedback | string; // Allow string for backward compatibility or simple info
  /**
   * Optional flag to make the input read-only.
   */
  readOnly?: boolean;
  /**
   * Optional visual variant of the input.
   */
  variant?: 'primary' | 'secondary';
  /**
   * Optional error message to display when the field is invalid.
   * This will be used for Form.Message when isInvalid is true.
   */
  errorMessage?: string; // Specifically for errors
  /**
   * Optional icon component (from lucide-react) to display inside the input on the right.
   */
  icon?: ElementType; // Right icon
  /**
   * Optional icon component (from lucide-react) to display inside the input on the left.
   */
  leftIcon?: ElementType; // Left icon
  /**
   * Determines if the input should be a multi-line textarea.
   */
  multiline?: boolean;
  /**
   * Sets the visual state to invalid/error.
   * Radix Form.Message can show different messages based on validation.
   * We'll use this to conditionally render `errorMessage` or `feedback`.
   */
  isInvalid?: boolean;
  /**
   * Optional flag to indicate if the field is required. Adds visual indicator if label is present.
   * Radix Form.Label handles this if the input inside Form.Control is `required`.
   */
  required?: boolean;
  /**
   * Optional tooltip text or element for the info icon next to the label.
   */
  labelInfo?: string | React.ReactNode;
  /**
   * The position of the label relative to the input.
   * @default 'top'
   */
  labelPosition?: 'top' | 'left';
  /**
   * Custom class name for the Form.Field root element.
   */
  className?: string;
  /**
   * Custom class name for the Primitive.input/textarea element itself.
   */
  inputClassName?: string;
   /**
   * Custom class name for the Form.Label element.
   */
  labelClassName?: string;
   /**
   * Custom class name for the Form.Message element.
   */
  feedbackClassName?: string; // Can be used for general feedback styling
  /**
   * Standard HTML input type attribute (e.g., 'text', 'password', 'number', 'email').
   * Only applicable when multiline is false.
   */
  type?: React.HTMLInputTypeAttribute;
  /**
   * Standard HTML textarea rows attribute.
   * Only applicable when multiline is true.
   */
  rows?: number;
  /**
   * Standard HTML textarea cols attribute.
   * Only applicable when multiline is true.
   */
  cols?: number;
  /**
   * Standard HTML onChange event handler.
   */
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  value?: string | number | readonly string[];
  defaultValue?: string | number | readonly string[];
  /**
   * Optional string to be used as a `data-testid` attribute for testing purposes.
   */
  dataTestId?: string;
  /**
   * Optional click handler for the right icon.
   */
  onIconClick?: React.MouseEventHandler<HTMLButtonElement>;
  /**
   * Optional click handler for the left icon.
   */
  onLeftIconClick?: React.MouseEventHandler<HTMLButtonElement>;
}

/**
 * Input component built using Radix UI Form primitives.
 *
 * This component renders a `Form.Field`, `Form.Label`, `Form.Control`, and `Form.Message`.
 * It **MUST** be used within a `<FormRoot>` component to enable
 * form submission, validation state propagation, and other Radix Form features.
 *
 * @throws Error if used outside of FormRoot context
 *
 * @example
 * ```tsx
 * import { Input, FormRoot } from './Input';
 *
 * function MyForm() {
 *   return (
 *     <FormRoot onSubmit={(e) => e.preventDefault()}>
 *       <Input name="email" label="Email" type="email" required />
 *       <button type="submit">Submit</button>
 *     </FormRoot>
 *   );
 * }
 * ```
 */
export const Input = forwardRef<React.ComponentRef<typeof Primitive.input> | React.ComponentRef<'textarea'>, InputProps>(
  (
    {
      name, // Required for Form.Field
      label,
      feedback: feedbackProp, // Renamed to avoid conflict
      errorMessage,
      icon: RightIconComponent,
      leftIcon: LeftIconComponent,
      multiline = false,
      isInvalid = false,
      variant = 'primary',
      labelInfo,
      labelPosition = 'top',
      className,
      inputClassName,
      labelClassName,
      feedbackClassName,
      type = 'text',
      rows,
      cols,
      value,
      defaultValue,
      onChange,
      min,
      max,
      step,
      id: providedId,
      disabled = false,
      required = false,
      readOnly = false,
      dataTestId,
      onIconClick,
      onLeftIconClick,
      ...restProps
    },
    ref
  ) => {
    // Enforce that Input is used within FormRoot context
    useFormRootContext('Input');

    const generatedId = useId();
    const id = providedId || generatedId;
    const hasRightIcon = !!RightIconComponent;
    const hasLeftIcon = !!LeftIconComponent;

    let feedbackObject: Feedback | undefined = undefined;
  
    if (typeof feedbackProp === 'string') {
      // If feedback is a string, treat it as 'info' type by default, or 'error' if isInvalid is also true
      // This maintains some backward compatibility and handles the old errorMessage prop.
      if (isInvalid && errorMessage) {
        feedbackObject = { message: errorMessage, type: 'error' };
      } else if (isInvalid && feedbackProp && !errorMessage) {
        // If isInvalid is true, feedback string is an error message
        feedbackObject = { message: feedbackProp, type: 'error' };
      } else if (feedbackProp) {
        feedbackObject = { message: feedbackProp, type: 'info' };
      }
    } else if (feedbackProp) {
      feedbackObject = feedbackProp;
    }
  
    // If isInvalid is true and an errorMessage is provided, it should override any other feedback of type 'error'.
    // Or, if feedbackObject is already of type 'error' due to isInvalid, use its message.
    if (isInvalid) {
      if (errorMessage) {
        feedbackObject = { message: errorMessage, type: 'error' };
      } else if (feedbackObject && feedbackObject.type !== 'error' && feedbackObject.message) {
        // If isInvalid, but feedback was e.g. 'info', convert to 'error' with same message
        // This case might be less common if `errorMessage` is used correctly.
        // However, if `feedback` prop was an object like { message: "Hint", type: "info" }
        // and `isInvalid` is true, we should show an error.
        // The QA implies `errorMessage` prop is for when `isInvalid` is true.
        // Let's prioritize `errorMessage` when `isInvalid` is true.
        // If `errorMessage` is not set, but `isInvalid` is true, and `feedbackProp` was a string,
        // it's already handled above to become an error.
        // If `feedbackProp` was an object, and `isInvalid` is true, its type should become 'error'.
        if (feedbackObject) { // Ensure feedbackObject exists
           feedbackObject = { ...feedbackObject, type: 'error', message: feedbackObject.message || 'An error occurred.'};
        } else {
          // Default error message if isInvalid is true but no message source
          feedbackObject = { message: 'An error occurred.', type: 'error'};
        }
      } else if (!feedbackObject && errorMessage) { // Case where feedbackProp was undefined but errorMessage exists
          feedbackObject = { message: errorMessage, type: 'error' };
      }
    }
  
  
    const messageContent = feedbackObject?.message;
    const feedbackType = feedbackObject?.type;
  
    const FeedbackIconComponent = feedbackObject?.icon || {
      error: AlertCircle,
      success: CheckCircle,
      info: Info,
      warning: AlertTriangle,
    }[feedbackType || 'info'];
  
  
    const inputElement = multiline ? (
      <textarea
        ref={ref as React.Ref<HTMLTextAreaElement>}
        id={id}
        rows={rows}
        cols={cols}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        disabled={disabled}
        required={required}
        readOnly={readOnly}
        aria-invalid={isInvalid}
        aria-required={required}
        className={cn(
          styles.input,
          styles.textarea,
          variant === 'secondary' && styles.secondary,
          inputClassName
        )}
        {...restProps}
      />
    ) : (
      <Primitive.input
        ref={ref as React.Ref<HTMLInputElement>}
        id={id}
        type={type}
        min={min}
        max={max}
        step={step}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        disabled={disabled}
        required={required}
        readOnly={readOnly}
        aria-invalid={isInvalid}
        aria-required={required}
        className={cn(
          styles.input,
          styles.inputField,
          variant === 'secondary' && styles.secondary,
          inputClassName
        )}
        {...restProps}
      />
    );

    const fieldContent = (
      <>
        {label && (
          <div className={styles.labelWrapper}>
            <Form.Label htmlFor={id} className={cn(styles.label, labelClassName)}>
              {label}
            </Form.Label>
            {required && !labelInfo && <span className={styles.requiredIndicatorAfterLabel}>*</span>}
            {labelInfo && (
              <span className={styles.infoIconWrapper}>
                <span className={styles.infoIcon}>&#x24D8;</span>
                {required && <span className={styles.requiredIndicatorAfterLabelInfo}>*</span>}
              </span>
            )}
          </div>
        )}
        <div
          className={cn(
            styles.inputContainer,
            variant === 'secondary' && styles.secondary,
            isInvalid && styles.invalid,
            disabled && styles.disabled,
            readOnly && styles.readOnly
          )}
          data-multiline={multiline}
        >
          {LeftIconComponent && (
            <button type="button" onClick={onLeftIconClick} className={styles.iconButton}>
              <LeftIconComponent className={cn(styles.icon, styles.leftIcon)} aria-hidden="true" />
            </button>
          )}
          <Form.Control asChild>
            {inputElement}
          </Form.Control>
          <div className={styles.rightIconContainer}>
            {RightIconComponent && (
              <button type="button" onClick={onIconClick} className={styles.iconButton}>
                <RightIconComponent className={cn(styles.icon, styles.rightIcon)} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
        {messageContent && feedbackType && (
          <Form.Message
            className={cn(
              styles.feedback,
              styles[feedbackType],
              feedbackClassName
            )}
            data-feedback-type={feedbackType}
          >
            {FeedbackIconComponent && <FeedbackIconComponent className={styles.feedbackIcon} aria-hidden="true" />}
            {messageContent}
          </Form.Message>
        )}
      </>
    );

    return (
      <Form.Field
        name={name}
        className={cn(
          styles.wrapper,
          labelPosition === 'left' && styles.wrapperLeft,
          className
        )}
        data-invalid={isInvalid ? '' : undefined}
        data-testid={dataTestId}
      >
        {fieldContent}
      </Form.Field>
    );
  }
);

Input.displayName = 'Input';
