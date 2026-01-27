export interface ExtractedImage {
  id: string
  name: string
  blob: Blob
  url: string
  size: number
}

export type WorkerRequest = {
  type: 'extract'
  file: File
}

export type WorkerResponse =
  | { type: 'progress'; percent: number }
  | { type: 'image'; data: ArrayBuffer; name: string; mimeType: string }
  | { type: 'complete'; total: number }
  | { type: 'error'; message: string }
  | { type: 'warning'; message: string }

export type SupportedFileType = 'docx' | 'xlsx' | 'pptx' | 'key' | 'pages' | 'numbers' | 'epub' | 'mobi' | 'azw3'

export interface FileTypeInfo {
  extension: SupportedFileType
  mediaPaths: string[]
}
