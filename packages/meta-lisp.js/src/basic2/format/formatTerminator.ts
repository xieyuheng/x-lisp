import * as B from "../index.ts"
import { formatOperand } from "./formatOperand.ts"

export function formatTerminator(terminator: B.Terminator): string {
  switch (terminator.kind) {
    case "ReturnTerminator":
      return `(return ${formatOperand(terminator.value)})`

    case "GotoTerminator": {
      const args =
        terminator.args.length > 0
          ? " " + terminator.args.map(formatOperand).join(" ")
          : ""
      return `(goto (label ${terminator.targetLabel}${args}))`
    }

    case "BranchTerminator": {
      const thenArgs =
        terminator.thenArgs.length > 0
          ? " " + terminator.thenArgs.map(formatOperand).join(" ")
          : ""
      const elseArgs =
        terminator.elseArgs.length > 0
          ? " " + terminator.elseArgs.map(formatOperand).join(" ")
          : ""
      return `(branch ${formatOperand(terminator.condition)} (label ${terminator.thenLabel}${thenArgs}) (label ${terminator.elseLabel}${elseArgs}))`
    }

    case "TailCallTerminator":
      return `(tail-call ${formatOperand(terminator.target)} ${terminator.operands.map(formatOperand).join(" ")})`

    case "TailApplyTerminator":
      return `(tail-apply ${formatOperand(terminator.target)} ${terminator.operands.map(formatOperand).join(" ")})`

    case "UnreachableTerminator":
      return `(unreachable)`
  }
}
