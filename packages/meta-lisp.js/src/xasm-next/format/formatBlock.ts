import * as N from "../index.ts"
import { formatInstr } from "./formatInstr.ts"

export function formatBlock(block: N.Block): string {
  const instrs = block.instrs.map(formatInstr).join(" ")
  return `(block ${block.name} ${instrs})`
}
