import { NextResponse } from "next/server"
import pg from 'pg'

const { Pool } = pg

export async function POST() {
  try {
    const databaseUrl = process.env.DATABASE_URL

    if (!databaseUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "DATABASE_URL 环境变量未配置",
          debug: {
            hasPGHOST: !!process.env.PGHOST,
            hasPGPORT: !!process.env.PGPORT,
            hasPGUSER: !!process.env.PGUSER,
            hasPGPASSWORD: !!process.env.PGPASSWORD,
            hasPGDATABASE: !!process.env.PGDATABASE,
          }
        },
        { status: 500 }
      )
    }

    // 解析连接字符串，提供调试信息
    let parsedUrl: URL
    try {
      parsedUrl = new URL(databaseUrl)
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: "DATABASE_URL 格式无效",
          error: "无法解析连接字符串",
          urlPreview: databaseUrl.replace(/:[^:@]+@/, ':****@')
        },
        { status: 500 }
      )
    }

    // 检查连接字符串中的关键部分
    const isSupabase = parsedUrl.hostname.includes('supabase.co')
    const isPooler = parsedUrl.hostname.includes('pooler')
    const username = parsedUrl.username

    // Supabase 直接连接模式，用户名应该是 postgres（不带项目引用）
    if (isSupabase && !isPooler && username.includes('.')) {
      console.warn('⚠️ 警告：检测到 Supabase 直接连接模式，但用户名包含项目引用')
      console.warn('当前用户名:', username)
      console.warn('建议用户名: postgres')
      console.warn('当前主机:', parsedUrl.hostname)
    }

    // Supabase Pooler 模式，用户名应该是 postgres.[PROJECT_REF]
    if (isSupabase && isPooler && !username.includes('.')) {
      console.warn('⚠️ 警告：检测到 Supabase Pooler 模式，但用户名不包含项目引用')
      console.warn('当前用户名:', username)
      console.warn('建议用户名: postgres.[PROJECT_REF]')
      console.warn('当前主机:', parsedUrl.hostname)
    }

    console.log('数据库连接信息:')
    console.log('  主机:', parsedUrl.hostname)
    console.log('  端口:', parsedUrl.port)
    console.log('  数据库:', parsedUrl.pathname.substring(1))
    console.log('  用户名:', username)
    console.log('  是否 Supabase:', isSupabase)
    console.log('  是否 Pooler:', isPooler)

    const pool = new Pool({
      connectionString: databaseUrl,
      connectionTimeoutMillis: 10000,
    })

    // 创建 categories 表
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL UNIQUE,
        order VARCHAR(10) NOT NULL DEFAULT '0',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `)

    // 创建 categories_order_idx 索引
    await pool.query(`
      CREATE INDEX IF NOT EXISTS categories_order_idx ON categories(order)
    `)

    // 创建 questions 表
    await pool.query(`
      CREATE TABLE IF NOT EXISTS questions (
        id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
        category_id VARCHAR(36) NOT NULL REFERENCES categories(id),
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        is_frequent BOOLEAN NOT NULL DEFAULT FALSE,
        order VARCHAR(10) NOT NULL DEFAULT '0',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE
      )
    `)

    // 创建 questions_category_id_idx 索引
    await pool.query(`
      CREATE INDEX IF NOT EXISTS questions_category_id_idx ON questions(category_id)
    `)

    // 创建 questions_order_idx 索引
    await pool.query(`
      CREATE INDEX IF NOT EXISTS questions_order_idx ON questions(order)
    `)

    // 检查现有数据
    const categoriesResult = await pool.query('SELECT COUNT(*) as count FROM categories')
    const questionsResult = await pool.query('SELECT COUNT(*) as count FROM questions')

    await pool.end()

    return NextResponse.json({
      success: true,
      message: "数据库初始化成功！",
      data: {
        categories: parseInt(categoriesResult.rows[0].count),
        questions: parseInt(questionsResult.rows[0].count),
      }
    })

  } catch (error: any) {
    console.error('数据库初始化失败：', error)
    return NextResponse.json(
      {
        success: false,
        message: "数据库初始化失败",
        error: error.message
      },
      { status: 500 }
    )
  }
}
