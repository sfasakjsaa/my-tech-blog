import { categoryManager } from "../src/storage/database/categoryManager.ts"
import { questionManager } from "../src/storage/database/questionManager.ts"

async function fixCSSCategory() {
  console.log("正在修复 CSS 分类...")

  const categories = await categoryManager.getCategories()

  // 找到两个 CSS 分类
  const cssCategories = categories.filter(cat =>
    cat.name === "CSS" || cat.name.includes("CSS")
  )

  console.log(`找到 ${cssCategories.length} 个 CSS 相关分类：`)
  cssCategories.forEach(cat => {
    console.log(`  - ${cat.name} (ID: ${cat.id})`)
  })

  // 查找每个分类的题目数量
  for (const cat of cssCategories) {
    const questions = await questionManager.getQuestions({ categoryId: cat.id })
    console.log(`  ${cat.name}: ${questions.length} 道题目`)
  }

  // 删除空的分类
  const emptyCategory = cssCategories.find(cat => cat.name === "🍈 CSS")
  if (emptyCategory) {
    const questions = await questionManager.getQuestions({ categoryId: emptyCategory.id })
    if (questions.length === 0) {
      console.log(`\n删除空的分类: ${emptyCategory.name}`)
      await categoryManager.deleteCategory(emptyCategory.id)
      console.log("✓ 删除成功")
    } else {
      console.log(`\n${emptyCategory.name} 不是空的，不删除`)
    }
  }

  console.log("\n修复完成！")
  console.log("请刷新页面查看效果。")
}

fixCSSCategory().catch(console.error)
