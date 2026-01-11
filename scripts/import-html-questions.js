import fs from 'fs';
import http from 'http';

const BACKEND_URL = 'http://localhost:8080';
const CATEGORY_ID = '1768000001001';

// 解析 Markdown 文件，提取题目
function parseMarkdown(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const questions = [];

  // 使用正则表达式匹配每个题目
  const questionPattern = /### (\*)?(\d+)\.\s+(.+?)(?=\n###|\n$|$)/gs;
  let match;

  while ((match = questionPattern.exec(content)) !== null) {
    const title = match[3].trim();
    const fullMatch = match[0];

    questions.push({
      title: title,
      content: fullMatch
    });
  }

  return questions;
}

// 创建题目
function createQuestion(question) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      title: question.title,
      content: question.content,
      categoryId: CATEGORY_ID,
      isFrequent: false
    });

    const options = {
      hostname: 'localhost',
      port: 8080,
      path: '/api/questions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.success) {
            console.log(`✓ 创建成功: ${question.title}`);
            resolve(response.data);
          } else {
            console.log(`✗ 创建失败: ${question.title} - ${response.message}`);
            reject(new Error(response.message));
          }
        } catch (e) {
          console.log(`✗ 解析响应失败: ${question.title}`);
          reject(e);
        }
      });
    });

    req.on('error', (e) => {
      console.log(`✗ 请求失败: ${question.title}`);
      reject(e);
    });

    req.write(postData);
    req.end();
  });
}

// 批量导入题目
async function importQuestions() {
  console.log('开始解析 Markdown 文件...');
  const questions = parseMarkdown('assets/CSS.md');
  console.log(`找到 ${questions.length} 个题目\n`);

  console.log('开始导入题目...\n');

  let successCount = 0;
  let failCount = 0;

  for (const question of questions) {
    try {
      await createQuestion(question);
      successCount++;
      // 避免请求过快
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      failCount++;
    }
  }

  console.log(`\n导入完成！成功: ${successCount}, 失败: ${failCount}`);
}

importQuestions().catch(console.error);
