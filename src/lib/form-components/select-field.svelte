<script lang="ts">
	let { label, id, value = $bindable(), ...props } = $props();
</script>

<div class="custom-select">
	<label for={id}>{label}</label>
	<select name={id} {id} bind:value>
		{@render props.children()}
	</select>
</div>
