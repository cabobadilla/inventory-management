<template>
  <div class="topbar">
    <h1 class="page-title">{{ pageTitle }}</h1>
    <div v-if="showFilters" class="topbar-filters">
      <FilterBar />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import FilterBar from './FilterBar.vue'

const route = useRoute()

const pageTitle = computed(() => route.meta?.title || 'Inventory')

const showFilters = computed(() => route.meta?.showFilters !== false)
</script>

<style scoped>
.topbar {
  display: flex;
  align-items: center;
  height: var(--header-h);
  border-bottom: 1px solid var(--border);
  background: var(--bg-surface);
  padding: 0 var(--space-6);
  position: sticky;
  top: 0;
  z-index: 20;
  gap: var(--space-6);
}

.page-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  flex-shrink: 0;
  margin: 0;
}

.topbar-filters {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
}

/* Strip FilterBar's own bar chrome so it sits flush inside TopBar */
.topbar-filters :deep(.filters-bar) {
  background: transparent;
  border-bottom: none;
  padding: 0;
  position: static;
  width: 100%;
}

.topbar-filters :deep(.filters-container) {
  max-width: none;
  margin: 0;
  padding: 0;
}
</style>
