import type { NumericLiteral } from "../frontend/ast.ts";
import type { BinaryExpr } from "../frontend/ast.ts";
import type { FileNode, Stmt } from "../frontend/ast.ts";
import type { NullValue, NumericValue, RuntimeValue } from "./values.ts";

function evaluateFile(fileNode: FileNode): RuntimeValue {
  let lastEvaluated: RuntimeValue = {
    type: "null",
    value: "null",
  } as NullValue;

  for (const stmt of fileNode.stmts) {
    lastEvaluated = evaluate(stmt);
  }

  return lastEvaluated;
}

function evaluateBinaryExpr(binaryExpr: BinaryExpr): RuntimeValue {
  const lhs = evaluate(binaryExpr.left);
  const rhs = evaluate(binaryExpr.right);

  if (lhs.type === "number" && rhs.type === "number") {
    return evaluateNumbericBinaryExpr(
      binaryExpr.operator,
      lhs as NumericValue,
      rhs as NumericValue,
    );
  }

  return {
    type: "null",
    value: "null",
  } as NullValue;
}

function evaluateNumbericBinaryExpr(
  operator: string,
  lhs: NumericValue,
  rhs: NumericValue,
): NumericValue {
  let result = 0;

  switch (operator) {
    case "+":
      result = lhs.value + rhs.value;
      break;
    case "-":
      result = lhs.value - rhs.value;
      break;
    case "*":
      result = lhs.value * rhs.value;
      break;
    case "/":
      result = lhs.value / rhs.value;
      break;
    case "%":
      result = lhs.value % rhs.value;
      break;
    default:
      throw new Error(`Unknown operator: ${operator}`);
  }

  return {
    type: "number",
    value: result,
  } as NumericValue;
}

export default function evaluate(astNode: Stmt): RuntimeValue {
  switch (astNode.nodeType) {
    case "File":
      return evaluateFile(astNode as FileNode);

    case "BinaryExpr":
      return evaluateBinaryExpr(astNode as BinaryExpr);

    case "NumericLiteral":
      return {
        type: "number",
        value: (astNode as NumericLiteral).value,
      } as NumericValue;

    case "NullLiteral":
      return {
        type: "null",
        value: "null",
      } as NullValue;

    default:
      throw new Error(`Unsupported AST node type: ${astNode.nodeType}`);
  }
}
