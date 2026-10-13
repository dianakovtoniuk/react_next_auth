import { cookies } from 'next/headers';
import { Lucia } from 'lucia';
import { BetterSqlite3Adapter } from '@lucia-auth/adapter-sqlite';

import db from './db';

const adapter = new BetterSqlite3Adapter(db, {
  user: 'users',
  session: 'sessions',
});

const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === 'production',
    },
  },
});

export async function createAuthSession(userId: string): Promise<void> {
  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
}

export async function verifyAuth() {
  const sessionCookie = cookies().get(lucia.sessionCookieName);

  if (!sessionCookie || !sessionCookie.value) {
    return {
      user: null,
      session: null,
    };
  }

  const result = await lucia.validateSession(sessionCookie.value);

  try {
    if (result.session && result.session.fresh) {
      const freshCookie = lucia.createSessionCookie(result.session.id);
      cookies().set(
        freshCookie.name,
        freshCookie.value,
        freshCookie.attributes
      );
    }
    if (!result.session) {
      const blankCookie = lucia.createBlankSessionCookie();
      cookies().set(
        blankCookie.name,
        blankCookie.value,
        blankCookie.attributes
      );
    }
  } catch {}

  return result;
}