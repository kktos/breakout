import { Lexer, createToken } from "chevrotain";

// We define the regExp only **once** (outside) to avoid performance issues.
const stringLiteralPattern =
  /"(?:[^\\"]|\\(?:[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*"/y;
function matchStringLiteral(text, startOffset) {
  // using 'y' sticky flag (Note it is not supported on IE11...)
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/sticky
  stringLiteralPattern.lastIndex = startOffset;

  // Note that just because we are using a custom token pattern
  // Does not mean we cannot implement it using JavaScript Regular Expressions...
  const execResult = stringLiteralPattern.exec(text);
  if (execResult !== null) {
    const fullMatch = execResult[0];
    // compute the payload
    const matchWithOutQuotes = fullMatch.substr(1, fullMatch.length - 2);
    // attach the payload
    execResult.payload = matchWithOutQuotes;
  }

  return execResult;
}

const tokenDefs= {
	Identifier: {pattern: /[a-zA-Z]\w*/},
	Variable: {pattern: /\$[a-zA-Z]\w*/},

	Display: {  pattern: "display", longer_alt: "Identifier"},
	Game: {  pattern: "game", longer_alt: "Identifier"},
	Level: {  pattern: "level", longer_alt: "Identifier"},
	Debug: {  pattern: "debug", longer_alt: "Identifier"},
	Editor: {  pattern: "editor", longer_alt: "Identifier"},

	Background: {  pattern: "background", longer_alt: "Identifier"},
	ShowCursor: {  pattern: "showCursor", longer_alt: "Identifier"},
	Font: {  pattern: "font", longer_alt: "Identifier"},
	Layout: {  pattern: "layout", longer_alt: "Identifier"},
	Layers: {  pattern: "layers", longer_alt: "Identifier"},
	Align: {  pattern: "align", longer_alt: "Identifier"},
	Size: {  pattern: "size", longer_alt: "Identifier"},
	Zoom: {  pattern: "zoom", longer_alt: "Identifier"},
	Color: {  pattern: "color", longer_alt: "Identifier"},
	At: {  pattern: "at", longer_alt: "Identifier"},
	Range: {  pattern: "range", longer_alt: "Identifier"},
	Action: {  pattern: "action", longer_alt: "Identifier"},

	Text: {  pattern: "text", longer_alt: "Identifier"},
	Sprite: {  pattern: "sprite", longer_alt: "Identifier"},
	Menu: {  pattern: "menu", longer_alt: "Identifier"},
	View: {  pattern: "view", longer_alt: "Identifier"},
	Rect: {  pattern: "rect", longer_alt: "Identifier"},

	Items: {  pattern: "items", longer_alt: "Identifier"},
	Item: {  pattern: "item", longer_alt: "Identifier"},
	Selection: {  pattern: "selection", longer_alt: "Identifier"},
	UI: {  pattern: "ui", longer_alt: "Identifier"},
	Pos: {  pattern: "pos", longer_alt: "Identifier"},
	Width: {  pattern: "width", longer_alt: "Identifier"},
	Height: {  pattern: "height", longer_alt: "Identifier"},
	Type: {  pattern: "type", longer_alt: "Identifier"},

	Left: {  pattern: "left", longer_alt: "Identifier"},
	Right: {  pattern: "right", longer_alt: "Identifier"},
	Center: {  pattern: "center", longer_alt: "Identifier"},

	Set: {  pattern: "set", longer_alt: "Identifier"},
	For: {  pattern: "for", longer_alt: "Identifier"},
	Repeat: {  pattern: "repeat", longer_alt: "Identifier"},
	Step: {  pattern: "step", longer_alt: "Identifier"},

	StringLiteral : { pattern: matchStringLiteral, line_breaks: false },
	Comma : { pattern: "," },
	Dot : { pattern: "." },
	Dollar : { pattern: "$" },
	Colon : { pattern: ":" },
	OpenParent : { pattern: "(" },
	CloseParent : { pattern: ")" },
	OpenCurly : { pattern: "{" },
	CloseCurly : { pattern: "}" },
	OpenBracket : { pattern: "[" },
	CloseBracket : { pattern: "]" },
	Integer : { pattern: /0|[1-9]\d*/ },
	HexNumber : { pattern: /#(?:[0-9A-Fa-f]{1,8})/ },

	WhiteSpace : { pattern: /\s+/, group: Lexer.SKIPPED },
	Comment: { pattern: /\/\/[^\n\r]*/, group: Lexer.SKIPPED }
};

export const tokens= {};
for (const [key, value] of Object.entries(tokenDefs)) {
	if(value.longer_alt) {
		value.longer_alt= tokens[value.longer_alt];
	}
	tokens[key]= createToken({...value, name:key});
}

// The order of tokens is important
export const tokenList = [
	tokens.WhiteSpace,
	tokens.Comment,

	// "keywords" appear before the Identifier
	tokens.Display,
	tokens.Game,
	tokens.Level,
	tokens.Debug,
	tokens.Editor,
	tokens.Background,
	tokens.ShowCursor,
	tokens.Font,
	tokens.Layout,
	tokens.Layers,
	tokens.Align,
	tokens.Size,
	tokens.Zoom,
	tokens.Color,
	tokens.At,
	tokens.Range,
	tokens.Action,
	tokens.Text,
	tokens.Sprite,
	tokens.Menu,
	tokens.Items,
	tokens.Item,
	tokens.Selection,
	tokens.UI,
	tokens.Pos,
	tokens.View,
	tokens.Rect,
	tokens.Width,
	tokens.Height,
	tokens.Type,

	tokens.Left,
	tokens.Right,
	tokens.Center,
	
	tokens.Set,
	tokens.For,
	tokens.Repeat,
	tokens.Step,

	// The Identifier must appear after the keywords because all keywords are valid identifiers.
	tokens.Identifier,
	tokens.Variable,
	tokens.Comma,
	tokens.Dot,
	tokens.Dollar,
	tokens.Colon,
	tokens.OpenCurly,
	tokens.CloseCurly,
	tokens.OpenBracket,
	tokens.CloseBracket,
	tokens.OpenParent,
	tokens.CloseParent,

	tokens.HexNumber,
	tokens.Integer,
	tokens.StringLiteral
];

export const SheetLexer = new Lexer(tokenList);

// export function lex(inputText) {
//   const lexingResult = SheetLexer.tokenize(inputText);

//   if (lexingResult.errors.length > 0) {
// 	console.error("LEXERR", lexingResult.errors);
//     throw Error("Sad Sad Panda, lexing errors detected");
//   }

//   return lexingResult;
// }

