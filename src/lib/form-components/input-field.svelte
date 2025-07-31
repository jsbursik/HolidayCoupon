<script lang="ts">
  import { inputValidation } from "$lib/actions/inputValidation";
  import type { InputType } from "$appTypes";

  let { type = "text" as InputType, id, label, value = $bindable(), ...props } = $props();
</script>

<span class="form-control">
  <label for={id}>{label}</label>
  <input {type} {id} name={id} bind:value use:inputValidation={{ type }} {...props} />
</span>
