<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { theme } from '$lib/stores/theme';
	import ThemeSwitch from '$lib/components/ThemeSwitch.svelte';
	import type { ThemeToggleEvent } from '$lib/types/theme';
	import { tick } from 'svelte';

	let { children } = $props();

	const isDark = $derived($theme === 'dark');

	async function handleThemeToggle(event: ThemeToggleEvent): Promise<void> {
		await document.startViewTransition(() => {
			tick().then(() => theme.toggle());
		}).ready;

		const { x, y } = event;

		// TODO: Make the animation smoother. Idk why it is not as smooth previously.
		document.documentElement.animate(
			[
				{ clipPath: `circle(0px at ${x}px ${y}px)`, offset: 0 },
				{ clipPath: `circle(40vmax at ${x}px ${y}px)`, offset: 0.2 },
				{ clipPath: `circle(30vmax at ${x}px ${y}px)`, offset: 0.6 },
				{ clipPath: `circle(200vmax at ${x}px ${y}px)`, offset: 1 }
			],
			{
				duration: 1200,
				easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
				pseudoElement: '::view-transition-new(root)'
			}
		);
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="app" class:dark={isDark} class:light={!isDark}>
	{@render children?.()}
</div>

<ThemeSwitch toggle={handleThemeToggle} />

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

	::view-transition-old(root),
	::view-transition-new(root) {
		animation: none;
		mix-blend-mode: normal;
	}
</style>
