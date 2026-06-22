import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { BookmarkCategory } from '@/types/config'
import { parseConfig, resolveIcon } from '@/utils'
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

  const visibleLinks = computed(() => {
    if (activeCategory.value === ALL_CATEGORY) return allLinks.value
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
