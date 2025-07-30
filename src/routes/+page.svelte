<script lang="ts">
  import InputField from "$lib/form-components/input-field.svelte";
  import PhoneField from "$lib/form-components/phone-field.svelte";
  import EmailField from "$lib/form-components/email-field.svelte";
</script>

<div class="container fit">
  <form method="POST" class="column-form">
    <h2 class="form-header">Coupon Form:</h2>
    <InputField id="first_name" label="First Name" placeholder="John" />
    <InputField id="last_name" label="Last Name" placeholder="Smith" />
    <EmailField id="email" label="Email" />
    <PhoneField id="phone" label="Phone" />
    <button class="btn btn-primary" style="width: 100%;">Get Coupon Code!</button>
  </form>
</div>
