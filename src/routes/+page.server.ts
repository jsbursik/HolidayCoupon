import type { Actions } from "@sveltejs/kit";
import { fail, redirect } from "@sveltejs/kit";

import { createCouponFormSchema } from "$lib";
import { insertSafe } from "$lib/safe-insert";
import type { Env } from "$lib/types";

export const actions: Actions = {
  default: async ({ request, platform }) => {
    const env = platform!.env as Env;
    const raw = Object.fromEntries(await request.formData());
    const CouponFormSchema = createCouponFormSchema(env.JBURSIK_AUTH!);
    const parsed = await CouponFormSchema.safeParseAsync(raw);

    if (!parsed.success) {
      const { fieldErrors } = parsed.error.flatten();
      return fail(400, { errors: fieldErrors, values: raw });
    }

    const cleanData = {
      ...parsed.data,
      phone: parsed.data.phone.replace(/\D/g, ""),
    };

    const result = await insertSafe(cleanData, env);

    if (!result.success) {
      return fail(400, { errors: result.fieldErrors, values: parsed.data });
    }

    throw redirect(303, `/coupon?code=${result.code}`);
  },
};
