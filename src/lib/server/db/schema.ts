import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const coupons = sqliteTable("coupons", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull(),
  redeemed: integer("redeemed", { mode: "boolean" }).default(false).notNull(),
  code: text("code").notNull().unique(),
  first_name: text("first_name").notNull(),
  last_name: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull().unique(),
});
