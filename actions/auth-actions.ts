'use server';

import { redirect } from 'next/navigation';

import { hashUserPassword } from '@/lib/hash';
import { createUser } from '@/lib/user';

interface SignupFormState {
  errors?: {
    email?: string;
    password?: string;
  };
}

export async function signup(
  prevState: SignupFormState,
  formData: FormData
): Promise<SignupFormState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const errors: NonNullable<SignupFormState['errors']> = {};

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
    createUser(email, hashedPassword);
  } catch (error) {
    if (
      error instanceof Error &&
      'code' in error &&
      error.code === 'SQLITE_CONSTRAINT_UNIQUE'
    ) {
      return {
        errors: {
          email: 'It seems like an account for the chosen email already exists.',
        },
      };
    }
    throw error;
  }

  redirect('/training');
}