import type { ComponentProps } from 'react'

export function NotFoundIllustration(props: ComponentProps<'svg'>) {
  return (
    <svg
      viewBox="0 0 194 85"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="404"
      {...props}
    >
      <defs>
        <clipPath id="not-found-glitch">
          <rect x="0" y="20" width="194" height="6" />
          <rect x="0" y="44" width="194" height="4" />
          <rect x="0" y="62" width="194" height="7" />
        </clipPath>
      </defs>

      <g
        fontFamily="'Open Sans', sans-serif"
        fontSize="96"
        fontWeight="800"
        textAnchor="middle"
      >
        <text x="97" y="78" fill="#2C46B1">
          404
        </text>
        <text
          x="91"
          y="78"
          fill="#B12C4D"
          opacity="0.85"
          clipPath="url(#not-found-glitch)"
        >
          404
        </text>
        <text x="103" y="78" fill="#2C4091" clipPath="url(#not-found-glitch)">
          404
        </text>
      </g>
    </svg>
  )
}
