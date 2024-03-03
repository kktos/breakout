import { tokens } from "../lexer.js";

export function rectRules(parser) {
	const  $ = parser;

    $.RULE("layoutRect", (options, isMenuItem) => {
		$.CONSUME(tokens.Rect);

		const result= {
			type: "rect",
		};
		if(options?.color) {
			result.color= options.color;
		}

		result.pos = $.SUBRULE(parser.parm_at);

		result.width= $.SUBRULE(parser.layoutViewWidth);
		result.height= $.SUBRULE(parser.layoutViewHeight);

		if(isMenuItem) {
			result.action= $.SUBRULE(parser.layoutAction);
		}

		return result;
    });

}