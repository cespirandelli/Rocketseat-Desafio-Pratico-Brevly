import {
  CircleNotchIcon,
  DownloadSimpleIcon,
  LinkIcon,
} from '@phosphor-icons/react'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'
import { useLinks } from '@/hooks/use-links'
import { exportLinks } from '@/http/export-links'
import { downloadUrl } from '@/utils/download-url'
import { LinkItem } from './link-item'
import { Button } from './ui/button'
import { Card } from './ui/card'

type LinksListProps = {
  className?: string
}

export function LinksList({ className }: LinksListProps) {
  const {
    data: links,
    isLoading,
    isError,
    isFetching,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useLinks()

  const loadMoreRef = useRef<HTMLDivElement>(null)

  const { mutate: exportLinksFn, isPending: isExporting } = useMutation({
    mutationFn: exportLinks,
    onSuccess: async ({ reportUrl }) => {
      await downloadUrl(reportUrl)
    },
    onError: () => {
      toast.error('Erro ao exportar', {
        description: 'Não foi possível gerar o CSV. Tente novamente.',
      })
    },
  })

  useEffect(() => {
    const element = loadMoreRef.current

    if (!element || !hasNextPage) {
      return
    }

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !isFetchingNextPage) {
        fetchNextPage()
      }
    })

    observer.observe(element)

    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const hasLinks = Boolean(links && links.length > 0)

  return (
    <Card
      className={twMerge(
        'relative flex flex-col gap-4 overflow-hidden sm:gap-5',
        className
      )}
    >
      {isFetching && (
        <div
          role="progressbar"
          aria-label="Carregando links"
          className="absolute inset-x-0 top-0 h-1 overflow-hidden"
        >
          <div className="h-full w-2/5 animate-loading-bar bg-blue-base" />
        </div>
      )}

      <header className="flex items-center justify-between gap-4">
        <h2 className="font-bold text-gray-600 text-lg">Meus links</h2>

        <Button
          variant="secondary"
          onClick={() => exportLinksFn()}
          disabled={!hasLinks || isExporting}
        >
          {isExporting ? (
            <CircleNotchIcon className="size-4 animate-spin" />
          ) : (
            <DownloadSimpleIcon className="size-4" />
          )}
          Baixar CSV
        </Button>
      </header>

      {isLoading ? (
        <div className="flex flex-col items-center gap-3 border-gray-200 border-t pt-4 pb-6 text-gray-500">
          <CircleNotchIcon className="size-8 animate-spin text-gray-400" />
          <span className="text-xs uppercase">Carregando links...</span>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center gap-3 border-gray-200 border-t pt-4 pb-6 text-center text-gray-500">
          <span className="text-xs uppercase">
            Não foi possível carregar os links
          </span>
        </div>
      ) : hasLinks ? (
        <div className="scrollbar-thin -mr-3 max-h-[60vh] overflow-y-auto pr-3 lg:max-h-[calc(100dvh-16rem)]">
          <ul>
            {links?.map(link => (
              <LinkItem key={link.id} link={link} />
            ))}
          </ul>

          <div ref={loadMoreRef} className="flex justify-center">
            {isFetchingNextPage && (
              <CircleNotchIcon className="my-3 size-5 animate-spin text-gray-400" />
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 border-gray-200 border-t pt-4 pb-6 text-gray-500">
          <LinkIcon className="size-8 text-gray-400" />
          <span className="text-center text-xs uppercase">
            Ainda não existem links cadastrados
          </span>
        </div>
      )}
    </Card>
  )
}
