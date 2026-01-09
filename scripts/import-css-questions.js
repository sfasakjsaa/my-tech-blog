import { categoryManager } from "../src/storage/database/categoryManager.ts"
import { questionManager } from "../src/storage/database/questionManager.ts"
import { readFileSync } from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 读取 CSS.md 文件
const cssContent = readFileSync(join(__dirname, "../assets/CSS.md"), "utf-8")

// 解析题目
function parseQuestions(content) {
  const questions = []
  const lines = content.split("\n")

  // 匹配题目标题：### 数字. 标题
  const questionPattern = /^###\s+\d+\.\s+(.+)$/

  let currentQuestion = null
  let answerLines = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmedLine = line.trim()

    // 检测是否是新题目
    const questionMatch = trimmedLine.match(questionPattern)

    if (questionMatch) {
      // 保存上一个题目
      if (currentQuestion) {
        currentQuestion.content = answerLines.join("\n").trim()
        // 只有当内容不为空时才添加
        if (currentQuestion.content) {
          questions.push(currentQuestion)
        }
      }

      // 开始新题目
      const title = questionMatch[1].trim()
      // 移除标题中可能存在的多余星号
      const cleanTitle = title.replace(/\*\*/g, "").replace(/\*/g, "").trim()

      currentQuestion = {
        title: cleanTitle,
        content: ""
      }
      answerLines = []
      continue
    }

    // 如果已经有当前题目，收集答案内容
    if (currentQuestion) {
      // 跳过空行、分隔线、代码块图片链接（以 ![] 开头的行）
      if (!trimmedLine || trimmedLine.startsWith("---") || trimmedLine.startsWith("![")) {
        continue
      }

      // 收集内容
      answerLines.push(line)
    }
  }

  // 保存最后一个题目
  if (currentQuestion) {
    currentQuestion.content = answerLines.join("\n").trim()
    if (currentQuestion.content) {
      questions.push(currentQuestion)
    }
  }

  return questions
}

// 主函数
async function main() {
  console.log("开始解析 CSS.md 文件...")

  const questions = parseQuestions(cssContent)
  console.log(`解析到 ${questions.length} 道题目`)

  // 显示前几道题目用于调试
  console.log("\n前 5 道题目：")
  for (let i = 0; i < Math.min(5, questions.length); i++) {
    console.log(`${i + 1}. ${questions[i].title}`)
  }

  // 检查是否存在 CSS 分类
  const categories = await categoryManager.getCategories()
  let cssCategory = categories.find(cat => cat.name === "CSS")

  if (!cssCategory) {
    console.log("\n创建 CSS 分类...")
    cssCategory = await categoryManager.createCategory({ name: "CSS" })
    console.log("CSS 分类创建成功:", cssCategory.id)
  } else {
    console.log("\nCSS 分类已存在:", cssCategory.id)
  }

  // 批量添加题目
  console.log("\n开始添加题目...")
  let successCount = 0
  let errorCount = 0

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i]
    try {
      await questionManager.createQuestion({
        title: q.title,
        content: q.content,
        categoryId: cssCategory.id,
        isFrequent: false
      })
      successCount++
      console.log(`[${i + 1}/${questions.length}] ${q.title}`)
    } catch (error) {
      errorCount++
      console.error(`  错误: ${error.message}`)
    }
  }

  console.log(`\n导入完成！成功: ${successCount}, 失败: ${errorCount}`)
}

main().catch(console.error)
