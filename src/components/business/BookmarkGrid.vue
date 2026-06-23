<template>
  <div class="grid">
    <BookmarkCard v-for="link in links" :key="link.url" :link="link" />
    <div v-if="links.length === 0" class="grid__empty">{{ emptyHint ?? '当前分类暂无书签' }}</div>
  </div>
</template>

<script setup lang="ts">
import type { BookmarkLink } from '@/types/config'
import BookmarkCard from './BookmarkCard.vue'

defineProps<{
  links: BookmarkLink[]
  /** 列表为空时显示的提示文案；缺省「当前分类暂无书签」 */
  emptyHint?: string
}>()
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px 4px;
  padding: 0 20px;
}
.grid__empty {
  grid-column: 1 / -1;
  text-align: center;
  padding: 30px;
  color: var(--color-text-on-image);
  font-size: var(--text-base);
  background: rgba(0, 0, 0, 0.3);
  border-radius: var(--radius-md);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

@media (max-width: 800px) {
  .grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 16px 10px;
  }
}
@media (max-width: 600px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px 8px;
  }
}
</style>
