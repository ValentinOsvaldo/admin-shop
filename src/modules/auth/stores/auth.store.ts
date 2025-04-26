import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';
import { AuthStatus, type RegisterForm, type User } from '../interfaces';
import { checkStatusAction, loginAction, registerAction } from '../actions';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | undefined>();
  const token = ref(useLocalStorage('token', ''));
  const status = ref<AuthStatus>(AuthStatus.Authenticating);

  const login = async (email: string, password: string) => {
    try {
      const loginResponse = await loginAction(email, password);

      if (!loginResponse.ok) {
        logout();
        return false;
      }

      user.value = loginResponse.user;
      token.value = loginResponse.token;
      status.value = AuthStatus.Authenticated;

      return true;
    } catch {
      return logout();
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    status.value = AuthStatus.Unauthenticated;
    user.value = undefined;
    token.value = '';
    return false;
  };

  const register = async (register: RegisterForm) => {
    try {
      const registerRes = await registerAction(register);

      if (!registerRes.ok) {
        logout();

        return { ok: false, message: registerRes.message };
      }

      user.value = registerRes.user;
      token.value = registerRes.token;
      status.value = AuthStatus.Authenticated;

      return { ok: true, message: '' };
    } catch {
      return { ok: false, message: 'Error al registrar el usuario' };
    }
  };

  const checkAuthStatus = async (): Promise<boolean> => {
    try {
      const statusRes = await checkStatusAction();

      if (!statusRes.ok) {
        logout();
        return false;
      }

      user.value = statusRes.user;
      token.value = statusRes.token;
      status.value = AuthStatus.Authenticated;

      return true;
    } catch {
      logout();
      return false;
    }
  };

  return {
    status,
    user,
    token,
    // Getters
    isChecking: computed(() => status.value === AuthStatus.Authenticating),
    isAuthenticated: computed(() => status.value === AuthStatus.Authenticated),
    username: computed(() => user.value?.fullName),
    isAdmin: computed(() => user.value?.roles.includes('admin') ?? false),
    // TODO: getter to know if is admin or not

    // Actions
    login,
    logout,
    register,
    checkAuthStatus,
  };
});
