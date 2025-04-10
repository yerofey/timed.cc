<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen text-center p-4"
    :class="{ 'bg-gray-50': !isDarkMode, 'bg-gray-900': isDarkMode }"
  >
    <!-- Loading State -->
    <div v-if="loading" class="space-y-6">
      <n-spin size="large">
        <template #description>
          <div class="mt-4 text-lg" :class="loadingTextClass">
            Redirecting...
          </div>
        </template>
      </n-spin>
    </div>

    <!-- Error State -->
    <n-result
      v-else-if="error"
      status="404"
      title="Code Not Found"
      description="The code you provided does not exist or has expired."
    >
      <template #footer>
        <n-button type="primary" @click="$router.push('/')">
          Back to Home
        </n-button>
      </template>
    </n-result>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useEncryption } from '../composables/useEncryption.js';

const encryptionKey = import.meta.env.VITE_ENCRYPTION_KEY;
const { decrypt } = useEncryption(encryptionKey);

const loading = ref(true);
const error = ref(false);
const route = useRoute();

const isDarkMode = computed(() => {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches;
});

const loadingTextClass = computed(() => ({
  'text-gray-600': !isDarkMode.value,
  'text-gray-300': isDarkMode.value,
}));

onMounted(async () => {
  const code = decodeURIComponent(route.params.code);

  try {
    const res = await fetch(`/api/resolve/${code}`);

    if (!res.ok) throw new Error('Network response was not ok');

    const data = await res.json();

    // Check if the response contains a URL
    if (!data.encryptedUrl) throw new Error('No URL found');

    const { encryptedUrl } = data;

    const decryptedUrl = decrypt(encryptedUrl);
    if (!decryptedUrl) throw new Error('Failed to decrypt URL');

    // Immediate redirect when ready
    window.location.href = decryptedUrl;
  } catch (e) {
    console.error('Error fetching the URL:', e);
    error.value = true;
  } finally {
    loading.value = false;
  }
});
</script>
