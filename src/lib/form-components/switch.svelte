<script lang="ts">
  import "./switch.css";

  let { label = "", id, onToggle, checked = false, ...props } = $props();

  async function handleChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (onToggle) {
      await onToggle(target.checked, id);
    }
  }
</script>

<div class="switch-wrapper">
  {#if label}
    <label for={id} class="label">{label}</label>
  {/if}
  <label class="switch" for={id}>
    <input type="checkbox" {id} {checked} onchange={handleChange} {...props} />
    <span class="slider round"></span>
  </label>
</div>
