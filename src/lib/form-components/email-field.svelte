<script lang="ts">
  let { id, label, value = $bindable(), ...props } = $props();

  let isValid = $state(true);

  function simpleValidate(e: Event) {
    const tar = e.target as HTMLInputElement;
    const expr = /(.+)@(.+)\.([a-z|A-Z]+)/;

    isValid = expr.test(tar.value);
  }
</script>

<span class="form-control">
  <label for={id}>{label}:</label>
  <input type="email" class={isValid ? "" : "invalid"} name={id} {id} placeholder="email@example.com" onblur={simpleValidate} />
</span>
