import { tokens } from "../lexer.js";

export function gameRules(parser) {
	const  $ = parser;

	$.RULE("gameSheet", () => {
		const sheet= { type: "game" };
		sheet.name= $.SUBRULE(parser.gameClause);

		$.CONSUME(tokens.OpenCurly);

		// $.MANY(() => {
		// 	const {name,value}= $.SUBRULE(parser.displayProps);
		// 	sheet[name] = value;
		// });

		$.CONSUME(tokens.CloseCurly);

		return sheet;
    });

    $.RULE("gameClause", () => {
      $.CONSUME(tokens.Game);
      return $.CONSUME(tokens.StringLiteral).payload;
    });

    // $.RULE("displayProps", () => {
	// 	return $.OR([
	// 		{ ALT:() => $.SUBRULE(parser.background) },
	// 		{ ALT:() => $.SUBRULE(parser.showCursor) },
	// 		{ ALT:() => $.SUBRULE(parser.font) },
	// 		{ ALT:() => $.SUBRULE(parser.layout) }
	// 	]);
    // });

	// layoutRules(parser);

}