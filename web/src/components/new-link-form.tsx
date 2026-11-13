import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod'
import { LINKS_QUERY_KEY } from '@/hooks/use-links'
import { createLink } from '@/http/create-link'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Input } from './ui/input'

const INVALID_URL_MESSAGE = 'Informe uma url válida.'
const INVALID_SHORT_URL_MESSAGE =
  'Informe uma url sem espaço ou caractere especial.'

function withProtocol(url: string) {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`
}

const newLinkFormSchema = z.object({
  originalUrl: z
    .string()
    .trim()
    .min(1, INVALID_URL_MESSAGE)
    .transform(withProtocol)
    .pipe(
      z.url({
        protocol: /^https?$/,
        hostname: z.regexes.domain,
        error: INVALID_URL_MESSAGE,
      })
    ),
  shortUrl: z
    .string()
    .trim()
    .min(1, INVALID_SHORT_URL_MESSAGE)
    .max(64, 'O link encurtado deve ter no máximo 64 caracteres.')
    .regex(/^[a-zA-Z0-9_-]+$/, INVALID_SHORT_URL_MESSAGE),
})

type NewLinkFormInput = z.input<typeof newLinkFormSchema>
type NewLinkFormOutput = z.output<typeof newLinkFormSchema>

type NewLinkFormProps = {
  className?: string
}

export function NewLinkForm({ className }: NewLinkFormProps) {
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { errors },
  } = useForm<NewLinkFormInput, unknown, NewLinkFormOutput>({
    resolver: zodResolver(newLinkFormSchema),
    defaultValues: {
      originalUrl: '',
      shortUrl: '',
    },
  })

  const { mutateAsync: createLinkFn, isPending } = useMutation({
    mutationFn: createLink,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: LINKS_QUERY_KEY })
    },
  })

  async function handleCreateLink(data: NewLinkFormOutput) {
    try {
      await createLinkFn(data)

      reset()
      toast.success('Link criado com sucesso!')
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 409) {
        setError('shortUrl', { message: 'Essa URL encurtada já existe.' })
        toast.error('Erro no cadastro', {
          description: 'Essa URL encurtada já existe.',
        })
        return
      }

      toast.error('Erro no cadastro', {
        description: 'Não foi possível criar o link. Tente novamente.',
      })
    }
  }

  const [originalUrl, shortUrl] = watch(['originalUrl', 'shortUrl'])
  const isFormEmpty = !originalUrl?.trim() || !shortUrl?.trim()

  return (
    <Card className={twMerge('flex flex-col gap-5 sm:gap-6', className)}>
      <h2 className="font-bold text-gray-600 text-lg">Novo link</h2>

      <form
        onSubmit={handleSubmit(handleCreateLink)}
        className="flex flex-col gap-5 sm:gap-6"
        noValidate
      >
        <div className="flex flex-col gap-4">
          <Input
            label="Link original"
            placeholder="www.exemplo.com.br"
            autoComplete="off"
            inputMode="url"
            error={errors.originalUrl?.message}
            {...register('originalUrl')}
          />

          <Input
            label="Link encurtado"
            prefix="brev.ly/"
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            error={errors.shortUrl?.message}
            {...register('shortUrl')}
          />
        </div>

        <Button type="submit" disabled={isPending || isFormEmpty}>
          {isPending ? 'Salvando...' : 'Salvar link'}
        </Button>
      </form>
    </Card>
  )
}
