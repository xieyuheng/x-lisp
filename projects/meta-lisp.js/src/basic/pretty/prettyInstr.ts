import * as Ppml from "@xieyuheng/ppml.js"
import { type Instr } from "../instr/index.ts"
import { prettySyntax, prettyText } from "./layout.ts"
import { prettyExp } from "./prettyExp.ts"

export function prettyInstr(instr: Instr): Ppml.Node {
  switch (instr.kind) {
    case "AssignInstr": {
      return prettySyntax(
        "=",
        [],
        [prettyText(instr.dest), prettyExp(instr.exp)],
      )
    }

    case "PerformInstr": {
      return prettySyntax("perform", [], [prettyExp(instr.exp)])
    }

    case "TestInstr": {
      return prettySyntax("test", [], [prettyExp(instr.exp)])
    }

    case "BranchInstr": {
      return prettySyntax(
        "branch",
        [],
        [prettyText(instr.thenLabel), prettyText(instr.elseLabel)],
      )
    }

    case "GotoInstr": {
      return prettySyntax("goto", [], [prettyText(instr.label)])
    }

    case "ReturnInstr": {
      return prettySyntax("return", [], [prettyExp(instr.exp)])
    }
  }
}
