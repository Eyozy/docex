// useTheme: 暗色模式管理（全局单例）

import { ref } from 'vue'

type Theme = 'light' | 'dark'

// 全局状态（单例）
const theme = ref<Theme>('dark')
const isDark = ref(true)
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

function initTheme() {
  if (initialized) return
  if (typeof window === 'undefined') return
  initialized = true

  // 从本地存储读取
  const stored = localStorage.getItem('theme') as Theme | null
  if (stored && ['light', 'dark'].includes(stored)) {
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
