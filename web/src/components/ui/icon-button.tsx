import type { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

type IconButtonProps = ComponentProps<'button'>

export function IconButton({ className, ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      className={twMerge(
        'flex size-8 shrink-0 items-center justify-center rounded-sm border border-transparent bg-gray-200 text-gray-600 transition-colors hover:border-blue-base disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
}
