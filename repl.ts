import Parser from "./frontend/parser.ts";

function repl() {
  console.log("Custom scripting language REPL v0.1");

  while (true) {
    const input = (prompt(">") || "").trim();
    if (!input || input === "exit") {
      break;
    }

    const parser = new Parser();
    const fileAst = parser.produceAst(input);
    console.log(fileAst);
  }
}

if (import.meta.main) {
  repl();
}
