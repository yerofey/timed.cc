<template>
  <n-config-provider :theme="currentTheme">
    <n-notification-provider>
      <n-dialog-provider>
        <n-message-provider>
          <router-view />
        </n-message-provider>
      </n-dialog-provider>
    </n-notification-provider>
  </n-config-provider>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { darkTheme } from 'naive-ui';

const currentTheme = ref(null);

// Check for system color scheme preference
const checkDarkModePreference = () => {
  currentTheme.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    ? darkTheme
    : null;
};

onMounted(() => {
  checkDarkModePreference();

  // Watch for changes in system preference
  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  darkModeMediaQuery.addEventListener('change', checkDarkModePreference);
});

onUnmounted(() => {
  // Clean up the event listener
  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  darkModeMediaQuery.removeEventListener('change', checkDarkModePreference);
});
</script>

<style>
body {
  font-family: 'Inter', sans-serif;
  font-display: swap;
}

.code-font {
  font-family: 'JetBrains Mono', monospace;
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
