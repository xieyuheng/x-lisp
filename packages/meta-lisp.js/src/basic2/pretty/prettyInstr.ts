import * as Ppml from "@xieyuheng/ppml.js"
import * as B from "../index.ts"
import { prettyOperand } from "./prettyOperand.ts"
import { prettyType } from "./prettyType.ts"

export function prettyInstr(instr: B.Instr): Ppml.Node {
  const operandNodes = instr.operands.map(prettyOperand)
  const inner = Ppml.prettySyntax(instr.op, [], operandNodes)

  const attrEntries = Object.entries(instr.attributes)
  const attrNodes = attrEntries.flatMap(([key, attr]) => [
    Ppml.text(`:${key}`),
    prettyAttribute(attr),
  ])

  return Ppml.prettySyntax(
    "=",
    [],
    [Ppml.text(instr.id), prettyType(instr.type), inner, ...attrNodes],
  )
}

function prettyAttribute(attribute: B.Attribute): Ppml.Node {
  switch (attribute.kind) {
    case "TypeAttribute":
      return prettyType(attribute.value)
    case "SymbolAttribute":
      return Ppml.text(attribute.value)
    case "IntAttribute":
      return Ppml.text(attribute.value.toString())
    case "ListAttribute":
      return Ppml.prettySyntax("", [], attribute.elements.map(prettyAttribute))
  }
}
