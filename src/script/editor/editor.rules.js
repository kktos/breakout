import { tokens } from "../lexer.js";

export function editorRules(parser) {
	const  $ = parser;

	$.RULE("editorSheet", () => {
		const sheet= { type: "editor" };
		sheet.name= $.SUBRULE(parser.editorClause);

		$.CONSUME(tokens.OpenCurly);

		// $.MANY(() => {
		// 	const {name,value}= $.SUBRULE(parser.displayProps);
		// 	sheet[name] = value;
		// });

		$.CONSUME(tokens.CloseCurly);

		return sheet;
    });

    $.RULE("editorClause", () => {
      $.CONSUME(tokens.Editor);
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