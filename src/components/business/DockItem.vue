<template>
  <div
    class="dock-item"
    :class="{ active }"
    :title="name"
    role="button"
    tabindex="0"
    @click="$emit('select')"
    @keydown.enter="$emit('select')"
  >
    <span class="dock-item__tip">{{ name }}</span>
    <BaseIcon v-if="icon" :src="icon" :size="20" />
    <svg
      v-else
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      class="dock-item__fallback-icon"
    >
      <circle cx="12" cy="12" r="10" />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { BaseIcon } from '@/components/base'

defineProps<{
  name: string
  icon?: string
  active?: boolean
}>()

defineEmits<{
  select: []
}>()
</script>

<style scoped>
.dock-item {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--dur-fast) var(--ease-out);
  position: relative;
  color: var(--color-text);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
.dock-item :deep(svg) {
  width: 20px;
  height: 20px;
  transition: all var(--dur-fast);
}
.dock-item:hover {
  background: #fff;
  transform: scale(1.15) translateY(-6px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
  color: var(--color-accent);
}
.dock-item.active {
  background: var(--color-accent);
  color: #fff;
  box-shadow: var(--shadow-accent);
  border-color: var(--color-accent);
}
.dock-item.active :deep(svg) {
  stroke: #fff;
  color: #fff;
}
/* 激活态把 <img> 图标转白：brightness(0) 先压成纯黑，invert(1) 再翻成纯白 */
.dock-item.active :deep(.base-icon--image) {
  filter: brightness(0) invert(1);
}
.dock-item__tip {
  position: absolute;
  top: -32px;
  background: #fff;
  color: var(--color-text);
  font-size: var(--text-xs);
  font-weight: var(--font-weight-semibold);
  padding: 5px 10px;
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-1);
  opacity: 0;
  transition: opacity var(--dur-fast);
  pointer-events: none;
  white-space: nowrap;
  transform: translateY(4px);
}
.dock-item:hover .dock-item__tip {
  opacity: 1;
  transform: translateY(0);
}
.dock-item__fallback-icon {
  width: 20px;
  height: 20px;
}
</style>
