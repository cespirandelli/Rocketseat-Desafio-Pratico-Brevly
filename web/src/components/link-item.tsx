import { CopyIcon, TrashIcon } from '@phosphor-icons/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { LINKS_QUERY_KEY } from '@/hooks/use-links'
import { deleteLink } from '@/http/delete-link'
import type { Link } from '@/http/types'
import { formatAccessCount } from '@/utils/format-access-count'
import { getShortUrlHref, getShortUrlLabel } from '@/utils/short-url'
import { IconButton } from './ui/icon-button'

type LinkItemProps = {
  link: Link
}

function removeProtocol(url: string) {
  return url.replace(/^https?:\/\//i, '')
}

export function LinkItem({ link }: LinkItemProps) {
  const queryClient = useQueryClient()

  const shortUrlHref = getShortUrlHref(link.shortUrl)
  const shortUrlLabel = getShortUrlLabel(link.shortUrl)

  const { mutateAsync: deleteLinkFn, isPending: isDeleting } = useMutation({
    mutationFn: deleteLink,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: LINKS_QUERY_KEY })
    },
  })

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(shortUrlHref)

      toast.info('Link copiado com sucesso', {
        description: `O link ${link.shortUrl} foi copiado para a área de transferência.`,
      })
    } catch {
      toast.error('Não foi possível copiar o link')
    }
  }

  async function handleDeleteLink() {
    const confirmed = window.confirm(
      `Você realmente quer apagar o link ${link.shortUrl}?`
    )

    if (!confirmed) {
      return
    }

    try {
      await deleteLinkFn(link.id)
    } catch {
      toast.error('Erro ao apagar', {
        description: 'Não foi possível apagar o link. Tente novamente.',
      })
    }
  }

  return (
    <li
      className="flex items-center gap-4 border-gray-200 border-t py-3 data-[deleting=true]:opacity-50 sm:gap-5 sm:py-4"
      data-deleting={isDeleting}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <a
          href={shortUrlHref}
          target="_blank"
          rel="noreferrer"
          className="truncate font-semibold text-blue-base text-md hover:underline"
        >
          {shortUrlLabel}
        </a>
        <span className="truncate text-gray-500 text-sm">
          {removeProtocol(link.originalUrl)}
        </span>
      </div>

      <span className="shrink-0 text-gray-500 text-sm">
        {formatAccessCount(link.accessCount)}
      </span>

      <div className="flex shrink-0 items-center gap-1">
        <IconButton
          onClick={handleCopyLink}
          aria-label={`Copiar link ${shortUrlLabel}`}
          title="Copiar link"
        >
          <CopyIcon className="size-4" />
        </IconButton>

        <IconButton
          onClick={handleDeleteLink}
          disabled={isDeleting}
          aria-label={`Apagar link ${shortUrlLabel}`}
          title="Apagar link"
        >
          <TrashIcon className="size-4" />
        </IconButton>
      </div>
    </li>
  )
}
