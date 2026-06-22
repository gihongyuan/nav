<template>
  <div class="dock-wrap">
    <BaseGlassPanel blur="md" radius="pill" class="dock" role="tablist">
      <DockItem
        v-for="cat in configStore.categories"
        :key="cat.name"
        :name="cat.name"
        :icon="cat.icon"
        :active="configStore.activeCategory === cat.name"
        @select="configStore.setCategory(cat.name)"
      />
    </BaseGlassPanel>
  </div>
</template>

<script setup lang="ts">
import { BaseGlassPanel } from '@/components/base'
import DockItem from './DockItem.vue'
import { useConfigStore } from '@/stores'

const configStore = useConfigStore()
</script>

<style scoped>
.dock-wrap {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
}
.dock {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
}
@media (max-width: 600px) {
  .dock-wrap {
    bottom: 16px;
  }
}
</style>
