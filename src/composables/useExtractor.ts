// useExtractor: Core state management and Worker communication

import { ref, onUnmounted } from 'vue'
import type { ExtractedImage, WorkerResponse } from '@/types'
import ExtractorWorker from '@/workers/extractor.worker?worker'

export function useExtractor() {
  const images = ref<ExtractedImage[]>([])
  const isProcessing = ref(false)
  const progress = ref(0)
  const error = ref<string | null>(null)

  let worker: Worker | null = null

  function createWorker(): Worker {
    const w = new ExtractorWorker()

    w.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const data = event.data

      switch (data.type) {
        case 'progress':
          progress.value = data.percent
          break

        case 'image':
          const blob = new Blob([data.data], { type: data.mimeType })
          const url = URL.createObjectURL(blob)

          images.value.push({
            id: crypto.randomUUID(),
            name: data.name,
            blob,
            url,
            size: blob.size
          })
          break

        case 'complete':
          isProcessing.value = false
          // Delay clearing progress to let user see 100%
          setTimeout(() => {
            progress.value = 0
          }, 500)
          break

        case 'error':
          error.value = data.message
          isProcessing.value = false
          break
      }
    }

    w.onerror = (e) => {
      error.value = e.message || 'Unknown error during extraction'
      isProcessing.value = false
    }

    return w
  }

  function extractFromFile(file: File) {
    clearImages()
    error.value = null
    isProcessing.value = true
    progress.value = 0

    if (worker) {
      worker.terminate()
    }

    worker = createWorker()
    worker.postMessage({ type: 'extract', file })
  }

  function clearImages() {
    images.value.forEach(img => URL.revokeObjectURL(img.url))
    images.value = []
    progress.value = 0
    error.value = null
  }

  onUnmounted(() => {
    clearImages()
    if (worker) {
      worker.terminate()
      worker = null
    }
  })

  return {
    images,
    isProcessing,
    progress,
    error,
    extractFromFile,
    clearImages
  }
}
