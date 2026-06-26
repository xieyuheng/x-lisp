import * as Ppml from "@xieyuheng/ppml.js"
import * as B from "../index.ts"
import { prettyOperand } from "./prettyOperand.ts"

export function prettyTerminator(terminator: B.Terminator): Ppml.Node {
  switch (terminator.kind) {
    case "ReturnTerminator":
      return Ppml.prettySyntax("return", [], [prettyOperand(terminator.value)])

    case "GotoTerminator":
      return Ppml.prettySyntax("goto", [], [
        Ppml.prettySyntax("label", [], [
          Ppml.text(terminator.targetLabel),
          ...terminator.args.map(prettyOperand),
        ]),
      ])

    case "BranchTerminator":
      return Ppml.prettySyntax("branch", [], [
        prettyOperand(terminator.condition),
        Ppml.prettySyntax("label", [], [
          Ppml.text(terminator.thenLabel),
          ...terminator.thenArgs.map(prettyOperand),
        ]),
        Ppml.prettySyntax("label", [], [
          Ppml.text(terminator.elseLabel),
          ...terminator.elseArgs.map(prettyOperand),
        ]),
      ])

    case "TailCallTerminator":
      return Ppml.prettySyntax("tail-call", [], [
        prettyOperand(terminator.target),
        ...terminator.operands.map(prettyOperand),
      ])

    case "TailApplyTerminator":
      return Ppml.prettySyntax("tail-apply", [], [
        prettyOperand(terminator.target),
        ...terminator.operands.map(prettyOperand),
      ])

    case "UnreachableTerminator":
      return Ppml.prettySyntax("unreachable", [], [])
  }
}
