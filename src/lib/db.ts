/* Database Connection*/

import { Pool, PoolClient, QueryResult } from 'pg';


const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME || 'ticketing_system',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
      }
)


pool.on('connect', () => { console.log('Connected to database successfully')})

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err)
  process.exit(-1)
})

/* Execute a query */
export const query = async (text: string, params?: any[]): Promise<QueryResult> => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log('Executed query', { text, duration, rows: res.rowCount })
    return res
  } catch (error) {
    console.error('Query error:', error)
    throw error
  }
}

/* Get a client from the pool for transactions */
export const getClient = async (): Promise<PoolClient> => {
  return await pool.connect();
}

/* Close all connections in the pool */
export const closePool = async (): Promise<void> => {
  await pool.end()
  console.log('🔴 Database pool has been closed')
}

export default pool;

