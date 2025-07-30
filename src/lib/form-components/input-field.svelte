<script lang="ts">
  let { id, label, value = $bindable(), placeholder = "", emptyBlur = true, ...props } = $props();

  let inputField: HTMLInputElement;
  let isValid = $state(true);

  function handleInput(e: Event) {
    const tar = e.target as HTMLInputElement;
    if (emptyBlur && !tar.value) {
      isValid = false;
    } else {
      isValid = true;
    }
  }
</script>

<span class="form-control">
  <label for={id}>{label}:</label>
  <input type="text" class={isValid ? "" : "invalid"} {id} name={id} {placeholder} bind:this={inputField} onblur={handleInput} />
</span>
