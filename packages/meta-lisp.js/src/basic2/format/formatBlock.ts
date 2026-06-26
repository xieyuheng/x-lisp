import * as B from "../index.ts"
import { formatType } from "./formatType.ts"
import { formatInstr } from "./formatInstr.ts"
import { formatTerminator } from "./formatTerminator.ts"

export function formatBlock(block: B.Block): string {
  const instrTexts = block.instrs.map(formatInstr)
  const terminatorText = formatTerminator(block.terminator)
  const bodyParts = [...instrTexts, terminatorText]

  if (block.parameters.length === 0) {
    return `(block ${block.label} ${bodyParts.join(" ")})`
  }

  const paramTexts = block.parameters
    .map(([name, type]) => `(${name} ${formatType(type)})`)
    .join(" ")
  return `(block (${block.label} ${paramTexts}) ${bodyParts.join(" ")})`
}
