import { Link } from 'react-router'
import { LogoIcon } from './logo-icon'

export function Logo() {
  return (
    <Link
      to="/"
      aria-label="Página inicial do brev.ly"
      className="inline-flex items-center gap-1.5 text-blue-base"
    >
      <LogoIcon className="size-7" />
      <span className="font-bold text-2xl tracking-tight">brev.ly</span>
    </Link>
  )
}
