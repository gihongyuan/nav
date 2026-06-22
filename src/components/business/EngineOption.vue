<template>
  <div
    class="engine-option"
    :class="{ active }"
    role="option"
    :aria-selected="active"
    @click="$emit('select')"
  >
    <BaseIcon v-if="icon" :src="icon" :size="18" class="engine-option__icon" />
    <span>{{ name }}</span>
    <span v-if="active" class="engine-option__check">✓</span>
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
.engine-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: var(--text-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
  transition: background var(--dur-fast);
}
.engine-option:hover {
  background: #f0f2f5;
}
.engine-option.active {
  color: var(--color-accent);
  font-weight: var(--font-weight-semibold);
}
.engine-option__icon {
  flex-shrink: 0;
  color: inherit;
}
.engine-option__check {
  margin-left: auto;
  font-size: var(--text-xs);
  color: var(--color-accent);
}
</style>
