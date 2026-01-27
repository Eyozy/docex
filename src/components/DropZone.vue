<template>
  <div
    class="relative group w-full"
    @dragenter.prevent="handleDragEnter"
    @dragover.prevent="handleDragOver"
    @dragleave.prevent="handleDragLeave"
    @drop.prevent="handleDrop"
  >
    <div
      class="relative overflow-hidden transition-all duration-200 cursor-pointer rounded-xl border-2 border-dashed bg-white dark:bg-zinc-900"
      :class="[
        isDragging
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20'
          : 'border-zinc-200 dark:border-zinc-800 hover:border-primary-400 dark:hover:border-primary-600 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
      ]"
      @click="!isProcessing && triggerFileInput()"
    >
      <div class="relative z-10 flex flex-col items-center justify-center gap-6 px-6 py-12 sm:py-16 text-center">
        <div
          class="w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-200"
          :class="[
            isDragging || isProcessing
              ? 'bg-primary-100 text-primary-600 dark:bg-primary-950/30 dark:text-primary-400 scale-110'
              : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 group-hover:scale-110 group-hover:text-primary-600 dark:group-hover:text-primary-400'
          ]"
        >
          <span
            class="material-symbols-outlined text-4xl"
            :class="{ 'animate-spin': isProcessing }"
          >
            {{ isProcessing ? 'progress_activity' : (isDragging ? 'file_download' : 'cloud_upload') }}
          </span>
        </div>

        <div class="max-w-md space-y-2">
          <h3 class="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            {{ isProcessing ? t('dropzone.processing') : (isDragging ? t('dropzone.drop') : t('dropzone.title')) }}
          </h3>
          <p v-if="!isProcessing" class="text-zinc-500 dark:text-zinc-400 text-sm">
            {{ t('dropzone.description') }}
          </p>
        </div>

        <button
          @click.stop="triggerFileInput"
          :disabled="isProcessing"
          class="btn-primary flex items-center gap-2 mt-2"
        >
          <span class="material-symbols-outlined">
            {{ isProcessing ? 'hourglass_top' : 'upload_file' }}
          </span>
          <span>{{ t('dropzone.button') }}</span>
        </button>

        <div v-if="!isProcessing" class="flex flex-wrap items-center justify-center gap-1.5 mt-3 opacity-50 hover:opacity-100 transition-opacity">
          <span
            v-for="format in FORMATS"
            :key="format"
            class="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800"
          >
            {{ format }}
          </span>
        </div>
      </div>

      <input
        ref="fileInputRef"
        type="file"
        class="hidden"
        :accept="ACCEPTED_TYPES"
        @change="handleFileSelect"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

defineProps<{
  isProcessing: boolean
}>()

const emit = defineEmits<{
  (e: 'file-selected', file: File): void
}>()

const { t } = useI18n()

const fileInputRef = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
let dragCounter = 0

const ACCEPTED_TYPES = '.docx,.xlsx,.pptx,.key,.pages,.numbers,.epub,.mobi,.azw3'
const SUPPORTED_EXTENSIONS = ['docx', 'xlsx', 'pptx', 'key', 'pages', 'numbers', 'epub', 'mobi', 'azw3']
const FORMATS = ['DOCX', 'XLSX', 'PPTX', 'KEY', 'PAGES', 'NUMBERS', 'EPUB', 'MOBI', 'AZW3']

function triggerFileInput() {
  fileInputRef.value?.click()
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    emit('file-selected', file)
  }
  if (target) target.value = ''
}

function handleDragEnter(e: DragEvent) {
  dragCounter++
  if (e.dataTransfer?.types.includes('Files')) {
    isDragging.value = true
  }
}

function handleDragOver() {
  // Drag over handled by preventDefault on the element
}

function handleDragLeave() {
  dragCounter--
  if (dragCounter === 0) {
    isDragging.value = false
  }
}

function handleDrop(e: DragEvent) {
  dragCounter = 0
  isDragging.value = false

  const file = e.dataTransfer?.files[0]
  if (file) {
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (ext && SUPPORTED_EXTENSIONS.includes(ext)) {
      emit('file-selected', file)
    }
  }
}
</script>
