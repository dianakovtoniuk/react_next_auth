import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { logout } from '@/actions/auth-actions';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Next Auth',
  description: 'Next.js Authentication',
};

export default function AuthRootLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header id="auth-header">
        <p>Welcome back!</p>
        <form action={logout}>
          <button>Logout</button>
        </form>
      </header>
      {children}
    </>
  );
}