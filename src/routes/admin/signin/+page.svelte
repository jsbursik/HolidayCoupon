<script lang="ts">
  import { SignIn } from "@auth/sveltekit/components";
  import { providerMap } from "../../../auth";

  import logo from "$lib/assets/logo.png";
</script>

<div class="container center fit">
  <img src={logo} alt="Holiday Auto Group" />
  <div>
    {#each providerMap as provider}
      <SignIn
        options={{
          redirectTo: `/admin`,
        }}
        provider={provider.id}
        signInPage="signin"
      >
        <div slot="submitButton">
          <span> Signin with {provider.name}</span>
        </div>
      </SignIn>
    {/each}
  </div>
</div>
