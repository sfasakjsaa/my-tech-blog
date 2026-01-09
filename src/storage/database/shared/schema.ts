import { pgTable, text, timestamp, varchar, index, boolean } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { createSchemaFactory } from "drizzle-zod"

export const categories = pgTable(
  "categories",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    name: varchar("name", { length: 100 }).notNull().unique(),
    order: varchar("order", { length: 10 }).notNull().default("0"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    orderIdx: index("categories_order_idx").on(table.order),
  })
)

export const questions = pgTable(
  "questions",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    categoryId: varchar("category_id", { length: 36 })
      .notNull()
      .references(() => categories.id),
    title: text("title").notNull(),
    content: text("content").notNull(),
    isFrequent: boolean("is_frequent").notNull().default(false),
    order: varchar("order", { length: 10 }).notNull().default("0"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => ({
    categoryIdIdx: index("questions_category_id_idx").on(table.categoryId),
    orderIdx: index("questions_order_idx").on(table.order),
  })
)

const { createInsertSchema: createCoercedInsertSchema } = createSchemaFactory({
  coerce: { date: true },
})

export const insertCategorySchema = createCoercedInsertSchema(categories).pick({
  name: true,
})

export const updateCategorySchema = createCoercedInsertSchema(categories)
  .pick({
    name: true,
    order: true,
  })
  .partial()

export const insertQuestionSchema = createCoercedInsertSchema(questions).pick({
  categoryId: true,
  title: true,
  content: true,
  isFrequent: true,
})

export const updateQuestionSchema = createCoercedInsertSchema(questions)
  .pick({
    categoryId: true,
    title: true,
    content: true,
    isFrequent: true,
    order: true,
  })
  .partial()

export type Category = typeof categories.$inferSelect
export type InsertCategory = typeof insertCategorySchema.type
export type UpdateCategory = typeof updateCategorySchema.type
export type Question = typeof questions.$inferSelect
export type InsertQuestion = typeof insertQuestionSchema.type
export type UpdateQuestion = typeof updateQuestionSchema.type
