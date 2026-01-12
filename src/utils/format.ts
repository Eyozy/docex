// Shared formatting utilities

/**
 * Format file size to human-readable string
 */
export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * Get file extension in uppercase
 * @param filename - The filename to extract extension from
 * @param maxLength - Optional maximum length for the extension
 */
export function getExtension(filename: string, maxLength?: number): string {
  const ext = filename.split('.').pop()?.toUpperCase() || ''
  if (maxLength && ext.length > maxLength) {
    return ext.slice(0, maxLength)
  }
  return ext
}
