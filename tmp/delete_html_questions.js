const fs = require('fs');

// 读取原始数据
const data = JSON.parse(fs.readFileSync('backend/data/questions.json', 'utf8'));

// 过滤掉HTML分类（categoryId: 1768000001001）的题目
const filteredData = data.filter(question => question.categoryId !== '1768000001001');

// 写回文件
fs.writeFileSync('backend/data/questions.json', JSON.stringify(filteredData, null, 2), 'utf8');

console.log(`已删除 ${data.length - filteredData.length} 道HTML分类题目`);
console.log(`剩余 ${filteredData.length} 道题目`);
