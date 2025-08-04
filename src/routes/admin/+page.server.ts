import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

import { db } from "$lib/server/db";
import { coupons } from "$lib/server/db/schema";
import { ilike, or } from "drizzle-orm";
import { sql } from "drizzle-orm/sql";

const PAGE_SIZE = 20;

export const load: PageServerLoad = async ({ locals, url }) => {
  const session = await locals.auth();
  const page = Number(url.searchParams?.get("page") ?? 1);
  const search = url.searchParams?.get("search")?.trim();

  if (!session?.user?.name) {
    throw redirect(302, `/auth/signin?redirectTo=${encodeURIComponent(url.pathname)}`);
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

  const rows = await db.select().from(coupons).where(whereClause).limit(PAGE_SIZE).offset(offset);

  const total = await db
    .select({ count: sql<number>`count(*)` })
    .from(coupons)
    .where(whereClause);

  return {
    session,
    rows,
    total: Number(total),
    currentPage: page,
    search,
  };
};
