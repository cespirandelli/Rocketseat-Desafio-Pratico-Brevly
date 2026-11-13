import type { ComponentProps } from 'react'

export function LogoIcon(props: ComponentProps<'svg'>) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <g stroke="currentColor" strokeWidth={4}>
        <rect
          x={3.9}
          y={9.6}
          width={15}
          height={21}
          rx={7.5}
          transform="rotate(-45 3.9 9.6)"
        />
        <rect
          x={9.8}
          y={11.6}
          width={15}
          height={21}
          rx={7.5}
          transform="rotate(-45 9.8 11.6)"
        />
      </g>
    </svg>
  )
}
