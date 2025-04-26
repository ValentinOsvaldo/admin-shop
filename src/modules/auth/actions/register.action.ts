import { tesloApi } from '@/api/tesloApi';
import type { AuthResponse, RegisterForm, User } from '../interfaces';

interface RegisterError {
  ok: false;
  message: string;
}

interface RegisterSuccess {
  ok: true;
  user: User;
  token: string;
}

export const registerAction = async (
  register: RegisterForm,
): Promise<RegisterSuccess | RegisterError> => {
  try {
    const { data } = await tesloApi.post<AuthResponse>('/auth/register', register);

    return {
      ok: true,
      token: data.token,
      user: data.user,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: 'No se pudo crear el usuario',
    };
  }
};
