import { tokens } from "../lexer.js";

export function uiRules(parser) {
	const  $ = parser;

	$.RULE("displayUI", () => {
		const result= {};

		$.CONSUME(tokens.UI);
		$.CONSUME(tokens.OpenCurly);

		$.AT_LEAST_ONE(() => {
			const {name,value}= $.OR([
				{ ALT:() => $.SUBRULE(parser.displayUIBackground) },
				{ ALT:() => $.SUBRULE(parser.displayUIPos) }
			]);
			result[name] = value;
		});

		$.CONSUME(tokens.CloseCurly);

		return {name: "ui", value: result};
    });

    $.RULE("displayUIBackground", () => {
		$.CONSUME(tokens.Background);
		const value= $.SUBRULE(parser.htmlColor);
		return { name: "background", value };
    });

    $.RULE("displayUIPos", () => {
		$.CONSUME(tokens.Pos);
		const value= $.CONSUME(tokens.StringLiteral).payload;
		return { name: "pos", value };
    });

}