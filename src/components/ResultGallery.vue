<template>
  <div class="flex flex-col gap-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <h3 class="text-xl sm:text-2xl font-semibold text-surface-900 dark:text-white">
          {{ t('gallery.title') }}
        </h3>
        <span class="px-2.5 py-0.5 rounded-full bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 text-sm font-medium">
          {{ images.length }}
        </span>
      </div>

      <div class="flex items-center gap-2">
        <!-- Clear Button -->
        <button
          v-if="images.length > 0"
          @click="emit('clear')"
          class="btn-ghost flex items-center gap-2 cursor-pointer text-sm"
        >
          <span class="material-symbols-outlined text-lg">delete_sweep</span>
          <span class="hidden sm:inline">{{ t('gallery.clear') }}</span>
        </button>

        <!-- Download All Button -->
        <button
          v-if="images.length > 0"
          @click="handleDownloadAll"
          :disabled="isDownloading"
          class="btn-primary flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          <span
            class="material-symbols-outlined text-lg"
            :class="{ 'animate-spin': isDownloading }"
          >
            {{ isDownloading ? 'progress_activity' : 'download' }}
          </span>
          <span>
            {{ isDownloading ? t('gallery.downloading', { percent: downloadProgress }) : t('gallery.downloadAll') }}
          </span>
        </button>
      </div>
    </div>

    <!-- Gallery with Virtual Scroll -->
    <div
      v-if="images.length > 0"
      ref="containerRef"
      class="max-h-[800px] min-h-[300px] overflow-y-auto overflow-x-hidden rounded-3xl bg-surface-50 dark:bg-surface-900/50 border border-surface-200 dark:border-surface-800 p-4 sm:p-6 scrollbar-hide"
      @scroll="handleScroll"
    >
      <!-- Spacer for total height -->
      <div :style="{ height: `${totalHeight}px`, position: 'relative' }">
        <!-- Visible items container -->
        <div
          class="grid gap-4 pb-6"
          :class="gridColsClass"
          :style="{ transform: `translateY(${offsetTop}px)` }"
        >
          <ImageCard
            v-for="image in visibleItems"
            :key="image.id"
            :image="image"
            @download="handleDownloadSingle"
            @preview="emit('preview', $event)"
          />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="flex flex-col items-center justify-center py-20 rounded-3xl border border-dashed border-surface-200 dark:border-surface-700 bg-surface-50/50 dark:bg-surface-900/50"
    >
      <div class="w-16 h-16 rounded-2xl bg-surface-100 dark:bg-surface-800 text-surface-400 dark:text-surface-500 flex items-center justify-center mb-4">
        <span class="material-symbols-outlined text-3xl">image</span>
      </div>
      <p class="text-surface-500 dark:text-surface-400 font-medium">
        {{ t('gallery.empty') }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ExtractedImage } from '@/types'
import { useVirtualScroll } from '@/composables/useVirtualScroll'
import { downloadImage, downloadAllAsZip } from '@/utils/download'
import ImageCard from './ImageCard.vue'

const props = defineProps<{
  images: ExtractedImage[]
}>()

const emit = defineEmits<{
  (e: 'clear'): void
  (e: 'preview', image: ExtractedImage): void
}>()

const { t } = useI18n()

const containerRef = ref<HTMLElement | null>(null)
const isDownloading = ref(false)
const downloadProgress = ref(0)

// Responsive columns
const columns = ref(4)

function updateColumns() {
  const width = window.innerWidth
  if (width < 640) {
    columns.value = 2
  } else if (width < 1024) {
    columns.value = 3
  } else {
    columns.value = 4
  }
}

onMounted(() => {
  updateColumns()
  window.addEventListener('resize', updateColumns)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateColumns)
})

const gridColsClass = computed(() => {
  return {
    'grid-cols-2': columns.value === 2,
    'grid-cols-3': columns.value === 3,
    'grid-cols-4': columns.value === 4
  }
})

// Virtual scroll
const imagesRef = computed(() => props.images)
const { visibleItems, totalHeight, offsetTop, handleScroll } = useVirtualScroll({
  containerRef,
  items: imagesRef,
  itemHeight: 200,
  columns
})

// Download single
function handleDownloadSingle(image: ExtractedImage) {
  downloadImage(image)
}

// Download all
async function handleDownloadAll() {
  isDownloading.value = true
  downloadProgress.value = 0

  try {
    await downloadAllAsZip(props.images, (percent) => {
      downloadProgress.value = percent
    })
  } finally {
    isDownloading.value = false
    downloadProgress.value = 0
  }
}
</script>