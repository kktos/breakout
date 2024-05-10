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

const idataById= {};
let lastImageId= 0;
export function drawPixelated(img, context, zoom, x=0, y=0) {
	// if (!zoom) zoom=4; if (!x) x=0; if (!y) y=0;

	if (!img.id) img.id = `__img${lastImageId++}`;

	let idata = idataById[img.id];
	if (!idata){
	  const canvas = document.createElement('canvas');
	  canvas.width  = img.width;
	  canvas.height = img.height;
	  const ctx = canvas.getContext('2d');
	  ctx.drawImage(img,0,0);
	  idata = idataById[img.id] = ctx.getImageData(0,0,img.width,img.height).data;
	}
	for (let x2=0;x2<img.width;++x2){
	  for (let y2=0;y2<img.height;++y2){
		const i=(y2*img.width+x2)*4;
		const r=idata[i  ];
		const g=idata[i+1];
		const b=idata[i+2];
		const a=idata[i+3];
		context.fillStyle = `rgba(${r},${g},${b},${a/255})`;
		context.fillRect(x+x2*zoom, y+y2*zoom, zoom, zoom);
	  }
	}
}

export function drawCropPixelated(img, context, zoom, srcRect, dstRect) {
	if (!img.id) img.id = `__img${lastImageId++}`;

	let idata = idataById[img.id];
	if (!idata){
		const ctx= img.getContext('2d');
	//   const canvas = document.createElement('canvas');
	//   canvas.width  = img.width;
	//   canvas.height = img.height;
	//   const ctx = canvas.getContext('2d');
	//   ctx.drawImage(img,0,0);
	  idata = idataById[img.id] = ctx.getImageData(srcRect.x,srcRect.y,srcRect.w,srcRect.h).data;
	}
	for (let x2=0;x2<img.width;++x2){
	  for (let y2=0;y2<img.height;++y2){
		const i=(y2*img.width+x2)*4;
		const r=idata[i  ];
		const g=idata[i+1];
		const b=idata[i+2];
		const a=idata[i+3];
		context.fillStyle = `rgba(${r},${g},${b},${a/255})`;
		context.fillRect(dstRect.x + x2*zoom, dstRect.y + y2*zoom, zoom, zoom);
	  }
	}
}

export function createImgCanvas(img) {
	const canvas= document.createElement('canvas');
	canvas.width= img.width;
	canvas.height= img.height;
	const ctx= canvas.getContext('2d');
	ctx.imageSmoothingEnabled = false;
	ctx.drawImage(img, 0, 0);
	return canvas;
}

export function createFromSource(srcCtx, x, y, w, h) {
	const imgData= srcCtx.getImageData(x, y, w, h);
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	canvas.width = w;
	canvas.height = h;
	ctx.putImageData(imgData, 0, 0);
	return canvas;
}