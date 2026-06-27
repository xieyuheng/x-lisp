import * as B from "../index.ts"
import { formatType } from "./formatType.ts"
import { formatOperand } from "./formatOperand.ts"

export function formatInstr(instr: B.Instr): string {
  const operandTexts = instr.operands.map(formatOperand).join(" ")
  const inner =
    operandTexts.length > 0
      ? `(${instr.op} ${operandTexts})`
      : `(${instr.op})`

  const attrEntries = Object.entries(instr.attributes)
  const attrTexts = attrEntries
    .map(([key, attr]) => `:${key} ${formatAttribute(attr)}`)
    .join(" ")

  const parts = [
    "=",
    instr.id,
    formatType(instr.type),
    inner,
    ...(attrTexts.length > 0 ? [attrTexts] : []),
  ]

  return `(${parts.join(" ")})`
}

function formatAttribute(attribute: B.Attribute): string {
  switch (attribute.kind) {
    case "TypeAttribute":
      return formatType(attribute.value)
    case "SymbolAttribute":
      return attribute.value
    case "IntAttribute":
      return attribute.value.toString()
    case "ListAttribute":
      return `(${attribute.elements.map(formatAttribute).join(" ")})`
  }
}
