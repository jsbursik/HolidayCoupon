import { db } from "$lib/server/db";
import { coupons } from "$lib/server/db/schema";
import type { CouponInput } from "$lib";

function generateCouponCode(length = 8, separator = "-"): string {
  const CHARSET = "ABCDEFGHJKLMNOPQRSTUVWXYZ23456789";
  let code = "";

  for (let i = 0; i < length; i++) {
    code += CHARSET[Math.floor(Math.random() * CHARSET.length)];
  }

  if (separator && length === 8) {
    code = code.slice(0, 4) + separator + code.slice(4);
  }

  return code;
}

type CouponResponse = { success: true; code: string } | { success: false; fieldErrors: Record<string, string[]> };
type PostgresError = Error & {
  code?: string;
  detail?: string;
  contraint?: string;
};

function isPostgresError(err: unknown): err is PostgresError {
  return typeof err === "object" && err !== null && "code" in err;
}

export async function insertSafe(data: CouponInput): Promise<CouponResponse> {
  const maxAttempts = 5;
  const date = new Date().toISOString().split("T")[0];

  for (let i = 0; i < maxAttempts; i++) {
    const code = generateCouponCode();

    try {
      await db.insert(coupons).values({ date, ...data, code });
      return { success: true, code };
    } catch (err: unknown) {
      if (isPostgresError(err) && err.code === "23505") {
        const msg = err.message || "";

        if (msg.includes("code")) {
          continue;
        }

        const fieldErrors: Record<string, string[]> = {};

        if (msg.includes("phone")) {
          fieldErrors.phone = ["This phone number has already been used"];
        }

        if (msg.includes("email")) {
          fieldErrors.email = ["This email address has already been used"];
        }

        return { success: false, fieldErrors };
      }

      return {
        success: false,
        fieldErrors: { _form: ["Unexpected Server Error. Please try again"] },
      };
    }
  }
  return {
    success: false,
    fieldErrors: { _form: ["Failed to generate Coupon Code, try again"] },
  };
}
