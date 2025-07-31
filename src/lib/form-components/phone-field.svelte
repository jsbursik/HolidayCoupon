<script lang="ts">
  let { id, label, value = $bindable(), ...props } = $props();

  let phoneField: HTMLInputElement;
  let isValid = $state(true);

  function handleInput(e: KeyboardEvent) {
    if (e.ctrlKey) return;
    if (e.key.length > 1) return;
    if (/[0-9]/.test(e.key)) return;
    e.preventDefault();
  }

  function formatToPhone(e: KeyboardEvent) {
    const tar = e.target as HTMLInputElement;
    const digits = tar.value.replace(/\D/g, "").substring(0, 10);
    const areaCode = digits.substring(0, 3);
    const prefix = digits.substring(3, 6);
    const suffix = digits.substring(6, 10);

    if (digits.length > 6) {
      tar.value = `(${areaCode}) ${prefix}-${suffix}`;
    } else if (digits.length > 3) {
      tar.value = `(${areaCode}) ${prefix}`;
    } else if (digits.length > 0) {
      tar.value = `(${areaCode}`;
    }
  }

  function handleValidity(e: Event) {
    const tar = e.target as HTMLInputElement;
    const val = tar.value.replace(/\D/g, "");

    if (val.length < 10 || val.length > 10) {
      isValid = false;
    } else {
      isValid = true;
    }
  }
</script>

<span class="form-control">
  <label for={id}>{label}:</label>
  <input
    type="tel"
    inputmode="tel"
    class={isValid ? "" : "invalid"}
    name={id}
    {id}
    placeholder="(123) 456-7890"
    bind:this={phoneField}
    onkeydown={handleInput}
    onkeyup={formatToPhone}
    onblur={handleValidity}
  />
</span>
