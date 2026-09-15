<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="configStore.toolModalVisible" class="modal-overlay" @click.self="configStore.closeToolModal()">
        <div class="modal">
          <!-- 侧边分类栏 -->
          <aside class="modal__sidebar">
            <button
              class="modal__category"
              :class="{ 'is-active': configStore.activeToolCategory === ALL_TOOLS }"
              @click="configStore.setToolCategory(ALL_TOOLS)"
            >
              <svg class="modal__category-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              <span class="modal__category-name">全部软件</span>
              <span class="modal__category-count">{{ configStore.toolCount }}</span>
            </button>
            <div class="modal__divider"></div>
            <button
              v-for="category in configStore.toolCategories"
              :key="category.name"
              class="modal__category"
              :class="{ 'is-active': configStore.activeToolCategory === category.name }"
              @click="configStore.setToolCategory(category.name)"
            >
              <img class="modal__category-icon" :src="category.icon" :alt="category.name" />
              <span class="modal__category-name">{{ category.name }}</span>
              <span class="modal__category-count">{{ category.children.length }}</span>
            </button>
          </aside>

          <!-- 主内容区 -->
          <button class="modal__close" @click="configStore.closeToolModal()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <main class="modal__content">
            <header class="modal__header">
              <h2 class="modal__title">{{ currentCategoryName }}</h2>
              <div class="modal__search">
                <svg class="modal__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  v-model="searchQuery"
                  class="modal__search-input"
                  type="text"
                  placeholder="搜索工具名称、描述或标签..."
                />
                <button v-if="searchQuery" class="modal__search-clear" @click="searchQuery = ''">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </header>

            <div class="modal__grid">
              <ToolCard
                v-for="tool in filteredTools"
                :key="tool.name"
                :tool="tool"
              />
              <div v-if="filteredTools.length === 0" class="modal__empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <span>未找到匹配的工具</span>
              </div>
            </div>
          </main>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useConfigStore } from '@/stores'
import ToolCard from './ToolCard.vue'

const ALL_TOOLS = '__all__'

const configStore = useConfigStore()
const searchQuery = ref('')

const currentCategoryName = computed(() => {
  if (configStore.activeToolCategory === ALL_TOOLS) return '全部软件'
  return configStore.currentToolCategory?.name ?? '工具'
})

const filteredTools = computed(() => {
  let tools: typeof configStore.currentToolCategory.children = []

  if (configStore.activeToolCategory === ALL_TOOLS) {
    // 全部软件：合并所有分类的工具
    tools = configStore.toolCategories.flatMap(cat => cat.children)
  } else {
    tools = configStore.currentToolCategory?.children ?? []
  }

  // 搜索过滤
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    tools = tools.filter(tool =>
      tool.name.toLowerCase().includes(query) ||
      tool.desc.toLowerCase().includes(query) ||
      (tool.tags && tool.tags.some(tag => tag.toLowerCase().includes(query)))
    )
  }

  return tools
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-6);
}

.modal {
  position: relative;
  width: min(960px, 100%);
  height: min(640px, 90vh);
  background: var(--color-surface);
  backdrop-filter: blur(var(--blur-md));
  -webkit-backdrop-filter: blur(var(--blur-md));
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-3);
  display: flex;
  overflow: hidden;
}

/* 侧边栏 */
.modal__sidebar {
  width: 200px;
  background: rgba(255, 255, 255, 0.3);
  border-right: 1px solid var(--color-border);
  padding: var(--space-4) 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  overflow-y: auto;
  flex-shrink: 0;
}

.modal__divider {
  height: 1px;
  background: var(--color-border);
  margin: var(--space-2) var(--space-4);
}

.modal__category {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  margin-right: var(--space-3);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  cursor: pointer;
  transition: all var(--dur-fast) ease;
  color: var(--color-text);
  font-size: var(--text-base);
  font-weight: var(--font-weight-medium);
  border: none;
  background: transparent;
  text-align: left;
  width: calc(100% - var(--space-3));
  position: relative;
}

.modal__category:hover {
  background: rgba(59, 130, 246, 0.06);
  color: var(--color-accent);
}

.modal__category.is-active {
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%);
  color: var(--color-accent);
  font-weight: var(--font-weight-semibold);
}

.modal__category.is-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 60%;
  background: var(--color-accent);
  border-radius: 0 3px 3px 0;
}

.modal__category-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
  flex-shrink: 0;
  opacity: 0.7;
  transition: opacity var(--dur-fast) ease;
}

.modal__category-icon-svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  opacity: 0.7;
  transition: opacity var(--dur-fast) ease;
  color: currentColor;
}

.modal__category:hover .modal__category-icon,
.modal__category:hover .modal__category-icon-svg,
.modal__category.is-active .modal__category-icon,
.modal__category.is-active .modal__category-icon-svg {
  opacity: 1;
}

.modal__category-name {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.modal__category-count {
  font-size: var(--text-xs);
  font-weight: var(--font-weight-semibold);
  padding: 2px 8px;
  border-radius: var(--radius-pill);
  background: rgba(0, 0, 0, 0.06);
  color: var(--color-text-sub);
}

.modal__category:hover .modal__category-count {
  background: rgba(59, 130, 246, 0.1);
  color: var(--color-accent);
}

.modal__category.is-active .modal__category-count {
  background: rgba(59, 130, 246, 0.15);
  color: var(--color-accent);
}

/* 搜索框 */
.modal__search {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  padding: 0 var(--space-4);
  transition: all var(--dur-fast) ease;
  flex: 1;
  max-width: 320px;
}

.modal__search:focus-within {
  background: rgba(255, 255, 255, 0.9);
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.modal__search-icon {
  width: 16px;
  height: 16px;
  color: var(--color-text-sub);
  flex-shrink: 0;
}

.modal__search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: var(--text-sm);
  color: var(--color-text);
  padding: var(--space-2) 0;
  min-width: 0;
}

.modal__search-input::placeholder {
  color: var(--color-text-sub);
}

.modal__search-input:focus {
  outline: none;
}

.modal__search-clear {
  width: 20px;
  height: 20px;
  border: none;
  background: rgba(0, 0, 0, 0.08);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--dur-fast) ease;
  color: var(--color-text-sub);
  flex-shrink: 0;
}

.modal__search-clear:hover {
  background: rgba(0, 0, 0, 0.12);
  color: var(--color-text);
}

.modal__search-clear svg {
  width: 12px;
  height: 12px;
}

/* 主内容区 */
.modal__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.4);
  min-width: 0;
}

.modal__header {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-6);
  border-bottom: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.3);
  flex-shrink: 0;
}

.modal__title {
  font-size: var(--text-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-shrink: 0;
}

.modal__title::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 18px;
  background: var(--color-accent);
  border-radius: 2px;
}

.modal__close {
  position: absolute;
  top: var(--space-3);
  right: var(--space-3);
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  border: none;
  background: rgba(0, 0, 0, 0.05);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--dur-fast) ease;
  color: var(--color-text);
  z-index: 10;
}

.modal__close:hover {
  background: rgba(0, 0, 0, 0.1);
  transform: scale(1.1);
}

.modal__close svg {
  width: 18px;
  height: 18px;
}

.modal__grid {
  flex: 1;
  padding: var(--space-4) var(--space-6);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  min-height: 0;
}

.modal__grid::-webkit-scrollbar {
  width: 6px;
}

.modal__grid::-webkit-scrollbar-track {
  background: transparent;
}

.modal__grid::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.15);
  border-radius: 3px;
}

.modal__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  padding: var(--space-12);
  color: var(--color-text-sub);
}

.modal__empty svg {
  width: 48px;
  height: 48px;
  opacity: 0.3;
}

.modal__empty span {
  font-size: var(--text-base);
}

/* 动画 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity var(--dur-base) ease;
}

.modal-enter-active .modal,
.modal-leave-active .modal {
  transition: transform var(--dur-base) var(--ease-out), opacity var(--dur-base) ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal,
.modal-leave-to .modal {
  transform: scale(0.95) translateY(20px);
  opacity: 0;
}

/* 响应式 */
@media (max-width: 768px) {
  .modal-overlay {
    padding: var(--space-4);
  }

  .modal {
    width: 100%;
    height: 100%;
    flex-direction: column;
  }

  .modal__sidebar {
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    overflow-x: hidden;
    overflow-y: visible;
    padding: var(--space-3);
    border-right: none;
    border-bottom: 1px solid var(--color-border);
    gap: var(--space-2);
  }

  .modal__divider {
    display: none;
  }

  .modal__category {
    white-space: nowrap;
    margin-right: 0;
    border-radius: var(--radius-md);
    padding: var(--space-2) var(--space-3);
    width: auto;
  }

  .modal__category.is-active::before {
    display: none;
  }

  .modal__header {
    padding: var(--space-3) var(--space-4);
    flex-wrap: wrap;
  }

  .modal__title {
    font-size: var(--text-base);
  }

  .modal__search {
    order: 3;
    max-width: none;
    width: 100%;
  }

  .modal__grid {
    padding: var(--space-4);
  }
}
</style>
