import { pgSchema, serial, date, text, boolean } from "drizzle-orm/pg-core";

export const holidayCoupon = pgSchema("holiday_coupon");

export const coupons = holidayCoupon.table("coupons", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  redeemed: boolean("redeemed").default(false).notNull(),
  code: text("code").notNull().unique(),
  first_name: text("first_name").notNull(),
  last_name: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull().unique(),
});
