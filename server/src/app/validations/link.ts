import { z } from 'zod'

export const SHORT_URL_REGEX = /^[a-zA-Z0-9_-]+$/

export const originalUrlSchema = z.url({
  protocol: /^https?$/,
  hostname: z.regexes.domain,
  error: 'Informe uma URL válida.',
})

export const shortUrlSchema = z
  .string()
  .min(1, 'Informe o link encurtado.')
  .max(64, 'O link encurtado deve ter no máximo 64 caracteres.')
  .regex(
    SHORT_URL_REGEX,
    'Informe uma URL sem espaços ou caracteres especiais.'
  )
