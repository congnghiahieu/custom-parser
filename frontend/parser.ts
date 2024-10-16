import {
  BinaryExpr,
  Expr,
  FileAst,
  Identifier,
  NumbericLiteral,
  Stmt,
} from "./ast.ts";
import { Token, tokenize, TokenType } from "./lexer.ts";

class Parser {
  private tokens: Token[] = [];
  private cursor: number = 0;

  constructor() {
    this.tokens = [];
    this.cursor = 0;
  }

  public produceAst(sourceCode: string): FileAst {
    this.tokens = tokenize(sourceCode);

    const fileAst: FileAst = {
      nodeType: "File",
      stmts: [],
    };

    while (!this.isEOF()) {
      fileAst.stmts.push(this.parseStmt());
    }

    return fileAst;
  }

  private at() {
    return this.tokens[this.cursor];
  }

  private eat() {
    return this.tokens[this.cursor++];
  }

  private eatExpected(expectedType: TokenType) {
    const token = this.eat();
    if (!token || token.type !== expectedType) {
      throw new Error(
        `Found ${token.value} #${token.type}, expected #${expectedType}`,
      );
    }
  }

  private isEOF() {
    return this.tokens[this.cursor].type === TokenType.EOF;
  }

  private parseStmt(): Stmt {
    return this.parseExpr();
  }

  private parseExpr(): Expr {
    return this.parseAddicativeExpr();
  }

  private parseAddicativeExpr(): Expr {
    let left = this.parseMultiplicativeExpr();

    const ADDICATIVE_OPERATORS = [
      TokenType.Plus,
      TokenType.Minus,
    ];

    while (ADDICATIVE_OPERATORS.includes(this.at().type)) {
      const operator = this.eat().value;
      const right = this.parseMultiplicativeExpr();

      left = {
        nodeType: "BinaryExpr",
        left,
        right,
        operator,
      } as BinaryExpr;
    }

    return left;
  }

  private parseMultiplicativeExpr(): Expr {
    let left = this.parsePrimaryExpr();

    const MULTIPLICATIVE_OPERATORS = [
      TokenType.Multiply,
      TokenType.Divide,
      TokenType.Modulo,
    ];

    while (MULTIPLICATIVE_OPERATORS.includes(this.at().type)) {
      const operator = this.eat().value;
      const right = this.parsePrimaryExpr();

      left = {
        nodeType: "BinaryExpr",
        left,
        right,
        operator,
      } as BinaryExpr;
    }

    return left;
  }

  private parsePrimaryExpr(): Expr {
    const at = this.at();

    switch (at.type) {
      case TokenType.Identifier:
        return {
          nodeType: "Identifier",
          ident: this.eat().value,
        } as Identifier;
      case TokenType.Number:
        return {
          nodeType: "NumbericLiteral",
          value: parseFloat(this.eat().value),
        } as NumbericLiteral;
      case TokenType.OpenParen: {
        this.eat(); // Skip "("
        const exprInParen = this.parseExpr();
        this.eatExpected(TokenType.CloseParen); // Skip ")"
        return exprInParen;
      }
      default:
        throw new Error(
          `Unexpected token: ${at.value} - #${at.type}`,
        );
    }
  }
}

export default Parser;
