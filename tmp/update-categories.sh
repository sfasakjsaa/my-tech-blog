#!/bin/bash

# 删除旧分类
echo "Deleting old categories..."
curl -X DELETE http://localhost:5000/api/proxy/categories/1767966254373
echo ""
curl -X DELETE http://localhost:5000/api/proxy/categories/1767966254375
echo ""
curl -X DELETE http://localhost:5000/api/proxy/categories/1768006141087
echo ""

# 添加新分类
echo "Adding new categories..."
curl -X POST http://localhost:5000/api/proxy/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "🍇 HTML"}'
echo ""

curl -X POST http://localhost:5000/api/proxy/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "🍈 CSS"}'
echo ""

curl -X POST http://localhost:5000/api/proxy/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "🍉 JS-数据类型"}'
echo ""

curl -X POST http://localhost:5000/api/proxy/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "🍊 JS-基础"}'
echo ""

curl -X POST http://localhost:5000/api/proxy/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "🍋 JS-ES6"}'
echo ""

curl -X POST http://localhost:5000/api/proxy/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "🍒 JS-进阶"}'
echo ""

curl -X POST http://localhost:5000/api/proxy/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "🍍 Vue"}'
echo ""

curl -X POST http://localhost:5000/api/proxy/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "🍐 小程序"}'
echo ""

curl -X POST http://localhost:5000/api/proxy/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "🥭 性能优化"}'
echo ""

curl -X POST http://localhost:5000/api/proxy/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "🍎 工程化"}'
echo ""

curl -X POST http://localhost:5000/api/proxy/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "🫐 手写"}'
echo ""

curl -X POST http://localhost:5000/api/proxy/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "🥝 看代码写结果"}'
echo ""

curl -X POST http://localhost:5000/api/proxy/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "🍑 非技问答"}'
echo ""

curl -X POST http://localhost:5000/api/proxy/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "🌽 到ArkTS适配规则"}'
echo ""

curl -X POST http://localhost:5000/api/proxy/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "🛠️ 工具"}'
echo ""

echo "Done! Verifying categories..."
curl -s http://localhost:5000/api/proxy/categories
