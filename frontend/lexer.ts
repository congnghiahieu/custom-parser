export enum TokenType {
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
  Null,

  EOF,
}

export interface Token {
  value: string;
  type: TokenType;
}

const RESERVED_KEYWORDS: Record<string, TokenType> = {
  "let": TokenType.Let,
  "const": TokenType.Const,
  "null": TokenType.Null,
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
  return char.charCodeAt(0) >= BOUNDS[0] && char.charCodeAt(0) <= BOUNDS[1];
}

function isSkippable(char: string) {
  const SKIPPABLES = [" ", "\n", "\r", "\t"];
  return SKIPPABLES.includes(char);
}

export function token(value: string = "", type: TokenType): Token {
  return { value, type };
}

export function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  const stream = source.split("");

  const length = stream.length;
  let cursor = 0;

  while (cursor < length) {
    if (isSkippable(stream[cursor])) {
      cursor++;
      continue;
    }

    // Multiple character
    if (isAlpha(stream[cursor])) {
      let ident = "";
      while (cursor < length && isAlpha(stream[cursor])) {
        ident += stream[cursor++];
      }

      const reserved = RESERVED_KEYWORDS[ident];
      if (reserved) {
        tokens.push(token(ident, reserved));
      } else {
        tokens.push(token(ident, TokenType.Identifier));
      }
    } else if (isDigit(stream[cursor])) {
      let ident = "";
      while (cursor < length && isDigit(stream[cursor])) {
        ident += stream[cursor++];
      }

      tokens.push(token(ident, TokenType.Number));
    } else {
      // Single character
      const char = stream[cursor++];
      const mappedType = SINGLECHAR_MAP[char];

      if (mappedType) {
        tokens.push(token(char, mappedType));
      } else {
        throw new Error(`Unexpected character: ${char.charCodeAt(0)}`);
      }
    }
  }

  tokens.push(token("EOF", TokenType.EOF));
  return tokens;
}

async function main() {
  const source = await Deno.readTextFile("tests/main.cn");
  const tokens = tokenize(source);
  for (const token of tokens) {
    console.log(token);
  }
}

if (import.meta.main) {
  main();
}
