import { SvelteKitAuth } from "@auth/sveltekit";
import MicrosoftEntraID from "@auth/sveltekit/providers/microsoft-entra-id";
import { AUTH_MICROSOFT_ENTRA_ID_ID, AUTH_MICROSOFT_ENTRA_ID_SECRET, AUTH_MICROSOFT_ENTRA_ID_ISSUER } from "$env/static/private";

export const { handle, signIn } = SvelteKitAuth({
  providers: [
    MicrosoftEntraID({
      clientId: AUTH_MICROSOFT_ENTRA_ID_ID,
      clientSecret: AUTH_MICROSOFT_ENTRA_ID_SECRET,
      issuer: AUTH_MICROSOFT_ENTRA_ID_ISSUER,
    }),
  ],
});
