<script lang="ts">
  let { label, id, value = $bindable(), ...props } = $props();

  import "./select.css";
</script>

<span class="custom-select">
  <label for={id}>{label}</label>
  <span class="select-wrapper">
    <select name={id} {id} bind:value>
      {@render props.children()}
    </select>
  </span>
</span>
