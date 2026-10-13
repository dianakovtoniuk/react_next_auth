import db from './db';

export interface User {
  id: number;
  email: string;
  password: string;
}

export function createUser(email: string, password: string): number | bigint {
  const result = db
    .prepare('INSERT INTO users (email, password) VALUES (?, ?)')
    .run(email, password);
  return result.lastInsertRowid;
}

export function getUserByEmail(email: string): User | undefined {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email) as
    | User
    | undefined;
}