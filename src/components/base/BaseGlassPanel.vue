<template>
  <div class="base-glass-panel" :class="[blurClass, radiusClass]" :style="style">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    blur?: 'sm' | 'md'
    radius?: 'sm' | 'md' | 'lg' | 'pill'
    width?: string
    height?: string
  }>(),
  {
    blur: 'md',
    radius: 'lg',
  },
)

const blurClass = computed(() => `blur-${props.blur}`)
const radiusClass = computed(() => `radius-${props.radius}`)

const style = computed(() => {
  const s: Record<string, string> = {}
  if (props.width) s.width = props.width
  if (props.height) s.height = props.height
  return s
})
</script>

<style scoped>
.base-glass-panel {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-1);
}
.blur-sm {
  backdrop-filter: blur(var(--blur-sm));
  -webkit-backdrop-filter: blur(var(--blur-sm));
}
.blur-md {
  backdrop-filter: blur(var(--blur-md));
  -webkit-backdrop-filter: blur(var(--blur-md));
}
.radius-sm {
  border-radius: var(--radius-sm);
}
.radius-md {
  border-radius: var(--radius-md);
}
.radius-lg {
  border-radius: var(--radius-lg);
}
.radius-pill {
  border-radius: var(--radius-pill);
}
</style>
