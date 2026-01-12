<template>
  <div
    class="group relative rounded-2xl overflow-hidden card card-hover aspect-square cursor-pointer"
    @click="emit('preview', image)"
  >
    <!-- Image -->
    <img
      :src="image.url"
      :alt="image.name"
      class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      loading="lazy"
    />

    <!-- Hover overlay -->
    <div class="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-3">
      
      <!-- Action buttons -->
      <div class="flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200">
        <!-- Preview button -->
        <button
          @click.stop="emit('preview', image)"
          class="w-10 h-10 rounded-full bg-white text-surface-900 flex items-center justify-center hover:bg-surface-100 hover:scale-110 transition-all duration-200 shadow-lg"
          :title="t('card.preview')"
        >
          <span class="material-symbols-outlined text-xl">visibility</span>
        </button>

        <!-- Download button -->
        <button
          @click.stop="emit('download', image)"
          class="h-10 px-4 rounded-full bg-primary-600 text-white flex items-center gap-2 font-medium hover:bg-primary-500 hover:scale-105 transition-all duration-200 shadow-lg"
          :title="t('card.download')"
        >
          <span class="material-symbols-outlined text-xl">download</span>
          <span class="text-xs">{{ formatSize(image.size) }}</span>
        </button>
      </div>
    </div>

    <!-- File type badge -->
    <div class="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-md text-white/90 text-[10px] font-bold tracking-wider uppercase">
      {{ getExtension(image.name, 4) }}
    </div>

    <!-- File name (always visible at bottom) -->
    <div class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
      <p class="text-white text-xs font-medium truncate">
        {{ image.name }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { ExtractedImage } from '@/types'
import { formatSize, getExtension } from '@/utils/format'

defineProps<{
  image: ExtractedImage
}>()

const emit = defineEmits<{
  (e: 'download', image: ExtractedImage): void
  (e: 'preview', image: ExtractedImage): void
}>()

const { t } = useI18n()
</script>