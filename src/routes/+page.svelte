<script lang="ts">
	import { onMount } from 'svelte';
	import coolChair from '$lib/assets/images/cool-chair.png';
	import gitHubLogo from '$lib/assets/images/github-mark-white-1x.png';
	import linkedInLogo from '$lib/assets/images/InBug-White.png';
	import { paint, type ShineOptions } from './shine';
	import ThemeSwitch from '$lib/components/ThemeSwitch.svelte';
	import { theme } from '$lib/stores/theme';
	import type { ThemeToggleEvent } from '$lib/types/theme';

	const darkShine: ShineOptions = {
		base: [255, 255, 255],
		shine: [0, 0, 0],
		cycleDuration: 8000,
		flashWindow: 0.075,
		softness: 0.15
	};

	const lightShine: ShineOptions = {
		base: [0, 0, 0],
		shine: [255, 255, 255],
		cycleDuration: 8000,
		flashWindow: 0.075,
		softness: 0.15
	};

	let canvas: HTMLCanvasElement;
	let transitionCanvas: HTMLCanvasElement;
	let gradientReady = $state(false);
	let transitionGradientReady = $state(false);
	let shineOptions: ShineOptions = darkShine;

	// Theme switching variables
	let isAnimating = $state(false);
	let bubbleMask: HTMLDivElement | undefined;
	let baseLayer: HTMLDivElement | undefined;
	let transitionLayer: HTMLDivElement | undefined;

	let visualTheme = $state($theme);
	const isDark = $derived(isAnimating ? visualTheme === 'dark' : $theme === 'dark');

	// Update visual theme when store changes (but not during animation)
	$effect(() => {
		if (!isAnimating) {
			visualTheme = $theme;
		}
	});

	// Update shine options when theme changes
	$effect(() => {
		if (typeof window !== 'undefined') {
			shineOptions = isDark ? darkShine : lightShine;
		}
	});

	function handleThemeToggle(event: ThemeToggleEvent): void {
		if (isAnimating || !bubbleMask || !baseLayer || !transitionLayer) return;
		isAnimating = true;

		const { x, y } = event;

		// Set the origin point for the bubble
		bubbleMask.style.setProperty('--x', `${x}px`);
		bubbleMask.style.setProperty('--y', `${y}px`);

		// Update the transition layer with the new theme
		if (isDark) {
			transitionLayer.className = 'theme-layer light-layer';
			baseLayer.className = 'theme-layer dark-layer active';
		} else {
			transitionLayer.className = 'theme-layer dark-layer';
			baseLayer.className = 'theme-layer light-layer active';
		}

		bubbleMask.classList.add('expanding');

		// After animation completes, update everything
		setTimeout(() => {
			theme.toggle();
			visualTheme = $theme;

			if (baseLayer) {
				if ($theme === 'dark') {
					baseLayer.className = 'theme-layer dark-layer active';
				} else {
					baseLayer.className = 'theme-layer light-layer active';
				}
			}

			if (bubbleMask) {
				bubbleMask.classList.remove('expanding');
			}

			isAnimating = false;
		}, 1200);
	}

	onMount(() => {
		let frame = 0;
		let transitionFrame = 0;
		let disposed = false;

		// Use the theme store instead of media query
		const applyTheme = (isDark: boolean) => {
			shineOptions = isDark ? darkShine : lightShine;
		};
		applyTheme($theme === 'dark');

		const context = canvas.getContext('2d');
		if (!context) {
			return;
		}

		// Setup transition canvas
		const transitionContext = transitionCanvas.getContext('2d');
		if (!transitionContext) {
			return;
		}

		const image = new Image();
		image.src = coolChair;

		// Guarantee the PNG is fully decoded using it as a mask.
		const waitForImage = () =>
			new Promise<void>((resolve, reject) => {
				if (image.complete && image.naturalWidth > 0 && image.naturalHeight > 0) {
					resolve();
					return;
				}

				image.onload = () => resolve();
				image.onerror = () => reject(new Error('Failed to load gradient mask image.'));
			});

		const loadImage = async () => {
			try {
				await image.decode();
			} catch (error) {
				console.warn('Falling back to load event for gradient mask image.', error);
				await waitForImage();
				return;
			}

			if (!image.naturalWidth || !image.naturalHeight) {
				await waitForImage();
			}
		};

		const start = async () => {
			try {
				await loadImage();
			} catch (error) {
				console.error('Unable to load gradient mask image.', error);
				return;
			}

			if (disposed) {
				return;
			}

			if (!image.naturalWidth || !image.naturalHeight) {
				console.error('Gradient mask image has invalid dimensions.');
				return;
			}

			// Setup both canvases
			canvas.width = image.naturalWidth;
			canvas.height = image.naturalHeight;
			transitionCanvas.width = image.naturalWidth;
			transitionCanvas.height = image.naturalHeight;

			let buffer = context.createImageData(canvas.width, canvas.height);
			let transitionBuffer = transitionContext.createImageData(
				transitionCanvas.width,
				transitionCanvas.height
			);

			const render = (t: number) => {
				// Render main canvas
				buffer = paint(context, t, image, buffer, shineOptions);
				if (!gradientReady) {
					gradientReady = true;
				}

				// Render transition canvas with opposite theme
				const oppositeShine = isDark ? lightShine : darkShine;
				transitionBuffer = paint(transitionContext, t, image, transitionBuffer, oppositeShine);
				if (!transitionGradientReady) {
					transitionGradientReady = true;
				}

				frame = requestAnimationFrame(render);
			};

			render(performance.now());
		};

		void start();

		return () => {
			disposed = true;
			if (frame) {
				cancelAnimationFrame(frame);
			}
			if (transitionFrame) {
				cancelAnimationFrame(transitionFrame);
			}
		};
	});
</script>

<!-- Base layer (current theme) -->
<div
	class="theme-layer"
	class:dark-layer={isDark}
	class:light-layer={!isDark}
	class:active={true}
	bind:this={baseLayer}
>
	<section class="page-section hero">
		<div class="title">
			<div class="page-icon-wrapper" role="img" aria-label="Cool chair icon with animated gradient">
				<img
					src={coolChair}
					alt=""
					class="page-icon fallback"
					class:faded-out={gradientReady}
					aria-hidden="true"
				/>
				<canvas bind:this={canvas} class="page-icon gradient" class:visible={gradientReady}
				></canvas>
			</div>
			<h1 class="name">Thanh Nguyen</h1>
			<h3 class="job-title">Software Developer (Wannabe)</h3>
			<div class="social-links">
				<a href="https://github.com/Tea713" class="link-btn">
					<img src={gitHubLogo} class="logo" alt="GitHub Logo" />
				</a>
				<a href="https://www.linkedin.com/in/thanh-nguyen-85b619223" class="link-btn">
					<img src={linkedInLogo} class="logo" alt="LinkedIn Logo" />
				</a>
			</div>
		</div>
		<div class="about">
			<p>Hello there, I am a recent graduate from DePauw University, now located in NYC.</p>
			<p>
				Currently, not employed so I am open to most tech-related opportunities, software
				engineering/development would be nice.
			</p>
			<p>I (try to) program. Working to get better. With hopefully cool things in the progress.</p>
		</div>
	</section>
</div>

<!-- Transition layer (new theme) -->
<div class="bubble-mask" bind:this={bubbleMask}>
	<div
		class="theme-layer"
		class:light-layer={isDark}
		class:dark-layer={!isDark}
		bind:this={transitionLayer}
	>
		<section class="page-section hero">
			<div class="title">
				<div
					class="page-icon-wrapper"
					role="img"
					aria-label="Cool chair icon with animated gradient"
				>
					<img
						src={coolChair}
						alt=""
						class="page-icon fallback"
						class:faded-out={transitionGradientReady}
						aria-hidden="true"
					/>
					<canvas
						bind:this={transitionCanvas}
						class="page-icon gradient"
						class:visible={transitionGradientReady}
					></canvas>
				</div>
				<h1 class="name">Thanh Nguyen</h1>
				<h3 class="job-title">Software Developer (Wannabe)</h3>
				<div class="social-links">
					<a href="https://github.com/Tea713" class="link-btn">
						<img src={gitHubLogo} class="logo" alt="GitHub Logo" />
					</a>
					<a href="https://www.linkedin.com/in/thanh-nguyen-85b619223" class="link-btn">
						<img src={linkedInLogo} class="logo" alt="LinkedIn Logo" />
					</a>
				</div>
			</div>
			<div class="about">
				<p>Hello there, I am a recent graduate from DePauw University, now located in NYC.</p>
				<p>
					Currently, not employed so I am open to most tech-related opportunities, software
					engineering/development would be nice.
				</p>
				<p>
					I (try to) program. Working to get better. With hopefully cool things in the progress.
				</p>
			</div>
		</section>
	</div>
</div>

<ThemeSwitch toggle={handleThemeToggle} />

<style>
	/* CSS reset by Josh W. Comeau */

	/* 1. Use a more-intuitive box-sizing model */
	:global(*),
	:global(*::before),
	:global(*::after) {
		box-sizing: border-box;
	}

	/* 2. Remove default margin */
	:global(*) {
		margin: 0;
	}

	/* 3. Enable keyword animations */
	@media (prefers-reduced-motion: no-preference) {
		:global(html) {
			interpolate-size: allow-keywords;
		}
	}

	:global(body) {
		/* 4. Add accessible line-height */
		line-height: 1.5;
		/* 5. Improve text rendering */
		-webkit-font-smoothing: antialiased;
	}

	/* 6. Improve media defaults */
	:global(img),
	:global(picture),
	:global(video),
	:global(canvas),
	:global(svg) {
		display: block;
		max-width: 100%;
	}

	/* 7. Inherit fonts for form controls */
	:global(input),
	:global(button),
	:global(textarea),
	:global(select) {
		font: inherit;
	}

	/* 8. Avoid text overflows */
	:global(p),
	:global(h1),
	:global(h2),
	:global(h3),
	:global(h4),
	:global(h5),
	:global(h6) {
		overflow-wrap: break-word;
	}

	/* 9. Improve line wrapping */
	:global(p) {
		text-wrap: pretty;
	}
	:global(h1),
	:global(h2),
	:global(h3),
	:global(h4),
	:global(h5),
	:global(h6) {
		text-wrap: balance;
	}

	/* 10. Create a root stacking context */
	:global(#root),
	:global(#__next) {
		isolation: isolate;
	}

	/* Things I actually added */
	@font-face {
		font-family: 'Space Mono';
		src:
			url('fonts/spacemono/spacemono-regular-webfont.woff2') format('woff2'),
			url('fonts/spacemono/spacemono-regular-webfont.woff') format('woff');
		font-weight: normal;
		font-style: normal;
	}

	@font-face {
		font-family: 'Space Mono';
		src:
			url('fonts/spacemono/spacemono-bold-webfont.woff2') format('woff2'),
			url('fonts/spacemono/spacemono-bold-webfont.woff') format('woff');
		font-weight: bold;
		font-style: normal;
	}

	* {
		font-family: 'Space Mono', monospace;
	}

	:root {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}

	:root::-webkit-scrollbar {
		display: none;
	}

	/* Dark mode styles */
	:global(.dark-layer) {
		background: #000000;
		color: #ffffff;
	}

	/* Light mode styles */
	:global(.light-layer) {
		background: #ffffff;
		color: #000000;
	}

	:global(.light-layer .link-btn) {
		background-color: #ffffff;
	}

	:global(.light-layer .logo) {
		background-color: #ffffff;
		filter: invert(1);
	}

	:global(.light-layer .link-btn:hover .logo) {
		filter: invert(1) brightness(0.7);
	}

	/* Layer system */
	:global(.theme-layer) {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		pointer-events: none;
		z-index: 1;
	}

	:global(.theme-layer.active) {
		pointer-events: auto;
	}

	/* Bubble mask */
	:global(.bubble-mask) {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		pointer-events: none;
		z-index: 10;
		clip-path: circle(0px at var(--x, 50%) var(--y, 50%));
	}

	:global(.bubble-mask.expanding) {
		animation: bubbleExpand 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
	}

	section {
		height: 100vh;
		padding: 4rem 8rem;
		position: relative;
		z-index: 2;
	}

	.hero {
		align-items: center;
		justify-content: center;
		display: grid;
		grid-template-columns: 2fr 3fr;
		grid-template-areas: 'me about';
	}

	.about,
	.title {
		padding: 8px 16px;
		display: flex;
		flex-direction: column;
	}

	.about {
		gap: 1.5rem;
		grid-area: 'about';
	}

	.title {
		gap: 0.5rem;
		grid-area: 'me';
	}

	.social-links {
		display: flex;
		gap: 10px;
	}

	.link-btn {
		border: none;
		background-color: inherit;
	}

	.logo {
		height: 30px;
		width: auto;
		background-color: inherit;
		border: 0px;
		transition:
			filter 0.3s ease-out,
			transform 0.3s ease-out;
	}

	.link-btn:hover .logo {
		filter: brightness(3);
		transform: scale(1.1);
	}

	.page-icon-wrapper {
		position: relative;
		display: inline-block;
		width: min(100%, 28rem);
		max-width: 100%;
		overflow: hidden;
	}

	.page-icon {
		display: block;
		width: 100%;
		height: auto;
	}

	.page-icon.gradient {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
		transition: opacity 0.4s ease;
		pointer-events: none;
	}

	.page-icon.gradient.visible {
		opacity: 1;
	}

	.page-icon.fallback {
		transition: opacity 0.4s ease;
	}

	.page-icon.fallback.faded-out {
		opacity: 0;
	}

	h1 {
		font-weight: bolder;
		font-size: 3rem;
	}

	@media (max-width: 768px) {
		section {
			height: auto;
		}

		.hero {
			grid-template-columns: 1fr;
			grid-template-areas:
				'me'
				'about';
		}
	}
</style>
