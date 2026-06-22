import { ref, readonly } from 'vue'

const focused = ref(false)

/**
 * 搜索聚焦态 — 全局共享，驱动壁纸模糊动画
 */
export function useSearchFocus() {
  function setFocused(v: boolean) {
    focused.value = v
  }
  return {
    focused: readonly(focused),
    setFocused,
  }
}
