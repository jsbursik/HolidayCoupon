<script lang="ts">
  import type { ActionData } from "./$types";
  import InputField from "$lib/form-components/input-field.svelte";

  let { form }: { form: ActionData } = $props();
  let fieldErrors = form?.errors;
  let values = form?.values;
</script>

<div class="container fit">
  <form method="POST" class="column-form">
    <h2 class="form-header">Coupon Form:</h2>
    <InputField id="first_name" label="First Name" placeholder="John" required value={values?.first_name || ""} error={fieldErrors?.first_name?.[0]} />
    <InputField id="last_name" label="Last Name" placeholder="Smith" required value={values?.last_name || ""} error={fieldErrors?.last_name?.[0]} />
    <InputField type="email" id="email" label="Email" required value={values?.email || ""} error={fieldErrors?.email?.[0]} />
    <InputField type="tel" id="phone" label="Phone" required value={values?.phone || ""} error={fieldErrors?.phone?.[0]} />
    <button class="btn btn-primary" style="margin-top: 2rem">Get Coupon Code!</button>
  </form>
</div>
