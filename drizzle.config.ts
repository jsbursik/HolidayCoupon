import { defineConfig } from "drizzle-kit";

if (!process.env.CF_ACCT_ID || !process.env.CF_DB_ID || !process.env.CF_API_TOKEN) throw new Error("CloudFlare ENV variables not set");

export default defineConfig({
  schema: "./src/lib/server/db/schema.ts",
  dialect: "sqlite",
  out: "./drizzle",
  driver: "d1-http",
  dbCredentials: {
    accountId: process.env.CF_ACCT_ID,
    databaseId: process.env.CF_DB_ID,
    token: process.env.CF_API_TOKEN,
  },
});
