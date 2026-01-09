import { categoryManager } from "../src/storage/database/categoryManager.ts"

async function renameCSSCategory() {
  console.log("正在重命名 CSS 分类...")

  const categories = await categoryManager.getCategories()
  const cssCategory = categories.find(cat => cat.name === "CSS")

  if (cssCategory) {
    console.log(`找到 CSS 分类: ${cssCategory.name} (ID: ${cssCategory.id})`)
    console.log("正在重命名为: 🍈 CSS")

    await categoryManager.updateCategory(cssCategory.id, { name: "🍈 CSS" })
    console.log("✓ 重命名成功")
  } else {
    console.log("未找到 CSS 分类")
  }

  console.log("\n请刷新页面查看效果。")
}

renameCSSCategory().catch(console.error)
