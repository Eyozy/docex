const MOBI_MAGIC = new Uint8Array([0x42, 0x4F, 0x4F, 0x4B, 0x4D, 0x4F, 0x42, 0x49])

const DRM_SIGNATURES = [
  new Uint8Array([0x54, 0x54, 0x4C, 0x6C]),
]

const MAX_IMAGES = 1000

export function detectMobiDRM(buffer: ArrayBuffer): boolean {
  const view = new Uint8Array(buffer)

  if (!checkMagic(view, MOBI_MAGIC)) {
    return false
  }

  const headerSize = Math.min(view.length, 1024)
  for (const signature of DRM_SIGNATURES) {
    for (let i = 0; i < headerSize - signature.length; i++) {
      if (checkMagic(view.subarray(i, i + signature.length), signature)) {
        return true
      }
    }
  }

  if (view.length > 16) {
    const encryptionType = view[12] | (view[13] << 8) | (view[14] << 16) | (view[15] << 24)
    if (encryptionType !== 0) {
      return true
    }
  }

  return false
}

export function detectAZW3DRM(buffer: ArrayBuffer): boolean {
  return detectMobiDRM(buffer)
}

export function parseMobiImages(buffer: ArrayBuffer): ArrayBuffer[] {
  const images: ArrayBuffer[] = []
  const view = new Uint8Array(buffer)

  const imageSignatures = [
    new Uint8Array([0xFF, 0xD8, 0xFF]),
    new Uint8Array([0x89, 0x50, 0x4E, 0x47]),
    new Uint8Array([0x47, 0x49, 0x46, 0x38]),
  ]

  for (let i = 0; i < view.length - 100 && images.length < MAX_IMAGES; i++) {
    for (const sig of imageSignatures) {
      if (checkMagic(view.subarray(i, i + sig.length), sig)) {
        const imageBuffer = extractImageAtOffset(buffer, i)
        if (imageBuffer && imageBuffer.byteLength > 1000) {
          images.push(imageBuffer)
          i += imageBuffer.byteLength
          break
        }
      }
    }
  }

  return images
}

export function parseAZW3Images(buffer: ArrayBuffer): ArrayBuffer[] {
  return parseMobiImages(buffer)
}

function checkMagic(data: Uint8Array, magic: Uint8Array): boolean {
  if (data.length < magic.length) return false
  for (let i = 0; i < magic.length; i++) {
    if (data[i] !== magic[i]) return false
  }
  return true
}

function extractImageAtOffset(buffer: ArrayBuffer, offset: number): ArrayBuffer | null {
  const view = new Uint8Array(buffer)
  const JPEG_SIG = new Uint8Array([0xFF, 0xD8, 0xFF])
  const PNG_SIG = new Uint8Array([0x89, 0x50, 0x4E, 0x47])
  const GIF_SIG = new Uint8Array([0x47, 0x49, 0x46, 0x38])

  if (checkMagic(view.subarray(offset, offset + 3), JPEG_SIG)) {
    return extractJpeg(buffer, offset)
  }
  if (checkMagic(view.subarray(offset, offset + 4), PNG_SIG)) {
    return extractPng(buffer, offset)
  }
  if (checkMagic(view.subarray(offset, offset + 4), GIF_SIG)) {
    return extractGif(buffer, offset)
  }

  return null
}

function extractJpeg(buffer: ArrayBuffer, offset: number): ArrayBuffer | null {
  const view = new Uint8Array(buffer)
  let endOffset = offset + 2

  while (endOffset < view.length - 1) {
    if (view[endOffset] === 0xFF && view[endOffset + 1] === 0xD9) {
      endOffset += 2
      return buffer.slice(offset, endOffset)
    }
    endOffset++
  }

  return null
}

function extractPng(buffer: ArrayBuffer, offset: number): ArrayBuffer | null {
  const view = new Uint8Array(buffer)
  const IEND_SIG = new Uint8Array([0x49, 0x45, 0x4E, 0x44])

  let pos = offset + 8

  while (pos < view.length - 12) {
    const chunkLength = (view[pos] << 24) | (view[pos + 1] << 16) | (view[pos + 2] << 8) | view[pos + 3]

    if (chunkLength > 100_000_000 || pos + 12 + chunkLength > view.length) {
      break
    }

    const chunkType = view.subarray(pos + 4, pos + 8)

    if (checkMagic(chunkType, IEND_SIG)) {
      return buffer.slice(offset, pos + 12)
    }

    pos += 12 + chunkLength
  }

  return null
}

function extractGif(buffer: ArrayBuffer, offset: number): ArrayBuffer | null {
  const view = new Uint8Array(buffer)

  if (offset + 10 >= view.length) return null

  let endOffset = offset + 6

  const packedField = view[offset + 10]
  const hasGlobalColorTable = (packedField & 0x80) !== 0
  const colorTableSize = hasGlobalColorTable ? 3 * (1 << ((packedField & 0x07) + 1)) : 0
  endOffset += colorTableSize

  while (endOffset < view.length) {
    if (view[endOffset] === 0x3B) {
      endOffset++
      return buffer.slice(offset, endOffset)
    }

    if (view[endOffset] === 0x21) {
      endOffset += 2
      while (endOffset < view.length && view[endOffset] !== 0x00) {
        const blockSize = view[endOffset]
        if (endOffset + 1 + blockSize >= view.length) break
        endOffset += 1 + blockSize
      }
      if (endOffset < view.length) endOffset++
    } else if (view[endOffset] === 0x2C) {
      endOffset += 10
      if (endOffset < view.length) {
        const imagePacked = view[endOffset]
        const hasLocalColorTable = (imagePacked & 0x80) !== 0
        const localColorTableSize = hasLocalColorTable ? 3 * (1 << ((imagePacked & 0x07) + 1)) : 0
        endOffset += localColorTableSize
        endOffset++
        while (endOffset < view.length && view[endOffset] !== 0x00) {
          const blockSize = view[endOffset]
          if (endOffset + 1 + blockSize >= view.length) break
          endOffset += 1 + blockSize
        }
        if (endOffset < view.length) endOffset++
      }
    } else {
      endOffset++
    }

    if (endOffset > view.length * 2) break
  }

  return null
}
