const { Pool } = require('pg');

// Supabase 连接字符串（添加 sslmode=no-verify 跳过证书验证）
const connectionString = 'postgresql://postgres.ruqwijrtrsvwgwvhkbej:%40%40LYZ3467922@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=no-verify';

console.log('开始测试数据库连接...');
console.log('连接字符串（密码已隐藏）:', connectionString.replace(/:[^:@]+@/, ':****@'));

const pool = new Pool({
  connectionString: connectionString,
  connectionTimeoutMillis: 10000,
});

pool.query('SELECT NOW() as current_time', (err, res) => {
  if (err) {
    console.error('❌ 数据库连接失败！');
    console.error('错误信息:', err.message);
    console.error('错误代码:', err.code);
    pool.end(() => {
      process.exit(1);
    });
  } else {
    console.log('✅ 数据库连接成功！');
    console.log('当前时间:', res.rows[0].current_time);

    // 测试创建表
    pool.query(`
      CREATE TABLE IF NOT EXISTS test_table (
        id SERIAL PRIMARY KEY,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `, (err, res) => {
      if (err) {
        console.error('❌ 创建表失败:', err.message);
      } else {
        console.log('✅ 创建表成功');

        // 测试插入数据
        pool.query('INSERT INTO test_table DEFAULT VALUES', (err, res) => {
          if (err) {
            console.error('❌ 插入数据失败:', err.message);
          } else {
            console.log('✅ 插入数据成功');

            // 测试查询数据
            pool.query('SELECT COUNT(*) as count FROM test_table', (err, res) => {
              if (err) {
                console.error('❌ 查询数据失败:', err.message);
              } else {
                console.log('✅ 查询数据成功，记录数:', res.rows[0].count);
              }
              pool.end(() => process.exit(0));
            });
          }
        });
      }
    });
  }
});

// 超时处理
setTimeout(() => {
  console.error('❌ 连接超时！');
  pool.end(() => process.exit(1));
}, 15000);
