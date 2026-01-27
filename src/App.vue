<template>
  <div class="min-h-screen flex flex-col relative overflow-hidden bg-surface-50 dark:bg-surface-950 transition-colors duration-300">
    <div class="fixed inset-0 pointer-events-none opacity-40 dark:opacity-20">
      <div class="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] rounded-full bg-primary-200/30 dark:bg-primary-900/20 blur-[120px]"></div>
      <div class="absolute top-[20%] -right-[20%] w-[60%] h-[60%] rounded-full bg-primary-100/40 dark:bg-primary-800/20 blur-[100px]"></div>
    </div>

    <div class="relative z-10 flex flex-col min-h-screen">
      <AppHeader />

      <main class="flex-grow w-full max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 pt-24 pb-20">
        <div class="flex flex-col items-center text-center mb-8 sm:mb-12 max-w-2xl mx-auto animate-fade-in-up">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400 text-xs font-medium my-4">
            <span class="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse-subtle"></span>
            {{ t('hero.badge') }}
          </div>

          <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold text-surface-900 dark:text-white leading-[1.1] tracking-tight mb-6">
            {{ t('hero.title') }}
            <span class="text-primary-600 dark:text-primary-400">{{ t('hero.titleHighlight') }}</span>
          </h1>

          <p class="max-w-lg text-lg text-surface-500 dark:text-surface-400 leading-relaxed">
            {{ t('hero.description') }}
          </p>
        </div>

        <div class="max-w-3xl mx-auto mb-16 animate-fade-in-up" style="animation-delay: 100ms;">
          <DropZone
            :is-processing="isProcessing"
            @file-selected="handleFileSelected"
          />
        </div>

        <div v-if="isProcessing || progress > 0" class="max-w-2xl mx-auto mb-12 animate-fade-in">
          <ProgressBar
            :percent="progress"
            :show="isProcessing || progress > 0"
          />
        </div>

        <transition
          enter-active-class="transition ease-out duration-300"
          enter-from-class="opacity-0 translate-y-2 scale-95"
          enter-to-class="opacity-100 translate-y-0 scale-100"
          leave-active-class="transition ease-in duration-200"
          leave-from-class="opacity-100 translate-y-0 scale-100"
          leave-to-class="opacity-0 translate-y-2 scale-95"
        >
          <div
            v-if="error"
            class="max-w-2xl mx-auto mb-12 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm flex items-center gap-3"
          >
            <span class="material-symbols-outlined text-xl">error</span>
            {{ error }}
          </div>
        </transition>

        <div v-if="images.length > 0" class="mb-24 animate-fade-in-up">
          <ResultGallery
            :images="images"
            @clear="clearImages"
            @preview="openPreview"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto pt-20 border-t border-surface-200 dark:border-surface-800">
          <div
            v-for="(feature, index) in features"
            :key="feature.icon"
            class="group p-4 rounded-2xl hover:bg-surface-100 dark:hover:bg-surface-900 transition-all duration-300 ease-out text-center sm:text-left animate-fade-in-up hover:scale-[1.02] hover:shadow-lg hover:shadow-surface-200/50 dark:hover:shadow-surface-900/50"
            :style="{ animationDelay: `${(index + 2) * 100}ms` }"
          >
            <div class="w-12 h-12 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-900 dark:text-white flex items-center justify-center mx-auto sm:mx-0 mb-4 transition-all duration-300 ease-out group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 group-hover:scale-110">
              <span class="material-symbols-outlined text-2xl transition-colors duration-300 group-hover:text-primary-600 dark:group-hover:text-primary-400">{{ feature.icon }}</span>
            </div>
            <h3 class="text-lg font-semibold text-surface-900 dark:text-white mb-2 transition-colors duration-300 group-hover:text-primary-600 dark:group-hover:text-primary-400">
              {{ t(feature.titleKey) }}
            </h3>
            <p class="text-surface-500 dark:text-surface-400 text-sm leading-relaxed transition-colors duration-300">
              {{ t(feature.descKey) }}
            </p>
          </div>
        </div>
      </main>

      <footer class="py-8 mt-auto border-t border-surface-200 dark:border-surface-800">
        <div class="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 text-sm text-surface-400 dark:text-surface-500">
          <div class="hidden sm:flex w-full items-center justify-between">
            <span>
              {{ t('footer.copyright') }}
              <span class="mx-1.5">•</span>
              <span class="text-surface-600 dark:text-surface-400">{{ t('header.title') }}</span>
            </span>
            <span>
              {{ t('footer.inspired') }}
              <a
                href="https://meta.appinn.net/t/topic/79962"
                target="_blank"
                rel="noopener noreferrer"
                class="link-underline text-surface-500 dark:text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >{{ t('footer.appinn') }}</a>
            </span>
          </div>

          <div class="flex sm:hidden flex-col items-center gap-2 text-center">
            <span>
              {{ t('footer.copyright') }}
              <span class="mx-1.5">•</span>
              <span class="text-surface-600 dark:text-surface-400">{{ t('header.title') }}</span>
            </span>
            <span>
              {{ t('footer.inspired') }}
              <a
                href="https://meta.appinn.net/t/topic/79962"
                target="_blank"
                rel="noopener noreferrer"
                class="link-underline text-surface-500 dark:text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >{{ t('footer.appinn') }}</a>
            </span>
          </div>
        </div>
      </footer>
    </div>

    <ImagePreview
      :is-open="isPreviewOpen"
      :image="previewImage"
      @close="closePreview"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useExtractor } from '@/composables/useExtractor'
import type { ExtractedImage } from '@/types'
import AppHeader from '@/components/AppHeader.vue'
import DropZone from '@/components/DropZone.vue'
import ProgressBar from '@/components/ProgressBar.vue'
import ResultGallery from '@/components/ResultGallery.vue'
import ImagePreview from '@/components/ImagePreview.vue'

const { t } = useI18n()
const { images, isProcessing, progress, extractFromFile, clearImages } = useExtractor()

const previewImage = ref<ExtractedImage | null>(null)
const isPreviewOpen = ref(false)
const error = ref<string | null>(null)

const features = [
  { icon: 'shield', titleKey: 'features.privacy.title', descKey: 'features.privacy.description' },
  { icon: 'auto_awesome', titleKey: 'features.quality.title', descKey: 'features.quality.description' },
  { icon: 'bolt', titleKey: 'features.speed.title', descKey: 'features.speed.description' },
]

function handleFileSelected(file: File) {
  error.value = null
  extractFromFile(file)
}

function openPreview(image: ExtractedImage) {
  previewImage.value = image
  isPreviewOpen.value = true
}

function closePreview() {
  isPreviewOpen.value = false
  setTimeout(() => {
    previewImage.value = null
  }, 300)
}
</script>
