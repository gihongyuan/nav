<template>
  <a
    class="bookmark-card"
    :href="link.url"
    target="_blank"
    rel="noopener noreferrer"
    :title="link.description ?? link.title"
  >
    <div class="bookmark-card__icon">
      <BaseIcon :src="link.icon" :size="24" />
    </div>
    <div class="bookmark-card__title">{{ link.title }}</div>
  </a>
</template>

<script setup lang="ts">
import type { BookmarkLink } from '@/types/config'
import { BaseIcon } from '@/components/base'

defineProps<{
  link: BookmarkLink
}>()
</script>

<style scoped>
.bookmark-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 12px 4px;
  text-decoration: none;
  color: var(--color-text-on-image);
  transition: all var(--dur-fast) var(--ease-out);
  gap: 8px;
  cursor: pointer;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  border-radius: var(--radius-md);
}
.bookmark-card:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
  color: #fff;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.6);
}
.bookmark-card__icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  transition: all var(--dur-fast) var(--ease-out);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  color: #fff;
}
.bookmark-card:hover .bookmark-card__icon {
  background: rgba(255, 255, 255, 0.45);
  transform: scale(1.08);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}
.bookmark-card__title {
  font-size: 12px;
  font-weight: 500;
  line-height: 1.3;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: all var(--dur-fast);
}
</style>
