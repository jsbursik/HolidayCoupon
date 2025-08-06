import { error, type RequestHandler } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { eq } from "drizzle-orm";
import { coupons } from "$lib/server/db/schema";

export const POST: RequestHandler = async ({ request, locals }) => {
  const session = await locals.auth();
  if (!session?.user?.email) {
    throw error(401, "Unnauthorized API Access");
  }

  const { id, redeemed } = await request.json();
  console.log(`id: ${id}, redeemed: ${redeemed}`);

  if (!id || typeof redeemed !== "boolean") {
    return new Response("Invalid Data", { status: 400 });
  }

  await db.update(coupons).set({ redeemed }).where(eq(coupons.id, id));

  return new Response("OK");
};
