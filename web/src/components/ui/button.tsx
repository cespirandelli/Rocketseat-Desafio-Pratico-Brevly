import type { ComponentProps } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

const button = tv({
  base: 'inline-flex items-center justify-center gap-1.5 transition-colors disabled:pointer-events-none disabled:opacity-50',

  variants: {
    variant: {
      primary:
        'h-12 w-full rounded-lg bg-blue-base px-5 font-semibold text-md text-white hover:bg-blue-dark',
      secondary:
        'h-8 shrink-0 rounded-sm border border-transparent bg-gray-200 px-2 font-semibold text-gray-500 text-sm hover:border-blue-base',
    },
  },

  defaultVariants: {
    variant: 'primary',
  },
})

type ButtonProps = ComponentProps<'button'> & VariantProps<typeof button>

export function Button({ variant, className, ...props }: ButtonProps) {
  return <button className={button({ variant, className })} {...props} />
}
