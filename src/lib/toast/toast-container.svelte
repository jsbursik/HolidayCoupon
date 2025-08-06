<script lang="ts">
  import Toast from "./toast.svelte";
  import { toasts } from "./toastStore";

  function removeToast(id: string) {
    toasts.remove(id);
  }
</script>

<div class="toast-container">
  {#each $toasts as toast (toast.id)}
    <Toast message={toast.message} type={toast.type} duration={toast.duration} autoDestroy={toast.autoDestroy} onDestroy={() => removeToast(toast.id)} />
  {/each}
</div>
