import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'

// Feedback types
export type InputFeedbackType = 'error' | 'success' | 'info' | 'warning'

export interface InputFeedback {
  message: string
  type: InputFeedbackType
  icon?: React.ElementType
}

// Input container variants (for InputField)
const inputContainerVariants = cva(
  [
    'flex items-center gap-3',
    'px-3', // spacing-sp-12
    'border border-[var(--color-stroke-default)]',
    'rounded-[var(--radius-xs)]',
    'bg-[var(--color-surface-input-default)]',
    'transition-[border-color,box-shadow] duration-200',
    // Hover
    'hover:border-[var(--color-stroke-dark)]',
    // Focus within
    'focus-within:border-[var(--color-stroke-brand)]',
    'focus-within:shadow-[0_0_0_1px_var(--color-stroke-brand),0_0_0_2px_var(--denim-300)]',
  ],
  {
    variants: {
      variant: {
        primary: '',
        secondary: [
          'bg-transparent border-0 rounded-none px-0',
          'border-b border-[var(--color-stroke-default)]',
          'focus-within:border-b-2 focus-within:border-[var(--color-stroke-brand)]',
          'focus-within:shadow-none',
        ],
      },
      isInvalid: {
        true: [
          'border-[var(--error-accent)]',
          'focus-within:border-[var(--error-accent)]',
          'focus-within:shadow-[0_0_0_1px_var(--error-accent),0_0_0_2px_var(--error-accent)]',
        ],
      },
      isDisabled: {
        true: [
          'bg-[var(--color-surface-input-disabled)]',
          'border-[var(--color-stroke-default)]',
          'cursor-not-allowed',
          'hover:border-[var(--color-stroke-default)]',
        ],
      },
      isReadOnly: {
        true: [
          'cursor-default',
          'focus-within:border-[var(--color-stroke-default)]',
          'focus-within:shadow-none',
        ],
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  }
)

// Base input element styles (for bare Input)
const inputVariants = cva(
  [
    'w-full',
    'border border-[var(--color-stroke-default)]',
    'rounded-[var(--radius-xs)]',
    'bg-[var(--color-surface-input-default)]',
    'text-[var(--color-text-primary)]',
    'outline-none',
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
    // File input
    'file:border-0 file:bg-transparent file:font-medium',
  ],
  {
    variants: {
      inputSize: {
        default: 'h-9 px-3 text-sm leading-5 font-semibold', // 36px height
        xs: 'h-6 px-2 [font:var(--font-body-small-semibold)]', // 24px height
      },
    },
    defaultVariants: {
      inputSize: 'default',
    },
  }
)

// Inner input styles (when inside a container)
const baseInputStyles = [
  'flex-1 min-w-0 h-full',
  'bg-transparent border-0 p-0',
  'text-sm leading-5 font-semibold', // body-medium semibold
  'text-[var(--color-text-primary)]',
  'outline-none',
  'placeholder:text-[var(--color-text-secondary)]',
  'placeholder:font-normal',
  'disabled:cursor-not-allowed disabled:text-[var(--color-text-secondary)]',
]

// Simple Input - returns an actual <input> element
// For backwards compatibility with InputGroup, SidebarInput, etc.
function Input({
  className,
  type,
  inputSize,
  ...props
}: React.ComponentProps<'input'> & VariantProps<typeof inputVariants>) {
  return (
    <input
      type={type}
      data-slot="input"
      data-size={inputSize ?? 'default'}
      className={cn(inputVariants({ inputSize }), className)}
      {...props}
    />
  )
}

// InputField - enhanced input with label, icons, feedback
// For forms that need full field functionality
export interface InputFieldProps
  extends Omit<React.ComponentPropsWithoutRef<'input'>, 'className'> {
  /** Label text */
  label?: string
  /** Feedback message and type */
  feedback?: InputFeedback | string
  /** Error message (shorthand for feedback with error type) */
  errorMessage?: string
  /** Visual variant */
  variant?: 'primary' | 'secondary'
  /** Size variant. 'default' = 36px, 'xs' = 24px */
  inputSize?: 'default' | 'xs'
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
  /** Input element className */
  inputClassName?: string
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      label,
      feedback: feedbackProp,
      errorMessage,
      variant = 'primary',
      inputSize = 'default',
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
      inputClassName,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || React.useId()

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
        data-slot="input-field"
        className={cn(
          'flex w-full gap-1',
          labelPosition === 'top' ? 'flex-col' : 'flex-row items-center gap-3',
          className
        )}
      >
        {label && (
          <div className="flex items-center gap-0.5">
            <Label htmlFor={inputId} className="text-sm leading-5 text-[var(--color-text-secondary)] font-normal">
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
            inputSize === 'xs'
              ? cn('h-6 gap-2', variant === 'primary' && 'px-2') // 24px
              : 'h-9', // 36px
          )}
        >
          {LeftIcon && (
            <button
              type="button"
              onClick={onLeftIconClick}
              className="p-0 bg-transparent border-0 cursor-pointer flex items-center"
              disabled={disabled}
            >
              <LeftIcon className={cn(inputSize === 'xs' ? 'w-3.5 h-3.5' : 'w-4 h-4', 'text-[var(--color-icon-dark)]')} aria-hidden />
            </button>
          )}

          <input
            ref={ref}
            id={inputId}
            data-slot="input"
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            aria-invalid={isInvalid}
            className={cn(
              baseInputStyles,
              inputSize === 'xs' && '[font:var(--font-body-small-semibold)]',
              inputClassName,
            )}
            {...props}
          />

          {RightIcon && (
            <button
              type="button"
              onClick={onIconClick}
              className="p-0 bg-transparent border-0 cursor-pointer flex items-center"
              disabled={disabled}
            >
              <RightIcon className={cn(inputSize === 'xs' ? 'w-3.5 h-3.5' : 'w-4 h-4', 'text-[var(--color-icon-brand)]')} aria-hidden />
            </button>
          )}
        </div>

        {feedbackObject && (
          <div
            data-slot="input-feedback"
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

InputField.displayName = 'InputField'

export { Input, InputField, inputVariants, inputContainerVariants, baseInputStyles }
