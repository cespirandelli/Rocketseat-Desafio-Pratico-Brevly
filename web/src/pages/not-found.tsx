import { Link } from 'react-router'
import { NotFoundIllustration } from '@/components/not-found-illustration'
import { Card } from '@/components/ui/card'

export function NotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-3 py-8">
      <Card className="flex w-full max-w-[580px] flex-col items-center gap-6 px-5 py-12 text-center sm:px-12 sm:py-16">
        <NotFoundIllustration className="w-40 sm:w-48" />

        <h1 className="font-bold text-gray-600 text-xl">Link não encontrado</h1>

        <p className="font-semibold text-gray-500 text-md">
          O link que você está tentando acessar não existe, foi removido ou é
          uma URL inválida. Saiba mais em{' '}
          <Link to="/" className="text-blue-base underline">
            brev.ly
          </Link>
          .
        </p>
      </Card>
    </main>
  )
}
