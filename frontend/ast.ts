export type AstNodeType =
  | "File"
  | "Identifier"
  | "NumericLiteral"
  | "NullLiteral"
  | "BinaryExpr";

export interface Stmt {
  nodeType: AstNodeType;
}

export interface FileNode extends Stmt {
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

export interface NumericLiteral extends Expr {
  nodeType: "NumericLiteral";
  value: number;
}

export interface NullLiteral extends Expr {
  nodeType: "NullLiteral";
  value: "null";
}
