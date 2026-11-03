import { ref, computed } from 'vue'

const STORAGE_KEY = 'sidebar-collapsed'

// Singleton ref — shared across all components that call useSidebar()
const collapsed = ref(
  (() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored !== null ? JSON.parse(stored) : false
    } catch {
      return false
    }
  })()
)

// Track whether the viewport is below the sidebar-collapse breakpoint
const isSmallScreen = ref(false)

if (typeof window !== 'undefined') {
  const mql = window.matchMedia('(max-width: 1024px)')
  isSmallScreen.value = mql.matches
  mql.addEventListener('change', (e) => {
    isSmallScreen.value = e.matches
  })
}

// effectiveCollapsed overrides the persisted user preference on small screens
// so the sidebar is always icon-only below 1024px without touching localStorage.
const effectiveCollapsed = computed(() => isSmallScreen.value || collapsed.value)

export function useSidebar() {
  const toggle = () => {
    collapsed.value = !collapsed.value
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(collapsed.value))
    } catch {
      // localStorage unavailable — state still works in memory
    }
  }

  return { collapsed, toggle, isSmallScreen, effectiveCollapsed }
}
