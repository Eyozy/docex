import { ref, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from '@/composables/useToast'
import type { ExtractedImage, WorkerResponse } from '@/types'
import ExtractorWorker from '@/workers/extractor.worker?worker'

const DRM_WARNING_KEY = 'warning.drm'

export function useExtractor() {
  const { t } = useI18n()
  const { addToast } = useToast()

  const images = ref<ExtractedImage[]>([])
  const isProcessing = ref(false)
  const progress = ref(0)

  let worker: Worker | null = null

  function createWorker(): Worker {
    const w = new ExtractorWorker()

    w.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const data = event.data

      switch (data.type) {
        case 'progress':
          progress.value = data.percent
          break

        case 'image': {
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
        }

        case 'complete':
          isProcessing.value = false
          setTimeout(() => {
            progress.value = 0
          }, 500)
          if (images.value.length === 0) {
            addToast({
              message: t('warning.noImages'),
              type: 'info',
            })
          }
          break

        case 'error':
          addToast({
            message: data.message,
            type: 'error',
          })
          isProcessing.value = false
          break

        case 'warning': {
          const warningMessage = data.message === DRM_WARNING_KEY || data.message.includes('DRM detected')
            ? t('warning.drm')
            : data.message
          addToast({
            message: warningMessage,
            type: 'warning',
          })
          break
        }
      }
    }

    w.onerror = () => {
      addToast({
        message: 'Unknown error during extraction',
        type: 'error',
      })
      isProcessing.value = false
    }

    return w
  }

  function extractFromFile(file: File) {
    clearImages()
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
    extractFromFile,
    clearImages
  }
}
