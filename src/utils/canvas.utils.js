import ENV from "../env.js";

export function createViewport(canvas) {
	return {
		width: ENV.VIEWPORT_WIDTH,
		height: ENV.VIEWPORT_HEIGHT,
		canvas,
		bbox: canvas.getBoundingClientRect(),
		ctx: canvas.getContext("2d"),
		ratioWidth: canvas.width / ENV.VIEWPORT_WIDTH,
		ratioHeight: canvas.height / ENV.VIEWPORT_HEIGHT,
	};
}