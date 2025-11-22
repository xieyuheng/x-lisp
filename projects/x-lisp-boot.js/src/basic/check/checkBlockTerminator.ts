import * as S from "@xieyuheng/sexp.js"
import { type Block } from "../block/index.ts"
import { formatInstr } from "../format/index.ts"
import * as Instrs from "../instr/index.ts"

export function checkBlockTerminator(block: Block): void {
  if (block.instrs.length === 0) {
    let message = `[checkBlockTerminator] block must end with terminator instruction`
    if (block.meta) throw new S.ErrorWithMeta(message, block.meta)
    else throw new Error(message)
  }

  const lastInstr = block.instrs[block.instrs.length - 1]
  if (!Instrs.isTerminator(lastInstr)) {
    let message = `[checkBlockTerminator] block must end with terminator instruction`
    message += `\n  instr: ${formatInstr(lastInstr)}`
    if (lastInstr.meta) throw new S.ErrorWithMeta(message, lastInstr.meta)
    else throw new Error(message)
  }
}
