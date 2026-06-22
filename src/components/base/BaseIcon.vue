<template>
  <!-- 远程/本地图片资源：直接 <img>，保留原色，对描边/填充/位图都可靠 -->
  <img
    v-if="kind === 'image'"
    class="base-icon base-icon--image"
    :src="src"
    :alt="alt ?? ''"
    :style="{ width: `${size}px`, height: `${size}px` }"
    :aria-hidden="decorative || undefined"
    loading="lazy"
    decoding="async"
    @error="onError"
  />
  <!-- emoji / 纯文本字符：作为文字渲染 -->
  <span
    v-else-if="kind === 'text'"
    class="base-icon base-icon--text"
    :style="{ fontSize: `${size}px`, lineHeight: 1 }"
    :aria-hidden="decorative || undefined"
    >{{ src }}</span
  >
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    src?: string
    alt?: string
    size?: number
    /** 装饰性图标（默认 true）— 含语义信息时设为 false 并传 alt */
    decorative?: boolean
  }>(),
  {
    size: 20,
    decorative: true,
  },
)

const failed = ref(false)

/** 资源类型：远程/本地路径 → image；emoji/短文本 → text；空或加载失败 → empty */
const kind = computed<'image' | 'text' | 'empty'>(() => {
  const s = props.src
  if (!s || failed.value) return 'empty'
  if (/^https?:\/\//i.test(s) || s.startsWith('/')) return 'image'
  return 'text'
})

function onError() {
  failed.value = true
}
</script>

<style scoped>
.base-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  line-height: 1;
}
.base-icon--image {
  object-fit: contain;
  user-select: none;
  -webkit-user-drag: none;
}
</style>
