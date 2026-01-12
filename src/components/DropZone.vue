<template>
  <div
    class="relative group w-full"
    @dragenter.prevent="handleDragEnter"
    @dragover.prevent="handleDragOver"
    @dragleave.prevent="handleDragLeave"
    @drop.prevent="handleDrop"
  >
    <!-- Main Drop Area -->
    <div
      class="relative overflow-hidden transition-all duration-300 cursor-pointer rounded-3xl border-2 border-dashed bg-white dark:bg-surface-900"
      :class="[
        isDragging
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10'
          : 'border-surface-300 dark:border-surface-700 hover:border-primary-400 dark:hover:border-primary-600 hover:bg-surface-50 dark:hover:bg-surface-800'
      ]"
      @click="!isProcessing && triggerFileInput()"
    >
      
      <!-- Content -->
      <div class="relative z-10 flex flex-col items-center justify-center gap-6 px-6 py-12 sm:py-16 text-center">
        <!-- Icon Circle -->
        <div 
            class="w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300"
            :class="[
                isDragging || isProcessing
                ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                : 'bg-surface-100 text-surface-500 dark:bg-surface-800 dark:text-surface-400 group-hover:scale-110 group-hover:text-primary-600 dark:group-hover:text-primary-400'
            ]"
        >
          <span
            class="material-symbols-outlined text-4xl"
            :class="{ 'animate-spin': isProcessing }"
          >
            {{ isProcessing ? 'progress_activity' : (isDragging ? 'file_download' : 'cloud_upload') }}
          </span>
        </div>

        <!-- Text Content -->
        <div class="max-w-md space-y-2">
          <h3 class="text-xl sm:text-2xl font-semibold text-surface-900 dark:text-white">
            {{ isProcessing ? t('dropzone.processing') : (isDragging ? t('dropzone.drop') : t('dropzone.title')) }}
          </h3>
          <!-- Description removed for minimalism -->
        </div>

        <!-- Button -->
        <button
          @click.stop="triggerFileInput"
          :disabled="isProcessing"
          class="btn-primary flex items-center gap-2 mt-2"
        >
          <span class="material-symbols-outlined text-xl">
            {{ isProcessing ? 'hourglass_top' : 'add_circle' }}
          </span>
          <span>{{ t('dropzone.button') }}</span>
        </button>

        <!-- Supported formats badge -->
        <div class="flex flex-wrap items-center justify-center gap-2 mt-4 opacity-60 hover:opacity-100 transition-opacity">
          <span
            v-for="format in formats"
            :key="format"
            class="px-2 py-1 rounded text-xs font-mono font-medium text-surface-500 dark:text-surface-400 bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700"
          >
            {{ format }}
          </span>
        </div>
      </div>

      <!-- Hidden file input -->
      <input
        ref="fileInputRef"
        type="file"
        class="hidden"
        :accept="acceptedTypes"
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
// Counter to handle nested element drag events, prevents false dragleave triggers
let dragCounter = 0

const acceptedTypes = '.docx,.xlsx,.pptx,.key,.pages,.numbers'
const formats = ['DOCX', 'XLSX', 'PPTX', 'KEY', 'PAGES', 'NUMBERS']
const SUPPORTED_EXTENSIONS = ['docx', 'xlsx', 'pptx', 'key', 'pages', 'numbers']

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

function handleDragOver(e: DragEvent) {
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = 'copy'
  }
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
    // Silently ignore unsupported files - user can use file picker for better feedback
  }
}
</script>