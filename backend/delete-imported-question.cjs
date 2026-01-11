const fs = require('fs');
const path = require('path');

// 读取现有题目
const questionsPath = path.join(__dirname, 'data/questions.json');
const questions = JSON.parse(fs.readFileSync(questionsPath, 'utf-8'));

// 删除之前导入的题目（id: 1768102845323）
const filteredQuestions = questions.filter(q => q.id !== 1768102845323);

// 写入文件
fs.writeFileSync(questionsPath, JSON.stringify(filteredQuestions, null, 2), 'utf-8');

console.log(`已删除之前导入的题目，当前题库共 ${filteredQuestions.length} 道题目。`);
