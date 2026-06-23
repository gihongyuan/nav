<template>
  <form class="search-bar" @submit.prevent="handleSearch">
    <BaseGlassPanel blur="md" radius="pill" class="search-bar__box">
      <!-- 引擎下拉：仅在有引擎时显示 -->
      <BaseDropdown v-if="hasEngines" v-model="open" class="search-bar__dropdown" :class="{ open }">
        <template #trigger>
          <div class="search-bar__trigger" :title="currentEngine?.name">
            <BaseIcon v-if="currentEngine?.icon" :src="currentEngine.icon" :size="20" />
          </div>
        </template>
        <EngineOption
          v-for="eng in engines"
          :key="eng.name"
          :name="eng.name"
          :icon="eng.icon"
          :active="currentEngine?.name === eng.name"
          @select="selectEngine(eng.name)"
        />
      </BaseDropdown>

      <input
        ref="inputRef"
        v-model="query"
        type="text"
        class="search-bar__input"
        :placeholder="placeholder"
        autocomplete="off"
        :disabled="!hasEngines"
        @focus="setFocused(true)"
        @blur="onBlur"
      />

      <button
        type="submit"
        class="search-bar__btn"
        :disabled="!hasEngines"
        :title="currentEngine ? `用 ${currentEngine.name} 搜索` : '未配置搜索引擎'"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </button>
    </BaseGlassPanel>
  </form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { BaseGlassPanel, BaseDropdown, BaseIcon } from '@/components/base'
import EngineOption from './EngineOption.vue'
import { useSearchFocus } from '@/composables'
import { useConfigStore } from '@/stores'

const configStore = useConfigStore()
/** query 由 useSearchFocus 全局共享 —— HomeView 据此切换卡片区为过滤态 */
const { query, setFocused, reset } = useSearchFocus()

const open = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

const engines = computed(() => configStore.searchEngines)
const hasEngines = computed(() => engines.value.length > 0)

/**
 * 仅存「当前选中的引擎名」；具体的 SearchEngine 对象用 computed 派生，
 * 这样 yaml 增删改后会自动跟随，而不会保留过期对象引用。
 */
const selectedName = ref<string | null>(null)

const currentEngine = computed(() => {
  if (!hasEngines.value) return null
  return engines.value.find((e) => e.name === selectedName.value) ?? engines.value[0]
})

const placeholder = computed(() => {
  if (!hasEngines.value) return '未配置搜索引擎'
  return `在 ${currentEngine.value?.name ?? ''} 中搜索...`
})

function selectEngine(name: string) {
  selectedName.value = name
  open.value = false
  inputRef.value?.focus()
}

function handleSearch() {
  const q = query.value.trim()
  const engine = currentEngine.value
  if (!q || !engine) return
  const url = engine.url.replace('{query}', encodeURIComponent(q))
  window.open(url, '_blank', 'noopener,noreferrer')
  reset()
  inputRef.value?.blur()
}

/**
 * 失焦延迟 200ms 处理 —— 用户点击下方过滤后的卡片时，blur 会比 click 先触发，
 * 立即收起会让卡片网格在 click 命中前重渲染丢失目标；延迟至 click 完成后再收起。
 * 失焦即视为搜索意图结束，一并清空 query 让卡片区恢复到当前分类视图。
 */
function onBlur() {
  setTimeout(() => reset(), 200)
}
</script>

<style scoped>
.search-bar {
  width: min(100%, 600px);
  margin-bottom: 32px;
  position: relative;
  z-index: 10;
}
.search-bar__box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 6px 6px 6px;
  transition: all var(--dur-base) var(--ease-out);
}
.search-bar__box:focus-within {
  transform: scale(1.02);
  background: var(--color-surface-strong);
  border-color: rgba(255, 255, 255, 0.8);
  box-shadow: var(--shadow-2);
}

.search-bar__trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 36px;
  padding: 0;
  border-right: 1px solid var(--color-border);
  color: var(--color-text);
  cursor: pointer;
}
.search-bar__dropdown {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.search-bar__input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: var(--text-lg);
  color: var(--color-text);
  padding: 8px 4px 8px 12px;
  min-width: 0;
}
.search-bar__input::placeholder {
  color: var(--color-text-sub);
}
.search-bar__input:disabled {
  cursor: not-allowed;
}

.search-bar__btn {
  background: var(--color-accent);
  color: #fff;
  border: none;
  border-radius: var(--radius-pill);
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--dur-fast) var(--ease-out);
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}
.search-bar__btn:hover:not(:disabled) {
  background: var(--color-accent-hover);
  transform: scale(1.05);
}
.search-bar__btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.search-bar__btn svg {
  width: 16px;
  height: 16px;
}

@media (max-width: 600px) {
  .search-bar__trigger {
    width: 36px;
  }
}
</style>