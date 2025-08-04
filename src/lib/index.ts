import { z } from "zod";
import emailValidator from "node-email-verifier";

export const CouponFormSchema = z.object({
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

export type CouponInput = z.infer<typeof CouponFormSchema>;
