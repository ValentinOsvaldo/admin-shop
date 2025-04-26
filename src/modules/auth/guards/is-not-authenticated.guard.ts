import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import { AuthStatus } from '../interfaces';

const isNotAuthenticatedGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const authStore = useAuthStore();

  await authStore.checkAuthStatus();

  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  authStore.status === AuthStatus.Authenticated ? next({ name: 'home' }) : next();
};

export default isNotAuthenticatedGuard;
