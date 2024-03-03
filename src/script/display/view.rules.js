import { tokens } from "../lexer.js";

export function viewRules(parser) {
	const  $ = parser;

    $.RULE("layoutView", () => {
		$.CONSUME(tokens.View);

		const result= {
			type: "view",
			name: $.CONSUME(tokens.StringLiteral).payload,
			view: $.SUBRULE(parser.layoutViewType),
			pos: $.SUBRULE(parser.parm_at),
			width: $.SUBRULE(parser.layoutViewWidth),
			height: $.SUBRULE(parser.layoutViewHeight)
		};

		return result;
    });

    $.RULE("layoutViewType", () => {
		$.CONSUME(tokens.Type);
		$.CONSUME(tokens.Colon);
		return $.CONSUME(tokens.Identifier).image;
    });

    $.RULE("layoutViewWidth", () => {
		$.CONSUME(tokens.Width);
		$.CONSUME(tokens.Colon);
		return $.SUBRULE(parser.number);
    });

    $.RULE("layoutViewHeight", () => {
		$.CONSUME(tokens.Height);
		$.CONSUME(tokens.Colon);
		return $.SUBRULE(parser.number);
    });

}
/*
	view "BrickView" at:20,102 width:561 height:272
 */