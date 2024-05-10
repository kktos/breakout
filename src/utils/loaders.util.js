import ENV from "../env.js";

export function loadImage(name) {
    console.log(`loadImage(${name})`);
	return import(`/assets/images/${name}`)
            .then(m => m.default)
            .then(url => {
                return new Promise(resolve => {
                    const image= new Image();
                    image.addEventListener('load', () => resolve(image));
                    image.src= url;
                });                    
            });
}

export function loadSound(name) {
    console.log(`loadSound(${name})`);
	return import(`/assets/sounds/${name}`)
            .then(m => m.default)
            .then(url => fetch(url));
}

export function loadJson(url) {
    console.log(`loadJson(${url})`);
	return import(`/assets/${url}`).then(m => m.default);
}

export function saveFileAs(filename, data) {
    const blob = new Blob([JSON.stringify(data, null, 2)]);
    const link = document.createElement("a");
    link.download = filename;
    link.href = window.URL.createObjectURL(blob);
    link.click();
};