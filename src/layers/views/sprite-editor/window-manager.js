const windows= new Map();

export function window_init() {

	const style= document.createElement("style");
	style.innerHTML= `
		[window] {
			outline: white solid 1px;
			position: fixed;
			top: 0;
			left: 0;
			width: 500px;
			height: 500px;
			visibility: hidden;
		}
		[window].resizing {
			outline: red solid 1px;
			opacity: 0.8;
		}
		[window].moving {
			opacity: 0.8;
		}
		[window-title] {
			position: relative;
			background: #4270b6;
			color: white;
			font: 12px sans-serif;
			padding: 4px;
			border-bottom: 1px solid black;
		}	
	`;
	document.querySelector("head").appendChild(style);

	// biome-ignore lint/complexity/noForEach: <explanation>
	document.querySelectorAll("[window]").forEach((window) => window_create(window));

}

export function  window_create(window) {

	windows.set(window.id, {window});

	setupResize(window);

	const panelPos= JSON.parse(localStorage.getItem(`panelPos-${window.id}`));
	if(panelPos) {
		window.style.left= panelPos.left;
		window.style.top= panelPos.top;
	}

	let isPanelMoving;
	let isPanelOffset;
	const handle= window.querySelector("[window-title]");

	const titleDiv= document.createElement("div");
	handle.appendChild(titleDiv);

	const options= handle.getAttribute("window-title").split(" ");
	if(options.includes("close")) {
		const closeIcn= document.createElement("div");
		closeIcn.style.position= "absolute";
		closeIcn.style.right= "2px";
		closeIcn.style.top= "0px";
		closeIcn.style.width= "16px";
		closeIcn.className= "btn icn icn-close";
		closeIcn.addEventListener("click", () => { window.style.visibility= "hidden" });
		handle.appendChild(closeIcn);
	}

	handle.addEventListener('mousedown', (e) => {
		isPanelMoving= true;
		isPanelOffset= [
			window.offsetLeft - e.clientX,
			window.offsetTop - e.clientY
		];
		window.classList.add("moving");
	}, true);

	handle.addEventListener('mousemove', (e) => {
		e.preventDefault();
		if (isPanelMoving) {
			const mousePosition= {
				x : e.clientX,
				y : e.clientY
			};
			window.style.left= `${(mousePosition.x + isPanelOffset[0])}px`;
			window.style.top= `${(mousePosition.y + isPanelOffset[1])}px`;
		}
	}, true);

	handle.addEventListener('mouseup', () => {
		isPanelMoving= false;
		window.classList.remove("moving");
		localStorage.setItem(`panelPos-${window.id}`,JSON.stringify({
			top: window.style.top,
			left: window.style.left
		}));
	}, true);
}

export function window_set_title(id, title) {
	const elm= document.querySelector(`#${id} [window-title] > div`);
	elm.innerHTML= title;
}

export function window_show(id, visible= true) {
	windows.get(id).window.style.visibility= visible ? "visible":"hidden";
}

export function window_handle_event(id, handler) {
	windows.get(id).handleEvent= handler;
}

// const ResizeEvent = new Event("resize");

function setupResize(window) {

	let isPanelResizing= false;
	const initialMousePos= {
		x : 0,
		y : 0
	};

	window.addEventListener('mousedown', (e) => {

		const localY= e.clientY - window.offsetTop;
		// const localX= e.pageX - window.offsetLeft;
		// if(e.offsetY > window.clientHeight-5) {
		if(localY > window.clientHeight-15) {
			isPanelResizing= true;
			// window.className= "resizing";
			window.classList.add("resizing");
			initialMousePos.x= e.clientX;
			initialMousePos.y= e.clientY;
			return;
		}

		windows.get(window.id).handleEvent?.(e);

	}, true);

	window.addEventListener('mouseup', (e) => {
		if(isPanelResizing) {
			isPanelResizing= false;
			window.classList.remove("resizing");
			return;
		}
		windows.get(window.id).handleEvent?.(e);

	}, true);
	window.addEventListener('mouseleave', (e) => {
		if(isPanelResizing) {
			const deltaX= e.clientX - initialMousePos.x;
			const deltaY= e.clientY - initialMousePos.y;
			const w= window.offsetWidth;
			const h= window.offsetHeight;
			window.style.width= `${(w+deltaX)}px`;
			window.style.height= `${(h+deltaY)}px`;
			initialMousePos.x= e.clientX;
			initialMousePos.y= e.clientY;			
			return;
		}
		windows.get(window.id).handleEvent?.(e);
	}, true);

	window.addEventListener('mousemove', (e) => {
		e.preventDefault();
		if (isPanelResizing) {
			const deltaX= e.clientX - initialMousePos.x;
			const deltaY= e.clientY - initialMousePos.y;
			const w= window.offsetWidth;
			const h= window.offsetHeight;
			window.style.width= `${(w+deltaX)}px`;
			window.style.height= `${(h+deltaY)}px`;
			initialMousePos.x= e.clientX;
			initialMousePos.y= e.clientY;
			return;
			// window.dispatchEvent(ResizeEvent);
		}
		windows.get(window.id).handleEvent?.(e);
	}, true);

	document.addEventListener('keydown', (e) => windows.get(window.id).handleEvent?.(e), true);
	document.addEventListener('keyup', (e) => windows.get(window.id).handleEvent?.(e), true);

}
