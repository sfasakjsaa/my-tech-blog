const fs = require('fs');
const path = require('path');

// 读取题目
const questions = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/questions.json'), 'utf-8'));

// 筛选 JS 数据类型题目
const jsQuestions = questions.filter(q => q.categoryId === '1768000001003');

console.log(`JS 数据类型题目共 ${jsQuestions.length} 道：\n`);
jsQuestions.forEach((q, i) => {
  const frequent = q.isFrequent ? ' [常考]' : '';
  console.log(`${i + 1}. ${q.title}${frequent}`);
  console.log(`   内容长度: ${q.content.length} 字符`);
  console.log('');
});
