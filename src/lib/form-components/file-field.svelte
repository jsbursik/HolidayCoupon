<script lang="ts">
	let { id = 'upload', ...props } = $props();

	import './file-field.css';

	let inputEl: HTMLSpanElement;

	function handleInputChange(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			inputEl.innerText = input.files[0].name;
		}
	}
</script>

<label for={id} class="custom-file-upload">
	<span bind:this={inputEl}>Upload your file here</span>
</label>
<input {id} name={id} type="file" accept=".csv" required onchange={handleInputChange} />
