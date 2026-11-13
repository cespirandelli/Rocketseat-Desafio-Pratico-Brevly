import type { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

export function Card({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={twMerge('rounded-lg bg-gray-100 p-6 sm:p-8', className)}
      {...props}
    />
  )
}
