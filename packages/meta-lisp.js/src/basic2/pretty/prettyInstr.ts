import * as Ppml from "@xieyuheng/ppml.js"
import * as B from "../index.ts"
import { prettyType } from "./prettyType.ts"
import { prettyOperand } from "./prettyOperand.ts"

export function prettyInstr(instr: B.Instr): Ppml.Node {
  switch (instr.kind) {
    case "BinaryInstr":
      return Ppml.prettySyntax("=", [], [
        Ppml.text(instr.dest),
        prettyType(instr.type),
        Ppml.prettySyntax(instr.op, [], [
          prettyOperand(instr.left),
          prettyOperand(instr.right),
        ]),
      ])

    case "UnaryInstr":
      return Ppml.prettySyntax("=", [], [
        Ppml.text(instr.dest),
        prettyType(instr.type),
        Ppml.prettySyntax(instr.op, [], [prettyOperand(instr.operand)]),
      ])

    case "LoadInstr":
      return Ppml.prettySyntax("=", [], [
        Ppml.text(instr.dest),
        prettyType(instr.type),
        Ppml.prettySyntax("load", [], [prettyOperand(instr.pointer)]),
      ])

    case "StoreInstr":
      return Ppml.prettySyntax("store", [], [
        prettyType(instr.type),
        prettyOperand(instr.pointer),
        prettyOperand(instr.value),
      ])

    case "CallInstr":
      return Ppml.prettySyntax("=", [], [
        Ppml.text(instr.dest),
        prettyType(instr.type),
        Ppml.prettySyntax("call", [], [
          prettyOperand(instr.target),
          ...instr.operands.map(prettyOperand),
        ]),
      ])

    case "ApplyInstr":
      return Ppml.prettySyntax("=", [], [
        Ppml.text(instr.dest),
        prettyType(instr.type),
        Ppml.prettySyntax("apply", [], [
          prettyOperand(instr.target),
          ...instr.operands.map(prettyOperand),
        ]),
      ])

    case "SizeOfInstr":
      return Ppml.prettySyntax("=", [], [
        Ppml.text(instr.dest),
        Ppml.text("int64-t"),
        Ppml.prettySyntax("size-of", [], [prettyType(instr.targetType)]),
      ])

    case "OffsetOfInstr":
      return Ppml.prettySyntax("=", [], [
        Ppml.text(instr.dest),
        Ppml.text("int64-t"),
        Ppml.prettySyntax("offset-of", [], [
          prettyType(instr.structType),
          Ppml.prettySyntax("", [], instr.path.map(Ppml.text)),
        ]),
      ])
  }
}
