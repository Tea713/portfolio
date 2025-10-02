<script lang="ts">
	import { onMount } from 'svelte';
	import coolChair from '$lib/assets/images/cool-chair.png';
	import { theme } from '$lib/stores/theme';
	import type { ShineOptions } from '$lib/types/shineOptions';

	const DEFAULT_OPTIONS: Required<ShineOptions> = {
		base: [255, 255, 255],
		shine: [0, 0, 0],
		cycleDuration: 8000,
		flashWindow: 0.075,
		softness: 0.15
	};

	function paint(
		context: CanvasRenderingContext2D,
		t: number,
		maskSource: CanvasImageSource,
		buffer?: ImageData,
		options?: ShineOptions
	): ImageData {
		const { width, height } = context.canvas;
		const imageData = buffer ?? context.createImageData(width, height);
		const data = imageData.data;

		// Override the default flash timing/colour while keeping sane fallbacks.
		const opts = { ...DEFAULT_OPTIONS, ...options };
		const { base, shine, cycleDuration, flashWindow, softness } = opts;

		const loopTime = ((t % cycleDuration) + cycleDuration) % cycleDuration;
		const loopProgress = loopTime / cycleDuration;
		const isFlashing = loopProgress <= flashWindow;
		const shineProgress = isFlashing ? loopProgress / flashWindow : 0;
		const shineCenter = shineProgress * 2;

		for (let p = 0; p < data.length; p += 4) {
			const i = p / 4;
			const x = i % width;
			const y = (i / width) >>> 0;

			// Shine diagonally from top-right to bottom-left.
			const diag = (width - x) / width + y / height;
			let intensity = 0;

			if (isFlashing) {
				const distance = Math.abs(diag - shineCenter);
				const sigma = softness;
				// Gaussian falloff
				intensity = Math.exp(-(distance * distance) / (2 * sigma * sigma));
			}

			data[p + 0] = base[0] * (1 - intensity) + shine[0] * intensity;
			data[p + 1] = base[1] * (1 - intensity) + shine[1] * intensity;
			data[p + 2] = base[2] * (1 - intensity) + shine[2] * intensity;
			data[p + 3] = 255;
		}

		context.clearRect(0, 0, width, height);
		context.putImageData(imageData, 0, 0);
		context.save();
		context.globalCompositeOperation = 'destination-in';
		context.drawImage(maskSource, 0, 0, width, height);
		context.restore();

		return imageData;
	}

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

<style>
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
</style>
