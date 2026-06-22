<template>
  <div class="layout">
    <!-- 壁纸层 -->
    <div class="layout__wallpaper" :class="{ 'is-focused': focused }" :style="wallpaperStyle" />
    <div class="layout__content">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSearchFocus } from '@/composables'
import { useConfigStore } from '@/stores'

const { focused } = useSearchFocus()
const configStore = useConfigStore()

/** 把背景 URL 安全地拼成 CSS url("...")，转义可能破坏字符串的字符 */
const wallpaperStyle = computed(() => {
  const bg = configStore.config.background
  if (!bg) return {}
  const safe = bg.replace(/(["\\])/g, '\\$1')
  return { backgroundImage: `url("${safe}")` }
})
</script>

<style scoped>
.layout {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
.layout__wallpaper {
  position: fixed;
  inset: 0;
  z-index: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: var(--color-bg);
  filter: brightness(0.95);
  transform: scale(1);
  transition:
    filter var(--dur-slow) var(--ease-out),
    transform 0.6s var(--ease-out);
}
.layout__wallpaper.is-focused {
  filter: blur(24px) brightness(0.8);
  transform: scale(1.05);
}
.layout__content {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
}
</style>
