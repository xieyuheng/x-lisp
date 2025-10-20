import type { Instr } from "../instr/index.ts"

export type Block = {
  label: string
  instrs: Array<Instr>
}

export function Block(label: string, instrs: Array<Instr>): Block {
  return {
    label,
    instrs,
  }
}
