import * as B from "../index.ts"
import { formatOperand } from "./formatOperand.ts"
import { formatType } from "./formatType.ts"

export function formatInstr(instr: B.Instr): string {
  const operandTexts = instr.operands.map(formatOperand)
  const attrTexts = Object.entries(instr.attributes).map(
    ([key, attr]) => `:${key} ${formatAttribute(attr)}`,
  )

  const innerParts = [instr.op, ...operandTexts, ...attrTexts]
  const inner = `(${innerParts.join(" ")})`

  if (instr.results.length === 0) {
    return inner
  }

  const ids = instr.results.map((c) => c.id).join(" ")
  return `(= ${ids} ${inner})`
}

function formatAttribute(attribute: B.Attribute): string {
  switch (attribute.kind) {
    case "TypeAttribute":
      return formatType(attribute.value)
    case "SymbolAttribute":
      return attribute.value
    case "IntAttribute":
      return attribute.value.toString()
    case "FloatAttribute":
      return attribute.value.toString()
    case "BoolAttribute":
      return `(${attribute.value})`
    case "ListAttribute":
      return `(${attribute.elements.map(formatAttribute).join(" ")})`
  }
}
