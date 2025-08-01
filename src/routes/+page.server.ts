import type { Actions } from "@sveltejs/kit";
import { fail } from "@sveltejs/kit";

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
