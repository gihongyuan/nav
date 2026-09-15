<template>
  <div class="tool-button-wrap">
    <button class="tool-button" @click="configStore.openToolModal()">
      <svg class="tool-button__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
      <div class="tool-button__tooltip">
        <span class="tool-button__label">常用工具</span>
        <span class="tool-button__badge">{{ configStore.toolCount }}</span>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useConfigStore } from '@/stores'

const configStore = useConfigStore()
</script>

<style scoped>
.tool-button-wrap {
  position: fixed;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
}

.tool-button {
  position: relative;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surface);
  backdrop-filter: blur(var(--blur-md));
  -webkit-backdrop-filter: blur(var(--blur-md));
  border: 1px solid var(--color-border);
  border-left: none;
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  cursor: pointer;
  transition: all var(--dur-base) var(--ease-out);
  box-shadow: var(--shadow-1);
  color: var(--color-text);
}

.tool-button:hover {
  width: 48px;
  height: 48px;
  background: var(--color-surface-strong);
  color: var(--color-accent);
  box-shadow: 3px 0 16px rgba(59, 130, 246, 0.2);
}

.tool-button__icon {
  width: 20px;
  height: 20px;
  transition: transform var(--dur-base) var(--ease-out);
}

.tool-button:hover .tool-button__icon {
  transform: scale(1.15) rotate(-10deg);
}

.tool-button__tooltip {
  position: absolute;
  left: calc(100% + 12px);
  top: 50%;
  transform: translateY(-50%) translateX(-8px);
  background: var(--color-surface-strong);
  backdrop-filter: blur(var(--blur-sm));
  -webkit-backdrop-filter: blur(var(--blur-sm));
  color: var(--color-text);
  font-size: var(--text-sm);
  font-weight: var(--font-weight-semibold);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-1);
  opacity: 0;
  pointer-events: none;
  white-space: nowrap;
  transition: all var(--dur-base) var(--ease-out);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.tool-button__tooltip::before {
  content: '';
  position: absolute;
  left: -4px;
  top: 50%;
  transform: translateY(-50%) rotate(45deg);
  width: 8px;
  height: 8px;
  background: var(--color-surface-strong);
  border-left: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

.tool-button:hover .tool-button__tooltip {
  opacity: 1;
  transform: translateY(-50%) translateX(0);
}

.tool-button__badge {
  background: var(--color-accent);
  color: #fff;
  font-size: var(--text-xs);
  font-weight: var(--font-weight-semibold);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  min-width: 20px;
  text-align: center;
}
</style>
