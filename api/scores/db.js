/**
 * ChessArcade - Database Connection (Supabase Postgres)
 *
 * Configuración de conexión a Supabase usando postgres.js
 */

import postgres from 'postgres';

// Connection string desde environment variables
const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL;

if (!connectionString) {
  throw new Error(
    'DATABASE_URL or DIRECT_URL environment variable is required. ' +
    'Please add it to your .env.local file or Vercel project settings.'
  );
}

/**
 * Create Postgres connection with pooling
 *
 * Configuration optimized for Supabase:
 * - max: 10 concurrent connections
 * - idle_timeout: Close idle connections after 20s
 * - connect_timeout: Connection timeout 10s
 */
export const sql = postgres(connectionString, {
  max: 10,              // Maximum number of connections in pool
  idle_timeout: 20,     // Close connections idle for 20 seconds
  connect_timeout: 10,  // Timeout for establishing connection
  // Supabase uses SSL by default, no need to configure
});

// Export as default for convenience
export default sql;

/**
 * Usage example:
 *
 * import sql from './db.js';
 *
 * // Simple query
 * const scores = await sql`SELECT * FROM scores LIMIT 10`;
 *
 * // Parameterized query
 * const game = 'square-rush';
 * const result = await sql`
 *   SELECT * FROM scores
 *   WHERE game = ${game}
 *   ORDER BY score DESC
 *   LIMIT 50
 * `;
 */
