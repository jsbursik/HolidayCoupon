<!-- Toast.svelte -->
<script lang="ts">
  import { onMount } from "svelte";

  import "./toast.css";

  let {
    message = "",
    type = "info", // "success" | "error" | "warning" | "info"
    duration = 3000,
    onDestroy = () => {},
    autoDestroy = true,
    ...props
  } = $props();

  let visible = $state(true);
  let timeoutId: ReturnType<typeof setTimeout>;

  onMount(() => {
    if (autoDestroy && duration > 0) {
      timeoutId = setTimeout(() => {
        hide();
      }, duration);
    }

    // Cleanup timeout if component is destroyed early
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  });

  function hide() {
    visible = false;
    // Give time for exit animation, then destroy
    setTimeout(() => {
      onDestroy();
    }, 300); // Match your CSS transition duration
  }

  function handleClick() {
    // Allow manual dismissal
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    hide();
  }
</script>

{#if visible}
  <div class="toast toast-{type}" class:toast-exit={!visible} onclick={handleClick} role="alert" {...props}>
    <div class="toast-content">
      {message}
    </div>
    <button class="toast-close" onclick={handleClick} aria-label="Close">×</button>
  </div>
{/if}

<style>
</style>
