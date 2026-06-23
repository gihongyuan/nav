<template>
  <div class="home">
    <div class="home__container">
      <HeroClock />
      <SearchBar />
      <main class="home__content">
        <!-- 聚焦但 query 为空：完全隐藏卡片区（让用户专注输入） -->
        <!-- 聚焦且 query 非空：显示按 title 过滤的全部书签 -->
        <!-- 未聚焦：按当前分类显示 -->
        <BookmarkGrid v-if="!focused" :links="configStore.visibleLinks" />
        <BookmarkGrid v-else-if="searching" :links="filteredLinks" :empty-hint="emptyHint" />
      </main>
    </div>
    <!-- 聚焦时隐藏 dock，避免遮挡卡片区 -->
    <CategoryDock v-show="!focused" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { HeroClock, SearchBar, BookmarkGrid, CategoryDock } from '@/components/business'
import { useConfigStore } from '@/stores'
import { useSearchFocus } from '@/composables'

const configStore = useConfigStore()
const { focused, trimmedQuery, searching } = useSearchFocus()

/**
 * 输入聚焦且有 query 时：按 title 大小写不敏感包含过滤 allLinks。
 * 不再设上限 —— 既然占据整个卡片区，让用户能看到完整匹配集合，
 * 由 home__content 的原生滚动承担超长情况。
 */
const filteredLinks = computed(() => {
  const q = trimmedQuery.value.toLowerCase()
  if (!q) return []
  return configStore.allLinks.filter((link) => link.title.toLowerCase().includes(q))
})

const emptyHint = computed(() => `没有匹配「${trimmedQuery.value}」的书签`)
</script>

<style scoped>
.home {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: relative;
}
.home__container {
  width: 100%;
  max-width: 920px;
  padding: 48px 20px 120px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
}
.home__content {
  width: 100%;
  flex: 1;
  overflow-y: auto;
  padding-bottom: 20px;
}
@media (max-width: 600px) {
  .home__container {
    padding: 32px 16px 110px 16px;
  }
}
</style>