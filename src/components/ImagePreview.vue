<template>
  <transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-sm"
      @click="close"
      @keydown.escape="close"
    >
      <!-- Main Content -->
      <div
        class="relative w-full max-w-6xl h-full flex flex-col items-center justify-center animate-scale-in"
        @click.stop
      >
        <!-- Header controls -->
        <div class="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4">
          <!-- Image info -->
          <h2 class="text-white/90 text-lg font-medium truncate max-w-[50%] drop-shadow-md">
            {{ image?.name }}
          </h2>

          <!-- Action buttons -->
          <div class="flex items-center gap-3">
            <!-- Download Button -->
            <button
              @click="download"
              class="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors duration-200 backdrop-blur-md border border-white/10"
              :title="t('preview.download')"
            >
              <span class="material-symbols-outlined text-xl">download</span>
              <span class="hidden sm:inline text-sm font-medium">{{ t('preview.download') }}</span>
            </button>

            <!-- Close Button -->
            <button
              @click="close"
              class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors duration-200 backdrop-blur-md border border-white/10"
              :title="t('preview.close')"
            >
              <span class="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>

        <!-- Image Container -->
        <div class="w-full h-full flex items-center justify-center overflow-hidden py-16">
          <img
            :src="image?.url"
            :alt="image?.name"
            class="relative max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
          />
        </div>

        <!-- Footer info -->
        <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 sm:gap-6 px-4 sm:px-6 py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white/70 text-sm whitespace-nowrap max-w-[90vw] overflow-hidden">
          <!-- File type -->
          <div class="flex items-center gap-2 flex-shrink-0">
            <span class="material-symbols-outlined text-lg">description</span>
            <span class="font-mono uppercase">{{ getExtension(image?.name || '') }}</span>
          </div>

          <!-- Divider -->
          <div class="w-px h-4 bg-white/20"></div>

          <!-- Size -->
          <div class="flex items-center gap-2 flex-shrink-0">
            <span class="material-symbols-outlined text-lg">storage</span>
            <span class="font-mono">{{ formatSize(image?.size || 0) }}</span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { ExtractedImage } from '@/types'
import { downloadImage } from '@/utils/download'
import { formatSize, getExtension } from '@/utils/format'

const props = defineProps<{
  isOpen: boolean
  image: ExtractedImage | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { t } = useI18n()

function close() {
  emit('close')
}

function download() {
  if (props.image) {
    downloadImage(props.image)
  }
}
</script>