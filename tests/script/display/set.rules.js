import { tokens } from "../lexer.js";

export function setRules(parser) {
	const  $ = parser;

    $.RULE("layoutSet", () => {
		$.CONSUME(tokens.Set);

		const result= {
			type: "set",
			name: $.CONSUME(tokens.StringLiteral).payload
		};

		result.value = $.SUBRULE(parser.layoutSetValue);

		return result;
    });

    $.RULE("layoutSetValue", () => {
		return $.OR([
			{ ALT: () => $.CONSUME(tokens.StringLiteral).payload },
			{ ALT: () => $.SUBRULE(parser.layoutSetValueArray) },
		]);
    });

    $.RULE("layoutSetValueArray", () => {
		$.CONSUME(tokens.OpenBracket);

		const result= [];

		$.MANY_SEP({
			SEP: tokens.Comma,
			DEF: () => {
				result.push( $.CONSUME(tokens.StringLiteral).payload );
			}
		});

		$.CONSUME(tokens.CloseBracket);

		return result;
    });
}