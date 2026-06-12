import * as X86 from "../index.ts"
import { formatInstr } from "./formatInstr.ts"

export function formatBlock(block: X86.Block): string {
  const instrs = block.instrs.map(formatInstr).join(" ")
  return `(block ${block.name} ${instrs})`
}
