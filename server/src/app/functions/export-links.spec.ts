import { randomUUID } from 'node:crypto'
import { describe, expect, it, vi } from 'vitest'
import { isRight, unwrapEither } from '@/infra/shared/either'
import * as upload from '@/infra/storage/upload-file-to-storage'
import { makeLink } from '@/test/factories/make-link'
import { exportLinks } from './export-links'

describe('export links', () => {
  it('should be able to export the links to a csv file', async () => {
    const uploadStub = vi
      .spyOn(upload, 'uploadFileToStorage')
      .mockImplementationOnce(async () => {
        return {
          key: `downloads/${randomUUID()}-links.csv`,
          url: 'http://example.com/links.csv',
        }
      })

    const link1 = await makeLink({ accessCount: 5 })
    const link2 = await makeLink({ accessCount: 2 })

    const sut = await exportLinks()

    const generatedCSVStream = uploadStub.mock.calls[0][0].contentStream
    const csvAsString = await new Promise<string>((resolve, reject) => {
      const chunks: Buffer[] = []

      generatedCSVStream.on('data', (chunk: Buffer) => {
        chunks.push(chunk)
      })

      generatedCSVStream.on('end', () => {
        resolve(Buffer.concat(chunks).toString('utf-8'))
      })

      generatedCSVStream.on('error', err => {
        reject(err)
      })
    })

    const csvAsArray = csvAsString
      .trim()
      .split('\n')
      .map(row => row.split(','))

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).reportUrl).toBe('http://example.com/links.csv')
    expect(csvAsArray[0]).toEqual([
      'URL original',
      'URL encurtada',
      'Contagem de acessos',
      'Data de criação',
    ])
    expect(csvAsArray).toEqual(
      expect.arrayContaining([
        [
          link1.originalUrl,
          `brev.ly/${link1.shortUrl}`,
          '5',
          link1.createdAt.toISOString(),
        ],
        [
          link2.originalUrl,
          `brev.ly/${link2.shortUrl}`,
          '2',
          link2.createdAt.toISOString(),
        ],
      ])
    )
  })
})
