'use server';

import { redirect } from 'next/navigation';

import { hashUserPassword, verifyPassword } from '@/lib/hash';
import { createUser, getUserByEmail } from '@/lib/user';
import { createAuthSession, destroySession } from '@/lib/auth';

interface AuthFormState {
  errors?: {
    email?: string;
    password?: string;
  };
}

export async function signup(
  prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const errors: NonNullable<AuthFormState['errors']> = {};

  if (!email.includes('@')) {
    errors.email = 'Please enter a valid email address.';
  }

  if (password.trim().length < 8) {
    errors.password = 'Password must be at least 8 characters long.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const hashedPassword = hashUserPassword(password);
  try {
    const id = createUser(email, hashedPassword);
    await createAuthSession(String(id));
    redirect('/training');
  } catch (error) {
    if (
      error instanceof Error &&
      'code' in error &&
      error.code === 'SQLITE_CONSTRAINT_UNIQUE'
    ) {
      return {
        errors: {
          email:
            'It seems like an account for the chosen email already exists.',
        },
      };
    }
    throw error;
  }
}

export async function login(
  prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const existingUser = getUserByEmail(email);

  if (!existingUser) {
    return {
      errors: {
        email: 'Could not authenticate user, please check your credentials.',
      },
    };
  }

  const isValidPassword = verifyPassword(existingUser.password, password);

  if (!isValidPassword) {
    return {
      errors: {
        password: 'Could not authenticate user, please check your credentials.',
      },
    };
  }

  await createAuthSession(String(existingUser.id));
  redirect('/training');
}

export async function auth(
  mode: string,
  prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  if (mode === 'login') {
    return login(prevState, formData);
  }
  return signup(prevState, formData);
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect('/');
}