import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { useParams } from 'react-router'
import { LogoIcon } from '@/components/logo-icon'
import { Card } from '@/components/ui/card'
import { getLinkByShortUrl } from '@/http/get-link-by-short-url'
import { incrementLinkAccess } from '@/http/increment-link-access'
import { NotFound } from './not-found'

const SHORT_URL_REGEX = /^[a-zA-Z0-9_-]+$/

export function Redirect() {
  const { shortUrl = '' } = useParams<{ shortUrl: string }>()
  const isValidShortUrl = SHORT_URL_REGEX.test(shortUrl)

  const { data: link, isError } = useQuery({
    queryKey: ['link', shortUrl],
    queryFn: () => getLinkByShortUrl(shortUrl),
    enabled: isValidShortUrl,
    staleTime: Number.POSITIVE_INFINITY,
  })

  const hasRedirected = useRef(false)

  useEffect(() => {
    if (!link || hasRedirected.current) {
      return
    }

    hasRedirected.current = true

    incrementLinkAccess(link.id)
      .catch(() => null)
      .finally(() => {
        window.location.replace(link.originalUrl)
      })
  }, [link])

  if (!isValidShortUrl || isError) {
    return <NotFound />
  }

  return (
    <main className="flex min-h-dvh items-center justify-center px-3 py-8">
      <Card className="flex w-full max-w-[580px] flex-col items-center gap-6 px-5 py-12 text-center sm:px-12 sm:py-16">
        <LogoIcon className="size-12 text-blue-base" />

        <h1 className="font-bold text-gray-600 text-xl">Redirecionando...</h1>

        <div className="flex flex-col gap-1 font-semibold text-gray-500 text-md">
          <p>O link será aberto automaticamente em alguns instantes.</p>
          <p>
            Não foi redirecionado?{' '}
            {link ? (
              <a href={link.originalUrl} className="text-blue-base underline">
                Acesse aqui
              </a>
            ) : (
              <span className="text-gray-400">Acesse aqui</span>
            )}
          </p>
        </div>
      </Card>
    </main>
  )
}
