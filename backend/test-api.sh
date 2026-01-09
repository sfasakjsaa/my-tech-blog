#!/bin/bash

# Azhen Blog Backend API 测试脚本

BASE_URL="http://localhost:8080/api"

echo "=================================="
echo "Azhen Blog Backend API 测试"
echo "=================================="
echo ""

# 测试 1: 获取所有分类
echo "测试 1: 获取所有分类"
curl -s "$BASE_URL/categories" | jq '.'
echo ""
echo "----------------------------------"
echo ""

# 测试 2: 创建分类
echo "测试 2: 创建分类"
CATEGORY_RESPONSE=$(curl -s -X POST "$BASE_URL/categories" \
  -H "Content-Type: application/json" \
  -d '{"name":"前端技术","order":"1"}')
echo "$CATEGORY_RESPONSE" | jq '.'
CATEGORY_ID=$(echo "$CATEGORY_RESPONSE" | jq -r '.data.id')
echo "创建的分类 ID: $CATEGORY_ID"
echo ""
echo "----------------------------------"
echo ""

# 测试 3: 获取所有分类（验证创建成功）
echo "测试 3: 获取所有分类（验证创建成功）"
curl -s "$BASE_URL/categories" | jq '.'
echo ""
echo "----------------------------------"
echo ""

# 测试 4: 创建题目
echo "测试 4: 创建题目"
QUESTION_RESPONSE=$(curl -s -X POST "$BASE_URL/questions" \
  -H "Content-Type: application/json" \
  -d "{
    \"categoryId\": \"$CATEGORY_ID\",
    \"title\": \"React Hooks 使用指南\",
    \"content\": \"React Hooks 是 React 16.8 引入的新特性...\",
    \"isFrequent\": true
  }")
echo "$QUESTION_RESPONSE" | jq '.'
QUESTION_ID=$(echo "$QUESTION_RESPONSE" | jq -r '.data.id')
echo "创建的题目 ID: $QUESTION_ID"
echo ""
echo "----------------------------------"
echo ""

# 测试 5: 获取题目列表
echo "测试 5: 获取题目列表"
curl -s "$BASE_URL/questions?categoryId=$CATEGORY_ID" | jq '.'
echo ""
echo "----------------------------------"
echo ""

# 测试 6: 搜索题目
echo "测试 6: 搜索题目"
curl -s "$BASE_URL/questions?search=React" | jq '.'
echo ""
echo "----------------------------------"
echo ""

# 测试 7: 更新题目
echo "测试 7: 更新题目"
curl -s -X PUT "$BASE_URL/questions/$QUESTION_ID" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"React Hooks 完整指南（更新版）\",
    \"content\": \"React Hooks 是 React 16.8 引入的新特性，更新了更多内容...\",
    \"isFrequent\": true
  }" | jq '.'
echo ""
echo "----------------------------------"
echo ""

# 测试 8: 删除题目
echo "测试 8: 删除题目"
curl -s -X DELETE "$BASE_URL/questions/$QUESTION_ID" | jq '.'
echo ""
echo "----------------------------------"
echo ""

# 测试 9: 删除分类
echo "测试 9: 删除分类"
curl -s -X DELETE "$BASE_URL/categories/$CATEGORY_ID" | jq '.'
echo ""
echo "----------------------------------"
echo ""

echo "=================================="
echo "所有测试完成！"
echo "=================================="
