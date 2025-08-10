import { SvelteKitAuth } from "@auth/sveltekit";
import MicrosoftEntraID from "@auth/sveltekit/providers/microsoft-entra-id";
import { env } from "$env/dynamic/private";
import type { Provider } from "@auth/sveltekit/providers";

const providers: Provider[] = [
  MicrosoftEntraID({
    clientId: env.AUTH_MICROSOFT_ENTRA_ID_ID!,
    clientSecret: env.AUTH_MICROSOFT_ENTRA_ID_SECRET!,
    issuer: env.AUTH_MICROSOFT_ENTRA_ID_ISSUER!,
  }),
];

export const providerMap = providers.map((provider) => {
  if (typeof provider === "function") {
    const providerData = provider();
    return { id: providerData.id, name: providerData.name };
  } else {
    return { id: provider.id, name: provider.name };
  }
});

export const { handle, signIn, signOut } = SvelteKitAuth({
  trustHost: true, // Allow localhost for development
  providers,
  pages: {
    signIn: "/admin/signin",
  },
});
