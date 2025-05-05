<template>
  <FullScreenLoader v-if="authStore.isChecking" />
  <RouterView />
  <VueQueryDevtools />
</template>

<script lang="ts" setup>
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';
import { useAuthStore } from './modules/auth/stores/auth.store';
import { AuthStatus } from './modules/auth/interfaces';
import { useRoute, useRouter } from 'vue-router';
import { onUnmounted } from 'vue';
import FullScreenLoader from './modules/common/components/FullScreenLoader.vue';

const authStore = useAuthStore();

const router = useRouter();
const route = useRoute();

const unsubscribe = authStore.$subscribe(
  (_, state) => {
    if (state.status === AuthStatus.Authenticating) {
      authStore.checkAuthStatus();

      return;
    }

    if (route.path.includes('/auth') && state.status === AuthStatus.Authenticated) {
      router.replace({ name: 'home' });
      return;
    }
  },
  {
    immediate: true,
  },
);

onUnmounted(() => {
  unsubscribe();
});
</script>
