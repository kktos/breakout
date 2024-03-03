import { tokens } from "../lexer.js";

export function debugRules(parser) {
	const  $ = parser;

	$.RULE("debugSheet", () => {
		const sheet= { type: "debug" };
		sheet.name= $.SUBRULE(parser.debugClause);

		$.CONSUME(tokens.OpenCurly);

		// $.MANY(() => {
		// 	const {name,value}= $.SUBRULE(parser.displayProps);
		// 	sheet[name] = value;
		// });

		$.CONSUME(tokens.CloseCurly);

		return sheet;
    });

    $.RULE("debugClause", () => {
      $.CONSUME(tokens.Debug);
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