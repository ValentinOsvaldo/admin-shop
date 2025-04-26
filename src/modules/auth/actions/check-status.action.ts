import { tesloApi } from '@/api/tesloApi';
import type { AuthResponse, User } from '../interfaces';

interface CheckError {
  ok: false;
  message: string;
}

interface CheckSuccess {
  ok: true;
  user: User;
  token: string;
}

export const checkStatusAction = async (): Promise<CheckSuccess | CheckError> => {
  try {
    const localToken = localStorage.getItem('token');

    if (!localToken) return { ok: false, message: 'Empty token' };

    if (localToken && localToken.length === 0) {
      return { ok: false, message: 'Empty token' };
    }

    const { data } = await tesloApi.get<AuthResponse>('/auth/check-status');

    return {
      ok: true,
      user: data.user,
      token: data.token,
    };
  } catch (error) {
    console.error(error);

    return {
      ok: false,
      message: 'Is not possible verify token',
    };
  }
};
