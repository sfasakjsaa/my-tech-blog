const fs = require('fs');
const path = require('path');

// 读取 Markdown 文件
const markdownContent = fs.readFileSync(path.join(__dirname, '../assets/CSS.md'), 'utf-8');

// 分类ID
const categoryId = '1768000001003';

// 解析题目
function parseQuestions(content) {
  const questions = [];
  const now = new Date().toISOString();

  // 分割所有题目
  // 第一个题目特殊处理，后面以 ### 数字 开头
  const regex = /###\s+\d+\.\*?\s*/g;
  const parts = content.split(regex);

  console.log(`分割得到 ${parts.length} 部分`);

  // 第一个部分包含第一个题目（没有标题编号）
  let firstPart = parts[0];

  // 提取第一个题目的内容
  const firstQuestionMatch = firstPart.match(/^-\s*JavaScript共有八种数据类型[\s\S]+?(?=\n###|$)/);
  if (firstQuestionMatch) {
    const title = "JavaScript共有八种数据类型";
    const questionContent = firstQuestionMatch[0].replace(/^-\s*/, '').trim();

    questions.push({
      id: Date.now(),
      title: title,
      content: formatContent(questionContent),
      categoryId: categoryId,
      isFrequent: true,
      createdAt: now,
      updatedAt: now
    });
  }

  // 处理后面的题目
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    if (!part.trim()) continue;

    // 提取标题（第一行）
    const lines = part.split('\n');
    let titleLine = lines[0].trim();

    // 处理标题
    let title = titleLine;

    // 提取内容（剩余行）
    let content = lines.slice(1).join('\n').trim();

    if (title && content) {
      questions.push({
        id: Date.now() + i,
        title: title,
        content: formatContent(content),
        categoryId: categoryId,
        isFrequent: titleLine.includes('*'), // 标题带*的标记为常考
        createdAt: now,
        updatedAt: now
      });
    }
  }

  return questions;
}

// 格式化内容（Markdown 转 HTML）
function formatContent(content) {
  return content
    // 替换代码块
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
    // 替换行内代码
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // 替换加粗
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // 替换斜体
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    // 替换标题
    .replace(/^####\s+(.+)$/gm, '<h4>$1</h4>')
    .replace(/^###\s+(.+)$/gm, '<h3>$1</h3>')
    .replace(/^##\s+(.+)$/gm, '<h2>$1</h2>')
    // 替换列表
    .replace(/^\-\s+(.+)$/gm, '<li>$1</li>')
    // 替换换行
    .replace(/\n/g, '<br>');
}

// 解析题目
const newQuestions = parseQuestions(markdownContent);

console.log(`\n解析到 ${newQuestions.length} 道题目：`);
newQuestions.forEach((q, i) => {
  console.log(`${i + 1}. ${q.title}`);
});

// 读取现有题目
const questionsPath = path.join(__dirname, 'data/questions.json');
const existingQuestions = JSON.parse(fs.readFileSync(questionsPath, 'utf-8'));

// 合并题目
const allQuestions = [...existingQuestions, ...newQuestions];

// 写入文件
fs.writeFileSync(questionsPath, JSON.stringify(allQuestions, null, 2), 'utf-8');

console.log(`\n成功导入 ${newQuestions.length} 道题目到 "🍉 JS-数据类型" 分类！`);
console.log(`当前题库共 ${allQuestions.length} 道题目。`);
