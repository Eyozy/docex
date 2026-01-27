<template>
  <div class="group relative rounded-xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 aspect-square cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-zinc-200/50 dark:hover:shadow-zinc-900/50">
    <img
      :src="image.url"
      :alt="image.name"
      class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      loading="lazy"
    />

    <div class="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-md text-white/90 text-[10px] font-bold tracking-wider uppercase z-10">
      {{ getExtension(image.name, 4) }}
    </div>

    <div class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-10">
      <p class="text-white text-xs font-medium truncate">
        {{ image.name }}
      </p>
    </div>

    <div class="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-3 md:flex sm:hidden">
      <div class="flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200">
        <button
          @click.stop="emit('preview', image)"
          class="w-10 h-10 rounded-full bg-white text-zinc-900 flex items-center justify-center hover:bg-zinc-100 hover:scale-110 transition-all duration-200 shadow-lg"
          :title="t('card.preview')"
        >
          <span class="material-symbols-outlined text-xl">visibility</span>
        </button>

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

    <div class="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 via-black/70 to-transparent sm:flex md:hidden z-20">
      <div class="flex items-center justify-center gap-2">
        <button
          @click.stop="emit('preview', image)"
          class="w-9 h-9 rounded-full bg-white/90 text-zinc-900 flex items-center justify-center hover:bg-white transition-all duration-200 shadow-md"
          :title="t('card.preview')"
        >
          <span class="material-symbols-outlined text-lg">visibility</span>
        </button>

        <button
          @click.stop="emit('download', image)"
          class="flex-1 h-9 rounded-full bg-primary-600 text-white flex items-center justify-center gap-1.5 font-medium hover:bg-primary-700 transition-all duration-200 shadow-md"
          :title="t('card.download')"
        >
          <span class="material-symbols-outlined text-lg">download</span>
          <span class="text-xs">{{ formatSize(image.size) }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ExtractedImage } from '@/types'
import { formatSize, getExtension } from '@/utils/format'

const props = defineProps<{
  image: ExtractedImage
}>()

const emit = defineEmits<{
  (e: 'download', image: ExtractedImage): void
  (e: 'preview', image: ExtractedImage): void
}>()

const { t } = useI18n()

// 组件卸载时释放 Blob URL 防止内存泄漏
onUnmounted(() => {
  if (props.image.url && props.image.url.startsWith('blob:')) {
    URL.revokeObjectURL(props.image.url)
  }
})
</script>
