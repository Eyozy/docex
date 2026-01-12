// useTheme: 暗色模式管理（全局单例）

import { ref } from 'vue'

type Theme = 'light' | 'dark'

// Global state (singleton) - default to light mode
const theme = ref<Theme>('light')
const isDark = ref(false)
let initialized = false

function applyTheme(dark: boolean) {
  isDark.value = dark
  if (typeof document === 'undefined') return
  if (dark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

function setTheme(newTheme: Theme) {
  theme.value = newTheme
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('theme', newTheme)
  }
  applyTheme(newTheme === 'dark')
}

function toggleTheme() {
  setTheme(theme.value === 'light' ? 'dark' : 'light')
}

function isTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'dark'
}

function initTheme() {
  if (initialized || typeof window === 'undefined') return
  initialized = true

  // Read from local storage
  const stored = localStorage.getItem('theme')
  if (isTheme(stored)) {
    theme.value = stored
  }
  applyTheme(theme.value === 'dark')
}

// 立即初始化（浏览器环境）
if (typeof window !== 'undefined') {
  initTheme()
}

export function useTheme() {
  initTheme()

  return {
    theme,
    isDark,
    setTheme,
    toggleTheme
  }
}
