import * as Ppml from "@xieyuheng/ppml.js"
import { type Instr } from "../instr/index.ts"
import { prettyExp } from "./prettyExp.ts"

export function prettyInstr(instr: Instr): Ppml.Node {
  switch (instr.kind) {
    case "AssignInstr": {
      return Ppml.prettySyntax(
        "=",
        [],
        [Ppml.text(instr.dest), prettyExp(instr.exp)],
      )
    }

    case "PerformInstr": {
      return Ppml.prettySyntax("perform", [], [prettyExp(instr.exp)])
    }

    case "TestInstr": {
      return Ppml.prettySyntax("test", [], [prettyExp(instr.exp)])
    }

    case "BranchInstr": {
      return Ppml.prettySyntax(
        "branch",
        [],
        [Ppml.text(instr.thenLabel), Ppml.text(instr.elseLabel)],
      )
    }

    case "GotoInstr": {
      return Ppml.prettySyntax("goto", [], [Ppml.text(instr.label)])
    }

    case "ReturnInstr": {
      return Ppml.prettySyntax("return", [], [prettyExp(instr.exp)])
    }
  }
}
