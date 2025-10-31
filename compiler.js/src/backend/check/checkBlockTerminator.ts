import * as X from "@xieyuheng/x-sexp.js"
import type { Block } from "../block/index.ts"
import { formatInstr } from "../format/index.ts"
import type { Instr } from "../instr/index.ts"

export function checkBlockTerminator(block: Block): void {
  if (block.instrs.length === 0) {
    let message = `[checkBlockTerminator] block must end with terminator instruction`
    if (block.meta) throw new X.ErrorWithMeta(message, block.meta)
    else throw new Error(message)
  }

  const lastInstr = block.instrs[block.instrs.length - 1]
  if (!isTerminator(lastInstr)) {
    let message = `[checkBlockTerminator] block must end with terminator instruction`
    message += `\n  instr: ${formatInstr(lastInstr)}`
    if (lastInstr.meta) throw new X.ErrorWithMeta(message, lastInstr.meta)
    else throw new Error(message)
  }
}

function isTerminator(instr: Instr): boolean {
  return ["return", "goto", "branch"].includes(instr.op)
}
