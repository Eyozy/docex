<template>
  <header class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md bg-white/70 dark:bg-surface-950/70 border-b border-surface-200/50 dark:border-surface-800/50">
    <div class="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 h-16 sm:h-20 flex items-center justify-between">
      
      <!-- Logo -->
      <div class="flex items-center gap-3 cursor-pointer group" @click="scrollToTop">
        <BrandLogo className="w-9 h-9 transition-transform duration-300 group-hover:scale-105" />
        <div class="flex flex-col">
          <h1 class="text-surface-900 dark:text-white font-bold text-xl leading-none tracking-tight">
            {{ t('header.title') }}
          </h1>
        </div>
      </div>

      <!-- Desktop Actions -->
      <div class="hidden md:flex items-center gap-2">
        <!-- Language Toggle -->
        <button
          @click="toggleLocale"
          class="flex items-center gap-2 px-3 py-2 rounded-lg text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors duration-200"
          :title="locale === 'zh-CN' ? 'Switch to English' : '切换到中文'"
        >
          <span class="material-symbols-outlined text-xl">translate</span>
          <span class="text-sm font-medium">{{ locale === 'zh-CN' ? 'EN' : '中文' }}</span>
        </button>

        <!-- Theme Toggle -->
        <button
          @click="toggleTheme"
          class="flex items-center justify-center w-10 h-10 rounded-lg text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors duration-200"
          :title="themeTitle"
        >
          <span class="material-symbols-outlined text-xl">
            {{ themeIcon }}
          </span>
        </button>

        <!-- Divider -->
        <div class="w-px h-6 bg-surface-200 dark:bg-surface-800 mx-2"></div>

        <!-- GitHub Link -->
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          class="btn-ghost flex items-center gap-2 px-3"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          <span class="text-sm font-medium">{{ t('header.github') }}</span>
        </a>
      </div>

      <!-- Mobile Menu Button -->
      <button
        @click="isMenuOpen = !isMenuOpen"
        class="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors duration-200"
      >
        <span class="material-symbols-outlined text-2xl">
          {{ isMenuOpen ? 'close' : 'menu' }}
        </span>
      </button>
    </div>

    <!-- Mobile Menu Dropdown -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="isMenuOpen"
        class="md:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-surface-950/95 backdrop-blur-xl border-b border-surface-200 dark:border-surface-800 shadow-lg"
      >
        <div class="flex flex-col p-4 gap-2">
          <!-- Language Toggle (Mobile) -->
          <button
            @click="toggleLocale"
            class="flex items-center justify-between w-full px-4 py-3 rounded-xl text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          >
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-xl">translate</span>
              <span class="font-medium">Language</span>
            </div>
            <span class="text-sm font-semibold bg-surface-100 dark:bg-surface-800 px-2 py-1 rounded">
              {{ locale === 'zh-CN' ? '中文' : 'English' }}
            </span>
          </button>

          <!-- Theme Toggle (Mobile) -->
          <button
            @click="toggleTheme"
            class="flex items-center justify-between w-full px-4 py-3 rounded-xl text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          >
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-xl">
                {{ theme === 'dark' ? 'dark_mode' : 'light_mode' }}
              </span>
              <span class="font-medium">{{ theme === 'dark' ? 'Dark Mode' : 'Light Mode' }}</span>
            </div>
            <span class="material-symbols-outlined text-surface-400">chevron_right</span>
          </button>

          <!-- Divider -->
          <div class="h-px bg-surface-100 dark:bg-surface-800 my-2"></div>

          <!-- GitHub Link (Mobile) -->
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <span class="font-medium">{{ t('header.github') }}</span>
          </a>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTheme } from '@/composables/useTheme'
import BrandLogo from '@/components/BrandLogo.vue'

const { t, locale } = useI18n()
const { theme, toggleTheme } = useTheme()

const isMenuOpen = ref(false)

function toggleLocale() {
  const newLocale = locale.value === 'zh-CN' ? 'en-US' : 'zh-CN'
  locale.value = newLocale
  localStorage.setItem('locale', newLocale)
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const themeIcon = computed(() => {
  return theme.value === 'dark' ? 'dark_mode' : 'light_mode'
})

const themeTitle = computed(() => {
  return theme.value === 'dark' ? 'Dark mode' : 'Light mode'
})
</script>
