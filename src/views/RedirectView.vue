<template>
  <div class="flex flex-col items-center justify-center min-h-screen text-center p-4"
    :class="{ 'bg-gray-50': !isDarkMode, 'bg-gray-900': isDarkMode }">
    <!-- Loading State -->
    <div v-if="loading" class="space-y-6">
      <n-spin size="large">
        <template #description>
          <div class="mt-4 text-lg" :class="secondaryTextClass">
            Redirecting...
          </div>
        </template>
      </n-spin>
    </div>

    <!-- Error State -->
    <n-result v-else-if="error" status="404" title="Code Not Found"
      description="The code you provided does not exist or has expired.">
      <template #footer>
        <n-button type="primary" @click="$router.push('/')">
          Go Back
        </n-button>
      </template>
    </n-result>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useEncryption } from '@composables/useEncryption.js';
import { useTheme } from '@composables/useTheme.js';
import api from '@services/api';
import { encryptionKey } from '@/config';

const { decrypt } = useEncryption(encryptionKey);

const loading = ref(true);
const error = ref(false);
const route = useRoute();

// Use the theme composable
const { isDarkMode, secondaryTextClass } = useTheme();

onMounted(async () => {
  const code = decodeURIComponent(route.params.code);

  try {
    const data = await api.get(`resolve/${code}`);

    if (!data.encryptedUrl) throw new Error('No URL found');

    const { encryptedUrl } = data;

    const decryptedUrl = decrypt(encryptedUrl);
    if (!decryptedUrl) throw new Error('Failed to decrypt URL');

    window.location.href = decryptedUrl;
  } catch (e) {
    console.error('Error fetching the URL:', e);
    error.value = true;
  } finally {
    loading.value = false;
  }
});
</script>
