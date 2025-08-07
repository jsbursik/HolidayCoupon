import { drizzle } from 'drizzle-orm/d1';
import type { D1Database } from '@cloudflare/workers-types';
import * as schema from './schema';

export interface Env {
  DB: D1Database;
}

export const createDB = (env: Env) => {
  return drizzle(env.DB, { schema });
};
