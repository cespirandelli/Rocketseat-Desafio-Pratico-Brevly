function getFileName(url: string) {
  const segments = new URL(url).pathname.split('/').filter(Boolean)

  return segments.at(-1) ?? 'links.csv'
}

export async function downloadUrl(url: string) {
  const link = document.createElement('a')

  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }

    const blob = await response.blob()

    link.href = window.URL.createObjectURL(blob)
    link.download = getFileName(url)
  } catch {
    link.href = url
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
  }

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
