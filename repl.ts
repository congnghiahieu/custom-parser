import Parser from "./frontend/parser.ts";
import evaluate from "./runtime/interpreter.ts";

function repl() {
  console.log("Custom scripting language REPL v0.1");

  while (true) {
    const input = (prompt(">") || "").trim();
    if (!input || input === "exit") {
      break;
    }

    const parser = new Parser();
    const fileAst = parser.produceAst(input);
    const runtimeValue = evaluate(fileAst);
    console.dir(runtimeValue, { depth: 10 });
  }
}

if (import.meta.main) {
  repl();
}
