<script lang="ts">
  import type { ActionData } from "./$types";
  import Input from "$lib/form-components/input.svelte";

  let { form }: { form: ActionData } = $props();
  let fieldErrors = form?.errors;
  let values = form?.values;
</script>

<div class="container fit">
  <form method="POST">
    <div class="column">
      <h2>Coupon Form:</h2>
      <Input id="first_name" label="First Name" placeholder="John" required value={values?.first_name || ""} error={fieldErrors?.first_name?.[0]} />
      <Input id="last_name" label="Last Name" placeholder="Smith" required value={values?.last_name || ""} error={fieldErrors?.last_name?.[0]} />
      <Input type="email" id="email" label="Email" required value={values?.email || ""} error={fieldErrors?.email?.[0]} />
      <Input type="tel" id="phone" label="Phone" required value={values?.phone || ""} error={fieldErrors?.phone?.[0]} />
      <button class="btn btn-primary">Get Coupon Code!</button>
    </div>
  </form>
</div>
