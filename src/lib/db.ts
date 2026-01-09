import { drizzle } from "drizzle-orm/node-postgres"
import pg from "pg"
import * as schema from "@/storage/database/shared/schema"

const { Pool } = pg

// 数据库连接池
let pool: pg.Pool | null = null
let db: ReturnType<typeof drizzle> | null = null

// Supabase 连接字符串规范化函数
function normalizeSupabaseUrl(url: string): string {
  try {
    const parsed = new URL(url)

    // 检查是否是 Supabase URL
    if (parsed.hostname.includes('supabase.co')) {
      // Supabase Pooler 模式：用户名应该是 postgres.[PROJECT_REF]
      // Supabase 直接连接模式：用户名应该是 postgres
      const isPooler = parsed.hostname.includes('pooler')
      const username = parsed.username

      // 如果是 Pooler 模式但用户名不包含项目引用，尝试从密码或主机名提取
      if (isPooler && !username.includes('.')) {
        console.log('检测到 Supabase Pooler 模式但用户名格式不正确，尝试修正...')
        // 从主机名提取项目引用，例如：aws-0-ap-southeast-1.pooler.supabase.com
        // 实际上，我们需要从密码或其他地方获取项目引用
        // 这里我们先返回原 URL，让用户手动修正
      }

      // 如果是直接连接模式但用户名包含项目引用，移除它
      if (!isPooler && username.includes('.')) {
        const parts = username.split('.')
        if (parts[0] === 'postgres' && parts.length > 1) {
          const newUsername = 'postgres'
          parsed.username = newUsername
          const normalized = parsed.toString()
          console.log('修正后的 Supabase 连接字符串（移除用户名中的项目引用）')
          console.log('旧用户名:', username, '-> 新用户名:', newUsername)
          return normalized
        }
      }
    }

    return url
  } catch (error) {
    console.error('解析连接字符串失败:', error)
    return url
  }
}

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
    connectionString = normalizeSupabaseUrl(databaseUrl)
    console.log('使用 DATABASE_URL 连接数据库')
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
    console.log('从 PG* 环境变量构建连接字符串')
  }

  // 创建连接池
  pool = new Pool({
    connectionString: connectionString,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  })

  // 测试连接
  try {
    const client = await pool.connect()
    console.log('数据库连接成功')
    client.release()
  } catch (error: any) {
    console.error('数据库连接失败:', error.message)
    console.error('连接字符串（密码已隐藏）:', connectionString.replace(/:[^:@]+@/, ':****@'))
    throw error
  }

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
