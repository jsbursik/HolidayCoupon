import { z } from "zod";

export const createCouponFormSchema = (authToken: string) => z.object({
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
      try {
        const response = await fetch(`https://api.jsbursik.com/api/validate-email?email=${encodeURIComponent(email)}`, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + authToken,
          },
          signal: AbortSignal.timeout(4000), // 4 second timeout
        });

        if (!response.ok) {
          console.warn("Email validation service returned error, allowing email through");
          return true; // Allow if server error
        }

        const result = await response.json();
        return result.valid === true;
      } catch (error) {
        // Network error, timeout, or server down - allow the email through
        console.warn("Email validation service unavailable, allowing email:", error);
        return true;
      }
    }, "Email appears to be invalid or temporary"),
  phone: z.string().min(10, "Phone is required"),
});

export type CouponInput = z.infer<ReturnType<typeof createCouponFormSchema>>;
