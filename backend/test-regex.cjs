const fs = require('fs');
const path = require('path');

// 读取 Markdown 文件
const markdownContent = fs.readFileSync(path.join(__dirname, '../assets/CSS.md'), 'utf-8');

// 测试正则表达式
const regex = /###\s+\d+\.\*?\s*/g;
const matches = markdownContent.match(regex);

console.log(`匹配到 ${matches ? matches.length : 0} 个标题：`);
if (matches) {
  matches.forEach((m, i) => {
    console.log(`${i + 1}. ${m}`);
  });
}

// 尝试分割
const parts = markdownContent.split(regex);
console.log(`\n分割得到 ${parts.length} 部分`);
