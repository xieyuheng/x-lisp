import { type Instr, type Meta } from "../instr/index.ts"

export type Block = {
  label: string
  instrs: Array<Instr>
  meta?: Meta
}

export function Block(label: string, instrs: Array<Instr>, meta?: Meta): Block {
  return {
    label,
    instrs,
    meta,
  }
}
