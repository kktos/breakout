
const LOGLEVELS= ["LOG", "ERR"];
const WINDOW= document.querySelector("#log-window");
const OUTPUT= WINDOW.querySelector("#log");
const CLOSE= WINDOW.querySelector("#close");

function print(level, args) {
	const str= args.reduce((acc, curr) => { return `${acc} ${String(curr)}`}, "");

	OUTPUT.innerHTML+= `<div class="${level>1?"err":""}">${LOGLEVELS[level-1]}:${str}</div>`;
	con.log(...args);
}

const con= window.console;

const console= {};
console.log= (...args) => print(1, args);
console.error= (...args) => print(2, args);
console.warn= (...args) => print(2, args);

console.show= () => {WINDOW.style.visibility= "visible"};
console.hide= () => {WINDOW.style.visibility= "hidden"};

window.console= console;
CLOSE.addEventListener("click", () => console.hide());