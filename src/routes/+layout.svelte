<script lang="ts">
  import ToastContainer from "$lib/toast/toast-container.svelte";
  import "../app.css";

  let { children } = $props();
</script>

<main>
  {@render children()}
</main>

<ToastContainer />
