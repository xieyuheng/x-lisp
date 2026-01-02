import { type Block } from "../block/Block.ts"
import { formatInstr } from "./formatInstr.ts"

export function formatBlock(block: Block): string {
  const instrs = block.instrs.map(formatInstr).join(" ")
  return `(block ${block.label} ${instrs})`
}
