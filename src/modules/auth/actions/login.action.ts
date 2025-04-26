import { tesloApi } from '@/api/tesloApi';
import type { AuthResponse, User } from '../interfaces';
import { isAxiosError } from 'axios';

interface LoginError {
  ok: false;
  message: string;
}

interface LoginSuccess {
  ok: true;
  user: User;
  token: string;
}

export const loginAction = async (
  email: string,
  password: string,
): Promise<LoginSuccess | LoginError> => {
  try {
    const resp = await tesloApi.post<AuthResponse>('/auth/login', { email, password });

    return { ...resp.data, ok: true };
  } catch (error) {
    console.error(error);

    if (isAxiosError(error) && error.response?.status === 401) {
      return {
        ok: false,
        message: 'Usuario o contraseña incorrectos',
      };
    }

    console.error(error);
    throw new Error('No se pudo realizar la petición');
  }
};
