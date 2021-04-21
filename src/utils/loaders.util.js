import ENV from "../env.js";

export function loadImage(url) {
    return new Promise(resolve => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.src = ENV.IMAGES_DIR + url;
    });
}

export function loadJson(url) {
	return fetch(url)
		.then(response => response.json());
}
