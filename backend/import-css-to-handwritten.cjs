const fs = require('fs');
const path = require('path');

// 读取 Markdown 文件
const markdownContent = fs.readFileSync(path.join(__dirname, '../assets/CSS.md'), 'utf-8');

// 分类ID：🫐 手写
const categoryId = '1768000001011';

// 解析题目
function parseQuestions(content) {
  const questions = [];
  const now = new Date().toISOString();

  // 以 ### 分割（注意 ### 前面可能有空格）
  const parts = content.split(/^\s*###\s+/m);

  console.log(`分割得到 ${parts.length} 部分`);

  // 处理第一部分（包含从第一个题目到 ### 2. 之间的所有内容）
  const firstPart = parts[0];
  const firstLines = firstPart.split('\n');
  const firstTitle = firstLines[0].replace(/^-\s*/, '').trim(); // 移除开头的 "- "
  const firstContent = firstLines.slice(1).join('\n').trim();

  if (firstTitle && firstContent) {
    questions.push({
      id: Date.now(),
      title: firstTitle,
      content: formatContent(firstContent),
      categoryId: categoryId,
      isFrequent: true,
      createdAt: now,
      updatedAt: now
    });
  }

  // 处理后续部分（### 2. 开始的题目）
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    if (!part.trim()) continue;

    const lines = part.split('\n');
    let titleLine = lines[0].trim();

    // 处理标题：移除序号和多余的星号（如 "2. * " 或 "3.* "）
    let title = titleLine.replace(/^\d+\.\*?\s*/, '').replace(/^\*\s*/, '').trim();

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
  const star = q.isFrequent ? ' [常考]' : '';
  console.log(`${i + 1}. ${q.title}${star}`);
});

// 读取现有题目
const questionsPath = path.join(__dirname, 'data/questions.json');
const existingQuestions = JSON.parse(fs.readFileSync(questionsPath, 'utf-8'));

// 删除之前导入的 手写 题目（categoryId: 1768000001011）
const filteredQuestions = existingQuestions.filter(q => q.categoryId !== categoryId);

// 合并题目
const allQuestions = [...filteredQuestions, ...newQuestions];

// 写入文件
fs.writeFileSync(questionsPath, JSON.stringify(allQuestions, null, 2), 'utf-8');

console.log(`\n已删除之前导入的 手写 题目`);
console.log(`成功导入 ${newQuestions.length} 道题目到 "🫐 手写" 分类！`);
console.log(`当前题库共 ${allQuestions.length} 道题目。`);
