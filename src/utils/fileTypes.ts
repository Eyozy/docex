import type { FileTypeInfo, SupportedFileType } from '@/types'

const FILE_TYPE_CONFIG: Record<SupportedFileType, string[]> = {
  docx: ['word/media/'],
  xlsx: ['xl/media/'],
  pptx: ['ppt/media/'],
  key: ['Data/', 'Images/'],
  pages: ['Data/', 'Images/'],
  numbers: ['Data/', 'Images/'],
  epub: ['OEBPS/images/', 'EPUB/images/', 'images/', 'Images/', 'OPS/images/'],
  mobi: [],
  azw3: []
}

const IMAGE_MIME_TYPES: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  bmp: 'image/bmp',
  webp: 'image/webp',
  tiff: 'image/tiff',
  tif: 'image/tiff',
  svg: 'image/svg+xml',
  emf: 'image/emf',
  wmf: 'image/wmf'
}

const IMAGE_MAGIC_NUMBERS: Array<{ bytes: number[]; type: string }> = [
  { bytes: [0x89, 0x50, 0x4E, 0x47], type: 'image/png' },
  { bytes: [0xFF, 0xD8, 0xFF], type: 'image/jpeg' },
  { bytes: [0x47, 0x49, 0x46, 0x38], type: 'image/gif' },
  { bytes: [0x42, 0x4D], type: 'image/bmp' },
  { bytes: [0x52, 0x49, 0x46, 0x46], type: 'image/webp' }
]

export function getFileTypeInfo(filename: string): FileTypeInfo | null {
  const ext = filename.split('.').pop()?.toLowerCase() as SupportedFileType
  const mediaPaths = FILE_TYPE_CONFIG[ext]

  if (!mediaPaths) return null

  return { extension: ext, mediaPaths }
}

export function isImagePath(path: string): boolean {
  const ext = path.split('.').pop()?.toLowerCase() || ''
  return ext in IMAGE_MIME_TYPES
}

export function getMimeTypeByExtension(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase() || ''
  return IMAGE_MIME_TYPES[ext] || 'application/octet-stream'
}

export function detectImageTypeByMagicNumber(buffer: ArrayBuffer): string | null {
  const bytes = new Uint8Array(buffer.slice(0, 12))

  for (const magic of IMAGE_MAGIC_NUMBERS) {
    let match = true
    for (let i = 0; i < magic.bytes.length; i++) {
      if (bytes[i] !== magic.bytes[i]) {
        match = false
        break
      }
    }
    if (match) {
      if (magic.type === 'image/webp') {
        const webpMarker = new TextDecoder().decode(bytes.slice(8, 12))
        if (webpMarker !== 'WEBP') continue
      }
      return magic.type
    }
  }

  return null
}

export function isInMediaDirectory(path: string, mediaPaths: string[]): boolean {
  return mediaPaths.some(mediaPath => path.startsWith(mediaPath))
}
