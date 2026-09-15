<template>
  <div class="tool-card" :class="{ 'is-expanded': expanded }" @click="toggle">
    <div class="tool-card__main">
      <img class="tool-card__icon" :src="tool.icon" :alt="tool.name" />
      <div class="tool-card__info">
        <div class="tool-card__name-row">
          <span class="tool-card__name">{{ tool.name }}</span>
          <span v-if="tool.tags && tool.tags.length" class="tool-card__tags">
            <span v-for="tag in tool.tags" :key="tag" class="tool-card__tag">{{ tag }}</span>
          </span>
        </div>
        <div class="tool-card__desc">{{ tool.desc }}</div>
      </div>
      <div class="tool-card__actions">
        <span class="tool-card__version-count">{{ tool.versions.length }}个版本</span>
        <svg class="tool-card__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </div>
    <div v-if="tool.versions.length" class="tool-card__versions">
      <div
        v-for="version in tool.versions"
        :key="version.version"
        class="tool-card__version"
      >
        <div class="tool-card__version-info">
          <span class="tool-card__version-badge" :class="{ 'is-latest': version.latest }">
            {{ version.version }}
          </span>
          <span class="tool-card__version-name">{{ version.name }}</span>
        </div>
        <a
          class="tool-card__download"
          :href="version.url"
          target="_blank"
          @click.stop
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          下载
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Tool } from '@/types/config'

const props = defineProps<{
  tool: Tool
}>()

const expanded = ref(false)

function toggle() {
  expanded.value = !expanded.value
}
</script>

<style scoped>
.tool-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--dur-base) var(--ease-out);
  overflow: hidden;
  flex-shrink: 0;
}

.tool-card:hover {
  background: var(--color-surface-strong);
  box-shadow: var(--shadow-1);
  border-color: rgba(59, 130, 246, 0.3);
}

.tool-card.is-expanded {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 1px var(--color-accent), var(--shadow-2);
}

.tool-card__main {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
}

.tool-card__icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-sm);
  object-fit: contain;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.6);
  padding: 6px;
}

.tool-card__info {
  flex: 1;
  min-width: 0;
}

.tool-card__name-row {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: 2px;
  min-width: 0;
}

.tool-card__name {
  font-size: var(--text-base);
  font-weight: var(--font-weight-semibold);
  line-height: var(--leading-tight);
  color: var(--color-text);
  flex-shrink: 0;
}

.tool-card__desc {
  font-size: var(--text-sm);
  color: var(--color-text-sub);
  line-height: var(--leading-normal);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tool-card__tags {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 4px;
  min-width: 0;
  overflow: hidden;
}

.tool-card__tag {
  font-size: var(--text-xs);
  color: var(--color-accent);
  background: var(--color-accent-bg);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  font-weight: var(--font-weight-medium);
}

.tool-card__actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-shrink: 0;
}

.tool-card__version-count {
  font-size: var(--text-xs);
  color: var(--color-text-sub);
  background: rgba(0, 0, 0, 0.04);
  padding: 4px 10px;
  border-radius: var(--radius-pill);
}

.tool-card__chevron {
  width: 18px;
  height: 18px;
  color: var(--color-text-sub);
  transition: transform var(--dur-base) var(--ease-out);
}

.tool-card.is-expanded .tool-card__chevron {
  transform: rotate(180deg);
  color: var(--color-accent);
}

.tool-card__versions {
  max-height: 0;
  overflow: hidden;
  transition: max-height var(--dur-base) var(--ease-out);
  background: rgba(59, 130, 246, 0.03);
  border-top: 1px solid transparent;
}

.tool-card.is-expanded .tool-card__versions {
  max-height: 400px;
  border-top-color: var(--color-border);
}

.tool-card__version {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-4);
  transition: background var(--dur-fast) ease;
}

.tool-card__version:hover {
  background: rgba(255, 255, 255, 0.5);
}

.tool-card__version + .tool-card__version {
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.tool-card__version-info {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.tool-card__version-badge {
  font-size: var(--text-xs);
  font-weight: var(--font-weight-semibold);
  padding: 3px 10px;
  border-radius: var(--radius-pill);
  background: rgba(0, 0, 0, 0.06);
  color: var(--color-text);
  letter-spacing: 0.3px;
}

.tool-card__version-badge.is-latest {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #fff;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.tool-card__version-name {
  font-size: var(--text-sm);
  color: var(--color-text);
  font-weight: var(--font-weight-medium);
}

.tool-card__download {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: #fff;
  border-radius: var(--radius-pill);
  font-size: var(--text-sm);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  transition: all var(--dur-fast) ease;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.tool-card__download:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.tool-card__download svg {
  width: 14px;
  height: 14px;
}
</style>
