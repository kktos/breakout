import { EmbeddedActionsParser } from "chevrotain";
import { debugRules } from "./debug/debug.rules.js";
import { displayRules } from "./display/display.rules.js";
import { editorRules } from "./editor/editor.rules.js";
import { gameRules } from "./game/game.rules.js";
import { tokenList, tokens } from "./lexer.js";

/*

displaySheet
   : displayClause OpenCurly CloseCurly

displayClause
   : "display" String

fromClause
   : "FROM" Identifier

whereClause
   : "WHERE" expression

expression
   : atomicExpression relationalOperator atomicExpression

atomicExpression
   : Integer | Identifier

relationalOperator
   : ">" | "<"

 */
export class SheetParser extends EmbeddedActionsParser {
  constructor() {
    super(tokenList);

	// biome-ignore lint/complexity/noUselessThisAlias: <explanation>
	const  $ = this;

    $.RULE("sheet", () => {
		return $.OR([
			{ ALT:() => $.SUBRULE(this.displaySheet) },
			{ ALT:() => $.SUBRULE(this.gameSheet) },
			{ ALT:() => $.SUBRULE(this.editorSheet) },
			{ ALT:() => $.SUBRULE(this.debugSheet) }
		]);
	});

	displayRules(this);
	gameRules(this);
	debugRules(this);
	editorRules(this);

    $.RULE("background", () => {
		$.CONSUME(tokens.Background);
		const value= $.OR([
			{ ALT: () => $.SUBRULE(this.number) },
			{ ALT: () => $.SUBRULE(this.htmlColor) }
		]);
		return { name: "background", value };
    });
    $.RULE("showCursor", () => {
      $.CONSUME(tokens.ShowCursor);
	  return { name: "showCursor", value: true };
    });
    $.RULE("font", () => {
      $.CONSUME(tokens.Font);
      const value= $.CONSUME(tokens.StringLiteral).payload;
	  return { name: "font", value };
    });

	$.RULE("number", () => parseInt($.CONSUME(tokens.Integer).image));

    $.RULE("htmlColor", () => {
		const colorName= () => $.CONSUME(tokens.Identifier).image;
		const colorHex= () => $.CONSUME(tokens.HexNumber).image;
		return $.OR([
			{ ALT: colorHex },
			{ ALT: colorName }
		]);
    });

    this.performSelfAnalysis();
  }
}

