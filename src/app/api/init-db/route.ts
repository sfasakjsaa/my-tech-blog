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

    const pool = new Pool({
      connectionString: databaseUrl,
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
