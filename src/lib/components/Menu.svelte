<script lang="ts">
	import { currentSection } from '$lib/stores/section';

	type Section = 'about' | 'projects' | 'shop';

	interface Props {
		onNavigate?: (section: Section) => void;
	}

	let { onNavigate }: Props = $props();

	function navigate(section: Section) {
		currentSection.navigateTo(section);
		onNavigate?.(section);
	}
</script>

<nav class="section-menu">
	<button
		class="menu-btn"
		class:active={$currentSection === 'about'}
		onclick={() => navigate('about')}
	>
		About
	</button>

	<button
		class="menu-btn"
		class:active={$currentSection === 'projects'}
		onclick={() => navigate('projects')}
	>
		Projects
	</button>
</nav>

<style>
	.section-menu {
		position: fixed;
		top: 2rem;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		flex-direction: row;
		gap: 2rem;
		z-index: 100;
	}

	.menu-btn {
		background: none;
		border: none;
		padding: 0.5rem 0;
		cursor: pointer;
		font-family: 'Space Mono', monospace;
		font-size: 1.25rem;
		font-weight: bold;
		position: relative;
		transition: opacity 0.2s ease;
		opacity: 0.6;
	}

	.menu-btn:hover {
		opacity: 1;
	}

	.menu-btn.active {
		opacity: 1;
	}

	.menu-btn::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 2px;
		background: currentColor;
		transform: scaleX(0);
		transition: transform 0.3s ease;
	}

	.menu-btn.active::after {
		transform: scaleX(1);
	}

	@media (max-width: 768px) {
		.section-menu {
			position: static;
			transform: none;
			flex-direction: row;
			justify-content: center;
			padding: 1rem;
		}
	}
</style>
