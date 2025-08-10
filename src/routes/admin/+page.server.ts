import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { Env } from "$lib/types";

import { createDB } from "$lib/server/db";
import { coupons } from "$lib/server/db/schema";
import { ilike, or } from "drizzle-orm";
import { sql } from "drizzle-orm/sql";

const PAGE_SIZE = 20;

export const load: PageServerLoad = async ({ locals, url, platform }) => {
  const session = await locals.auth();
  const page = Number(url.searchParams?.get("page") ?? 1);
  const search = url.searchParams?.get("search")?.trim();

  if (!session?.user?.name) {
    throw redirect(302, `/admin/signin`);
  }

  const offset = (page - 1) * PAGE_SIZE;

  let whereClause = undefined;
  if (search) {
    const pattern = `%${search}%`;
    whereClause = or(
      ilike(coupons.first_name, pattern),
      ilike(coupons.last_name, pattern),
      ilike(coupons.email, pattern),
      ilike(coupons.phone, pattern),
      ilike(coupons.code, pattern)
    );
  }

  const db = createDB(platform!.env as Env);

  // Fetch one extra row to determine if there are more pages (cursor-based pagination approach)
  const rows = await db
    .select()
    .from(coupons)
    .where(whereClause)
    .limit(PAGE_SIZE + 1)
    .offset(offset)
    .orderBy(coupons.id);

  const hasMore = rows.length > PAGE_SIZE;
  const displayRows = hasMore ? rows.slice(0, PAGE_SIZE) : rows;

  // Only get count on first page to minimize queries
  let total: number | undefined;
  if (page === 1) {
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(coupons)
      .where(whereClause);
    total = Number(count);
  }

  return {
    session,
    rows: displayRows,
    total,
    currentPage: page,
    hasMore,
    search,
  };
};
