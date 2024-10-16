export type AstNodeType =
  | "File"
  | "Identifier"
  | "NumbericLiteral"
  | "BinaryExpr";

export interface Stmt {
  nodeType: AstNodeType;
}

export interface FileAst extends Stmt {
  nodeType: "File";
  stmts: Stmt[];
}

export interface Expr extends Stmt {}

export interface BinaryExpr extends Expr {
  nodeType: "BinaryExpr";
  left: Expr;
  right: Expr;
  operator: string;
}

export interface Identifier extends Expr {
  nodeType: "Identifier";
  ident: string;
}

export interface NumbericLiteral extends Expr {
  nodeType: "NumbericLiteral";
  value: number;
}
