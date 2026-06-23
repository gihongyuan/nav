<template>
  <a
    class="bookmark-card"
    :href="link.url"
    target="_blank"
    rel="noopener noreferrer"
    :title="link.description ?? link.title"
    @click="handleClick"
  >
    <div class="bookmark-card__icon" :class="{ 'is-glass': isTransparent }" :style="iconStyle">
      <BaseIcon :src="link.icon" :size="28" />
      <span v-if="clickCount > 0" class="bookmark-card__badge">{{ badgeLabel }}</span>
    </div>
    <div class="bookmark-card__title">{{ link.title }}</div>
  </a>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { BookmarkLink } from '@/types/config'
import { BaseIcon } from '@/components/base'
import { useClickStats } from '@/composables/useClickStats'

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

const { recordClick, getClickCount } = useClickStats()
const clickCount = computed(() => getClickCount(props.link.url))
/** 红点上限文案 —— 超过 99 显示 99+ 防止气泡被撑大 */
const badgeLabel = computed(() => (clickCount.value > 99 ? '99+' : String(clickCount.value)))

/**
 * 点击拦截：仅写计数，不 preventDefault —— 浏览器照常按 target="_blank" 新标签打开，
 * 不破坏原生行为（中键、Ctrl+Click、右键菜单都仍由浏览器接管）。
 */
function handleClick() {
  recordClick(props.link.url)
}
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
  position: relative;
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
/* 点击次数红点：克制低饱和、小尺寸、右上角溢出磁贴边缘 */
.bookmark-card__badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: var(--radius-pill);
  background: #e25c5c;
  color: #fff;
  font-size: var(--text-xs);
  font-weight: var(--font-weight-semibold);
  line-height: 18px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
  pointer-events: none;
  /* 透明态下磁贴本身没有阴影，给红点单独加一层 outline 保持可读 */
  outline: 2px solid rgba(255, 255, 255, 0.25);
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
