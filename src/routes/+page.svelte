<script lang="ts">
	import { onMount } from 'svelte';
	import coolChair from '$lib/assets/images/cool-chair.png';
	import gitHubLogo from '$lib/assets/images/github-mark-white-1x.png';
	import linkedInLogo from '$lib/assets/images/InBug-White.png';
	import { paint, type ShineOptions } from './shine';
	import { theme } from '$lib/stores/theme';

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
	let gradientReady = $state(false);
	let shineOptions: ShineOptions = $derived($theme === 'dark' ? darkShine : lightShine);

	onMount(() => {
		let frame = 0;
		let disposed = false;

		const context = canvas.getContext('2d');
		if (!context) {
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

			canvas.width = image.naturalWidth;
			canvas.height = image.naturalHeight;

			let buffer = context.createImageData(canvas.width, canvas.height);

			const render = (t: number) => {
				buffer = paint(context, t, image, buffer, shineOptions);
				if (!gradientReady) {
					gradientReady = true;
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
		};
	});
</script>

<section class="page-section hero">
	<div class="title">
		<div class="page-icon-wrapper" role="img" aria-label="Cool chair icon">
			<img
				src={coolChair}
				alt=""
				class="page-icon fallback"
				class:faded-out={gradientReady}
				aria-hidden="true"
			/>
			<canvas bind:this={canvas} class="page-icon gradient" class:visible={gradientReady}></canvas>
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
		<p>I (try to) program. Working to get better. With hopefully cooler things in the progress.</p>
	</div>
</section>

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

	.logo {
		background: none;
	}

	/* Dark mode styles */
	:global(.dark *) {
		background: #000000;
		color: #ffffff;
	}

	/* Light mode styles */
	:global(.light *) {
		background: #ffffff;
		color: #000000;
	}

	:global(.light .logo) {
		filter: invert(1);
	}

	:global(.light .link-btn:hover .logo) {
		filter: invert(1) brightness(0.7);
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
	}

	.logo {
		height: 30px;
		width: auto;
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
