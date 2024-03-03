import { tokens } from "../lexer.js";

export function spriteRules(parser) {
	const  $ = parser;

    $.RULE("layoutSprite", (options) => {
		$.CONSUME(tokens.Sprite);

		const result= {
			type: "sprite",
			sprite: $.CONSUME(tokens.StringLiteral).payload
		};
		if(options?.zoom) {
			result.zoom= options.zoom;
		}

		result.pos = $.SUBRULE(parser.parm_at);

		$.OPTION(() => {
			result.range = $.SUBRULE(parser.parm_range);
		});

		return result;
    });

	$.RULE("parm_range", () => {
		$.CONSUME(tokens.Range);
		$.CONSUME(tokens.Colon);
		const x= $.SUBRULE(parser.number);
		$.CONSUME(tokens.Comma);
		const y= $.SUBRULE2(parser.number);
		return [ x, y ];
	});

}