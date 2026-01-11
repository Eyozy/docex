// 下载工具函数

import type { ExtractedImage } from '@/types'

/**
 * 单张图片下载
 */
export function downloadImage(image: ExtractedImage) {
  const a = document.createElement('a')
  a.href = image.url
  a.download = image.name
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

/**
 * 批量打包下载
 */
export async function downloadAllAsZip(
  images: ExtractedImage[],
  onProgress?: (percent: number) => void
): Promise<void> {
  if (images.length === 0) return

  // 动态导入 JSZip 减少初始包体积
  const JSZip = (await import('jszip')).default
  const zip = new JSZip()

  // 添加所有图片到 ZIP
  const folder = zip.folder('images')
  if (!folder) return

  // 处理重名文件
  const nameCount = new Map<string, number>()

  images.forEach((img, index) => {
    let name = img.name

    // 处理重名
    const count = nameCount.get(name) || 0
    if (count > 0) {
      const ext = name.split('.').pop() || ''
      const baseName = name.slice(0, -(ext.length + 1))
      name = `${baseName}_${count}.${ext}`
    }
    nameCount.set(img.name, count + 1)

    folder.file(name, img.blob)

    // 添加阶段进度 (0-50%)
    onProgress?.(Math.round(((index + 1) / images.length) * 50))
  })

  // 生成 ZIP 文件
  const content = await zip.generateAsync(
    { type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } },
    (meta) => {
      // 压缩阶段进度 (50-100%)
      onProgress?.(50 + Math.round(meta.percent / 2))
    }
  )

  // 触发下载
  const url = URL.createObjectURL(content)
  const a = document.createElement('a')
  a.href = url
  a.download = `extracted-images-${Date.now()}.zip`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)

  // 释放内存
  URL.revokeObjectURL(url)
}
