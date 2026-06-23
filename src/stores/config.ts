import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { BookmarkCategory } from '@/types/config'
import { parseConfig, resolveIcon } from '@/utils'
import { useClickStats } from '@/composables/useClickStats'
// 编译期内联 settings.yaml（由 @rollup/plugin-yaml 处理）
import rawConfig from '../../settings.yaml'

/** 「全部」分类的固定名称 — 与 dock 显示文案及默认选中态保持一致 */
export const ALL_CATEGORY = '全部'

/**
 * 全局配置 store — 编译期已内联 settings.yaml
 */
export const useConfigStore = defineStore('config', () => {
  const config = ref(parseConfig(rawConfig as Record<string, unknown>))
  const activeCategory = ref<string>(ALL_CATEGORY)
  const { getClickCount } = useClickStats()

  /** 跨分类的全部链接（独立 memo，避免被 categories 重算时拖累） */
  const allLinks = computed(() => config.value.urls.flatMap((c) => c.children))

  const categories = computed<BookmarkCategory[]>(() => {
    const all: BookmarkCategory = {
      name: ALL_CATEGORY,
      icon: resolveIcon('./icons/all.svg'),
      children: allLinks.value,
    }
    return [all, ...config.value.urls]
  })

  /**
   * 当前可见的书签列表
   * - 「全部」态：按点击次数降序排列；计数相等或都为 0 时保留 yaml 原序（稳定排序）。
   *   仅在「全部」态参与排序，其它分类保持原顺序，避免分类内部排序被点击习惯打乱。
   */
  const visibleLinks = computed(() => {
    if (activeCategory.value === ALL_CATEGORY) {
      // slice() 拷贝再排序：避免污染 allLinks 的稳定身份（其它 computed 仍依赖原序）
      return allLinks.value.slice().sort((a, b) => getClickCount(b.url) - getClickCount(a.url))
    }
    const cat = config.value.urls.find((c) => c.name === activeCategory.value)
    return cat?.children ?? []
  })

  const searchEngines = computed(() => config.value.search)

  function setCategory(name: string) {
    activeCategory.value = name
  }

  return {
    config,
    activeCategory,
    categories,
    visibleLinks,
    searchEngines,
    setCategory,
  }
})
