// 类型定义

export interface ExtractedImage {
  id: string
  name: string
  blob: Blob
  url: string
  size: number
}

// Worker 消息类型
export type WorkerRequest = {
  type: 'extract'
  file: File
}

export type WorkerResponse =
  | { type: 'progress'; percent: number }
  | { type: 'image'; data: ArrayBuffer; name: string; mimeType: string }
  | { type: 'complete'; total: number }
  | { type: 'error'; message: string }

// 支持的文件类型
export type SupportedFileType = 'docx' | 'xlsx' | 'pptx' | 'key' | 'pages' | 'numbers'

export interface FileTypeInfo {
  extension: SupportedFileType
  mediaPaths: string[]
}
