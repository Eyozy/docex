<template>
  <div v-if="show" class="w-full animate-fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between mb-3 px-1">
      <div class="flex items-center gap-2">
        <span class="material-symbols-outlined text-primary-500 text-lg animate-spin">sync</span>
        <span class="text-sm font-medium text-surface-600 dark:text-surface-300">
          {{ t('progress.extracting') }}
        </span>
      </div>
      <span class="text-sm font-mono font-bold text-surface-900 dark:text-white tabular-nums">
        {{ percent }}%
      </span>
    </div>

    <!-- Progress bar container -->
    <div class="relative w-full h-2 rounded-full overflow-hidden bg-surface-200 dark:bg-surface-700">
      <!-- Progress fill -->
      <div
        class="h-full rounded-full bg-primary-500 transition-all duration-300 ease-out"
        :style="{ width: `${percent}%` }"
      ></div>
    </div>

    <!-- Status text -->
    <div class="mt-2 text-center">
      <span class="text-xs text-surface-500 dark:text-surface-400">
        {{ percent < 30 ? t('progress.reading') : percent < 70 ? t('progress.processing') : t('progress.finishing') }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineProps<{
  percent: number
  show: boolean
}>()

const { t } = useI18n()
</script>