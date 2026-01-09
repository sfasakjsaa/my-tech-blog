import { eq, SQL, and, desc, asc, sql } from "drizzle-orm"
import { getDb } from "@/lib/db"
import {
  categories,
  questions,
  insertCategorySchema,
  updateCategorySchema,
} from "./shared/schema"
import type { Category, InsertCategory, UpdateCategory } from "./shared/schema"

export class CategoryManager {
  async createCategory(data: InsertCategory): Promise<Category> {
    const db = await getDb()
    const validated = insertCategorySchema.parse(data)
    
    // 获取当前最大的 order 值
    const maxOrderQuery = await db
      .select({ order: categories.order })
      .from(categories)
      .orderBy(desc(categories.order))
      .limit(1)
    
    const maxOrder = maxOrderQuery[0]?.order
    const newOrder = maxOrder !== undefined ? String(parseInt(maxOrder) + 1) : "0"
    
    const [category] = await db
      .insert(categories)
      .values({ ...validated, order: newOrder })
      .returning()
    return category
  }

  async getCategories(options: {
    skip?: number
    limit?: number
  } = {}): Promise<Category[]> {
    const { skip = 0, limit = 100 } = options
    const db = await getDb()
    return db
      .select()
      .from(categories)
      .orderBy(sql`CAST(${categories.order} AS INTEGER)`, desc(categories.createdAt))
      .limit(limit)
      .offset(skip)
  }

  async getCategoryById(id: string): Promise<Category | null> {
    const db = await getDb()
    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
    return category || null
  }

  async updateCategory(
    id: string,
    data: UpdateCategory
  ): Promise<Category | null> {
    const db = await getDb()
    const validated = updateCategorySchema.parse(data)
    const [category] = await db
      .update(categories)
      .set(validated)
      .where(eq(categories.id, id))
      .returning()
    return category || null
  }

  async deleteCategory(id: string): Promise<boolean> {
    const db = await getDb()
    // 先删除该分类下的所有问题
    await db.delete(questions).where(eq(questions.categoryId, id))
    // 然后删除分类
    const result = await db.delete(categories).where(eq(categories.id, id))
    return (result.rowCount ?? 0) > 0
  }
}

export const categoryManager = new CategoryManager()
