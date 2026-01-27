// useVirtualScroll: Virtual scroll logic

import { ref, computed, onMounted, onUnmounted, type Ref } from 'vue'

interface VirtualScrollOptions<T> {
  containerRef: Ref<HTMLElement | null>
  items: Ref<T[]>
  itemHeight: number
  columns: Ref<number>
  buffer?: number
}

let lastScrollTime = 0
const SCROLL_THROTTLE = 16

export function useVirtualScroll<T>(options: VirtualScrollOptions<T>) {
  const { containerRef, items, itemHeight, columns, buffer = 2 } = options

  const scrollTop = ref(0)
  const containerHeight = ref(0)

  const visibleRange = computed(() => {
    const startRow = Math.max(0, Math.floor(scrollTop.value / itemHeight) - buffer)
    const visibleRows = Math.ceil(containerHeight.value / itemHeight) + buffer * 2
    const endRow = startRow + visibleRows

    return {
      startRow,
      endRow,
      start: startRow * columns.value,
      end: Math.min((endRow + 1) * columns.value, items.value.length)
    }
  })

  const visibleItems = computed(() => {
    return items.value.slice(visibleRange.value.start, visibleRange.value.end)
  })

  const totalHeight = computed(() => {
    const totalRows = Math.ceil(items.value.length / columns.value)
    return totalRows * itemHeight
  })

  const offsetTop = computed(() => {
    return visibleRange.value.startRow * itemHeight
  })

  function handleScroll(e: Event) {
    const now = Date.now()
    if (now - lastScrollTime < SCROLL_THROTTLE) {
      return
    }
    lastScrollTime = now

    const target = e.target as HTMLElement
    scrollTop.value = target.scrollTop
  }

  let resizeTimeout: ReturnType<typeof setTimeout> | null = null
  function updateContainerHeight() {
    if (resizeTimeout) {
      clearTimeout(resizeTimeout)
    }
    resizeTimeout = setTimeout(() => {
      if (containerRef.value) {
        containerHeight.value = containerRef.value.clientHeight
      }
    }, 100)
  }

  let resizeObserver: ResizeObserver | null = null

  onMounted(() => {
    updateContainerHeight()

    if (containerRef.value) {
      resizeObserver = new ResizeObserver(updateContainerHeight)
      resizeObserver.observe(containerRef.value)
    }
  })

  onUnmounted(() => {
    if (resizeTimeout) {
      clearTimeout(resizeTimeout)
    }
    if (resizeObserver) {
      resizeObserver.disconnect()
    }
  })

  return {
    visibleItems,
    totalHeight,
    offsetTop,
    handleScroll
  }
}
