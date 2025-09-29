export type ShineOptions = {
	base: [number, number, number];
	shine: [number, number, number];
	cycleDuration?: number;
	flashWindow?: number;
	softness?: number; // for the egdes
};

const DEFAULT_OPTIONS: Required<ShineOptions> = {
	base: [255, 255, 255],
	shine: [0, 0, 0],
	cycleDuration: 8000,
	flashWindow: 0.075,
	softness: 0.15
};

export function paint(
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
