import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

import * as schema from './schema';

const client = neon(Bun.env.DATABASE_URL!);
export const db = drizzle(client, { schema, logger: true });