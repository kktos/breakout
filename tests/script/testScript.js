import { formatWithOptions } from "node:util";
import { compileScript } from "./compiler.js";

const script = `
display "debug" {
	background 1
	showCursor
	// killOnExit
	font "bubble-bobble"

	ui {
		pos "bottom"
		background #808000A0
	}

	layout {

		size 2

		set "parms" [
			"IDX", "NAME", "FRAMES", "LOOP", "SPEED", "WIDTH", "HEIGHT"
		]
		set "values" [
			"IDX", "NAME", "FRAMES", "LOOP", "SPEED", "WIDTH", "HEIGHT"
		]

		repeat count:7 var:idx step:{ at:0,18 } {
			text "%parms.$idx%" at:100,18 align:1
			text "%values.$idx%" at:110,18
		}


	}
}
`;

// console.log( JSON.stringify(compileScript(script), undefined, 2) );
const sheet= compileScript(script);

console.log( formatWithOptions({ colors: true, depth: 9 }, sheet) );