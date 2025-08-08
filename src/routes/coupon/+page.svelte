<script lang="ts">
  import { page } from "$app/state";
  let code = page.url.searchParams.get("code");
</script>

{#if code}
  <div class="container fit center">
    <h2>Your Coupon Code:</h2>
    <h1 style="color: var(--accent-clr); margin-top: 1.5rem;">{code}</h1>
    <p style="max-width: 15rem; text-align: center; font-weight: bold;">Make sure to screenshot this to redeem it!</p>
  </div>
{:else}
  <h1>No Coupon Code Found</h1>
{/if}
