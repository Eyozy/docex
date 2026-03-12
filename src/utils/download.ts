// Download utility functions

import type { ExtractedImage } from '@/types'

export function downloadImage(image: ExtractedImage) {
  const a = document.createElement('a')
  a.href = image.url
  a.download = image.name
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

export async function downloadAllAsZip(
  images: ExtractedImage[],
  onProgress?: (percent: number) => void
): Promise<void> {
  if (images.length === 0) return

  const JSZip = (await import('jszip')).default
  const zip = new JSZip()
  const folder = zip.folder('images')
  if (!folder) return

  const nameCount = new Map<string, number>()

  images.forEach((img, index) => {
    const count = nameCount.get(img.name) || 0
    nameCount.set(img.name, count + 1)

    let name = img.name
    if (count > 0) {
      const dotIndex = name.lastIndexOf('.')
      const baseName = dotIndex > 0 ? name.slice(0, dotIndex) : name
      const ext = dotIndex > 0 ? name.slice(dotIndex) : ''
      name = `${baseName}_${count}${ext}`
    }

    folder.file(name, img.blob)
    onProgress?.(Math.round(((index + 1) / images.length) * 50))
  })

  const content = await zip.generateAsync(
    { type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } },
    (meta) => onProgress?.(50 + Math.round(meta.percent / 2))
  )

  const url = URL.createObjectURL(content)
  const a = document.createElement('a')
  a.href = url
  a.download = `extracted-images-${Date.now()}.zip`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
