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

  // 从环境变量获取数据库配置
  const databaseUrl = process.env.DATABASE_URL

  let connectionString: string

  if (databaseUrl && !databaseUrl.includes('${')) {
    // 如果有完整的 DATABASE_URL 且不包含变量引用，直接使用
    connectionString = databaseUrl
  } else {
    // 否则从单独的环境变量构建连接字符串（Prisma Postgres 模式）
    const pgHost = process.env.PGHOST
    const pgPort = process.env.PGPORT || '5432'
    const pgUser = process.env.PGUSER || 'postgres'
    const pgPassword = process.env.PGPASSWORD
    const pgDatabase = process.env.PGDATABASE || 'postgres'

    if (!pgHost || !pgPassword) {
      throw new Error("Database environment variables not set. Please check PGHOST and PGPASSWORD")
    }

    // 构建连接字符串
    connectionString = `postgresql://${pgUser}:${pgPassword}@${pgHost}:${pgPort}/${pgDatabase}`
  }

  // 创建连接池
  pool = new Pool({
    connectionString: connectionString,
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
