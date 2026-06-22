<template>
  <div ref="rootRef" class="base-dropdown" :class="{ open: modelValue }">
    <div
      class="base-dropdown__trigger"
      tabindex="0"
      role="button"
      :aria-expanded="modelValue"
      @click="toggle"
      @keydown.enter="toggle"
      @keydown.space.prevent="toggle"
    >
      <slot name="trigger" />
    </div>
    <Transition name="dd-fade">
      <div v-if="modelValue" class="base-dropdown__menu" role="listbox">
        <slot />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const rootRef = ref<HTMLElement | null>(null)

onClickOutside(rootRef, () => {
  if (props.modelValue) emit('update:modelValue', false)
})

function toggle() {
  emit('update:modelValue', !props.modelValue)
}
</script>

<style scoped>
.base-dropdown {
  position: relative;
}
.base-dropdown__trigger {
  cursor: pointer;
  display: flex;
  align-items: center;
}
.base-dropdown__menu {
  position: absolute;
  top: calc(100% + 12px);
  left: 0;
  min-width: 140px;
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-3);
  padding: 6px;
  z-index: 20;
}
.dd-fade-enter-active,
.dd-fade-leave-active {
  transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.dd-fade-enter-from,
.dd-fade-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-8px);
}
</style>
