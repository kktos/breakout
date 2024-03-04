import { tokens } from "../lexer.js";
import { actionRules } from "./action.rules.js";

export function textRules(parser) {
	const  $ = parser;

    $.RULE("layoutText", (options, isMenuItem) => {
		$.CONSUME(tokens.Text);

		const result= {
			type: "text",
			text: $.CONSUME(tokens.StringLiteral).payload
		};
		if(options?.size) {
			result.size= options.size;
		}
		if(options?.align) {
			result.align= options.align;
		}
		if(options?.color) {
			result.color= options.color;
		}

		result.pos = $.SUBRULE(parser.parm_at);

		$.OPTION(() => {
			const {name, value, isParm}= $.SUBRULE(parser.textSpriteProps);

			$.ACTION(() => {
				if(!isParm)
					options[name]= value;
				else
					result[name]= value;
			});

		});

		if(isMenuItem) {
			result.action= $.SUBRULE(parser.layoutAction);
		}

		return result;
    });

	actionRules(parser);

}