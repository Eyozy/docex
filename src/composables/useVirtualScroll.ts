// useVirtualScroll: 虚拟滚动逻辑

import { ref, computed, onMounted, onUnmounted, type Ref } from 'vue'

interface VirtualScrollOptions<T> {
  containerRef: Ref<HTMLElement | null>
  items: Ref<T[]>
  itemHeight: number   // 单行高度（含间距）
  columns: Ref<number> // 列数
  buffer?: number      // 缓冲行数
}

export function useVirtualScroll<T>(options: VirtualScrollOptions<T>) {
  const { containerRef, items, itemHeight, columns, buffer = 2 } = options

  const scrollTop = ref(0)
  const containerHeight = ref(0)

  /**
   * 计算可视范围
   */
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

  /**
   * 可视区域内的项目
   */
  const visibleItems = computed(() => {
    return items.value.slice(visibleRange.value.start, visibleRange.value.end)
  })

  /**
   * 总高度（用于撑开滚动容器）
   */
  const totalHeight = computed(() => {
    const totalRows = Math.ceil(items.value.length / columns.value)
    return totalRows * itemHeight
  })

  /**
   * 顶部偏移量（定位可见元素）
   */
  const offsetTop = computed(() => {
    return visibleRange.value.startRow * itemHeight
  })

  /**
   * 处理滚动事件
   */
  function handleScroll(e: Event) {
    const target = e.target as HTMLElement
    scrollTop.value = target.scrollTop
  }

  /**
   * 更新容器高度
   */
  function updateContainerHeight() {
    if (containerRef.value) {
      containerHeight.value = containerRef.value.clientHeight
    }
  }

  let resizeObserver: ResizeObserver | null = null

  onMounted(() => {
    updateContainerHeight()

    // 监听容器大小变化
    if (containerRef.value) {
      resizeObserver = new ResizeObserver(updateContainerHeight)
      resizeObserver.observe(containerRef.value)
    }
  })

  onUnmounted(() => {
    if (resizeObserver) {
      resizeObserver.disconnect()
    }
  })

  return {
    visibleItems,
    totalHeight,
    offsetTop,
    handleScroll,
    visibleRange
  }
}
