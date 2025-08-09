import type { CouponInput } from "$lib";
import type { Env } from "$lib/types";
import { createDB } from "$lib/server/db";
import { coupons } from "$lib/server/db/schema";
import { sendCouponNotifications } from "$lib/server/email";

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
type SqliteError = Error & {
  code?: string;
  message: string;
};

function isSqliteError(err: unknown): err is SqliteError {
  return typeof err === "object" && err !== null && "message" in err;
}

export async function insertSafe(data: CouponInput, env: Env): Promise<CouponResponse> {
  const maxAttempts = 5;
  const date = new Date().toISOString().split("T")[0];

  for (let i = 0; i < maxAttempts; i++) {
    const code = generateCouponCode();

    try {
      const db = createDB(env);
      await db.insert(coupons).values({ date, ...data, code });

      // Send email notifications (don't await to avoid blocking the response)
      console.log("Attempting to send email notifications for code:", code);
      sendCouponNotifications({ ...data, code }, env).catch((error) => {
        console.error("Email notification failed:", error);
      });

      return { success: true, code };
    } catch (err: unknown) {
      if (isSqliteError(err)) {
        const msg = err.message.toLowerCase();

        // SQLite unique constraint error
        if (msg.includes("unique constraint") || msg.includes("unique")) {
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
