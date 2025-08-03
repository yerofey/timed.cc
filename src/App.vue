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
import { ref, watch } from 'vue';
import { darkTheme } from 'naive-ui';
import { useTheme } from '@composables/useTheme.js';

const currentTheme = ref(null);
const { isDarkMode } = useTheme();

// Update Naive UI theme based on dark mode preference
watch(isDarkMode, (dark) => {
  currentTheme.value = dark ? darkTheme : null;
}, { immediate: true });
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
