<script lang="ts">
	import Icon from '@iconify/svelte';

	let { tooltip = 'Test Tooltip with a lot of words to see how it renders' } = $props();

	import './info-tip.css';
</script>

<span class="info-tip">
	<Icon icon="fa6-solid:circle-info" />
	<div id="info-tip">{tooltip}</div>
</span>
