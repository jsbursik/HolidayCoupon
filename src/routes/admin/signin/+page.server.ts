import { signIn, providerMap } from "../../../auth";
import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  return {
    providers: providerMap,
  };
};

export const actions = { default: signIn } satisfies Actions;
