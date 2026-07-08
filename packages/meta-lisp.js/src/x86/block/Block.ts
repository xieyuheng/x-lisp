import type { Instr } from "../instr/index.ts"

export type Block = {
  name: string
  instrs: Array<Instr>
}

export function Block(name: string, instrs: Array<Instr>): Block {
  return {
    name,
    instrs,
  }
}
