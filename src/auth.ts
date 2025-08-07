import { SvelteKitAuth } from "@auth/sveltekit";
import MicrosoftEntraID from "@auth/sveltekit/providers/microsoft-entra-id";
import { env } from "$env/dynamic/private";

export const { handle, signIn } = SvelteKitAuth({
  trustHost: true, // Allow localhost for development
  providers: [
    MicrosoftEntraID({
      clientId: env.AUTH_MICROSOFT_ENTRA_ID_ID!,
      clientSecret: env.AUTH_MICROSOFT_ENTRA_ID_SECRET!,
      issuer: env.AUTH_MICROSOFT_ENTRA_ID_ISSUER!,
    }),
  ],
});
