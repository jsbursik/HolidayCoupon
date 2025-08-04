<script lang="ts">
  import { page } from "$app/state";
  let code = page.url.searchParams.get("code");
</script>

{#if code}
  <div class="container fit">
    <h1>{code}</h1>
  </div>
{:else}
  <h1>No Coupon Code Found</h1>
{/if}
