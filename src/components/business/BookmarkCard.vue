<template>
  <a
    class="bookmark-card"
    :href="link.url"
    target="_blank"
    rel="noopener noreferrer"
    :title="link.description ?? link.title"
  >
    <div class="bookmark-card__icon" :class="{ 'is-glass': isTransparent }" :style="iconStyle">
      <BaseIcon :src="link.icon" :size="28" />
    </div>
    <div class="bookmark-card__title">{{ link.title }}</div>
  </a>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { BookmarkLink } from '@/types/config'
import { BaseIcon } from '@/components/base'

const props = defineProps<{
  link: BookmarkLink
}>()

/** 书签卡片图标背景：缺省白色，可在 settings.yaml 的 urls 各书签项 background 字段覆盖 */
const effectiveBg = computed(() => props.link.background ?? '#ffffff')

/** 透明模式：去除容器装饰，只显示 BaseIcon */
const isTransparent = computed(() => {
  const v = effectiveBg.value.trim().toLowerCase()
  return !v || v === 'transparent'
})

const iconStyle = computed(() =>
  isTransparent.value ? {} : { background: effectiveBg.value },
)
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
  transition: transform var(--dur-fast) var(--ease-out);
  gap: 8px;
  cursor: pointer;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}
.bookmark-card:hover {
  transform: translateY(-2px);
  color: #fff;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.6);
}
.bookmark-card__icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-xl);
  transition: all var(--dur-fast) var(--ease-out);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  color: var(--color-text);
}
/* 透明态：完全去除容器装饰，只显示图标本身 */
.bookmark-card__icon.is-glass {
  background: transparent;
  box-shadow: none;
}
.bookmark-card:hover .bookmark-card__icon {
  transform: scale(1.08);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}
.bookmark-card:hover .bookmark-card__icon.is-glass {
  background: transparent;
  box-shadow: none;
}
.bookmark-card__title {
  font-size: var(--text-sm);
  font-weight: var(--font-weight-medium);
  line-height: var(--leading-tight);
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: all var(--dur-fast);
}
</style>
