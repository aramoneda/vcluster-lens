import * as React from 'react'
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import {
  inputContainerVariants,
  baseInputStyles,
  type InputFeedback,
  type InputFeedbackType,
} from '@/components/ui/input'

// Textarea variants (standalone)
const textareaVariants = [
  'w-full min-h-[74px]',
  'px-3 py-2', // spacing-sp-12 / spacing-sp-8
  'border border-[var(--color-stroke-default)]',
  'rounded-[var(--radius-xs)]',
  'bg-[var(--color-surface-input-default)]',
  'text-sm leading-5 font-semibold',
  'text-[var(--color-text-primary)]',
  'outline-none resize-none',
  'transition-[border-color,box-shadow] duration-200',
  // Placeholder
  'placeholder:text-[var(--color-text-secondary)]',
  'placeholder:font-normal',
  // Hover
  'hover:border-[var(--color-stroke-dark)]',
  // Focus
  'focus:border-[var(--color-stroke-brand)]',
  'focus:shadow-[0_0_0_1px_var(--color-stroke-brand),0_0_0_2px_var(--denim-300)]',
  // Disabled
  'disabled:bg-[var(--color-surface-input-disabled)]',
  'disabled:border-[var(--color-stroke-default)]',
  'disabled:cursor-not-allowed',
  'disabled:text-[var(--color-text-secondary)]',
  'disabled:hover:border-[var(--color-stroke-default)]',
  // Invalid
  'aria-invalid:border-[var(--error-accent)]',
  'aria-invalid:focus:border-[var(--error-accent)]',
  'aria-invalid:focus:shadow-[0_0_0_1px_var(--error-accent),0_0_0_2px_var(--error-accent)]',
]

// Simple Textarea - returns an actual <textarea> element
// For backwards compatibility with InputGroupTextarea, etc.
function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(textareaVariants, className)}
      {...props}
    />
  )
}

// TextareaField - enhanced textarea with label, icons, feedback
export interface TextareaFieldProps
  extends Omit<React.ComponentPropsWithoutRef<'textarea'>, 'className'> {
  /** Label text */
  label?: string
  /** Feedback message and type */
  feedback?: InputFeedback | string
  /** Error message (shorthand for feedback with error type) */
  errorMessage?: string
  /** Visual variant */
  variant?: 'primary' | 'secondary'
  /** Invalid state */
  isInvalid?: boolean
  /** Left icon */
  leftIcon?: React.ElementType
  /** Right icon */
  icon?: React.ElementType
  /** Label position */
  labelPosition?: 'top' | 'left'
  /** Info text for label tooltip */
  labelInfo?: string | React.ReactNode
  /** Click handler for left icon */
  onLeftIconClick?: React.MouseEventHandler<HTMLButtonElement>
  /** Click handler for right icon */
  onIconClick?: React.MouseEventHandler<HTMLButtonElement>
  /** Wrapper className */
  className?: string
  /** Textarea element className */
  textareaClassName?: string
}

const TextareaField = React.forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  (
    {
      label,
      feedback: feedbackProp,
      errorMessage,
      variant = 'primary',
      isInvalid = false,
      leftIcon: LeftIcon,
      icon: RightIcon,
      labelPosition = 'top',
      labelInfo,
      required,
      disabled,
      readOnly,
      onLeftIconClick,
      onIconClick,
      className,
      textareaClassName,
      rows = 3,
      id,
      ...props
    },
    ref
  ) => {
    const textareaId = id || React.useId()

    // Process feedback
    let feedbackObject: InputFeedback | undefined
    if (typeof feedbackProp === 'string') {
      feedbackObject = {
        message: feedbackProp,
        type: isInvalid ? 'error' : 'info',
      }
    } else if (feedbackProp) {
      feedbackObject = feedbackProp
    }

    if (isInvalid && errorMessage) {
      feedbackObject = { message: errorMessage, type: 'error' }
    } else if (isInvalid && !feedbackObject) {
      feedbackObject = { message: 'Invalid input', type: 'error' }
    }

    const feedbackType = feedbackObject?.type
    const FeedbackIcon =
      feedbackObject?.icon ||
      {
        error: AlertCircle,
        success: CheckCircle,
        info: Info,
        warning: AlertTriangle,
      }[feedbackType || 'info']

    return (
      <div
        data-slot="textarea-field"
        className={cn(
          'flex w-full gap-1',
          labelPosition === 'top' ? 'flex-col' : 'flex-row items-start gap-3',
          className
        )}
      >
        {label && (
          <div className="flex items-center gap-0.5">
            <Label htmlFor={textareaId} className="text-sm leading-5 text-[var(--color-text-secondary)] font-normal">
              {label}
            </Label>
            {required && !labelInfo && (
              <span className="text-[var(--error-accent)] font-semibold ml-0.5">*</span>
            )}
            {labelInfo && (
              <span className="flex items-center gap-0.5 ml-0.5">
                <Info className="w-4 h-4 text-[var(--color-text-secondary)]" />
                {required && (
                  <span className="text-[var(--error-accent)] font-semibold">*</span>
                )}
              </span>
            )}
          </div>
        )}

        <div
          className={cn(
            inputContainerVariants({
              variant,
              isInvalid,
              isDisabled: disabled,
              isReadOnly: readOnly,
            }),
            'min-h-[74px] h-auto py-2 items-start'
          )}
        >
          {LeftIcon && (
            <button
              type="button"
              onClick={onLeftIconClick}
              className="p-0 bg-transparent border-0 cursor-pointer flex items-center mt-0.5"
              disabled={disabled}
            >
              <LeftIcon className="w-4 h-4 text-[var(--color-icon-dark)]" aria-hidden />
            </button>
          )}

          <textarea
            ref={ref}
            id={textareaId}
            data-slot="textarea"
            rows={rows}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            aria-invalid={isInvalid}
            className={cn(
              baseInputStyles,
              'resize-none h-auto',
              textareaClassName
            )}
            {...props}
          />

          {RightIcon && (
            <button
              type="button"
              onClick={onIconClick}
              className="p-0 bg-transparent border-0 cursor-pointer flex items-center mt-0.5"
              disabled={disabled}
            >
              <RightIcon className="w-4 h-4 text-[var(--color-icon-brand)]" aria-hidden />
            </button>
          )}
        </div>

        {feedbackObject && (
          <div
            data-slot="textarea-feedback"
            className={cn(
              'flex items-center gap-1 text-sm leading-5',
              {
                'text-[var(--color-state-error)]': feedbackType === 'error',
                'text-[var(--color-state-success)]': feedbackType === 'success',
                'text-[var(--color-state-warning)]': feedbackType === 'warning',
                'text-[var(--color-text-secondary)]': feedbackType === 'info',
              }
            )}
          >
            {FeedbackIcon && <FeedbackIcon className="w-4 h-4 shrink-0" aria-hidden />}
            {feedbackObject.message}
          </div>
        )}
      </div>
    )
  }
)

TextareaField.displayName = 'TextareaField'

export { Textarea, TextareaField, textareaVariants }
export type { InputFeedback as TextareaFeedback, InputFeedbackType as TextareaFeedbackType }
