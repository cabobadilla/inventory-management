<template>
  <div class="app">
    <Sidebar
      @show-profile-details="showProfileDetails = true"
      @show-tasks="showTasks = true"
    />
    <main class="main-col" :class="{ 'is-collapsed': effectiveCollapsed }">
      <TopBar />
      <div class="page">
        <router-view />
      </div>
    </main>

    <ProfileDetailsModal
      :is-open="showProfileDetails"
      @close="showProfileDetails = false"
    />

    <TasksModal
      :is-open="showTasks"
      :tasks="tasks"
      @close="showTasks = false"
      @add-task="addTask"
      @delete-task="deleteTask"
      @toggle-task="toggleTask"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from './api'
import { useAuth } from './composables/useAuth'
import { useSidebar } from './composables/useSidebar'
import Sidebar from './components/Sidebar.vue'
import TopBar from './components/TopBar.vue'
import ProfileDetailsModal from './components/ProfileDetailsModal.vue'
import TasksModal from './components/TasksModal.vue'

const { currentUser } = useAuth()
const { effectiveCollapsed } = useSidebar()

const showProfileDetails = ref(false)
const showTasks = ref(false)
const apiTasks = ref([])

const tasks = computed(() => {
  return [...currentUser.value.tasks, ...apiTasks.value]
})

const loadTasks = async () => {
  try {
    apiTasks.value = await api.getTasks()
  } catch (err) {
    console.error('Failed to load tasks:', err)
  }
}

const addTask = async (taskData) => {
  try {
    const newTask = await api.createTask(taskData)
    apiTasks.value.unshift(newTask)
  } catch (err) {
    console.error('Failed to add task:', err)
  }
}

const deleteTask = async (taskId) => {
  try {
    const isMockTask = currentUser.value.tasks.some(t => t.id === taskId)
    if (isMockTask) {
      const index = currentUser.value.tasks.findIndex(t => t.id === taskId)
      if (index !== -1) currentUser.value.tasks.splice(index, 1)
    } else {
      await api.deleteTask(taskId)
      apiTasks.value = apiTasks.value.filter(t => t.id !== taskId)
    }
  } catch (err) {
    console.error('Failed to delete task:', err)
  }
}

const toggleTask = async (taskId) => {
  try {
    const mockTask = currentUser.value.tasks.find(t => t.id === taskId)
    if (mockTask) {
      mockTask.status = mockTask.status === 'pending' ? 'completed' : 'pending'
    } else {
      const updatedTask = await api.toggleTask(taskId)
      const index = apiTasks.value.findIndex(t => t.id === taskId)
      if (index !== -1) apiTasks.value[index] = updatedTask
    }
  } catch (err) {
    console.error('Failed to toggle task:', err)
  }
}

onMounted(loadTasks)
</script>

<style>
/* ─── Design tokens ─────────────────────────────────────────── */
:root {
  --bg-app: #f8fafc;
  --bg-surface: #ffffff;
  --bg-sunken: #f1f5f9;
  --border: #e2e8f0;
  --border-strong: #cbd5e1;
  --text-primary: #0f172a;
  --text-secondary: #334155;
  --text-muted: #64748b;
  --text-inverse: #ffffff;
  --accent: #2563eb;
  --accent-hover: #1d4ed8;
  --accent-soft: #dbeafe;
  --success: #16a34a; --success-soft: #d1fae5;
  --warning: #d97706; --warning-soft: #fed7aa;
  --danger: #dc2626;  --danger-soft: #fee2e2;
  --info: #3b82f6;    --info-soft: #dbeafe;
  --radius-sm: 6px; --radius-md: 8px; --radius-lg: 10px;
  --shadow-sm: 0 1px 2px rgba(15,23,42,0.04), 0 1px 3px rgba(15,23,42,0.06);
  --shadow-md: 0 4px 12px rgba(15,23,42,0.06);
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px;
  --space-5: 20px; --space-6: 24px; --space-8: 32px;
  --sidebar-w-expanded: 240px;
  --sidebar-w-collapsed: 72px;
  --header-h: 56px;
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  background: var(--bg-app);
  color: var(--text-primary);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  min-height: 100vh;
}

/* ─── Badge utilities ────────────────────────────────────────── */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: var(--radius-sm);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.badge--success { background: var(--success-soft); color: #065f46; }
.badge--warning { background: var(--warning-soft); color: #92400e; }
.badge--danger  { background: var(--danger-soft);  color: #991b1b; }
.badge--info    { background: var(--info-soft);    color: #1e40af; }
.badge--neutral { background: var(--bg-sunken);    color: var(--text-secondary); }

/* Legacy badge classes used by existing views — keep for backward compat */
.badge.success   { background: var(--success-soft); color: #065f46; }
.badge.warning   { background: var(--warning-soft); color: #92400e; }
.badge.danger    { background: var(--danger-soft);  color: #991b1b; }
.badge.info      { background: var(--info-soft);    color: #1e40af; }
.badge.increasing { background: var(--success-soft); color: #065f46; }
.badge.decreasing { background: var(--danger-soft);  color: #991b1b; }
.badge.stable    { background: #e0e7ff; color: #3730a3; }
.badge.high      { background: var(--danger-soft);  color: #991b1b; }
.badge.medium    { background: var(--warning-soft); color: #92400e; }
.badge.low       { background: var(--info-soft);    color: #1e40af; }

/* ─── Global element styles (used by views) ──────────────────── */
.page-header { margin-bottom: 1.5rem; }
.page-header h2 { font-size: 1.875rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.375rem; letter-spacing: -0.025em; }
.page-header p { color: var(--text-muted); font-size: 0.938rem; }

.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem; }

.stat-card { background: var(--bg-surface); padding: 1.25rem; border-radius: var(--radius-lg); border: 1px solid var(--border); transition: all 0.2s ease; }
.stat-card:hover { border-color: var(--border-strong); box-shadow: var(--shadow-md); }
.stat-label { color: var(--text-muted); font-size: 0.875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.625rem; }
.stat-value { font-size: 2.25rem; font-weight: 700; color: var(--text-primary); letter-spacing: -0.025em; }
.stat-card.warning .stat-value { color: #ea580c; }
.stat-card.success .stat-value { color: #059669; }
.stat-card.danger .stat-value  { color: var(--danger); }
.stat-card.info .stat-value    { color: var(--accent); }

.card { background: var(--bg-surface); border-radius: var(--radius-lg); padding: 1.25rem; border: 1px solid var(--border); margin-bottom: 1.25rem; }
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding-bottom: 0.875rem; border-bottom: 1px solid var(--border); }
.card-title { font-size: 1.125rem; font-weight: 700; color: var(--text-primary); letter-spacing: -0.025em; }

.table-container { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; }
thead { background: var(--bg-app); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
th { text-align: left; padding: 0.5rem 0.75rem; font-weight: 600; color: #475569; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
td { padding: 0.5rem 0.75rem; border-top: 1px solid var(--bg-sunken); color: var(--text-secondary); font-size: 0.875rem; }
tbody tr { transition: background-color 0.15s ease; }
tbody tr:hover { background: var(--bg-app); }

.loading { text-align: center; padding: 3rem; color: var(--text-muted); font-size: 0.938rem; }
.error { background: var(--danger-soft); border: 1px solid #fecaca; color: #991b1b; padding: 1rem; border-radius: var(--radius-md); margin: 1rem 0; font-size: 0.938rem; }
</style>

<style scoped>
.app {
  min-height: 100vh;
}

.main-col {
  margin-left: var(--sidebar-w-expanded);
  transition: margin-left 180ms ease;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-app);
}

.main-col.is-collapsed {
  margin-left: var(--sidebar-w-collapsed);
}

.page {
  padding: var(--space-6);
  max-width: 1440px;
  width: 100%;
  box-sizing: border-box;
}
</style>
