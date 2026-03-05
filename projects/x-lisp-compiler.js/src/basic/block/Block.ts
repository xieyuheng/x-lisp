import { type TokenMeta as Meta } from "@xieyuheng/sexp-tael.js"
import { type Instr } from "../instr/index.ts"

export type Block = {
  label: string
  instrs: Array<Instr>
  meta?: TokenMeta
}

export function Block(label: string, instrs: Array<Instr>, meta?: TokenMeta): Block {
  return {
    label,
    instrs,
    meta,
  }
}
