import JSZip from 'jszip'
import { detectMobiDRM, parseMobiImages, detectAZW3DRM, parseAZW3Images } from '@/utils/ebookParser'

const FILE_TYPE_CONFIG: Record<string, string[]> = {
  docx: ['word/media/'],
  xlsx: ['xl/media/'],
  pptx: ['ppt/media/'],
  key: ['Data/'],
  pages: ['Data/'],
  numbers: ['Data/'],
  epub: ['OEBPS/images/', 'EPUB/images/', 'images/', 'Images/', 'OPS/images/']
}

const IGNORED_KEYWORDS = [
  'preview', 'thumbnail', 'icon', 'poster', 'shape',
  'blank', 'placeholder', 'template', 'mask', 'shadow',
  'gradient', 'pattern', 'tile', 'stroke', 'fill',
  'bullet', 'arrow', 'line', 'rect', 'oval', 'star',
  'callout', 'connector', 'brace', 'bracket', 'frame',
  'background', 'watermark', 'logo', 'badge', 'symbol',
  'cover'
]

const IWORK_SYSTEM_PATTERNS = [
  /^mt-[A-F0-9]{8}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{12}/i,
  /^st-[A-F0-9]{8}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{12}/i,
  /^[A-F0-9]{8}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{12}$/i,
  /^tile-/i,
  /^sf-/i,
  /^_/,
  /^\./,
  /dropshadow/i,
  /reflection/i,
  /^image-/i,
  /-small-\d+\./i,
  /^blankMoviePosterImage/i,
]

const MIN_IMAGE_SIZE = 10000

const IMAGE_EXTENSIONS = new Set([
  'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'tiff', 'tif', 'svg', 'emf', 'wmf'
])

const IMAGE_MAGIC_NUMBERS: Array<{ bytes: number[]; type: string; ext: string }> = [
  { bytes: [0x89, 0x50, 0x4E, 0x47], type: 'image/png', ext: 'png' },
  { bytes: [0xFF, 0xD8, 0xFF], type: 'image/jpeg', ext: 'jpg' },
  { bytes: [0x47, 0x49, 0x46, 0x38], type: 'image/gif', ext: 'gif' },
  { bytes: [0x42, 0x4D], type: 'image/bmp', ext: 'bmp' },
]

function detectImageType(buffer: ArrayBuffer): { type: string; ext: string } | null {
  const bytes = new Uint8Array(buffer.slice(0, 12))

  for (const magic of IMAGE_MAGIC_NUMBERS) {
    let match = true
    for (let i = 0; i < magic.bytes.length; i++) {
      if (bytes[i] !== magic.bytes[i]) {
        match = false
        break
      }
    }
    if (match) return { type: magic.type, ext: magic.ext }
  }

  const isRIFF = bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46
  const isWEBP = bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  if (isRIFF && isWEBP) {
    return { type: 'image/webp', ext: 'webp' }
  }

  return null
}

function isImageFile(path: string): boolean {
  const ext = path.split('.').pop()?.toLowerCase() || ''
  return IMAGE_EXTENSIONS.has(ext)
}

function getMimeType(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase() || ''
  const mimeMap: Record<string, string> = {
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
  return mimeMap[ext] || 'application/octet-stream'
}

const MAX_FILE_SIZE = 200 * 1024 * 1024

async function extractImagesFromEbook(file: File, ext: string): Promise<void> {
  const buffer = await file.arrayBuffer()

  const detectDRM = ext === 'mobi' ? detectMobiDRM : detectAZW3DRM
  const parseImages = ext === 'mobi' ? parseMobiImages : parseAZW3Images

  if (detectDRM(buffer)) {
    self.postMessage({ type: 'warning', message: 'DRM detected. Please remove DRM before extracting images.' })
    return
  }

  const imageBuffers = parseImages(buffer)
  const total = imageBuffers.length
  let processed = 0

  for (const imgBuffer of imageBuffers) {
    const detected = detectImageType(imgBuffer)
    if (detected) {
      processed++
      self.postMessage({
        type: 'image',
        data: imgBuffer,
        name: `image_${processed}.${detected.ext}`,
        mimeType: detected.type
      }, [imgBuffer])
    }

    if (total > 0 && (processed % 5 === 0 || processed === total)) {
      self.postMessage({ type: 'progress', percent: Math.round((processed / total) * 100) })
    }
  }

  self.postMessage({ type: 'complete', total: processed })
}

async function extractImages(file: File): Promise<void> {
  try {
    if (file.size > MAX_FILE_SIZE) {
      self.postMessage({
        type: 'error',
        message: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`
      })
      return
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || ''

    if (ext === 'mobi' || ext === 'azw3') {
      await extractImagesFromEbook(file, ext)
      return
    }

    const mediaPaths = FILE_TYPE_CONFIG[ext]
    const isIWork = ['key', 'pages', 'numbers'].includes(ext)

    if (!mediaPaths) {
      self.postMessage({ type: 'error', message: `Unsupported file format: ${ext}` })
      return
    }

    const zip = new JSZip()
    const content = await zip.loadAsync(file)
    const allPaths = Object.keys(content.files)
    const imagePaths: string[] = []

    for (const path of allPaths) {
      if (content.files[path].dir) continue

      const inMediaDir = mediaPaths.some(mediaPath => path.startsWith(mediaPath))

      if (inMediaDir) {
        const fileName = path.split('/').pop() || ''
        const fileNameLower = fileName.toLowerCase()

        if (IGNORED_KEYWORDS.some(keyword => fileNameLower.includes(keyword))) {
          continue
        }

        if (isIWork && IWORK_SYSTEM_PATTERNS.some(pattern => pattern.test(fileName))) {
          continue
        }

        if (fileNameLower.endsWith('.pdf')) {
          continue
        }

        imagePaths.push(path)
      }
    }

    let processed = 0
    const total = imagePaths.length

    for (const path of imagePaths) {
      const fileData = content.files[path]
      const buffer = await fileData.async('arraybuffer')

      if (isIWork && buffer.byteLength < MIN_IMAGE_SIZE) {
        processed++
        continue
      }

      let mimeType = ''
      let detectedExt = ''

      const detected = detectImageType(buffer)
      if (detected) {
        mimeType = detected.type
        detectedExt = detected.ext
      } else {
        if (isImageFile(path)) {
          mimeType = getMimeType(path)
          detectedExt = path.split('.').pop()?.toLowerCase() || ''
        }
      }

      let fileName = path.split('/').pop() || `image_${processed}`

      if (detectedExt && !fileName.includes('.')) {
         fileName = `${fileName}.${detectedExt}`
      }

      if (mimeType && mimeType !== 'application/octet-stream') {
        self.postMessage({
          type: 'image',
          data: buffer,
          name: fileName,
          mimeType
        }, [buffer])
      }

      processed++

      if (total > 0 && (processed % 5 === 0 || processed === total)) {
        self.postMessage({
          type: 'progress',
          percent: Math.round((processed / total) * 100)
        })
      }
    }

    self.postMessage({
      type: 'complete',
      total: processed
    })

  } catch (error) {
    self.postMessage({
      type: 'error',
      message: error instanceof Error ? error.message : 'Error processing file'
    })
  }
}

self.onmessage = async (event: MessageEvent) => {
  const { type, file } = event.data

  if (type === 'extract' && file) {
    await extractImages(file)
  }
}
