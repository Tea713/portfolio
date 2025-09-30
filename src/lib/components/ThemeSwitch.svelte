<script lang="ts">
	import { theme } from '$lib/stores/theme';
	import type { ThemeToggleEvent } from '$lib/types/theme';
	import lightModeIcon from '$lib/assets/images/light_mode_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg';
	import darkModeIcon from '$lib/assets/images/dark_mode_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg';

	interface Props {
		toggle?: (event: ThemeToggleEvent) => void;
	}

	let { toggle }: Props = $props();

	const isDark = $derived($theme === 'dark');
	let inverting = $state(false);

	function handleClick(event: MouseEvent): void {
		inverting = true;
		const target = event.currentTarget as HTMLButtonElement;
		const rect = target.getBoundingClientRect();
		const x = rect.left + rect.width / 2;
		const y = rect.top + rect.height / 2;

		toggle?.({ x, y });

		setTimeout(() => {
			inverting = false;
		}, 1200);
	}
</script>

<button class="theme-switch" onclick={handleClick} aria-label="Toggle theme">
	{#if isDark}
		<img class:active={inverting} id="light-mode-icon" src={lightModeIcon} alt="Light Mode" />
	{:else}
		<img class:active={inverting} id="dark-mode-icon" src={darkModeIcon} alt="Dark Mode" />
	{/if}
</button>

<style>
	.theme-switch {
		position: fixed;
		top: 2rem;
		right: 2rem;
		z-index: 1000;
		background: none;
		backdrop-filter: blur(10px);
		border: none;
		border-radius: 50px;
		padding: 0.5rem;
		cursor: pointer;
		transition: transform 0.3s ease;
	}

	.theme-switch:hover {
		transform: scale(1.05);
	}

	.theme-switch:active {
		transform: scale(0.95);
	}

	.theme-switch img {
		transition: filter 0.3s ease;
	}

	#light-mode-icon {
		filter: invert(0);
	}

	#light-mode-icon.active {
		filter: invert(1);
	}

	#dark-mode-icon {
		filter: invert(1);
	}

	#dark-mode-icon.active {
		filter: invert(0);
	}

	@media (max-width: 768px) {
		.theme-switch {
			top: 1rem;
			right: 1rem;
		}
	}
</style>
