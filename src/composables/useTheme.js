import { ref, computed, onMounted, onUnmounted } from 'vue';

/**
 * Composable for theme-related functionality
 * @returns {Object} Theme utilities and state
 */
export function useTheme() {
  const darkMode = ref(false);

  // Check if dark mode is enabled in system preferences
  const isDarkMode = computed(() => darkMode.value);

  // Classes for common UI elements based on theme
  const textClass = computed(() => ({
    'text-gray-800': !darkMode.value,
    'text-white': darkMode.value,
  }));

  const secondaryTextClass = computed(() => ({
    'text-gray-600': !darkMode.value,
    'text-gray-300': darkMode.value,
  }));

  const bgClass = computed(() => ({
    'bg-white': !darkMode.value,
    'bg-gray-800': darkMode.value,
  }));

  const pageBgClass = computed(() => ({
    'bg-gray-50': !darkMode.value,
    'bg-gray-900': darkMode.value,
  }));

  // Media query listener for system preference changes
  let mediaQuery;

  const updateTheme = () => {
    darkMode.value = window.matchMedia?.('(prefers-color-scheme: dark)').matches || false;
  };

  onMounted(() => {
    updateTheme();
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', updateTheme);
  });

  onUnmounted(() => {
    mediaQuery?.removeEventListener('change', updateTheme);
  });

  return {
    darkMode,
    isDarkMode,
    textClass,
    secondaryTextClass,
    bgClass,
    pageBgClass,
    updateTheme,
  };
}
