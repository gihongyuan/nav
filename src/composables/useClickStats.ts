import { ref } from 'vue'

/**
 * 书签点击次数统计 —— 持久化于浏览器 localStorage
 *
 * - 仅在模块首次被引用时读取一次 storage，之后所有调用方共享同一个响应式 map，
 *   避免每个组件各自反复解析 JSON、各自维护一份计数。
 * - `recordClick` 直接落盘；解析/写入失败（隐私模式、配额、损坏 JSON）静默降级，
 *   保证书签跳转始终能正常进行，绝不因统计阻塞主流程。
 * - `getClickCount` 返回原始计数；排序逻辑由调用方负责。
 */

const STORAGE_KEY = 'nav:click-stats'

type ClickStats = Record<string, number>

/** 响应式计数映射 —— 排序需要它，所以 store 的 computed 会依赖此 ref */
const stats = ref<ClickStats>(loadStats())

function loadStats(): ClickStats {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object') return {}
    const out: ClickStats = {}
    for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof v === 'number' && Number.isFinite(v) && v > 0) out[k] = v
    }
    return out
  } catch {
    return {}
  }
}

function persist(snapshot: ClickStats) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot))
  } catch {
    // 配额超限/隐私模式：放弃持久化，内存态依然可用
  }
}

export function useClickStats() {
  function recordClick(url: string) {
    if (!url) return
    const next = { ...stats.value, [url]: (stats.value[url] ?? 0) + 1 }
    stats.value = next
    persist(next)
  }

  function getClickCount(url: string): number {
    return stats.value[url] ?? 0
  }

  return { stats, recordClick, getClickCount }
}
