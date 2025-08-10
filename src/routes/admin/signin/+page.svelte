<script lang="ts">
  import type { PageData } from "./$types";
  const { data }: { data: PageData } = $props();
  const providerMap = data.providers;

  import { SignIn } from "@auth/sveltekit/components";
  import logo from "$lib/assets/logo.png";
</script>

<div class="container-row">
  <div class="container center fit">
    <img src={logo} alt="Holiday Auto Group" style="width: 20rem; margin-inline: 2rem; margin-bottom: 2rem;" />
    <div>
      {#each providerMap as provider}
        <SignIn options={{ redirectTo: "/admin" }} provider={provider.id} signInPage="admin/signin">
          <div slot="submitButton" class="btn btn-primary">
            <span>Signin with {provider.name}</span>
          </div>
        </SignIn>
      {/each}
    </div>
  </div>
</div>
