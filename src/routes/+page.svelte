<script lang="ts">
  import type { ActionData } from "./$types";
  import InputField from "$lib/form-components/input-field.svelte";

  let { form }: { form: ActionData } = $props();

  let first_name = $state(form?.first_name || "");
  let last_name = $state(form?.last_name || "");
  let email = $state(form?.email || "");
  let phone = $state(form?.phone || "");
</script>

<div class="container fit">
  <form method="POST" class="column-form">
    <h2 class="form-header">Coupon Form:</h2>
    <InputField id="first_name" label="First Name" placeholder="John" required bind:value={first_name} />
    <InputField id="last_name" label="Last Name" placeholder="Smith" required bind:value={last_name} />
    <InputField class={{ invalid: form?.fake }} type="email" id="email" label="Email" required bind:value={email} />
    <InputField type="tel" id="phone" label="Phone" required bind:value={phone} />
    <button class="btn btn-primary" style="width: 100%;">Get Coupon Code!</button>
  </form>
</div>
