<template>
  <header class="hero">
    <div class="hero__time">{{ time }}</div>
    <div class="hero__date">{{ date }}</div>
  </header>
</template>

<script setup lang="ts">
import { useClock } from '@/composables'

const { time, date } = useClock()
</script>

<style scoped>
.hero {
  text-align: center;
  margin-bottom: 24px;
  animation: fade-in 0.8s var(--ease-out);
}
.hero__time {
  font-size: var(--text-display);
  font-weight: var(--font-weight-medium);
  line-height: var(--leading-none);
  margin-bottom: 4px;
  color: var(--color-text-on-image);
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}
.hero__date {
  font-size: var(--text-lg);
  font-weight: var(--font-weight-medium);
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
}
</style>
