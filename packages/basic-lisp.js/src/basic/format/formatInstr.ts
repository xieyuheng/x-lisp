import * as B from "../index.ts"
import { formatOperand } from "./formatOperand.ts"
import { formatType } from "./formatType.ts"

export function formatInstr(instr: B.Instr): string {
  const operandTexts = instr.input.map(formatOperand)
  const attrTexts = Object.entries(instr.attributes).map(
    ([key, attr]) => `:${key} ${formatAttribute(attr)}`,
  )

  const innerParts = [instr.op, ...operandTexts, ...attrTexts]
  const inner = `(${innerParts.join(" ")})`

  if (instr.output.length === 0) {
    return inner
  }

  const ids = instr.output.map((c) => c.id).join(" ")
  return `(= ${ids} ${inner})`
}

function formatAttribute(attribute: B.Attribute): string {
  switch (attribute.kind) {
    case "TypeAttribute":
      return formatType(attribute.content)
    case "SymbolAttribute":
      return attribute.content
    case "IntAttribute":
      return attribute.content.toString()
    case "FloatAttribute":
      if (Number.isInteger(attribute.content)) {
        return `${attribute.content}.0`
      } else {
        return attribute.content.toString()
      }
    case "BoolAttribute":
      return `(${attribute.content})`
    case "StringAttribute":
      return JSON.stringify(attribute.content)
    case "ListAttribute":
      return `(${attribute.elements.map(formatAttribute).join(" ")})`
  }
}
