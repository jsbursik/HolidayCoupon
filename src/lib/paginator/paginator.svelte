<script lang="ts">
  import "./paginator.css";

  let { curr = 1, last = 1, onPageClick, ...props } = $props();

  function goTo(p: number) {
    onPageClick?.(p);
  }
</script>

<div class="page-wrapper">
  {#if curr > 2}<button onclick={() => goTo(1)} class="page">«</button>{/if}
  {#if curr > 1}<button onclick={() => goTo(curr - 1)} class="page">{curr - 1}</button>{/if}
  <span class="page active">{curr}</span>
  {#if last > 1 && curr != last}<button onclick={() => goTo(curr + 1)} class="page">{curr + 1}</button>{/if}
  {#if last > curr + 2}<button onclick={() => goTo(last)} class="page">»</button>{/if}
</div>
