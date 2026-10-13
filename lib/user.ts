import db from './db';

export function createUser(email: string, password: string): number | bigint {
  const result = db
    .prepare('INSERT INTO users (email, password) VALUES (?, ?)')
    .run(email, password);
  return result.lastInsertRowid;
}