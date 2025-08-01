import type { Actions } from "@sveltejs/kit";
import { fail } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { coupons } from "$lib/server/db/schema";

import { z } from "zod";
import emailValidator from "node-email-verifier";

const CouponFormSchema = z.object({
  first_name: z
    .string()
    .min(3, "First Name is required.")
    .regex(/[a-zA-Z]+/, "First name must be letters"),
  last_name: z
    .string()
    .min(3, "Last Name is required.")
    .regex(/[a-zA-Z]+/, "Last name must be letters"),
  email: z
    .string()
    .email("Invalid Email Address.")
    .refine(async (email) => {
      return await emailValidator(email);
    }, "Email is either fake or temporary"),
  phone: z.string().min(10, "Phone is required"),
});

export const actions: Actions = {
  default: async ({ request }) => {
    const form = await request.formData();
    const data = Object.fromEntries(form.entries());

    const parsed = await CouponFormSchema.safeParseAsync(data);

    if (!parsed.success) {
      const { fieldErrors } = parsed.error.flatten();
      return fail(400, { errors: fieldErrors, values: data });
    }

    const { first_name, last_name, email, phone } = parsed.data;

    console.log(`${first_name} ${last_name} ${email} ${phone}`);
  },
};

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

type DBInsert = typeof coupons.$inferInsert;

async function insertSafe(data: { first_name: string; last_name: string; email: string; phone: string }) {
  const maxAttempts = 5;

  for (let i = 0; i < maxAttempts; i++) {
    const code = generateCouponCode();

    try {
      const result = await db.insert(coupons).values({
        date: new Date().toISOString().split("T")[0],
        ...data,
        code,
      });

      return result;
    } catch (err: any) {
      if (err.code === "23505") {
        const message = err.message || "";

        if (message.includes("code")) {
          continue;
        }
        if (message.includes("phone")) {
          throw new Error("Phone number has already been used!");
        }
        if (message.includes("email")) {
          throw new Error("Email has already been used.");
        }
      }
      throw err;
    }
  }
  throw new Error("Failed to generate a unique coupon code after several attempts!");
}
