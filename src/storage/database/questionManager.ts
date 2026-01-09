import { eq, SQL, and, or, like, asc, desc } from "drizzle-orm"
import { getDb } from "coze-coding-dev-sdk"
import {
  questions,
  insertQuestionSchema,
  updateQuestionSchema,
} from "./shared/schema"
import type { Question, InsertQuestion, UpdateQuestion } from "./shared/schema"

export class QuestionManager {
  async createQuestion(data: InsertQuestion): Promise<Question> {
    const db = await getDb()
    const validated = insertQuestionSchema.parse(data)
    
    // 获取该分类下的最大 order 值
    const maxOrderQuery = await db
      .select({ order: questions.order })
      .from(questions)
      .where(eq(questions.categoryId, validated.categoryId))
      .orderBy(desc(questions.order))
      .limit(1)
    
    const maxOrder = maxOrderQuery[0]?.order
    const newOrder = maxOrder !== undefined ? String(parseInt(maxOrder) + 1) : "0"
    
    const [question] = await db
      .insert(questions)
      .values({ ...validated, order: newOrder })
      .returning()
    return question
  }

  async getQuestions(options: {
    skip?: number
    limit?: number
    categoryId?: string
    search?: string
  } = {}): Promise<Question[]> {
    const { skip = 0, limit = 100, categoryId, search } = options
    const db = await getDb()
    const conditions: SQL[] = []
    if (categoryId !== undefined && categoryId !== "all") {
      conditions.push(eq(questions.categoryId, categoryId))
    }
    if (search !== undefined && search !== "") {
      const searchPattern = `%${search}%`
      conditions.push(
        or(
          like(questions.title, searchPattern),
          like(questions.content, searchPattern)
        )!
      )
    }
    const query = db.select().from(questions)
    if (conditions.length > 0) {
      query.where(and(...conditions))
    }
    return query.orderBy(asc(questions.order), desc(questions.createdAt)).limit(limit).offset(skip)
  }

  async getQuestionById(id: string): Promise<Question | null> {
    const db = await getDb()
    const [question] = await db
      .select()
      .from(questions)
      .where(eq(questions.id, id))
    return question || null
  }

  async updateQuestion(
    id: string,
    data: UpdateQuestion
  ): Promise<Question | null> {
    const db = await getDb()
    const validated = updateQuestionSchema.parse(data)
    const [question] = await db
      .update(questions)
      .set({ ...validated, updatedAt: new Date() })
      .where(eq(questions.id, id))
      .returning()
    return question || null
  }

  async deleteQuestion(id: string): Promise<boolean> {
    const db = await getDb()
    const result = await db.delete(questions).where(eq(questions.id, id))
    return (result.rowCount ?? 0) > 0
  }
}

export const questionManager = new QuestionManager()
