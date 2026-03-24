import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Orders table — records every purchase and tracks delivery status.
 */
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  /** Buyer's email address for delivery */
  email: varchar("email", { length: 320 }).notNull(),
  /** Product ID purchased */
  productId: varchar("productId", { length: 64 }).notNull(),
  /** Product display name */
  productName: text("productName").notNull(),
  /** Payment method: alipay | usdc */
  paymentMethod: mysqlEnum("paymentMethod", ["alipay", "usdc"]).notNull(),
  /** Price paid (CNY for alipay, USD for usdc) */
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  /** Currency: CNY | USD */
  currency: varchar("currency", { length: 8 }).notNull(),
  /** Optional transaction hash or payment proof */
  txHash: text("txHash"),
  /** Payment proof image URL (S3) */
  paymentProofUrl: text("paymentProofUrl"),
  /** Payment proof verification status */
  proofVerified: mysqlEnum("proofVerified", ["pending", "verified", "rejected"]).default("pending").notNull(),
  /** Delivery status */
  status: mysqlEnum("status", ["pending", "delivered", "failed"]).default("pending").notNull(),
  /** When the delivery email was sent */
  deliveredAt: timestamp("deliveredAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;
