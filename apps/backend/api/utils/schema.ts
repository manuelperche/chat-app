import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// Tables

export const ProductTable = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  modelFileName: varchar("model_file_name", { length: 1024 }).notNull(),
  likes: integer("likes").notNull().default(0),
  dislikes: integer("dislikes").notNull().default(0),
});

export const CommentsTable = pgTable("comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  text: varchar("text", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  productId: uuid("productId")
    .references(() => ProductTable.id)
    .notNull(),
});

// Relations

export const ProductsTableRelations = relations(ProductTable, ({ many }) => ({
  comments: many(CommentsTable),
}));

export const CommentsTableRelations = relations(CommentsTable, ({ one }) => ({
  product: one(ProductTable, {
    fields: [CommentsTable.productId],
    references: [ProductTable.id],
  }),
}));
