import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { BookmarkCategory, ToolCategory } from '@/types/config'
import { parseConfig, resolveIcon } from '@/utils'
import { useClickStats } from '@/composables/useClickStats'
// 编译期内联 config/ 目录下的所有配置（由 navConfigPlugin 虚拟模块处理）
import rawConfig from 'virtual:nav-config'

/** 「全部」分类的固定名称（保留常量供外部引用，不再出现在 dock 中） */
export const ALL_CATEGORY = '全部'

/** 「常用」分类 — 替换 dock 首项「全部」，显示点击次数倒序 Top12 */
export const FREQUENT_CATEGORY = '常用'

/** 「常用」分类的最大显示条数 */
const FREQUENT_LIMIT = 12

/**
 * 全局配置 store — 编译期已内联 config/ 下所有 YAML 配置
 */
export const useConfigStore = defineStore('config', () => {
  const config = ref(parseConfig(rawConfig as Record<string, unknown>))
  const { getClickCount } = useClickStats()

  /** 默认选中「常用」 */
  const activeCategory = ref<string>(FREQUENT_CATEGORY)

  /** 工具弹窗状态 */
  const toolModalVisible = ref(false)
  const activeToolCategory = ref<string>('')

  /** 跨分类的全部链接（独立 memo，避免被 categories 重算时拖累） */
  const allLinks = computed(() => config.value.urls.flatMap((c) => c.children))

  /**
   * 按 getClickCount 降序排序的 allLinks（稳定排序，同分次保留 yaml 顺序）
   */
  const sortedAllLinks = computed(() =>
    allLinks.value.slice().sort((a, b) => getClickCount(b.url) - getClickCount(a.url)),
  )

  /** 常用 Top12 */
  const frequentLinks = computed(() => sortedAllLinks.value.slice(0, FREQUENT_LIMIT))

  const categories = computed<BookmarkCategory[]>(() => {
    const frequent: BookmarkCategory = {
      name: FREQUENT_CATEGORY,
      icon: resolveIcon('./icons/All.svg'),
      children: frequentLinks.value,
    }
    return [frequent, ...config.value.urls]
  })

  /** 工具分类列表 */
  const toolCategories = computed<ToolCategory[]>(() => config.value.tools)

  /** 工具总数 */
  const toolCount = computed(() =>
    config.value.tools.reduce((sum, cat) => sum + cat.children.length, 0),
  )

  /** 当前选中的工具分类 */
  const currentToolCategory = computed(() => {
    if (!activeToolCategory.value && config.value.tools.length > 0) {
      return config.value.tools[0]
    }
    return config.value.tools.find((c) => c.name === activeToolCategory.value) ?? config.value.tools[0]
  })

  /**
   * 当前可见的书签列表
   * - 「常用」态：点击次数倒序 Top12（含 yaml 顺序补位）
   * - 「全部」态：全部链接按点击次数降序（保留常量供外部引用，dock 无入口）
   * - 其它分类：保持 yaml 原顺序
   */
  const visibleLinks = computed(() => {
    if (activeCategory.value === FREQUENT_CATEGORY) return frequentLinks.value
    if (activeCategory.value === ALL_CATEGORY) return sortedAllLinks.value
    const cat = config.value.urls.find((c) => c.name === activeCategory.value)
    return cat?.children ?? []
  })

  const searchEngines = computed(() => config.value.search)

  function setCategory(name: string) {
    activeCategory.value = name
  }

  function openToolModal() {
    toolModalVisible.value = true
    if (!activeToolCategory.value && config.value.tools.length > 0) {
      activeToolCategory.value = config.value.tools[0].name
    }
  }

  function closeToolModal() {
    toolModalVisible.value = false
  }

  function setToolCategory(name: string) {
    activeToolCategory.value = name
  }

  return {
    config,
    activeCategory,
    categories,
    visibleLinks,
    allLinks,
    searchEngines,
    setCategory,
    // 工具相关
    toolModalVisible,
    activeToolCategory,
    toolCategories,
    toolCount,
    currentToolCategory,
    openToolModal,
    closeToolModal,
    setToolCategory,
  }
})
