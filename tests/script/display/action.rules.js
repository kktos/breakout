import { tokens } from "../lexer.js";

export function actionRules(parser) {
	const  $ = parser;

    $.RULE("layoutAction", () => {
		const result= [];

		$.CONSUME(tokens.Action);

		$.CONSUME(tokens.Colon);

		$.CONSUME(tokens.OpenCurly);

		$.AT_LEAST_ONE(() => {
			result.push( $.SUBRULE(parser.layoutActionFunctionCall) );
		});

		$.CONSUME(tokens.CloseCurly);

		return result;
    });

	$.RULE("layoutActionFunctionCall", () => {
		const parts= [];
		$.AT_LEAST_ONE_SEP({
			SEP: tokens.Dot,
			DEF: () => {
				parts.push( $.CONSUME(tokens.Identifier).image );
			}
		});

		const result= {
			name: parts,
			args: []
		};

		$.CONSUME(tokens.OpenParent);

		$.MANY_SEP({
			SEP: tokens.Comma,
			DEF: () => {
				$.OR([
					{ ALT: () => { result.args.push( $.SUBRULE(parser.number) ); } },
					{ ALT: () => { result.args.push( $.CONSUME2(tokens.Identifier).image ); } },
					{ ALT: () => { result.args.push( $.CONSUME2(tokens.Variable).image ); } },
					{ ALT: () => { result.args.push( $.CONSUME2(tokens.StringLiteral).image ); } },
				]);
			}
		});

		$.CONSUME(tokens.CloseParent);

		return result;
    });
}
/*
	actionParm
		:  "action" ":" actionBlock

	actionBlock
		: "{" functionCall (functionCall)* "}"

	functionCall
		: Identifier "(" argumentList ")"

	argumentList
		:  | argument ("," argument)*

	argument
		: Number | Identifier | Variable | String
   	
 */