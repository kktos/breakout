import { formatWithOptions } from "node:util";
import { compileScript } from "./compiler.js";

const script = `
display "input name" {
	background black
	showCursor
	font "bubble-bobble"

	layout {
		set "playerName" ""

		size 3
		align 2

		color red
		text "HIGH SCORE" at:300,0
		text "1UP" at:75,0
		text "YOUR SCORE IS BEST" at:300,150

		color white
		text "%player.highscore%" at:300,26
		text "%player.score%" at:80,26
		text "%playerName%" at:400,468 align:1
		text "YOUR NAME" at:140,468 align:1

		text "PLEASE INPUT YOUR NAME." at:300,200 color:yellow


		set "letters_1" [
			"A", "B", "C", "D", "E", "F", "G", "H"
		]
		set "letters_2" [
			"I", "J", "K", "L", "M", "N", "O", "P"
		]
		set "letters_3" [
			"Q", "R", "S", "T", "U", "V", "W", "X"
		]
		set "letters_4" [
			"Y", "Z", " ", ".", "!", "?", "[", "]"
		]

		align 1
		color #F784F7

		menu {
			selection {
				left "paddles:selectionL"
				right "paddles:selectionR"
			}
			items {

				for "idx" 0,8 {
					step 52,0
					items { text "%letters_1.$idx%" at:100,270 action:{ concat(playerName, 3) } }
				}

				for "idx1" 0,8 {
					step 52,0
					items {	text "%letters_2.$idx1%" at:100,320 action:{ concat(playerName, 3) }	}
				}

				for "idx" 0,8 {
					step 52,0
					items { text "%letters_3.$idx%" at:100,370 action:{ concat(playerName, 3) } }
				}

				for "idx" 0,8 {
					step 52,0
					items { text "%letters_4.$idx%" at:100,420 action:{ concat(playerName, 3) } }
				}

				text "OK" at:300,550 action: { 
					updateHighscores(playerName)
					goTo("highscores")
				}
			}
		}


	}
}
`;

// console.log( JSON.stringify(compileScript(script), undefined, 2) );
const sheet= compileScript(script);

console.log( formatWithOptions({ colors: true, depth: 9 }, sheet) );