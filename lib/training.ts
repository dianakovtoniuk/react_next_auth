import db from './db';

export interface Training {
  id: number;
  title: string;
  image: string;
  description: string;
}

export function getTrainings(): Training[] {
  const stmt = db.prepare('SELECT * FROM trainings');
  return stmt.all() as Training[];
}
