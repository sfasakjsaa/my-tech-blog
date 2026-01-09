import { drizzle } from "drizzle-orm/node-postgres"
import pg from "pg"
import * as schema from "@/storage/database/shared/schema"

const { Pool } = pg

// 数据库连接池
let pool: pg.Pool | null = null
let db: ReturnType<typeof drizzle> | null = null

export async function getDb() {
  // 如果已有连接，直接返回
  if (db) {
    return db
  }

  // 从环境变量获取数据库 URL
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is not set")
  }

  // 创建连接池
  pool = new Pool({
    connectionString: databaseUrl,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  })

  // 创建 Drizzle 实例
  db = drizzle(pool, { schema })

  return db
}

// 关闭数据库连接（用于优雅关闭）
export async function closeDb() {
  if (pool) {
    await pool.end()
    pool = null
    db = null
  }
}
