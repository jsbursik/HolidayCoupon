import type { Actions } from "@sveltejs/kit";
import { fail } from "@sveltejs/kit";
import emailValidator from "node-email-verifier";

interface FormData {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  emailError?: string;
  fake?: boolean;
}

export const actions: Actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const formObject: Record<string, string> = {};
    for (const [key, value] of data.entries()) {
      formObject[key] = value as string;
    }
    if (formObject.email) {
      const isValid = await emailValidator(formObject.email);
      if (!isValid) {
        return fail(400, { ...formObject, emailError: "Invalid Email Address", fake: true } satisfies FormData);
      }
    }
  },
};
