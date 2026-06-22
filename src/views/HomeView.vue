<template>
  <div class="home">
    <div class="home__container">
      <HeroClock />
      <SearchBar />
      <main class="home__content">
        <BookmarkGrid :links="configStore.visibleLinks" />
      </main>
    </div>
    <CategoryDock />
  </div>
</template>

<script setup lang="ts">
import { HeroClock, SearchBar, BookmarkGrid, CategoryDock } from '@/components/business'
import { useConfigStore } from '@/stores'

const configStore = useConfigStore()
</script>

<style scoped>
.home {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: relative;
}
.home__container {
  width: 100%;
  max-width: 920px;
  padding: 48px 20px 120px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
}
.home__content {
  width: 100%;
  flex: 1;
  overflow-y: auto;
  padding-bottom: 20px;
}
@media (max-width: 600px) {
  .home__container {
    padding: 32px 16px 110px 16px;
  }
}
</style>
