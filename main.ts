enum TokenType {
  Identifier,

  Number,

  // Operators
  Plus,
  Minus,
  Multiply,
  Divide,
  Modulo,
  Equal,

  OpenParen,
  CloseParen,
  OpenBrace,
  CloseBrace,
  OpenBracket,
  CloseBracket,

  // Keywords
  Let,
  Const,
}

interface Token {
  value: string;
  type: TokenType;
}

const RESERVED_KEYWORDS: Record<string, TokenType> = {
  "let": TokenType.Let,
  "const": TokenType.Const,
};

const SINGLECHAR_MAP: Record<string, TokenType> = {
  "+": TokenType.Plus,
  "-": TokenType.Minus,
  "*": TokenType.Multiply,
  "/": TokenType.Divide,
  "%": TokenType.Modulo,
  "=": TokenType.Equal,
  "(": TokenType.OpenParen,
  ")": TokenType.CloseParen,
  "{": TokenType.OpenBrace,
  "}": TokenType.CloseBrace,
  "[": TokenType.OpenBracket,
  "]": TokenType.CloseBracket,
};

function isAlpha(char: string) {
  return char.toUpperCase() != char.toLowerCase();
}

function isDigit(char: string) {
  const BOUNDS = ["0".charCodeAt(0), "9".charCodeAt(0)];

  return char.charCodeAt(0) >= BOUNDS[0] &&
    char.charCodeAt(0) <= BOUNDS[1];
}

function isSkippable(char: string) {
  const SKIPPABLES = [" ", "\n", "\r", "\t"];
  return SKIPPABLES.includes(char);
}

function token(value: string = "", type: TokenType): Token {
  return { value, type };
}

function tokenize(source: string): Token[] {
  const tokens = new Array<Token>();

  const stream = source.split("").reverse();

  while (stream.length > 0) {
    if (isSkippable(stream[stream.length - 1])) {
      stream.pop();
      continue;
    }

    // Multiple character
    if (isAlpha(stream[stream.length - 1])) {
      let ident = "";
      while (stream.length > 0 && isAlpha(stream[stream.length - 1])) {
        ident += stream.pop();
      }
      const reserved = RESERVED_KEYWORDS[ident];
      if (reserved) {
        tokens.push(token(ident, reserved));
      } else {
        tokens.push(token(ident, TokenType.Identifier));
      }
    } else if (isDigit(stream[stream.length - 1])) {
      let ident = "";
      while (stream.length > 0 && isDigit(stream[stream.length - 1])) {
        ident += stream.pop();
      }
      tokens.push(token(ident, TokenType.Number));
    } else {
      // Single character
      const char = stream.pop() || "";
      const mappedType = SINGLECHAR_MAP[char];
      if (mappedType) {
        tokens.push(token(char, mappedType));
      } else {
        throw new Error(`Unexpected character: ${char}`);
      }
    }
  }

  return tokens;
}

async function main() {
  const source = await Deno.readTextFile("tests/main.cn");
  const tokens = tokenize(source);
  for (const token of tokens) {
    console.log(token);
  }
}

main();
