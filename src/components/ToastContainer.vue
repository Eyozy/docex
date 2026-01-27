<template>
  <div class="fixed top-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
    <transition-group
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 translate-x-8 scale-95"
      enter-to-class="opacity-100 translate-x-0 scale-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 translate-x-0 scale-100"
      leave-to-class="opacity-0 translate-x-8 scale-95"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto max-w-sm w-full sm:w-80 p-4 rounded-xl shadow-lg backdrop-blur-md border flex items-center gap-3"
        :class="toastClasses(toast.type)"
      >
        <span class="material-symbols-outlined text-xl flex-shrink-0">
          {{ toastIcon(toast.type) }}
        </span>
        <p class="text-sm flex-1 leading-relaxed">
          {{ toast.message }}
        </p>
        <button
          @click="removeToast(toast.id)"
          class="flex-shrink-0 p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
        >
          <span class="material-symbols-outlined text-lg opacity-60">close</span>
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast'

const { toasts, removeToast } = useToast()

function toastClasses(type: string) {
  const classes = {
    info: 'bg-blue-50/90 dark:bg-blue-900/80 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300',
    success: 'bg-green-50/90 dark:bg-green-900/80 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300',
    warning: 'bg-yellow-50/90 dark:bg-yellow-900/80 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300',
    error: 'bg-red-50/90 dark:bg-red-900/80 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300',
  }
  return classes[type as keyof typeof classes] || classes.info
}

function toastIcon(type: string) {
  const icons = {
    info: 'info',
    success: 'check_circle',
    warning: 'warning',
    error: 'error',
  }
  return icons[type as keyof typeof icons] || icons.info
}
</script>
