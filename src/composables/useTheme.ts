import { ref, computed } from 'vue'

type Theme = 'light' | 'dark'

const isDark = ref(false)
let initialized = false

function applyTheme(dark: boolean) {
  isDark.value = dark
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('dark', dark)
}

function setTheme(newTheme: Theme) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('theme', newTheme)
  }
  applyTheme(newTheme === 'dark')
}

function toggleTheme() {
  setTheme(isDark.value ? 'light' : 'dark')
}

function initTheme() {
  if (initialized || typeof window === 'undefined') return
  initialized = true

  const stored = localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark') {
    applyTheme(stored === 'dark')
  }
}

if (typeof window !== 'undefined') {
  initTheme()
}

export function useTheme() {
  initTheme()

  return {
    theme: computed(() => isDark.value ? 'dark' : 'light'),
    isDark,
    setTheme,
    toggleTheme
  }
}
