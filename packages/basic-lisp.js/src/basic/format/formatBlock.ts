import * as B from "../index.ts"
import { formatInstr } from "./formatInstr.ts"

export function formatBlock(block: B.Block): string {
  const instrTexts = block.instrs.map(formatInstr).join(" ")
  return `(block ${block.label} ${instrTexts})`
}
