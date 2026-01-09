const pg = require('pg')
const { Pool } = pg

// 使用直连模式，强制使用 IPv4
const connectionString = 'postgresql://postgres:%40%40Lyz13467922@db.ruqwijrtrsvwgwvhkbej.supabase.co:5432/postgres'

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
})

async function testConnection() {
  console.log('尝试连接数据库...')
  console.log('连接字符串:', connectionString)

  try {
    const client = await pool.connect()
    console.log('✅ 数据库连接成功！')

    // 测试查询
    const result = await client.query('SELECT NOW()')
    console.log('数据库时间:', result.rows[0].now)

    // 检查表是否存在
    const tables = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `)
    console.log('现有表:', tables.rows.map(r => r.table_name))

    client.release()
    pool.end()
  } catch (error) {
    console.error('❌ 数据库连接失败:')
    console.error('错误类型:', error.code)
    console.error('错误信息:', error.message)
    pool.end()
    process.exit(1)
  }
}

testConnection()
