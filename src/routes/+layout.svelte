<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { theme } from '$lib/stores/theme';

	let { children } = $props();
	
	const isDark = $derived($theme === 'dark');
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="app" class:dark={isDark} class:light={!isDark}>
	{@render children?.()}
</div>

<style>
	:global(html, body) {
		margin: 0;
		padding: 0;
		height: 100%;
		overflow-x: hidden;
	}

	.app {
		min-height: 100vh;
		width: 100%;
	}
</style>
