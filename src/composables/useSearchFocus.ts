import { ref, computed, readonly } from 'vue'

const focused = ref(false)
const query = ref('')

/**
 * 搜索聚焦态 — 全局共享
 *
 * 跨组件协作（SearchBar 写入、HomeView/CategoryDock/壁纸读取）：
 * - `focused`：输入框是否聚焦；驱动壁纸模糊动画、dock 隐藏、卡片区切换
 * - `query`：搜索文本；驱动卡片区进入过滤模式、过滤结果由消费侧用 store.allLinks 派生
 * - `searching`：focused && query 非空，便于 UI 简单判定「过滤态」
 */
export function useSearchFocus() {
  function setFocused(v: boolean) {
    focused.value = v
  }
  function setQuery(v: string) {
    query.value = v
  }
  function reset() {
    query.value = ''
    focused.value = false
  }
  const trimmedQuery = computed(() => query.value.trim())
  const searching = computed(() => focused.value && trimmedQuery.value !== '')
  return {
    focused: readonly(focused),
    query,
    trimmedQuery,
    searching,
    setFocused,
    setQuery,
    reset,
  }
}