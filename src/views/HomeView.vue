<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center p-4"
    :class="{ 'bg-gray-50': !isDarkMode, 'bg-gray-900': isDarkMode }"
  >
    <div class="w-full max-w-md mx-auto">
      <!-- Header Section -->
      <div class="text-center mb-8 select-none">
        <div
          class="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
          >
            <!-- Icon from Solar by 480 Design - https://creativecommons.org/licenses/by/4.0/ -->
            <path
              fill="currentColor"
              d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10"
              opacity=".5"
            />
            <path
              fill="currentColor"
              fill-rule="evenodd"
              d="M12 7.25a.75.75 0 0 1 .75.75v3.69l2.28 2.28a.75.75 0 1 1-1.06 1.06l-2.5-2.5a.75.75 0 0 1-.22-.53V8a.75.75 0 0 1 .75-.75"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <h1
          class="text-4xl font-bold mb-2"
          :class="{ 'text-gray-800': !isDarkMode, 'text-white': isDarkMode }"
        >
          Timed Code
        </h1>
        <p
          class="text-lg"
          :class="{ 'text-gray-600': !isDarkMode, 'text-gray-300': isDarkMode }"
        >
          Share links between devices quickly
        </p>
      </div>

      <!-- Form Card -->
      <n-card
        class="rounded-xl shadow-lg"
        :class="{ 'bg-white': !isDarkMode, 'bg-gray-800': isDarkMode }"
      >
        <div class="space-y-6">
          <!-- Input & Button Group -->
          <p
            v-if="!filled"
            class="text-left mb-3"
            :class="{ 'text-gray-800': !isDarkMode, 'text-white': isDarkMode }"
          >
            Paste a URL to generate a code
          </p>
          <div v-if="!filled" class="flex flex-col sm:flex-row gap-3">
            <n-input
              v-model:value="url"
              placeholder="Enter your URL here..."
              clearable
              :disabled="loading"
              @keyup.enter="createCode"
              size="large"
              class="flex-grow"
            />
            <n-button
              type="primary"
              :disabled="!url || loading"
              @click="createCode"
              :loading="loading"
              size="large"
              class="sm:w-auto w-full"
            >
              Generate
            </n-button>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="flex justify-center">
            <n-spin size="large">
              <template #description>
                <div
                  class="mt-4 text-lg"
                  :class="{
                    'text-gray-600': !isDarkMode,
                    'text-gray-300': isDarkMode,
                  }"
                >
                  Generating code...
                </div>
              </template>
            </n-spin>
          </div>

          <!-- Generated Code Section -->
          <div v-if="code" class="flex flex-col items-center">
            <div class="flex flex-col items-center space-y-4">
              <!-- Generated Code -->
              <div class="flex items-center gap-2">
                <n-tag
                  :bordered="false"
                  type="info"
                  size="large"
                  round
                  class="flex-1 justify-center py-4 select-none"
                >
                  <n-h2 class="flex !my-1">{{ code }}</n-h2>
                </n-tag>
                <n-button quaternary circle @click="copyCode" size="large">
                  <template #icon>
                    <n-icon><CopyIcon /></n-icon>
                  </template>
                </n-button>
              </div>

              <!-- QR Code -->
              <div
                class="flex mt-2 rounded-lg"
                :class="{
                  'bg-gray-50': !isDarkMode,
                  'bg-gray-700': isDarkMode,
                }"
              >
                <n-qr-code
                  :size="140"
                  padding="10"
                  type="svg"
                  error-correction-level="M"
                  :value="fullUrl"
                />
              </div>

              <!-- Return button -->
              <n-button
                @click="handleClearClick"
                tertiary
                round
                size="small"
                class="mt-4 sm:w-auto w-full"
              >
                Go back
              </n-button>
            </div>
          </div>

          <!-- or -->
          <n-divider
            v-if="!code"
            dashed
            title-placement="left"
            class="!my-6 select-none"
            >or</n-divider
          >

          <!-- Code Input -->
          <p
            v-if="!code"
            class="text-left mb-3"
            :class="{ 'text-gray-800': !isDarkMode, 'text-white': isDarkMode }"
          >
            Enter a code to retrieve a URL
          </p>
          <div v-if="!code" class="flex flex-col sm:flex-row gap-3 mt-4">
            <n-input
              v-model:value="enteredCode"
              placeholder="Enter your code here..."
              clearable
              @keyup.enter="redirectWithCode"
              size="large"
              class="flex-grow"
            />
            <n-button
              type="primary"
              :disabled="!enteredCode"
              @click="redirectWithCode"
              size="large"
              class="sm:w-auto w-full"
            >
              Go
            </n-button>
          </div>
        </div>
      </n-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { CopyOutline as CopyIcon } from '@vicons/ionicons5';
import { useMessage } from 'naive-ui';
import { useEncryption } from '../composables/useEncryption.js';

const isDev = import.meta.env.IS_LOCAL === 'true';
const apiBasePath = import.meta.env.VITE_API_BASE_PATH || '/api';
const websiteUrl = import.meta.env.VITE_WEBSITE_URL || 'http://localhost:5173';
const encryptionKey = import.meta.env.VITE_ENCRYPTION_KEY;
const { encrypt } = useEncryption(encryptionKey);

const filled = ref(false);
const url = ref('');
const code = ref('');
const enteredCode = ref('');
const loading = ref(false);
const message = useMessage();

const isDarkMode = computed(() => {
  return (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
});

const fullUrl = computed(() => {
  return code.value ? `${websiteUrl}/${encodeURIComponent(code.value)}` : '';
});

async function createCode() {
  if (!url.value) {
    message.error('Please enter a URL.');
    return;
  }

  filled.value = true;
  loading.value = true;

  try {
    const encryptedUrl = encrypt(url.value);

    if (!encryptedUrl) {
      console.error('Failed to encrypt URL.');
      return;
    }

    const res = await fetch(`${apiBasePath}/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ encryptedUrl }),
    });

    const data = await res.json();
    code.value = data.code;
  } catch (err) {
    console.error('Error creating code:', err);
    message.error('Failed to create code. Please try again.');
  } finally {
    loading.value = false;
  }
}

function copyCode() {
  if (!code.value) return;
  navigator.clipboard.writeText(code.value);
  message.success('Copied to clipboard!');
}

const handleClearClick = () => {
  filled.value = false;
  url.value = '';
  code.value = '';
  enteredCode.value = '';
};

function redirectWithCode() {
  if (!enteredCode.value) {
    message.error('Please enter a code.');
    return;
  }

  $router.push(`/${encodeURIComponent(enteredCode.value)}`);
}
</script>
