// Web Worker: Document Image Extraction
// Runs in a separate thread to prevent blocking the main UI

import JSZip from 'jszip'

// File type configuration
const FILE_TYPE_CONFIG: Record<string, string[]> = {
  docx: ['word/media/'],
  xlsx: ['xl/media/'],
  pptx: ['ppt/media/'],
  // iWork formats: Images are typically in the 'Data' directory
  key: ['Data/'],
  pages: ['Data/'],
  numbers: ['Data/']
}

// Keywords to ignore (icons, placeholders, shapes, etc.)
const IGNORED_KEYWORDS = [
  'preview', 'thumbnail', 'icon', 'poster', 'shape',
  'blank', 'placeholder', 'template', 'mask', 'shadow',
  'gradient', 'pattern', 'tile', 'stroke', 'fill',
  'bullet', 'arrow', 'line', 'rect', 'oval', 'star',
  'callout', 'connector', 'brace', 'bracket', 'frame',
  'background', 'watermark', 'logo', 'badge', 'symbol'
]

// iWork system generated file patterns
const IWORK_SYSTEM_PATTERNS = [
  /^mt-[A-F0-9]{8}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{12}/i,  // mt-UUID (templates/thumbnails)
  /^st-[A-F0-9]{8}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{12}/i,  // st-UUID (slide thumbnails)
  /^[A-F0-9]{8}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{12}$/i,    // Pure UUID
  /^tile-/i,                    // tile- prefix
  /^sf-/i,                      // sf- system files
  /^_/,                         // Underscore prefix
  /^\./,                        // Dot prefix
  /dropshadow/i,
  /reflection/i,
  /^image-/i,                   // iWork generated image-xxx
  /-small-\d+\./i,              // Small thumbnails
  /^blankMoviePosterImage/i,
]

// Minimum image size threshold (bytes) to filter out UI elements
const MIN_IMAGE_SIZE = 10000  // 10KB

// Supported extensions
const IMAGE_EXTENSIONS = new Set([
  'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'tiff', 'tif', 'svg', 'emf', 'wmf'
])

// Magic numbers for accurate type detection
const IMAGE_MAGIC_NUMBERS: Array<{ bytes: number[]; type: string; ext: string }> = [
  { bytes: [0x89, 0x50, 0x4E, 0x47], type: 'image/png', ext: 'png' },
  { bytes: [0xFF, 0xD8, 0xFF], type: 'image/jpeg', ext: 'jpg' },
  { bytes: [0x47, 0x49, 0x46, 0x38], type: 'image/gif', ext: 'gif' },
  { bytes: [0x42, 0x4D], type: 'image/bmp', ext: 'bmp' },
]

/**
 * Detect image type via magic numbers
 */
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

  // Check for WEBP (RIFF....WEBP)
  if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46) {
    if (bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) {
      return { type: 'image/webp', ext: 'webp' }
    }
  }

  return null
}

/**
 * Check if file is an image based on extension
 */
function isImageFile(path: string): boolean {
  const ext = path.split('.').pop()?.toLowerCase() || ''
  return IMAGE_EXTENSIONS.has(ext)
}

/**
 * Get MIME type based on extension
 */
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

/**
 * Main extraction logic
 */
async function extractImages(file: File): Promise<void> {
  try {
    const ext = file.name.split('.').pop()?.toLowerCase() || ''
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
        // iWork specific filtering
        if (isIWork) {
            const fileName = path.split('/').pop() || '';
            const fileNameLower = fileName.toLowerCase();

            if (IGNORED_KEYWORDS.some(keyword => fileNameLower.includes(keyword))) {
                continue;
            }

            if (IWORK_SYSTEM_PATTERNS.some(pattern => pattern.test(fileName))) {
                continue;
            }

            if (fileNameLower.endsWith('.pdf')) {
                continue;
            }
        }
        imagePaths.push(path)
      }
    }

    let processed = 0
    const total = imagePaths.length

    for (const path of imagePaths) {
      const fileData = content.files[path]
      const buffer = await fileData.async('arraybuffer')

      // Filter small images (likely UI elements)
      if (isIWork && buffer.byteLength < MIN_IMAGE_SIZE) {
        processed++
        continue
      }

      let mimeType = ''
      let detectedExt = ''
      
      // 1. Try magic number detection
      const detected = detectImageType(buffer)
      if (detected) {
        mimeType = detected.type
        detectedExt = detected.ext
      } else {
        // 2. Fallback to extension
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
        }, [buffer]) // Transferable
      }

      processed++

      if (processed % 5 === 0 || processed === total) {
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
