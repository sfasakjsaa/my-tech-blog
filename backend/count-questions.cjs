const fs = require('fs');
const path = require('path');

// 读取题目和分类
const questions = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/questions.json'), 'utf-8'));
const categories = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/categories.json'), 'utf-8'));

// 统计每个分类的题目数量
const categoryCount = {};
questions.forEach(q => {
  const catId = q.categoryId;
  if (!categoryCount[catId]) {
    categoryCount[catId] = 0;
  }
  categoryCount[catId]++;
});

// 输出统计
console.log('题库统计：');
console.log(`总题目数：${questions.length}`);
console.log('');
categories.forEach(cat => {
  const count = categoryCount[cat.id] || 0;
  console.log(`${cat.name}: ${count} 题`);
});
