<script lang="ts">
  let { label = "", id, toggle, ...props } = $props();
  let inputEl: HTMLInputElement;

  function handleSliderClick() {
    inputEl.click();
  }
</script>

<div class="switch-wrapper">
  <label for={id} class="label">{label}</label>
  <input aria-hidden="true" type="checkbox" onchange={toggle} name={id} {id} bind:this={inputEl} />
  <span
    class="slider round"
    role="checkbox"
    tabindex="0"
    aria-checked={inputEl?.checked}
    aria-labelledby={id}
    onclick={handleSliderClick}
    onkeydown={(e) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        handleSliderClick();
      }
    }}
  ></span>
</div>
