import { WarningIcon } from '@phosphor-icons/react'
import { type ComponentProps, type ReactNode, useId } from 'react'
import { tv } from 'tailwind-variants'

const input = tv({
  slots: {
    root: 'group flex flex-col gap-2',
    label:
      'text-gray-500 text-xs uppercase transition-colors group-focus-within:font-bold group-focus-within:text-blue-base',
    field:
      'flex h-12 items-center rounded-lg border border-gray-300 px-4 text-md transition-colors focus-within:border-[1.5px] focus-within:border-blue-base',
    prefixText: 'select-none text-gray-400',
    control:
      'h-full w-full min-w-0 bg-transparent text-gray-600 outline-none placeholder:text-gray-400',
  },
  variants: {
    hasError: {
      true: {
        label:
          'font-bold text-danger group-focus-within:font-bold group-focus-within:text-danger',
        field: 'border-[1.5px] border-danger focus-within:border-danger',
      },
    },
  },
})

type InputProps = ComponentProps<'input'> & {
  label: string
  prefix?: string
  error?: string
}

export function Input({ label, prefix, error, id, ...props }: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = `${inputId}-error`

  const styles = input({ hasError: Boolean(error) })

  return (
    <div className={styles.root()}>
      <label htmlFor={inputId} className={styles.label()}>
        {label}
      </label>

      <div className={styles.field()}>
        {prefix && <span className={styles.prefixText()}>{prefix}</span>}
        <input
          id={inputId}
          className={styles.control()}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          {...props}
        />
      </div>

      {error && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  )
}

function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="flex items-center gap-2 text-gray-500 text-sm">
      <WarningIcon className="size-4 shrink-0 text-danger" />
      {children}
    </p>
  )
}
