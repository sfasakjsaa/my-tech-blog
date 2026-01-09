import { categoryManager } from "../src/storage/database/categoryManager.ts"

async function updateCSSOrder() {
  console.log("正在更新 CSS 分类排序...")

  const categories = await categoryManager.getCategories()
  const cssCategory = categories.find(cat => cat.name === "🍈 CSS")

  if (cssCategory) {
    console.log(`找到 CSS 分类: ${cssCategory.name}`)
    console.log(`当前 order: ${cssCategory.order}, 创建时间: ${cssCategory.createdAt}`)

    console.log("正在设置 order 为 '-1'（让它排在最前面）...")
    await categoryManager.updateCategory(cssCategory.id, { order: "-1" })
    console.log("✓ 更新成功")
  } else {
    console.log("未找到 CSS 分类")
  }

  console.log("\n请刷新页面查看效果。CSS 分类现在应该显示在最前面。")
}

updateCSSOrder().catch(console.error)
